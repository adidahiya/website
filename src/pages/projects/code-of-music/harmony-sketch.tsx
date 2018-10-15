import { Link } from "gatsby";
import p5 from "p5";
import React from "react";
import Tone from "tone";
import DefaultLayout from "../../../components/defaultLayout";
import { P5Canvas } from "../../../components/p5Canvas";

const CANVAS_WIDTH = 888;
const CANVAS_HEIGHT = 400;

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
        note: Tone.Types.Frequency;
    }> = [];

    public componentDidMount() {
        // do Tone setup
        Tone.Transport.bpm.value = 120;

        this.poly = new Tone.PolySynth(2, Tone.Synth).toMaster();
        this.poly.volume.value = -10;
        for (const v of this.poly.voices) {
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
        }).toMaster();
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
            <DefaultLayout>
                <h3>Code of Music</h3>
                <p>
                    Week 5 Harmony (<Link to="/blog/itp/code-of-music/harmony">blog post</Link>)
                </p>
                Press any key to play notes. Spacebar toggles drone. <br /> <br />
                <P5Canvas sketch={this.sketch} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
            </DefaultLayout>
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
        let frequencies: Tone.Types.Frequency[] = [];

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
            frequencies = this.poly.voices.map(v => v.frequency.value);
            this.notesToDraw.push({
                x: p.random(0, CANVAS_WIDTH),
                y: p.random(0, CANVAS_HEIGHT / 2),
                time: p.millis(),
                note: frequencies[frequencies.length - 1],
            });

            // pitch bend
            for (const v of this.poly.voices) {
                const { value } = v.frequency;
                v.frequency.rampTo(new Tone.Frequency(value).transpose(2));
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
            for (const v of this.poly.voices) {
                v.frequency.rampTo(frequencies[i]);
                i++;
            }
        };
    };

    // callback for each measure
    private handleMeasure = (time: Tone.Types.Time) => {
        let note: Tone.Types.Frequency = "C2";
        if (this.notesToDraw.length > 1) {
            console.log(this.poly.voices.map(v => v.frequency.value));
            note = this.poly.voices[0].frequency.value;
        }
        this.droneSynth.triggerAttackRelease(note, "1m", time, 0.5);
    };
}
