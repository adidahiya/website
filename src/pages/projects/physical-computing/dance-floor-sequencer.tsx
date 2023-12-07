/* eslint-disable max-classes-per-file, no-console, react/jsx-no-bind */

import {
    Button,
    ButtonGroup,
    Checkbox,
    Classes,
    Colors,
    FormGroup,
    HTMLSelect,
    Slider,
} from "@blueprintjs/core";
import chroma from "chroma-js";
import classNames from "classnames";
import { debounce, flatMap, flatMapDeep, max, noop, range } from "lodash-es";
import p5 from "p5";
import React from "react";
import * as Tone from "tone";

import * as styles from "./dance-floor-sequencer.module.css";
import { padStart } from "../../../common";
import { DefaultLayoutWithoutHeader as Layout } from "../../../components";

/** USB port name for p5.serialport */
const ARDUINO_PORT_NAME = "/dev/cu.usbmodem14101";
/** width dimension */
const PADS_WIDTH = 3;
/** height dimension */
const PADS_HEIGHT = 3;
/** which pads are non-interactive */
const NEUTRAL_PADS = [4];
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
/** default swing */
const DEFAULT_SWING = 0;
/** local storage key */
const LS_KEY = "dance-floor-sequencer";
/** get a url for a sound file relevant to this project */
const soundUrl = (filename: string) => `/sounds/floor-sequencer/${filename}`;
/** all sample banks */
const ALL_SAMPLE_BANKS = ["808", "909", "yakiman"];

const EMPTY_SEQUENCE = range(PADS_WIDTH * PADS_HEIGHT).map(() =>
    range(TOTAL_NUM_STEPS)
        .map(() => "0")
        .join(""),
);

/** Pad colors for the sequence timeline */
const PAD_COLORS: { [i: number]: string } = {
    0: Colors.VERMILION5,
    1: Colors.VIOLET5,
    2: Colors.LIME4,
    3: Colors.GOLD4,
    4: Colors.GRAY3,
    5: Colors.VERMILION5,
    6: Colors.VIOLET5,
    7: Colors.LIME4,
    8: Colors.GOLD4,
};
const DEFAULT_STEP_COLOR = Colors.GRAY4;

/** available sample banks */
const AVAILABLE_SAMPLE_BANKS = ["808", "909", "yakiman"];

interface ITimelinePosition {
    bar: number;
    beat: number;
    sixteenth: number;
}

/**
 * indexed by pad number, serialized representation of sequence
 * 0 = off, 1 = active, 2 = accent
 */
type Sequence = string[];

/** identifier for a sample bank */
type SampleBankId = string;

/** gets serialized to localStorage */
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
    isRecording: boolean;
    isLightsDemoActive: boolean;
    enableMetronome: boolean;
    position: ITimelinePosition;
    currentSampleBank: string;
    currentSequence: Sequence;
    prevSequence: Sequence | undefined | null;
    prevSampleBank: string | undefined | null;
    tempo: number;
    swing: Tone.Unit.NormalRange;
    isSerialConnectionOpen: boolean;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export default class extends React.PureComponent<{}, IState> {
    public state: IState = {
        isPlaying: false,
        isRecording: false,
        isLightsDemoActive: false,
        enableMetronome: false,
        position: {
            bar: 0,
            beat: 0,
            sixteenth: 0,
        },
        currentSampleBank: "808",
        currentSequence: EMPTY_SEQUENCE,
        prevSequence: undefined,
        prevSampleBank: undefined,
        tempo: DEFAULT_TEMPO,
        swing: DEFAULT_SWING,
        isSerialConnectionOpen: false,
    };

    // TODO: typings for p5.serial
    private serial: any;
    private transportEvent?: Tone.ToneEvent;
    private readonly parts: Array<Tone.Part | Tone.Loop> = [];
    private metronomePlayers?: Tone.Players;
    private sampleBanks: { [bankName: string]: Tone.Players } = {};

    /** queue of events to proces on the next transport step */
    private playersToRestoreVolume: Array<{
        sampleBankId: string;
        padId: string;
        oldVolume: Tone.Unit.Decibels;
    }> = [];

    public async componentDidMount() {
        const savedSequences = localStorage.getItem(LS_KEY);
        if (savedSequences != null) {
            const store: ISequencerStore = JSON.parse(savedSequences);
            const latest = max(Object.keys(store.sequences).map((key) => parseInt(key, 10)));
            if (latest !== undefined) {
                const latestSequence = store.sequences[latest];
                // eslint-disable-next-line react/no-did-mount-set-state
                this.setState({
                    prevSequence: latestSequence.sequence,
                    prevSampleBank: latestSequence.sampleBankId,
                    tempo: latestSequence.tempo,
                    currentSampleBank: latestSequence.sampleBankId,
                });
                this.loadSampleBank(latestSequence.sampleBankId);
            }
        }

        this.serial = new (p5 as any).SerialPort();
        // this.bindSerialEventHandlers();
        this.openSerialConnection();
        this.bindSerialEventHandlers();

        Tone.Transport.bpm.value = DEFAULT_TEMPO;
        Tone.Transport.loop = true;
        Tone.Transport.loopStart = "0:0:0";
        Tone.Transport.loopEnd = `${NUM_BARS}:0:0`;

        this.transportEvent = new Tone.ToneEvent(this.handleTransportStepEvent);
        this.transportEvent.loop = true;
        this.transportEvent.loopEnd = "16n";
        this.transportEvent.start();

        this.metronomePlayers = new Tone.Players({
            loud: soundUrl("metronome-loud.wav"),
            soft: soundUrl("metronome-soft.wav"),
        }).toDestination();
        // TODO: sync() each player to transport (but there doesn't seem to be a way to iterate over players automatically...)
        this.metronomePlayers.player("soft").volume.value = -10;

        // don't await this async action, the loading callbacks aren't working...
        this.loadSampleBank(this.state.currentSampleBank);

        const currentSequencePart = new Tone.Loop((time: number) => {
            const position = getPositionFromBarsBeatsSixteenths(
                Tone.Transport.position as Tone.Unit.BarsBeatsSixteenths,
            );
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
            currentSequence,
            enableMetronome,
            isPlaying,
            isSerialConnectionOpen,
            position,
            prevSequence,
            tempo,
            swing,
            currentSampleBank,
        } = this.state;

        return (
            <Layout
                title="dance floor MPC"
                className={classNames(Classes.DARK, styles.layoutContainer)}
            >
                <h3>dance floor MPC</h3>
                <div>
                    <FormGroup inline={true}>
                        <Button
                            icon={isPlaying ? "stop" : "play"}
                            intent={isPlaying ? "danger" : "success"}
                            onClick={this.handlePlayToggle}
                            style={{ marginRight: 10 }}
                            text={isPlaying ? "stop" : "start"}
                        />
                        <Button
                            icon="record"
                            intent={this.state.isRecording ? "none" : "danger"}
                            onClick={this.toggleIsRecording}
                            style={{ marginRight: 10 }}
                            text={this.state.isRecording ? "recording..." : "record"}
                        />
                        <Button
                            icon="delete"
                            intent="none"
                            onClick={this.resetCurrentSequence}
                            style={{ marginRight: 10 }}
                            text="reset"
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
                    <FormGroup label="tempo and swing" className="tempo-swing-form-group">
                        <Slider
                            labelStepSize={10}
                            max={180}
                            min={110}
                            onChange={(newTempo) => {
                                Tone.Transport.bpm.value = newTempo;
                                this.setState({ tempo: newTempo });
                            }}
                            stepSize={1}
                            value={tempo}
                        />
                        <Slider
                            labelStepSize={0.5}
                            max={1}
                            min={0}
                            onChange={(newSwing) => {
                                // sometimes Slider returns extra sig figs
                                newSwing = Math.round(newSwing * 10) / 10;
                                Tone.Transport.swing = newSwing;
                                console.log("set swing", newSwing);
                                this.setState({ swing: newSwing });
                            }}
                            stepSize={0.1}
                            value={swing}
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
                <FormGroup label="sample bank" style={{ marginTop: 20 }}>
                    <HTMLSelect
                        value={currentSampleBank}
                        options={AVAILABLE_SAMPLE_BANKS}
                        onChange={(evt) => {
                            const newSampleBank = evt.currentTarget.value;
                            this.setState({ currentSampleBank: newSampleBank }, () =>
                                this.loadSampleBank(),
                            );
                        }}
                    />
                </FormGroup>
                <FormGroup label="shortcuts" style={{ marginTop: 20 }}>
                    <ButtonGroup>
                        <Button text="4 on the floor" onClick={this.handleFourOnTheFloorShortcut} />
                        <Button text="hi-hat 16ths" onClick={this.handleHiHatSixteenthsShortcut} />
                    </ButtonGroup>
                </FormGroup>
                <FormGroup label="debugging" style={{ marginTop: 20 }}>
                    <ButtonGroup>
                        <Button
                            intent={isSerialConnectionOpen ? "danger" : "success"}
                            text={isSerialConnectionOpen ? "close serial" : "open serial"}
                            onClick={this.toggleSerialConnection}
                        />
                        <Button
                            text="flashy lights"
                            intent={this.state.isLightsDemoActive ? "success" : "primary"}
                            onClick={this.toggleFlashyLights}
                        />
                    </ButtonGroup>
                </FormGroup>
            </Layout>
        );
    }

    private renderPadMatrix = () => {
        return (
            <div className={styles.pads}>
                {range(PADS_WIDTH).map((i) => (
                    <div className={styles.padRow} key={i}>
                        {range(PADS_HEIGHT).map((j) => this.renderPad(i, j))}
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

    // we don't have to use Tone.Draw to sync up visuals because React's rendering pipeline uses
    // requestAnimationFrame, which is really all `Tone.Draw.schedule()` does anyway
    private handleTransportStepEvent = () => {
        const [barString, beatString, sixteenthString] = (
            Tone.Transport.position as Tone.Unit.BarsBeatsSixteenths
        ).split(":");
        const bar = parseInt(barString, 10);
        const beat = parseInt(beatString, 10);
        const sixteenth = parseInt(sixteenthString, 10);

        // restore volumes for accents
        for (const { sampleBankId, padId, oldVolume } of this.playersToRestoreVolume) {
            const player = this.sampleBanks[sampleBankId].player(padId);
            if (player.loaded) {
                player.volume.value = oldVolume;
            }
        }
        this.playersToRestoreVolume = [];

        this.setState({
            position: { bar, beat, sixteenth },
        });

        // tell arduino so LEDs can reflect state
        if (this.state.isSerialConnectionOpen) {
            const step = getStepFromPosition({ bar, beat, sixteenth });
            this.serial.write(`transportStep:${padStart(step, 2, "0")}\n`);
        }
    };

    // used for tuning & throttling the serial data communication
    private timeOfLastPadActivations: number[] = [];
    private padActivationDebounce = 200; // milliseconds

    private bindSerialEventHandlers() {
        this.serial.on("connected", () => console.log("connected"));
        this.serial.on("open", () => {
            console.log("open");
            this.setState({ isSerialConnectionOpen: true });
        });

        // can only do this once component is mounted
        // it's used in this.handleSerialData
        this.timeOfLastPadActivations = range(PADS_WIDTH * PADS_HEIGHT).map(() =>
            window.performance.now(),
        );

        this.serial.on("data", this.handleSerialData);
        this.serial.on("error", (err: any) => console.log("error", err));
        this.serial.on("close", () => {
            console.log("closed");
            this.setState({ isSerialConnectionOpen: false });
            // console.log("  attempting to re-open");
            // this.openSerialConnection();
        });
    }

    private toggleFlashyLights = () => {
        this.setState(
            {
                isLightsDemoActive: !this.state.isLightsDemoActive,
            },
            () => {
                if (this.state.isSerialConnectionOpen) {
                    this.serial.write(`demoLights:${this.state.isLightsDemoActive ? 1 : 0}`);
                }
            },
        );
    };

    private toggleSerialConnection = () => {
        if (this.state.isSerialConnectionOpen) {
            this.closeSerialConnection();
        } else {
            this.openSerialConnection();
        }
    };

    private openSerialConnection = debounce(() => {
        this.serial.open(ARDUINO_PORT_NAME);
    }, 500);

    private closeSerialConnection = debounce(() => {
        this.serial.close();
    }, 500);

    private handleSerialData = () => {
        const data: string = this.serial.readLine();
        const now = window.performance.now();

        if (data != null && data.trim() !== "") {
            const trimmedData = data.trim();

            if (trimmedData.startsWith("padChanges:")) {
                // 0 = no change, 1 = turned on, 2 = accent, 3 = turned off
                console.log(trimmedData);
                // interpret change data as numbers
                const changes = trimmedData
                    .substring("padChanges:".length)
                    .split("")
                    .map((s) => parseInt(s, 10));
                // react to changes if necessary
                changes.forEach((c, i) => {
                    // prevent thrashing
                    if (
                        isStepActive(c) &&
                        now > this.timeOfLastPadActivations[i] + this.padActivationDebounce
                    ) {
                        this.getPadClickHandler(i, isStepAccent(c))();
                        this.timeOfLastPadActivations[i] = window.performance.now();
                    }
                });
            } else if (trimmedData.startsWith("buttonStates:")) {
                const buttonStates = trimmedData
                    .substring("buttonStates:".length)
                    .split("")
                    .map((s) => parseInt(s, 10));

                // only one button is pressed at a time
                if (buttonStates[0] === 1) {
                    this.switchToNextSampleBank();
                } else if (buttonStates[1] === 1) {
                    this.resetCurrentSequence();
                } else if (buttonStates[2] === 1) {
                    this.handlePlayToggle();
                } else if (buttonStates[3] === 1) {
                    this.toggleIsRecording();
                }
            } else {
                return;
            }
        }
    };

    private handlePlayToggle = () => {
        if (Tone.Transport.state === "started") {
            Tone.Transport.stop();
            this.parts.forEach((p) => p.stop());
            this.setState({ isPlaying: false });
        } else {
            // start the Transport 100 milliseconds in the future which is not very perceptible,
            // but can help avoid scheduling errors
            Tone.Transport.start();
            this.parts.forEach((p) => p.start());
            this.setState({ isPlaying: true });
        }
    };

    private toggleIsRecording = () => {
        this.setState(
            {
                isRecording: !this.state.isRecording,
            },
            () => {
                if (this.state.isSerialConnectionOpen) {
                    this.serial.write(`isRecording:${this.state.isRecording ? 1 : 0}`);
                }
            },
        );
    };

    private handleMetronomeChange = () => {
        this.setState({
            enableMetronome: !this.state.enableMetronome,
        });
    };

    private getPadClickHandler =
        (padIndex: number, accent = false) =>
        (evt?: React.MouseEvent<HTMLDivElement>) => {
            if (NEUTRAL_PADS.indexOf(padIndex) >= 0) {
                // ignore interaction
                return;
            }

            if (evt != null) {
                accent = evt.shiftKey;
            }

            const { currentSampleBank, isRecording, position } = this.state;

            if (Tone.Transport.state === "started" && isRecording) {
                this.updateCurrentSequence({
                    accent,
                    padIndex,
                    steps: [getStepFromPosition(position)],
                });
            }

            this.playSample(currentSampleBank, padIndex, accent);
        };

    /** Where most of the audio happens. */
    private handleSequenceStep = (time: Tone.Unit.Time, step: number) => {
        const { currentSequence, currentSampleBank, prevSequence, prevSampleBank } = this.state;
        // this loops on sixteenth notes, but our sequencer currently only has quarter-note resolution
        const position = getPositionFromStep(step);

        if (this.state.enableMetronome && position.sixteenth === 0) {
            if (position.beat === 0) {
                this.metronomePlayers!.player("loud").start(time);
            } else {
                this.metronomePlayers!.player("soft").start(time);
            }
        }

        // don't play samples in the same bank twice
        const padsPlayedDuringThisStep: number[] = [];
        const playSequence = (
            { padSequence, bankId }: { padSequence: string; bankId: string },
            padIndex: number,
        ) => {
            const seq = deserializeSeq(padSequence);
            if (isStepActive(seq[step]) && padsPlayedDuringThisStep.indexOf(padIndex) === -1) {
                this.playSample(bankId, padIndex, isStepAccent(seq[step]));
                if (currentSampleBank === prevSampleBank) {
                    padsPlayedDuringThisStep.push(padIndex);
                }
            }
        };

        currentSequence
            .map((s) => ({ padSequence: s, bankId: currentSampleBank }))
            .forEach(playSequence);
        if (prevSequence != null && prevSampleBank != null) {
            prevSequence
                .map((s) => ({ padSequence: s, bankId: prevSampleBank }))
                .forEach(playSequence);
        }
    };

    private updateCurrentSequence = (options: {
        padIndex: number;
        /** Steps to update in a batch */
        steps: number[];
        /** Whether to set the step(s) to active, if omitted then this acts as a toggle */
        forceActivate?: boolean;
        /** Whether this is an accent, only works if we are activating */
        accent?: boolean;
    }) => {
        const { padIndex, steps, forceActivate, accent } = options;
        const { currentSequence } = this.state;
        const seq = deserializeSeq(currentSequence[padIndex]);
        for (const step of steps) {
            const isCurrentStepActive = seq[step] === 1;
            const isActivating = forceActivate || !isCurrentStepActive;
            if (isActivating && accent) {
                seq[step] = 2;
            } else if (isActivating) {
                seq[step] = 1;
            } else {
                seq[step] = 0;
            }
        }
        const newSeq = serializeSeq(seq);
        // TODO: also serialize the array?
        const newSequences = [...currentSequence];
        newSequences.splice(padIndex, 1, newSeq);
        const newState = {
            currentSequence: newSequences,
        };
        this.setState(newState);
    };

    /** Move the transport to a particular step */
    private handleCurrentSequenceStepClick = (position: ITimelinePosition) => {
        // move transport
        Tone.Transport.position = positionToBarsBeatsSixteenths(position);
        this.setState({ position });
    };

    private samplePadMapping: { [key: number]: string } = {
        0: "perc-1",
        1: "perc-2",
        2: "perc-3",
        3: "hh-open",
        5: "hh-closed",
        6: "kick",
        7: "tom",
        8: "snare",
    };

    private async loadSampleBank(sampleBankId = this.state.currentSampleBank) {
        console.log(`Loading sample bank [${sampleBankId}]...`);

        return new Promise<void>((resolve, _reject) => {
            if (this.sampleBanks[sampleBankId] == null) {
                this.sampleBanks[sampleBankId] = new Tone.Players(
                    range(PADS_WIDTH * PADS_HEIGHT).reduce(
                        (prev, i) => {
                            const sampleFilename = `${this.samplePadMapping[i]}.wav`;
                            return {
                                ...prev,
                                [`${i}`]: soundUrl(
                                    `sample-banks/${sampleBankId}/${sampleFilename}`,
                                ),
                            };
                        },
                        {} as { [key: string]: string },
                    ),
                    () => {
                        console.log(`Loaded "${sampleBankId}" samples!`);
                        resolve();
                    },
                ).toDestination();
            } else {
                resolve();
            }
            return;
        });
    }

    private switchToNextSampleBank() {
        const { currentSampleBank } = this.state;
        const currentIndex = ALL_SAMPLE_BANKS.indexOf(currentSampleBank);
        const nextIndex = currentIndex === ALL_SAMPLE_BANKS.length - 1 ? 0 : currentIndex + 1;
        const nextSampleBank = ALL_SAMPLE_BANKS[nextIndex];
        this.setState({ currentSampleBank: nextSampleBank }, () => {
            if (this.sampleBanks[nextSampleBank] == null) {
                this.loadSampleBank();
            }
        });
    }

    private playSample = (
        bankName: string,
        padIndex: number,
        accent: boolean,
        time?: Tone.Unit.Time,
    ) => {
        const padId = `${padIndex}`;

        if (
            this.sampleBanks[bankName] == null ||
            !this.sampleBanks[bankName].player(padId).loaded
        ) {
            console.log(
                `Bank ${bankName} pad ${padIndex} not loaded yet or file format is unsupported`,
            );
            return;
        }

        const player = this.sampleBanks[bankName].player(padId);

        if (time !== undefined) {
            const position = Tone.Time(time).toBarsBeatsSixteenths();
            console.log(`Triggering pad ${padIndex} at ${position}`);
        }

        const oldVolume = player.volume.value;

        if (accent) {
            // temporarily increase volume for this one
            player.volume.value = oldVolume + 8;
            if (this.state.isPlaying) {
                this.playersToRestoreVolume.push({
                    sampleBankId: bankName,
                    padId,
                    oldVolume,
                });
            } else {
                requestAnimationFrame(() => {
                    player.volume.value = oldVolume;
                });
            }
        }

        // play it!
        player.start(time === undefined ? "+0.1" : time);

        // window.performance.mark("played sample!");
    };

    private resetCurrentSequence = () => {
        if (this.state.currentSequence === EMPTY_SEQUENCE) {
            this.setState({
                prevSequence: null,
                prevSampleBank: null,
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
        const { currentSequence, currentSampleBank, tempo } = this.state;
        const now = Date.now();
        const currentSequenceEntry = {
            [now]: {
                sampleBankId: currentSampleBank,
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
            prevSampleBank: currentSampleBank,
            currentSequence: EMPTY_SEQUENCE,
        });
    };

    private handleFourOnTheFloorShortcut = () => {
        // HACKHACK: hard coded index
        const KICK_PAD_INDEX = 6;
        const kickSeq = deserializeSeq(this.state.currentSequence[KICK_PAD_INDEX]);
        const isShortcutEnabled = range(0, TOTAL_NUM_STEPS, SIXTEENTHS_PER_BEAT).every(
            (i) => kickSeq[i] === 1,
        );

        const steps = flatMap(
            range(NUM_BARS).map((bar) =>
                range(BEATS_PER_BAR).map((beat) =>
                    getStepFromPosition({ bar, beat, sixteenth: 0 }),
                ),
            ),
        );

        this.updateCurrentSequence({
            padIndex: KICK_PAD_INDEX,
            steps,
            // positionOrStep: { bar, beat, sixteenth: 0 },
            forceActivate: !isShortcutEnabled,
        });
    };

    private handleHiHatSixteenthsShortcut = () => {
        // HACKHACK: hard coded index
        const HH_PAD_INDEX = 5;
        const hhSeq = deserializeSeq(this.state.currentSequence[HH_PAD_INDEX]);
        const isShortcutEnabled = range(TOTAL_NUM_STEPS).every((i) => hhSeq[i] === 1);

        // TODO: might be simpler with TOTAL_NUM_STEPS
        const steps = flatMapDeep(
            range(NUM_BARS).map((bar) =>
                range(BEATS_PER_BAR).map((beat) =>
                    range(SIXTEENTHS_PER_BEAT).map((sixteenth) =>
                        getStepFromPosition({ bar, beat, sixteenth }),
                    ),
                ),
            ),
        ) as number[];

        this.updateCurrentSequence({
            padIndex: HH_PAD_INDEX,
            steps,
            forceActivate: !isShortcutEnabled,
        });
    };
}

interface IPadProps {
    index: number;
    position: ITimelinePosition;
    sequence: IPadSequence;
    onClick: (evt?: React.MouseEvent<HTMLDivElement>) => void;
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

    private handleClick = (evt: React.MouseEvent<HTMLDivElement>) => {
        this.props.onClick(evt);
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
                {range(NUM_BARS).map((bar) => (
                    <div className={styles.timelineBar} key={bar}>
                        {range(BEATS_PER_BAR).map((beat) => this.renderBeat(bar, beat))}
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
                {range(SIXTEENTHS_PER_BEAT).map((sixteenth) =>
                    this.renderStep(bar, beat, sixteenth),
                )}
            </div>
        );
    }

    private renderStep(bar: number, beat: number, sixteenth: number) {
        const { position, sequence } = this.props;
        const isCurrent =
            position.bar === bar && position.beat === beat && position.sixteenth === sixteenth;
        const step = getStepFromPosition({ bar, beat, sixteenth });
        let backgroundColor = DEFAULT_STEP_COLOR;

        if (isCurrent) {
            backgroundColor = Colors.LIGHT_GRAY5;
        } else if (sequence != null) {
            let hasNote = false;
            sequence.forEach((padSequence, i) => {
                if (isStepActive(padSequence.charAt(step))) {
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
                className={styles.timelineSixteenth}
                style={{ backgroundColor }}
                key={sixteenth}
                onClick={() => this.props.onStepClick({ bar, beat, sixteenth })}
            />
        );
    }
}

type IPadSequence = Array<0 | 1 | 2>;

function serializeSeq(seq: IPadSequence): string {
    return seq.join("");
}

// TODO: use binary for an even more compact format. but for now this is more debuggable.
function deserializeSeq(seq: string): IPadSequence {
    return seq.split("").map((s) => (s === "0" ? 0 : s === "1" ? 1 : 2));
}

function isStepActive(stepValue: string | number): boolean {
    // HACKHACK: messy
    return stepValue === 1 || stepValue === "1" || stepValue === 2 || stepValue === "2";
}

function isStepAccent(stepValue: string | number): boolean {
    // HACKHACK: messy
    return stepValue === 2 || stepValue === "2";
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
}: ITimelinePosition): Tone.Unit.BarsBeatsSixteenths {
    return `${bar}:${beat}:${sixteenth}`;
}

function getPositionFromBarsBeatsSixteenths(bbs: Tone.Unit.BarsBeatsSixteenths): ITimelinePosition {
    const [bar, beat, sixteenth] = bbs.split(":");
    return {
        bar: parseInt(bar, 10),
        beat: parseInt(beat, 10),
        sixteenth: parseInt(sixteenth, 10),
    };
}
