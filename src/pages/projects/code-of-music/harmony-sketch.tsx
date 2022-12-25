import { H3 } from "@blueprintjs/core";
import { Link } from "gatsby";
import p5 from "p5";
import React from "react";
import * as Tone from "tone";

import Layout from "../../../components/defaultLayoutWithoutHeader";
import { P5Canvas } from "../../../components/p5Canvas";

const CANVAS_WIDTH = 888;
const CANVAS_HEIGHT = 400;

/* eslint-disable no-underscore-dangle */

// eslint-disable-next-line @typescript-eslint/ban-types
export default class extends React.PureComponent<{}, { isDronePlaying: boolean }> {
    public state = {
        isDronePlaying: false,
    };

    private poly!: Tone.PolySynth<Tone.Synth>;
    private droneSynth!: Tone.Synth;
    private loop!: Tone.Loop;
    private notesToDraw: Array<{
        x: number;
        y: number;
        time: number;
        note: Tone.Unit.Frequency;
    }> = [];

    public componentDidMount() {
        // do Tone setup
        Tone.Transport.bpm.value = 120;

        this.poly = new Tone.PolySynth({ voice: Tone.Synth, maxPolyphony: 2 }).toDestination();
        this.poly.volume.value = -10;
        // @ts-ignore -- HACKHACK(adidahiya): need to update for Tone.js v14
        for (const v of this.poly._voices) {
            v.portamento = 100;
        }

        this.droneSynth = new Tone.Synth({
            oscillator: {
                type: "fmsine",
                modulationType: "triangle",
            },
            envelope: {
                attack: 0.5,
                decay: 0.3,
                release: 2,
            },
        }).toDestination();
        this.droneSynth.volume.value = -10;

        this.loop = new Tone.Loop(this.handleMeasure, "1m");
        Tone.Transport.start();
    }

    public componentWillUnmount() {
        this.loop.stop();
        this.poly.dispose();
        this.droneSynth.dispose();
    }

    public render() {
        return (
            <Layout>
                <H3>Code of Music</H3>
                <p>
                    Week 5 Harmony (<Link to="/blog/itp/code-of-music/harmony">blog post</Link>,{" "}
                    <a href="https://github.com/adidahiya/adidahiya.github.io/blob/develop/src/pages/projects/code-of-music/harmony-sketch.tsx">
                        code
                    </a>
                    )
                </p>
                Press any key to play notes. Spacebar toggles drone. <br /> <br />
                <P5Canvas sketch={this.sketch} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
            </Layout>
        );
    }

    private sketch = (p: p5) => {
        p.setup = () => {
            // noop
        };

        p.draw = () => {
            p.clear();
            p.noStroke();

            if (this.state.isDronePlaying) {
                // drone visualization
                const env = this.droneSynth.envelope.value;
                const droneY = CANVAS_HEIGHT * (1 - env);
                const droneHeight = CANVAS_HEIGHT * env;
                // light green matching blog
                p.fill(28, 160, 134);
                p.rect(0, droneY, CANVAS_WIDTH, droneHeight);
            }

            for (const note of this.notesToDraw) {
                p.noFill();
                p.stroke(224, 96, 96);
                p.strokeWeight(3);
                const now = p.millis();
                const rectSize = now - note.time;
                p.rect(note.x - rectSize / 2, note.y - rectSize / 2, rectSize, rectSize);
            }
        };

        const notes = ["C3", "E3"];
        let frequencies: Tone.Unit.Frequency[] = [];

        p.keyPressed = () => {
            if (p.keyCode === 32) {
                // spacebar
                if (this.state.isDronePlaying) {
                    this.loop.stop();
                } else {
                    this.loop.start();
                }
                this.setState({ isDronePlaying: !this.state.isDronePlaying });
                return;
            }

            this.poly.triggerAttack(notes);
            // @ts-ignore -- HACKHACK(adidahiya): need to update for Tone.js v14
            frequencies = this.poly._voices.map((v) => v.frequency.value);
            this.notesToDraw.push({
                x: p.random(0, CANVAS_WIDTH),
                y: p.random(0, CANVAS_HEIGHT / 2),
                time: p.millis(),
                note: frequencies[frequencies.length - 1],
            });

            // pitch bend
            // @ts-ignore -- HACKHACK(adidahiya): need to update for Tone.js v14
            for (const v of this.poly._voices) {
                const { value } = v.frequency;
                v.frequency.rampTo(Tone.Frequency(value).transpose(2));
            }
        };

        p.keyReleased = () => {
            // only release all if all keys were released
            if (p.keyIsPressed) {
                return;
            }

            this.poly.releaseAll();
            this.notesToDraw = [];

            // reset pitch bend
            let i = 0;
            // @ts-ignore -- HACKHACK(adidahiya): need to update for Tone.js v14
            for (const v of this.poly._voices) {
                v.frequency.rampTo(frequencies[i]);
                i++;
            }
        };
    };

    // callback for each measure
    private handleMeasure = (time: Tone.Unit.Time) => {
        let note: Tone.Unit.Frequency = "C2";
        if (this.notesToDraw.length > 1) {
            // @ts-ignore -- HACKHACK(adidahiya): need to update for Tone.js v14
            // eslint-disable-next-line no-console
            console.log(this.poly._voices.map((v) => v.frequency.value));
            // @ts-ignore -- HACKHACK(adidahiya): need to update for Tone.js v14
            note = this.poly._voices[0].frequency.value;
        }
        this.droneSynth.triggerAttackRelease(note, "1m", time, 0.5);
    };
}
