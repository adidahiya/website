import { Button, ButtonGroup, Checkbox, Colors, FormGroup, Slider } from "@blueprintjs/core";
import chroma from "chroma-js";
import classNames from "classnames";
import { flatMap, flatMapDeep, max, noop, range, throttle } from "lodash-es";
import p5 from "p5";
import React from "react";
import Tone from "tone";
// import { createLoopWithPlayers } from "../../../common";
import { DefaultLayoutWithoutHeader as Layout } from "../../../components";
import styles from "./dance-floor-sequencer.module.css";

const ARDUINO_PORT_NAME = "/dev/cu.usbmodem14101";
const PADS_WIDTH = 2;
const PADS_HEIGHT = 2;
/** number of steps in the sequencer */
const NUM_BARS = 2;
/** number of beats in a bar or measure */
const BEATS_PER_BAR = 4;
/** number of sixteenths in a beat */
const SIXTEENTHS_PER_BEAT = 4;
/** total number of steps */
const TOTAL_NUM_STEPS = NUM_BARS * BEATS_PER_BAR * SIXTEENTHS_PER_BEAT;
/** default tempo */
const DEFAULT_TEMPO = 120;
/** get a url for a sound file relevant to this project */
const soundUrl = (filename: string) => `/sounds/floor-sequencer/${filename}`;
const EMPTY_SEQUENCE = range(PADS_WIDTH * PADS_HEIGHT).map(() =>
    range(TOTAL_NUM_STEPS)
        .map(() => "0")
        .join(""),
);
const LS_KEY = "dance-floor-sequencer";

/** Pad colors for the sequence timeline */
const PAD_COLORS: { [i: number]: string } = {
    0: Colors.VERMILION5,
    1: Colors.VIOLET5,
    2: Colors.LIME4,
    3: Colors.GOLD4,
};
const DEFAULT_STEP_COLOR = Colors.GRAY4;

// tslint:disable no-console

interface ITimelinePosition {
    bar: number;
    beat: number;
    sixteenth: number;
}

/** indexed by pad number, serialized */
type Sequence = string[];

/** identifier for a sample bank */
type SampleBankId = string;

interface ISequencerStore {
    sequences: {
        [epochTime: string]: {
            sampleBankId: SampleBankId;
            sequence: Sequence;
            // currently not used for playback of non-current sequences, but stored
            tempo: number;
        };
    };
}

interface IState {
    isPlaying: boolean;
    enableMetronome: boolean;
    position: ITimelinePosition;
    sampleBank: string;
    currentSequence: Sequence;
    prevSequence: Sequence | undefined | null;
    tempo: number;
}

export default class extends React.PureComponent<{}, IState> {
    public state: IState = {
        isPlaying: false,
        enableMetronome: false,
        position: {
            bar: 0,
            beat: 0,
            sixteenth: 0,
        },
        sampleBank: "808",
        currentSequence: EMPTY_SEQUENCE,
        prevSequence: undefined,
        tempo: DEFAULT_TEMPO,
    };

    private serial: any;
    private transportEvent?: Tone.Event;
    private parts: Array<Tone.Part | Tone.Loop> = [];
    private metronomePlayers?: Tone.Players;
    private sampleBankPlayers?: Tone.Players;

    public async componentDidMount() {
        const savedSequences = localStorage.getItem(LS_KEY);
        if (savedSequences != null) {
            const store: ISequencerStore = JSON.parse(savedSequences);
            const latest = max(Object.keys(store.sequences).map(key => parseInt(key, 10)));
            if (latest !== undefined) {
                const latestSequence = store.sequences[latest];
                this.setState({
                    prevSequence: latestSequence.sequence,
                    tempo: latestSequence.tempo,
                    sampleBank: latestSequence.sampleBankId,
                });
            }
        }

        this.serial = new (p5 as any).SerialPort();
        // this.bindSerialEventHandlers();
        this.serial.open(ARDUINO_PORT_NAME);
        this.bindSerialEventHandlers();

        Tone.Transport.bpm.value = DEFAULT_TEMPO;
        Tone.Transport.loop = true;
        Tone.Transport.loopStart = "0:0:0";
        Tone.Transport.loopEnd = `${NUM_BARS}:0:0`;

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
        this.transportEvent.loopEnd = "16n";
        this.transportEvent.start();

        this.metronomePlayers = new Tone.Players({
            loud: soundUrl("metronome-loud.wav"),
            soft: soundUrl("metronome-soft.wav"),
        }).toMaster();
        this.metronomePlayers.get("soft").volume.value = -10;

        // don't await this async action, the loading callbacks aren't working...
        this.loadSampleBank();

        // const currentSequencePart = new Tone.Sequence(
        //     this.handleSequenceStep,
        //     range(TOTAL_NUM_STEPS),
        //     "16n",
        // );
        // currentSequencePart.loop = true;
        // currentSequencePart.loopEnd = `${NUM_BARS}m`;

        const currentSequencePart = new Tone.Loop((time: number) => {
            const position = getPositionFromBarsBeatsSixteenths(Tone.Transport.position);
            this.handleSequenceStep(time, getStepFromPosition(position));
        }, "16n");

        this.parts.push(currentSequencePart);
    }

    public componentWillUnmount() {
        Tone.Transport.stop();

        if (this.transportEvent != null) {
            this.transportEvent.stop().dispose();
        }

        for (const p of this.parts) {
            p.stop().dispose();
        }
    }

    public render() {
        const {
            isPlaying,
            enableMetronome,
            position,
            currentSequence,
            prevSequence,
            tempo,
        } = this.state;

        return (
            <Layout title="dance floor sequencer">
                <h3>dance floor sequencer</h3>
                <div className={styles.transportControls}>
                    <FormGroup inline={true}>
                        <Button
                            icon={isPlaying ? "stop" : "play"}
                            intent={isPlaying ? "danger" : "success"}
                            onClick={this.handlePlayToggle}
                            style={{ marginRight: 10 }}
                            text={isPlaying ? "stop" : "start"}
                        />
                        <Button
                            icon="delete"
                            intent="danger"
                            onClick={this.resetCurrentSequence}
                            style={{ marginRight: 10 }}
                            text="Reset"
                            disabled={currentSequence === EMPTY_SEQUENCE && prevSequence == null}
                        />
                        <Button
                            icon="chevron-right"
                            intent="primary"
                            onClick={this.saveSequenceAndAdvance}
                            style={{ marginRight: 10 }}
                            text="next player"
                            disabled={currentSequence === EMPTY_SEQUENCE}
                        />
                        <Checkbox
                            checked={enableMetronome}
                            label="metronome"
                            onChange={this.handleMetronomeChange}
                            inline={true}
                            style={{ verticalAlign: "top" }}
                        />
                    </FormGroup>
                    <FormGroup label="tempo">
                        <Slider
                            labelStepSize={10}
                            max={180}
                            min={110}
                            onChange={newTempo => {
                                Tone.Transport.bpm.value = newTempo;
                                this.setState({ tempo: newTempo });
                            }}
                            stepSize={1}
                            value={tempo}
                        />
                    </FormGroup>
                </div>
                <div className={styles.timeline}>
                    <TimelineSequence
                        position={position}
                        sequence={prevSequence}
                        onStepClick={noop}
                    />
                    <TimelineSequence
                        position={position}
                        sequence={currentSequence}
                        onStepClick={this.handleCurrentSequenceStepClick}
                    />
                </div>
                {this.renderPadMatrix()}
                <FormGroup label="shortcuts" style={{ marginTop: 20 }}>
                    <ButtonGroup>
                        <Button text="4 on the floor" onClick={this.handleFourOnTheFloorShortcut} />
                        <Button text="hi-hat 16ths" onClick={this.handleHiHatSixteenthsShortcut} />
                    </ButtonGroup>
                </FormGroup>
            </Layout>
        );
    }

    private renderPadMatrix = () => {
        return (
            <div className={styles.pads}>
                {range(PADS_WIDTH).map(i => (
                    <div className={styles.padRow} key={i}>
                        {range(PADS_HEIGHT).map(j => this.renderPad(i, j))}
                    </div>
                ))}
            </div>
        );
    };

    /**
     * Pad indices are calculated counting from top left -> bottom right, zero-indexed.
     */
    private renderPad = (i: number, j: number) => {
        const { position, currentSequence } = this.state;
        const index = i * PADS_WIDTH + j;
        return (
            <Pad
                index={index}
                position={position}
                sequence={deserializeSeq(currentSequence[index])}
                onClick={this.getPadClickHandler(index)}
                key={j}
            />
        );
    };

    // used for tuning & throttling the serial data communication
    private timeOfLastPadActivations: number[] = [];
    private padActivationDebounce = 125; // milliseconds

    private bindSerialEventHandlers() {
        this.serial.on("connected", () => console.log("connected"));
        this.serial.on("open", () => console.log("open"));

        // can only do this once component is mounted
        this.timeOfLastPadActivations = range(PADS_WIDTH * PADS_HEIGHT).map(() =>
            window.performance.now(),
        );

        this.serial.on("data", () => {
            const data: string = this.serial.readLine();
            const now = performance.now();

            if (data != null && data.trim() !== "") {
                // expecting serialized changes of the form '0000'
                // 0 = no change, 1 = turned on, 2 = turned off
                console.log("Serial data: ", data.trim());
                const changes = data
                    .trim()
                    .split("")
                    .map(s => parseInt(s, 10));
                changes.forEach((c, i) => {
                    // prevent thrashing
                    if (
                        c === 1 &&
                        now > this.timeOfLastPadActivations[i] + this.padActivationDebounce
                    ) {
                        this.getPadClickHandler(i)();
                        this.timeOfLastPadActivations[i] = window.performance.now();
                    }
                });
            }
        });
        this.serial.on("error", (err: any) => console.log("error", err));
        this.serial.on("close", () => console.log("closed"));
    }

    private handlePlayToggle = () => {
        if (Tone.Transport.state === "started") {
            Tone.Transport.stop();
            this.parts.forEach(p => p.stop());
            this.setState({ isPlaying: false });
        } else {
            // start the Transport 100 milliseconds in the future which is not very perceptible,
            // but can help avoid scheduling errors
            Tone.Transport.start();
            this.parts.forEach(p => p.start());
            this.setState({ isPlaying: true });
        }
    };

    private handleMetronomeChange = () => {
        this.setState({
            enableMetronome: !this.state.enableMetronome,
        });
    };

    private getPadClickHandler = (padIndex: number, playImmediately = true) => () => {
        this.updateCurrentSequence({
            padIndex,
            steps: [getStepFromPosition(this.state.position)],
            playImmediately,
        });
    };

    /** Where most of the audio happens. */
    private handleSequenceStep = (time: Tone.Types.Time, step: number) => {
        const { currentSequence, prevSequence } = this.state;
        // this loops on sixteenth notes, but our sequencer currently only has quarter-note resolution
        const position = getPositionFromStep(step);

        if (this.state.enableMetronome && position.sixteenth === 0) {
            if (position.beat === 0) {
                this.metronomePlayers!.get("loud").start(time);
            } else {
                this.metronomePlayers!.get("soft").start(time);
            }
        }

        // don't play samples twice
        const padsPlayedDuringThisStep: number[] = [];
        const playSequence = (padSequence: string, padIndex: number) => {
            const seq = deserializeSeq(padSequence);
            if (seq[step] === 1 && padsPlayedDuringThisStep.indexOf(padIndex) === -1) {
                this.playSample(padIndex);
                padsPlayedDuringThisStep.push(padIndex);
            }
        };

        currentSequence.forEach(playSequence);
        if (prevSequence != null) {
            prevSequence.forEach(playSequence);
        }
    };

    private updateCurrentSequence = (options: {
        padIndex: number;
        /** Steps to update in a batch */
        steps: number[];
        /** Whether to set the step(s) to active, if omitted then this acts as a toggle */
        activate?: boolean;
        /** If a single step is being updated, whether to play the sample immediately. @default false */
        playImmediately?: boolean;
    }) => {
        const { padIndex, steps, activate, playImmediately = false } = options;
        const { currentSequence } = this.state;
        const seq = deserializeSeq(currentSequence[padIndex]);
        for (const step of steps) {
            const isCurrentStepActive = seq[step] === 1;
            seq[step] = activate ? 1 : isCurrentStepActive ? 0 : 1;
        }
        const newSeq = serializeSeq(seq);
        // TODO: also serialize the array?
        const newSequences = [...currentSequence];
        newSequences.splice(padIndex, 1, newSeq);
        const newState = {
            currentSequence: newSequences,
        };
        this.setState(newState);

        if (steps.length === 1 && playImmediately && seq[steps[0]] === 1) {
            // if we are enabling the current step, then trigger the sample right away
            this.playSample(padIndex);
        }
    };

    /** Move the transport to a particular step */
    private handleCurrentSequenceStepClick = (position: ITimelinePosition) => {
        // move transport
        Tone.Transport.position = positionToBarsBeatsSixteenths(position);
        this.setState({ position });
    };

    private async loadSampleBank() {
        const { sampleBank } = this.state;

        console.log(`Loading sample bank [${sampleBank}]...`);

        return new Promise<void>((resolve, _reject) => {
            if (this.sampleBankPlayers == null) {
                this.sampleBankPlayers = new Tone.Players(
                    range(PADS_WIDTH * PADS_HEIGHT).reduce(
                        (prev, i) => {
                            return {
                                ...prev,
                                [`${i}`]: soundUrl(`sample-banks/${sampleBank}/${i}.wav`),
                            };
                        },
                        {} as { [key: string]: string },
                    ),
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
            }
        });
    }

    private playSample = (padIndex: number, time?: Tone.Types.Time) => {
        const player = this.sampleBankPlayers!.get(`${padIndex}`);

        if (player.loaded) {
            if (time !== undefined) {
                const position = new Tone.Time(time).toBarsBeatsSixteenths();
                console.log(`Triggering pad ${padIndex} at ${position}`);
            }
            player.start(time);
            window.performance.mark("played sample!");
        } else {
            console.log(`Pad ${padIndex} not loaded yet or file format is unsupported`);
        }
    };

    private resetCurrentSequence = () => {
        if (this.state.currentSequence === EMPTY_SEQUENCE) {
            this.setState({
                prevSequence: null,
            });
        } else {
            this.setState({
                currentSequence: EMPTY_SEQUENCE,
            });
        }

        const serializedStore = localStorage.getItem(LS_KEY);
        // this should always be non-null at this point since resetting is disabled until you advance,
        // but just to be safe...
        if (serializedStore != null) {
            const store: ISequencerStore = JSON.parse(serializedStore);
            // wipe out stored sequences (dangerous!)
            const newStore = {
                ...store,
                sequences: {},
            };
            localStorage.setItem(LS_KEY, JSON.stringify(newStore));
        }
    };

    private saveSequenceAndAdvance = () => {
        const { currentSequence, sampleBank, tempo } = this.state;
        const now = Date.now();
        const currentSequenceEntry = {
            [now]: {
                sampleBankId: sampleBank,
                sequence: currentSequence,
                tempo,
            },
        };
        let newStore: ISequencerStore = {
            sequences: currentSequenceEntry,
        };

        const serializedStore = localStorage.getItem(LS_KEY);
        if (serializedStore != null) {
            const store: ISequencerStore = JSON.parse(serializedStore);
            newStore = {
                ...store,
                sequences: {
                    ...store.sequences,
                    ...currentSequenceEntry,
                },
            };
        }

        localStorage.setItem(LS_KEY, JSON.stringify(newStore));
        this.setState({
            prevSequence: currentSequence,
            currentSequence: EMPTY_SEQUENCE,
        });
    };

    private handleFourOnTheFloorShortcut = () => {
        // HACKHACK: hard coded index
        const KICK_PAD_INDEX = 2;
        const kickSeq = deserializeSeq(this.state.currentSequence[KICK_PAD_INDEX]);
        const isShortcutEnabled = range(0, TOTAL_NUM_STEPS, SIXTEENTHS_PER_BEAT).every(
            i => kickSeq[i] === 1,
        );

        const steps = flatMap(
            range(NUM_BARS).map(bar =>
                range(BEATS_PER_BAR).map(beat => getStepFromPosition({ bar, beat, sixteenth: 0 })),
            ),
        );

        this.updateCurrentSequence({
            padIndex: KICK_PAD_INDEX,
            steps,
            // positionOrStep: { bar, beat, sixteenth: 0 },
            activate: !isShortcutEnabled,
        });
    };

    private handleHiHatSixteenthsShortcut = () => {
        // HACKHACK: hard coded index
        const HH_PAD_INDEX = 1;
        const hhSeq = deserializeSeq(this.state.currentSequence[HH_PAD_INDEX]);
        const isShortcutEnabled = range(TOTAL_NUM_STEPS).every(i => hhSeq[i] === 1);

        // TODO: might be simpler with TOTAL_NUM_STEPS
        const steps = flatMapDeep(
            range(NUM_BARS).map(bar =>
                range(BEATS_PER_BAR).map(beat =>
                    range(SIXTEENTHS_PER_BEAT).map(sixteenth =>
                        getStepFromPosition({ bar, beat, sixteenth }),
                    ),
                ),
            ),
        );

        this.updateCurrentSequence({
            padIndex: HH_PAD_INDEX,
            steps,
            activate: !isShortcutEnabled,
        });
    };
}

interface IPadProps {
    index: number;
    position: ITimelinePosition;
    sequence: IPadSequence;
    onClick: () => void;
}

class Pad extends React.Component<IPadProps> {
    public render() {
        const { index, position, sequence } = this.props;
        const isActive = sequence[getStepFromPosition(position)] === 1;
        const backgroundColor = PAD_COLORS[index];
        return (
            <div
                className={classNames(styles.pad, { [styles.padActive]: isActive })}
                style={{ backgroundColor }}
                onClick={this.handleClick}
            />
        );
    }

    private handleClick = () => {
        this.props.onClick();
    };
}

interface ITimelineSequenceProps {
    position: ITimelinePosition;
    sequence: Sequence | undefined | null;
    onStepClick: (position: ITimelinePosition) => void;
}

class TimelineSequence extends React.PureComponent<ITimelineSequenceProps> {
    public render() {
        return (
            <div className={styles.timelineSequence}>
                {range(NUM_BARS).map(bar => (
                    <div className={styles.timelineBar} key={bar}>
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
            >
                {range(SIXTEENTHS_PER_BEAT).map(sixteenth => this.renderStep(bar, beat, sixteenth))}
            </div>
        );
    }

    private renderStep(bar: number, beat: number, sixteenth: number) {
        const { position, sequence } = this.props;
        const isCurrent =
            position.bar === bar && position.beat === beat && position.sixteenth === sixteenth;
        const step = getStepFromPosition({ bar, beat, sixteenth });
        let backgroundColor = DEFAULT_STEP_COLOR;

        if (sequence != null) {
            let hasNote = false;
            sequence.forEach((padSequence, i) => {
                if (padSequence.charAt(step) === "1") {
                    if (hasNote) {
                        // mix with existing color
                        backgroundColor = chroma.mix(backgroundColor, PAD_COLORS[i]).hex();
                    } else {
                        backgroundColor = PAD_COLORS[i];
                    }
                    hasNote = true;
                }
            });
        }

        return (
            <div
                className={classNames(styles.timelineSixteenth, {
                    [styles.isCurrent]: isCurrent,
                })}
                style={{ backgroundColor }}
                key={sixteenth}
                onClick={() => this.props.onStepClick({ bar, beat, sixteenth })}
            />
        );
    }
}

type IPadSequence = Array<0 | 1>;

function serializeSeq(seq: IPadSequence): string {
    return seq.join("");
}

// TODO: use binary for an even more compact format. but for now this is more debuggable.
function deserializeSeq(seq: string): IPadSequence {
    return seq.split("").map(s => (s === "0" ? 0 : 1));
}

function getStepFromPosition(position: ITimelinePosition): number {
    return (
        position.bar * SIXTEENTHS_PER_BEAT * BEATS_PER_BAR +
        position.beat * BEATS_PER_BAR +
        position.sixteenth
    );
}

function getPositionFromStep(step: number): ITimelinePosition {
    const STEPS_PER_BAR = SIXTEENTHS_PER_BEAT * BEATS_PER_BAR;
    const bar = Math.floor(step / STEPS_PER_BAR);
    const stepWithinBar = step - bar * STEPS_PER_BAR;
    const beat = Math.floor(stepWithinBar / SIXTEENTHS_PER_BEAT);
    const sixteenth = stepWithinBar - beat * SIXTEENTHS_PER_BEAT;
    return { bar, beat, sixteenth };
}

function positionToBarsBeatsSixteenths({
    bar,
    beat,
    sixteenth,
}: ITimelinePosition): Tone.Types.BarsBeatsSixteenth {
    return `${bar}:${beat}:${sixteenth}`;
}

function getPositionFromBarsBeatsSixteenths(bbs: Tone.Types.BarsBeatsSixteenth): ITimelinePosition {
    const [bar, beat, sixteenth] = bbs.split(":");
    return {
        bar: parseInt(bar, 10),
        beat: parseInt(beat, 10),
        sixteenth: parseInt(sixteenth, 10),
    };
}
