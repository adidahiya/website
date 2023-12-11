import { Link } from "gatsby";
import type p5 from "p5";
import React from "react";
import * as Tone from "tone";

import { createLoopWithPlayers } from "../../../common";
import Layout from "../../../components/defaultLayoutWithoutHeader";
import { P5Canvas } from "../../../components/p5Canvas";

const CANVAS_WIDTH = 888;
const CANVAS_HEIGHT = 400;

// eslint-disable-next-line @typescript-eslint/ban-types
export default class extends React.PureComponent<{}, { isPlaying: boolean; tempo: number }> {
    public state = {
        isPlaying: false,
        tempo: 110,
    };

    private loops: any[] = [];

    public componentDidMount() {
        Tone.Transport.bpm.value = this.state.tempo;
        Tone.Transport.timeSignature = [4, 4];

        const kit = new Tone.Players({
            kick: "/sounds/kick.wav",
            snare: "/sounds/snare.wav",
            hh: "/sounds/electronic-hi-hat.ogg",
        }).toDestination();

        const drumLoop1 = createLoopWithPlayers(
            kit,
            "16n",
            ({ bar, beat, sixteenth: six, trigger }) => {
                if (beat === 0) {
                    if (six === 0 || six === 1 || six === 2) {
                        trigger("kick");
                    }
                    if (six === 3) {
                        trigger("snare");
                    }
                } else if (beat === 1) {
                    if (six === 0) {
                        trigger("kick");
                    }
                    if (six === 2) {
                        trigger("snare");
                    }
                } else if (beat === 2) {
                    if (six === 0) {
                        trigger("kick");
                    }
                    if (six === 1) {
                        if (bar > 0) {
                            trigger("kick");
                        }
                    }
                    if (six === 2) {
                        trigger("snare");
                    }
                } else if (beat === 3) {
                    if (six === 0) {
                        trigger("snare");
                    }
                }
            },
        );

        const drumLoop2 = createLoopWithPlayers(kit, "16n", ({ bar, trigger }) => {
            if (bar > 1) {
                trigger("hh");
            }
        });

        this.loops.push(drumLoop1, drumLoop2);
    }

    public componentWillUnmount() {
        Tone.Transport.stop();
    }

    public render() {
        return (
            <Layout>
                <h3>Code of Music</h3>
                <p>
                    Week 2 rhythm sketch (<Link to="/blog/itp/code-of-music/rhythm">blog post</Link>
                    ,{" "}
                    <a href="https://github.com/adidahiya/adidahiya.github.io/blob/develop/src/pages/projects/code-of-music/rhythm-sketch.tsx">
                        code
                    </a>
                    )
                </p>
                <button type="button" onClick={this.handlePlayToggle} style={{ marginBottom: 20 }}>
                    {this.state.isPlaying ? "Stop" : "Play"}
                </button>
                <input
                    type="range"
                    name="tempo"
                    min={80}
                    max={160}
                    value={this.state.tempo}
                    step={5}
                    style={{ verticalAlign: "middle", margin: "0 15px" }}
                    onChange={this.handleTempoChange}
                />
                <P5Canvas sketch={this.sketch} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
            </Layout>
        );
    }

    private handlePlayToggle = () => {
        if (Tone.Transport.state === "started") {
            Tone.Transport.stop();
            for (const loop of this.loops) {
                loop.stop();
            }
            this.setState({ isPlaying: false });
        } else {
            Tone.Transport.start();
            for (const loop of this.loops) {
                loop.start();
            }
            this.setState({ isPlaying: true });
        }
    };

    private handleTempoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tempo = parseInt(e.target.value, 10);
        this.setState({ tempo });
        Tone.Transport.bpm.value = tempo;
    };

    private sketch = (p: p5) => {
        p.setup = () => {
            p.background(this.state.tempo * 2);
        };

        p.draw = () => {
            p.background(this.state.tempo * 2);
        };
    };
}
