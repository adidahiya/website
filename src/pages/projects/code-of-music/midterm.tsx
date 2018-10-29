import { Button } from "@blueprintjs/core";
import { Link } from "gatsby";
import p5 from "p5";
import React from "react";
import Tone from "tone";
import { DefaultLayoutWithoutHeader as Layout } from "../../../components";
import { P5Canvas } from "../../../components/p5Canvas";

const CANVAS_WIDTH = 888;
const CANVAS_HEIGHT = 400;

interface IState {
    isPlaying: boolean;
}

export default class extends React.PureComponent<{}, IState> {
    public state = {
        isPlaying: false,
    };

    private monoSynth!: Tone.MonoSynth;

    public componentDidMount() {
        Tone.Transport.bpm.value = 120;
        this.monoSynth = new Tone.MonoSynth({
            oscillator: {
                type: "square",
            },
            filter: {
                Q: 2.4,
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
                decay: 2.51,
                release: 0.5,
                sustain: 0.1,
                baseFrequency: "A2",
                octaves: 4,
            },
        }).toMaster();
        this.monoSynth.volume.value = -10;
    }

    public componentWillUnmount() {
        this.monoSynth.dispose();
    }

    public render() {
        return (
            <Layout>
                <h3>Code of Music</h3>
                <p>
                    Midterm project (<Link to="/blog/itp/code-of-music/midterm">blog post</Link>)
                </p>
                <Button
                    icon={this.state.isPlaying ? "stop" : "play"}
                    intent={this.state.isPlaying ? "danger" : "primary"}
                    onClick={this.handlePlayToggle}
                    style={{ marginBottom: 20 }}
                    text={this.state.isPlaying ? "Stop" : "Play"}
                />
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

    // adapted from https://p5js.org/examples/hello-p5-drawing.html
    private sketch = (p: p5) => {
        const paths: ParticlePath[] = [];
        let isPainting = false;
        let current: p5.Vector;
        let previous: p5.Vector;

        let nextParticleTimer = 0;
        let lastBeatTimer = 0;

        const MAX_BACKGROUND_DARKEN_ON_BEAT = 12;

        p.setup = () => {
            current = p.createVector(0, 0);
            previous = p.createVector(0, 0);
        };

        p.draw = () => {
            const now = p.millis();
            const lengthOfSixteenth = new Tone.Time("16n").toMilliseconds();

            if (this.state.isPlaying) {
                const [bar, beat, sixteenth] = Tone.Transport.position.split(":");
                if (parseInt(sixteenth, 10) === 0) {
                    lastBeatTimer = now;
                }
                const darken = Math.round(
                    p.map(
                        now - lastBeatTimer,
                        0,
                        lengthOfSixteenth,
                        0,
                        MAX_BACKGROUND_DARKEN_ON_BEAT,
                    ),
                );
                p.background(255 - darken);
            } else {
                p.background(255);
            }

            if (now > nextParticleTimer && isPainting) {
                current.x = p.mouseX;
                current.y = p.mouseY;

                const force = p5.Vector.sub(current, previous);
                force.mult(0.05);
                paths[paths.length - 1].add(current, force);

                nextParticleTimer = now + p.random(100);
                previous.x = current.x;
                previous.y = current.y;
            }

            for (const path of paths) {
                path.update();
                path.display();
            }
        };

        p.mousePressed = () => {
            nextParticleTimer = 0;
            isPainting = true;
            previous.x = p.mouseX;
            previous.y = p.mouseY;
            paths.push(new ParticlePath(p));
        };

        p.mouseReleased = () => {
            isPainting = false;
        };
    };
}

interface IXYCoords {
    x: number;
    y: number;
}

class ParticlePath {
    private particles: Particle[];
    private hue: number;

    constructor(private p: p5) {
        this.particles = [];
        this.hue = Math.round(p.random(255));
    }

    public add(position: IXYCoords, force: IXYCoords) {
        this.particles.push(new Particle(this.p, position, force, this.hue));
    }

    public update() {
        this.particles.forEach(p => p.update());
    }

    public display() {
        // loop backwards
        for (let i = this.particles.length - 1; i >= 0; i--) {
            if (this.particles[i].lifespan <= 0) {
                this.particles.splice(i, 1);
            } else {
                this.particles[i].display(this.particles[i + 1]);
            }
        }
    }
}

const PARTICLE_SIZE = 16;

class Particle {
    public position: p5.Vector;
    public velocity: p5.Vector;
    public drag = 0.95;
    public lifespan = 255; // also used for alpha values
    private color: p5.Color;

    constructor(private p: p5, position: IXYCoords, force: IXYCoords, hue: number) {
        this.p.colorMode(this.p.HSB, 255);
        this.position = p.createVector(position.x, position.y);
        this.velocity = p.createVector(force.x, force.y);
        this.color = p.color(hue, 128, 200);
    }

    public update() {
        this.position.add(this.velocity);
        this.velocity.mult(this.drag);
        this.lifespan--;
    }

    public display(other?: Particle) {
        this.setFill(this.lifespan / 2);
        this.p.noStroke();
        this.p.ellipse(this.position.x, this.position.y, PARTICLE_SIZE, PARTICLE_SIZE);
        if (other !== undefined) {
            this.setStroke(this.lifespan / 2);
            this.p.line(this.position.x, this.position.y, other.position.x, other.position.y);
        }
    }

    private setFill(alpha: number) {
        this.p.fill(
            this.p.hue(this.color),
            this.p.saturation(this.color),
            this.p.brightness(this.color),
            alpha,
        );
    }

    private setStroke(alpha: number) {
        this.p.stroke(
            this.p.hue(this.color),
            this.p.saturation(this.color),
            this.p.brightness(this.color),
            alpha,
        );
    }
}
