import { Button, Checkbox } from "@blueprintjs/core";
import classNames from "classnames";
import { range } from "lodash-es";
import p5 from "p5";
import React from "react";
import Tone from "tone";
import { createLoopWithPlayers } from "../../../common";
import { DefaultLayoutWithoutHeader as Layout } from "../../../components";
import styles from "./dance-floor-sequencer.module.css";

const ARDUINO_PORT_NAME = "/dev/cu.usbmodem1411";
/** width & height of the square pad matrix */
const PAD_DIMENSIONS = 4;
/** number of steps in the sequencer */
const NUM_BARS = 2;
/** number of beats in a bar or measure */
const BEATS_PER_BAR = 4;
const soundUrl = (filename: string) => `/sounds/floor-sequencer/${filename}`;

// tslint:disable no-console

interface ITimelinePosition {
    bar: number;
    beat: number;
    sixteenth: number;
}

interface IState {
    isPlaying: boolean;
    enableMetronome: boolean;
    position: ITimelinePosition;
    sampleBank: string;
    /** indexed by pad number, serialized */
    sequences: string[];
}

export default class extends React.PureComponent<{}, IState> {
    public state: IState = {
        isPlaying: false,
        enableMetronome: true,
        position: {
            bar: 0,
            beat: 0,
            sixteenth: 0,
        },
        sampleBank: "808",
        sequences: range(PAD_DIMENSIONS * PAD_DIMENSIONS).map(() =>
            range(NUM_BARS * BEATS_PER_BAR)
                .map(() => "0")
                .join(""),
        ),
    };

    private serial: any;
    private transportEvent?: Tone.Event;
    private parts: Array<Tone.Part | Tone.Loop> = [];
    private sampleBankPlayers?: Tone.Players;

    public async componentDidMount() {
        this.serial = new (p5 as any).SerialPort();
        // this.bindSerialEventHandlers();
        this.serial.open(ARDUINO_PORT_NAME);

        Tone.context.latencyHint = "playback";
        Tone.Transport.bpm.value = 160;
        Tone.Transport.loop = true;
        Tone.Transport.loopEnd = `${NUM_BARS}m`;

        this.transportEvent = new Tone.Event(() => {
            const [bar, beat, sixteenth] = Tone.Transport.position.split(":");
            this.setState({
                position: {
                    bar: parseInt(bar, 10),
                    beat: parseInt(beat, 10),
                    sixteenth: parseInt(sixteenth, 10),
                },
            });
        });
        this.transportEvent.loop = true;
        this.transportEvent.loopEnd = "4n";
        this.transportEvent.start();

        const metronomePlayers = new Tone.Players({
            loud: soundUrl("metronome-loud.wav"),
            soft: soundUrl("metronome-soft.wav"),
        }).toMaster();
        metronomePlayers.get("soft").volume.value = -10;
        const metronomeLoop = createLoopWithPlayers(metronomePlayers, "4n", ({ beat, trigger }) => {
            if (!this.state.enableMetronome) {
                return;
            }

            if (beat === 0) {
                trigger("loud");
            } else {
                trigger("soft");
            }
        });
        this.parts.push(metronomeLoop);

        // don't await, the loading callbacks aren't working...
        this.loadSampleBank();
        const currentSampleLoop = createLoopWithPlayers(
            this.sampleBankPlayers!,
            "16n",
            ({ bar, beat, sixteenth, trigger }) => {
                const { sequences } = this.state;
                // for (const pad of sequences) {
                sequences.forEach((pad, padIndex) => {
                    const seq = deserializeSeq(pad);
                    const seqIndex = getSeqIndex({ bar, beat, sixteenth });
                    // this loops on sixteenth notes, but our sequencer currently only has quarter-note resolution
                    if (seq[seqIndex] === 1 && sixteenth === 0) {
                        console.log(`triggering ${padIndex} in seq`, seq, "on position", [
                            bar,
                            beat,
                        ]);
                        trigger(`${padIndex}`);
                    }
                });
            },
        );
        this.parts.push(currentSampleLoop);
    }

    public componentWillUnmount() {
        if (this.transportEvent != null) {
            this.transportEvent.stop().dispose();
        }

        for (const p of this.parts) {
            p.stop().dispose();
        }
    }

    public render() {
        const { isPlaying, enableMetronome, position, sequences } = this.state;

        return (
            <Layout>
                <h3>dance floor sequencer</h3>
                <div className={styles.transportControls}>
                    <Button
                        icon={isPlaying ? "stop" : "play"}
                        intent={isPlaying ? "danger" : "primary"}
                        onClick={this.handlePlayToggle}
                        style={{ marginBottom: 20 }}
                        text={isPlaying ? "stop" : "play"}
                    />
                    <Checkbox
                        checked={enableMetronome}
                        label="metronome"
                        onChange={this.handleMetronomeChange}
                    />
                </div>
                <div className={styles.timeline}>
                    <TimelineSequence position={this.state.position} />
                    <TimelineSequence position={this.state.position} />
                </div>
                <br />
                <div className={styles.pads}>
                    {range(PAD_DIMENSIONS).map(i => (
                        <div className={styles.padRow}>
                            {range(PAD_DIMENSIONS).map(j => (
                                <Pad
                                    i={i}
                                    j={j}
                                    position={position}
                                    sequence={deserializeSeq(sequences[i * PAD_DIMENSIONS + j])}
                                    onClick={this.getPadClickHandler(i, j)}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </Layout>
        );
    }

    private bindSerialEventHandlers() {
        this.serial.on("connected", () => console.log("connected"));
        this.serial.on("open", () => console.log("open"));
        this.serial.on("data", () => {
            const data = this.serial.readLine();

            if (data != null && data.trim() !== "") {
                // expecing data of the form "pitch, roll"
                // const matches = data.match(/(.*)\,\ (.*)/);
            }
        });
        this.serial.on("error", (err: any) => console.log("error", err));
        this.serial.on("close", () => console.log("closed"));
    }

    private handlePlayToggle = () => {
        if (Tone.Transport.state === "started") {
            Tone.Transport.stop("+0.1");
            this.parts.forEach(p => p.stop());
            this.setState({ isPlaying: false });
        } else {
            // start the Transport 100 milliseconds in the future which is not very perceptible,
            // but can help avoid scheduling errors
            Tone.Transport.start("+0.1");
            this.parts.forEach(p => p.start());
            this.setState({ isPlaying: true });
        }
    };

    private handleMetronomeChange = () => {
        this.setState({
            enableMetronome: !this.state.enableMetronome,
        });
    };

    private getPadClickHandler = (i: number, j: number) => () => {
        // toggle sequence step
        const { position, sequences } = this.state;
        const padIndex = i * PAD_DIMENSIONS + j;
        const seq = deserializeSeq(sequences[padIndex]);
        const seqIndex = getSeqIndex(position);
        seq[seqIndex] = seq[seqIndex] === 0 ? 1 : 0;
        const newSeq = serializeSeq(seq);
        // TODO: also serialize the array?
        const newSequences = [...sequences];
        newSequences.splice(padIndex, 1, newSeq);
        this.setState({
            sequences: newSequences,
        });
    };

    private async loadSampleBank() {
        const { sampleBank } = this.state;

        console.log(`Loading sample bank [${sampleBank}]...`);

        return new Promise<void>((resolve, _reject) => {
            if (this.sampleBankPlayers == null) {
                this.sampleBankPlayers = new Tone.Players(
                    {
                        "12": soundUrl(`sample-banks/${sampleBank}/12.wav`),
                        "13": soundUrl(`sample-banks/${sampleBank}/13.wav`),
                        "14": soundUrl(`sample-banks/${sampleBank}/14.wav`),
                    },
                    () => {
                        console.log("Loaded initial samples!");
                        resolve();
                    },
                ).toMaster();
                return;
            } else {
                const loaders = Object.keys(this.sampleBankPlayers).map(p => {
                    return new Promise<void>(innerResolve => {
                        this.sampleBankPlayers!.get(p).load(
                            `sample-banks/${sampleBank}/${p}`,
                            () => {
                                console.log("Loaded new samples!");
                                innerResolve();
                            },
                        );
                    });
                });
                return Promise.all(loaders);
                // for (const p of Object.keys(this.sampleBankPlayers)) {
                //     this.sampleBankPlayers.get(p).load(`sample-banks/${sampleBank}/${p}`);
                // }
            }
        });
    }
}

interface IPadProps {
    i: number;
    j: number;
    position: ITimelinePosition;
    sequence: IPadSequence;
    onClick: () => void;
}

class Pad extends React.PureComponent<IPadProps> {
    public render() {
        const { position, sequence } = this.props;
        const isActive = sequence[getSeqIndex(position)] === 1;
        const classes = classNames(styles.pad, { [styles.padActive]: isActive });
        return <div className={classes} onClick={this.handleClick} />;
    }

    private handleClick = () => {
        this.props.onClick();
    };
}

interface ITimelineSequenceProps {
    position: ITimelinePosition;
}

class TimelineSequence extends React.PureComponent<ITimelineSequenceProps> {
    public render() {
        return (
            <div className={styles.timelineSequence}>
                {range(NUM_BARS).map(bar => (
                    <div className={styles.timelineStep} key={bar}>
                        {range(BEATS_PER_BAR).map(beat => this.renderBeat(bar, beat))}
                    </div>
                ))}
            </div>
        );
    }

    private renderBeat(bar: number, beat: number) {
        const { position } = this.props;
        const isCurrent = position.bar === bar && position.beat === beat;
        return (
            <div
                className={classNames(styles.timelineBeat, { [styles.isCurrent]: isCurrent })}
                key={beat}
            />
        );
    }
}

type IPadSequence = Array<0 | 1>;

function serializeSeq(seq: IPadSequence): string {
    return seq.join("");
}

function deserializeSeq(seq: string): IPadSequence {
    return seq.split("").map(s => (s === "0" ? 0 : 1));
}

function getSeqIndex(position: ITimelinePosition): number {
    return position.bar * 4 + position.beat;
}
