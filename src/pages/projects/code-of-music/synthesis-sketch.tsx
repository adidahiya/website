/* eslint-disable react/jsx-no-bind */

import { Button, FormGroup, Slider } from "@blueprintjs/core";
import { Link } from "gatsby";
import React from "react";
import * as Tone from "tone";

import * as styles from "./synthesis-sketch.module.css";
import { createLoopWithPlayers } from "../../../common";
import { DefaultLayoutWithoutHeader as Layout, NormalRangeSlider } from "../../../components";

interface IState {
    isPlaying: boolean;
    filterQ: Tone.Unit.Positive;
    filterEnvDecay: number;
    filterEnvSustain: Tone.Unit.NormalRange;
    filterEnvRelease: Tone.Unit.NormalRange;
    tempo: number;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export default class extends React.PureComponent<{}, IState> {
    public state: IState = {
        isPlaying: false,
        filterQ: 1.4,
        filterEnvDecay: 0.6,
        filterEnvSustain: 0.3,
        filterEnvRelease: 0.5,
        tempo: 120,
    };

    private monoSynth!: Tone.MonoSynth;
    private parts: Array<Tone.Part | Tone.Loop> = [];

    public componentDidMount() {
        Tone.Transport.bpm.value = this.state.tempo;

        this.monoSynth = new Tone.MonoSynth({
            oscillator: {
                type: "square",
            },
            filter: {
                Q: this.state.filterQ,
                frequency: 1000,
                type: "lowpass",
                rolloff: -48,
            },
            envelope: {
                attack: 0.0001,
                decay: 0.2,
                sustain: 0.5,
                release: 0.5,
            },
            filterEnvelope: {
                attack: 0.001,
                decay: this.state.filterEnvDecay,
                release: this.state.filterEnvRelease,
                sustain: this.state.filterEnvSustain,
                baseFrequency: "A2",
                octaves: 4,
            },
        }).toDestination();
        this.monoSynth.volume.value = -10;

        const synthPart = new Tone.Part(
            (time: Tone.Unit.Time, note: string) => {
                this.monoSynth.triggerAttackRelease(note as Tone.Unit.Note, "8n", time);
            },
            [
                ["0:0:0", "A2"],
                ["0:0:1", "A3"],
                ["0:1:0", "A2"],
                ["0:1:3", "A2"],
                ["0:2:0", "A4"],
                ["0:2:3", "A2"],
            ],
        );
        synthPart.loop = true;
        synthPart.humanize = true;
        this.parts.push(synthPart);

        const kit = new Tone.Players({
            kick: "/sounds/kick.wav",
            hh: "/sounds/electronic-hi-hat.ogg",
            wood: "/sounds/wood.wav",
        }).toDestination();
        kit.volume.value = -10;
        const drumLoop = createLoopWithPlayers(kit, "16n", ({ beat, sixteenth: six, trigger }) => {
            if (six === 0) {
                trigger("kick");
            } else if (six === 2) {
                trigger("hh");
            }

            if (beat === 2) {
                if (six === 1) {
                    trigger("kick");
                } else if (six === 3) {
                    trigger("wood");
                }
            }

            if (beat === 3) {
                if (six === 2) {
                    trigger("wood");
                }
            }
        });
        this.parts.push(drumLoop);
    }

    public componentWillUnmount() {
        this.monoSynth.dispose();
    }

    public render() {
        return (
            <Layout>
                <h3>Code of Music</h3>
                <p>
                    Week 4 Synthesis (<Link to="/blog/itp/code-of-music/synthesis">blog post</Link>)
                </p>
                <Button
                    icon={this.state.isPlaying ? "stop" : "play"}
                    intent={this.state.isPlaying ? "danger" : "primary"}
                    onClick={this.handlePlayToggle}
                    style={{ marginBottom: 20 }}
                    text={this.state.isPlaying ? "Stop" : "Play"}
                />

                <FormGroup label="tempo">
                    <Slider
                        labelStepSize={10}
                        max={180}
                        min={110}
                        onChange={(tempo) => {
                            Tone.Transport.bpm.value = tempo;
                            this.setState({ tempo });
                        }}
                        stepSize={1}
                        value={this.state.tempo}
                    />
                </FormGroup>

                <p>filter</p>
                <div className={`${styles.sliderPanel} inline-slider-panel`}>
                    <FormGroup label="Q" inline={true}>
                        <Slider
                            labelStepSize={2}
                            max={12}
                            min={0}
                            onChange={(filterQ) => {
                                this.monoSynth.filter.Q.value = filterQ;
                                this.setState({ filterQ });
                            }}
                            stepSize={0.1}
                            value={this.state.filterQ}
                            vertical={true}
                        />
                    </FormGroup>

                    <FormGroup label="env decay" inline={true}>
                        <Slider
                            labelStepSize={0.5}
                            max={5}
                            min={0.2}
                            onChange={(filterEnvDecay) => {
                                this.monoSynth.filterEnvelope.decay = filterEnvDecay;
                                this.setState({ filterEnvDecay });
                            }}
                            stepSize={0.1}
                            value={this.state.filterEnvDecay}
                            vertical={true}
                        />
                    </FormGroup>

                    <FormGroup label="env sustain" inline={true}>
                        <NormalRangeSlider
                            onChange={(filterEnvSustain: number) => {
                                this.monoSynth.filterEnvelope.sustain = filterEnvSustain;
                                this.setState({ filterEnvSustain });
                            }}
                            value={this.state.filterEnvSustain}
                            vertical={true}
                        />
                    </FormGroup>

                    <FormGroup label="env release" inline={true}>
                        <NormalRangeSlider
                            onChange={(filterEnvRelease: number) => {
                                this.monoSynth.filterEnvelope.release = filterEnvRelease;
                                this.setState({ filterEnvRelease });
                            }}
                            value={this.state.filterEnvRelease}
                            vertical={true}
                        />
                    </FormGroup>
                </div>
                {/* <P5Canvas sketch={this.sketch} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} /> */}
            </Layout>
        );
    }

    private handlePlayToggle = () => {
        if (Tone.Transport.state === "started") {
            Tone.Transport.stop();
            this.parts.forEach((p) => p.stop());
            this.setState({ isPlaying: false });
        } else {
            Tone.Transport.start();
            this.parts.forEach((p) => p.start());
            this.setState({ isPlaying: true });
        }
    };
}
