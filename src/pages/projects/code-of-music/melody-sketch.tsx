import { Link } from "gatsby";
import p5 from "p5";
import React from "react";
import Tone from "tone";
import Layout from "../../../components/defaultLayoutWithoutHeader";
import { P5Canvas } from "../../../components/p5Canvas";

const CANVAS_WIDTH = 888;
const CANVAS_HEIGHT = 400;

export default class extends React.PureComponent<
    {},
    { isPlaying: boolean; scale: string[]; octaveToFilter: number }
> {
    public state = {
        isPlaying: false,
        scale: getMinorBluesScaleWithHarmonies(),
        octaveToFilter: 0,
    };

    private synth: any;
    private pattern: any;
    private isPatternPlaying = false;

    public componentDidMount() {
        Tone.Transport.bpm.value = 160;
        this.synth = new Tone.Synth({
            oscillator: {
                type: "sine",
            },
            envelope: {
                attack: 0.05,
                decay: 0.6,
                sustain: 1.0,
                release: 2,
            },
        }).toMaster();
        this.synth.volume.value = -10;

        this.pattern = new Tone.Pattern(
            (time: number, note: any) => {
                this.isPatternPlaying = true;
                this.synth.triggerAttackRelease(note, "16t", time);
                setTimeout(
                    () => (this.isPatternPlaying = false),
                    new Tone.Time("16t").toMilliseconds(),
                );
            },
            this.state.scale,
            "randomWalk",
        );
        this.pattern.interval = "8n";
        this.pattern.humanize = true;
        this.pattern.start();
    }

    public componentWillUnmount() {
        this.pattern.stop();
        this.pattern.dispose();
    }

    public render() {
        return (
            <Layout>
                <h3>Code of Music</h3>
                <p>
                    Week 3 melody sketch (<Link to="/blog/itp/code-of-music/melody">blog post</Link>
                    ,{" "}
                    <a href="https://github.com/adidahiya/adidahiya.github.io/blob/develop/src/pages/projects/code-of-music/melody-sketch.tsx">
                        code
                    </a>
                    )
                </p>
                <button type="button" onClick={this.handlePlayToggle} style={{ marginBottom: 20 }}>
                    {this.state.isPlaying ? "Stop" : "Play"}
                </button>{" "}
                <span>{this.state.scale.join(" ")}</span>
                <P5Canvas sketch={this.sketch} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
            </Layout>
        );
    }

    private handlePlayToggle = () => {
        if (Tone.Transport.state === "started") {
            Tone.Transport.stop();
            this.setState({ isPlaying: false });
        } else {
            Tone.Transport.start();
            this.setState({ isPlaying: true });
        }
    };

    private sketch = (p: p5) => {
        let notesInCanvas: Array<{ x: number; y: number; triggered: number; color: string }> = [];

        p.setup = () => {
            // noop
        };

        p.draw = () => {
            p.noStroke();

            const now = p.millis();
            const octaveToFilter = Math.floor(p.map(p.mouseY, 0, CANVAS_HEIGHT, 2, 6));
            p.background(Math.floor(p.map(p.mouseY, 0, CANVAS_HEIGHT, 4, 1)) * 64);
            let fillColor = `255, 204, 0`;
            switch (octaveToFilter) {
                case 3:
                    fillColor = `224, 96, 224`;
                    break;
                case 4:
                    fillColor = `96, 224, 224`;
                    break;
                case 5:
                    fillColor = `224, 96, 96`;
            }

            if (Tone.Transport.state === "started" && this.isPatternPlaying) {
                // create a new note
                notesInCanvas.push({
                    x: p.mouseX,
                    y: p.mouseY,
                    triggered: now,
                    color: fillColor,
                });
            }
            const newNotes: typeof notesInCanvas = [];
            for (const note of notesInCanvas) {
                // fade notes as they drift left
                const alpha = p.map(now, note.triggered, now, 0, 1);
                // console.log(now, note.triggered, alpha);
                p.fill(`rgba(${note.color}, ${alpha})`);
                p.ellipse(note.x, note.y, 10);
                if (note.x !== 0) {
                    newNotes.push({ ...note, x: note.x - 2 });
                }
            }
            notesInCanvas = newNotes;

            if (this.state.octaveToFilter !== octaveToFilter && this.pattern != null) {
                const scale = getMinorBluesScaleWithHarmonies(octaveToFilter);
                this.pattern.values = scale;
                this.setState({ scale, octaveToFilter });
            }
        };
    };
}

const minorBluesScale = ["C2", "Eb2", "F2", "Gb2", "G2", "Bb3"];
function getMinorBluesScaleWithHarmonies(octaveToFilter: number = 0) {
    if (Tone == null) {
        return minorBluesScale;
    }

    const octave = octaveToFilter.toString();

    return minorBluesScale
        .reduce(
            (harmonies, note) =>
                harmonies.concat(new Tone.Frequency(note).harmonize([0, 12, 24, 36])),
            [] as Tone.Frequency[],
        )
        .map((freq: any) => freq.toNote())
        .filter((note: string) => {
            // console.log(note, octaveToFilter);
            const octavePlusOne = (octaveToFilter + 1).toString();
            return note.indexOf(octave) === -1 && note.indexOf(octavePlusOne) === -1;
        });
}
