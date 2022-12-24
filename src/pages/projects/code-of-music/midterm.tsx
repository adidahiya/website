import { Button } from "@blueprintjs/core";
import { Link } from "gatsby";
import p5 from "p5";
import React from "react";
import * as Tone from "tone";
import { createLoopWithPlayers } from "../../../common";
import { DefaultLayoutWithoutHeader as Layout } from "../../../components";
import { P5Canvas } from "../../../components/p5Canvas";

const CANVAS_WIDTH = 888;
const CANVAS_HEIGHT = 500;
const DEFAULT_FILTER_Q = 1.4;

interface IState {
    isPlaying: boolean;
}

export default class extends React.PureComponent<{}, IState> {
    public state = {
        isPlaying: false,
    };

    private monoSynth!: Tone.MonoSynth;
    private parts: Array<Tone.Part | Tone.Loop> = [];
    private paths: ParticlePath[] = [];

    public componentDidMount() {
        Tone.Transport.bpm.value = 120;
        this.monoSynth = new Tone.MonoSynth({
            oscillator: {
                type: "square",
            },
            filter: {
                Q: DEFAULT_FILTER_Q,
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
                decay: 0.6,
                sustain: 0.3,
                release: 0.5,
                baseFrequency: "C2",
                octaves: 4,
            },
        }).toMaster();
        this.monoSynth.volume.value = -25;
        const synthPart = new Tone.Part(
            (time: Tone.Unit.Time, note: string) => {
                const shouldTrigger = this.paths.filter((p) => p.isActive()).length > 1;
                if (shouldTrigger) {
                    this.monoSynth.triggerAttackRelease(note as Tone.Unit.Note, "8n", time);
                }
            },
            [
                ["0:0:0", "F2"],
                ["0:0:2", "A#2"],
                ["0:0:3", "C2"],
                ["0:1:0", "A#2"],
                ["0:1:3", "F2"],
                ["0:2:1", "F2"],
                ["0:2:3", "F2"],
            ],
        );
        synthPart.loop = true;
        synthPart.humanize = true;
        // disable for now, might bring back more random synth patterns later
        // this.parts.push(synthPart);

        const kit = new Tone.Players({
            kick: "/sounds/kick.wav",
            hh: "/sounds/electronic-hi-hat.ogg",
            wood: "/sounds/drum-wood-under-rug.m4a",
            dsClave: "/sounds/drum-synth-clave.m4a",
            dsGlass: "/sounds/drum-synth-glass.m4a",
            snareCombo: "/sounds/drum-snare-combo.m4a",
        }).toMaster();
        kit.volume.value = 0;
        kit.player("kick").volume.value = -15;
        kit.player("hh").volume.value = -10;
        kit.player("wood").volume.value = 5;
        kit.player("dsClave").volume.value = 10;
        kit.player("dsGlass").volume.value = 10;

        const drumLoop = createLoopWithPlayers(kit, "16n", ({ beat, sixteenth: six, trigger }) => {
            // console.log(bar, beat, six);
            const numActivePaths = this.paths.filter((p) => p.isActive()).length;
            const shouldTriggerHH = this.paths.some((p) => p.isActive() && p.hue > 50);
            const shouldTriggerClave = this.paths.some((p) => p.isActive() && p.hue < 100);
            const shouldTriggerGlass = this.paths.some((p) => p.isActive() && p.hue > 150);
            const shouldTriggerWood = numActivePaths > 2;
            const shouldTriggerSnare = this.paths.some((p) => p.isActive() && p.hue > 100 && p.hue < 200);

            if (beat === 0) {
                if (shouldTriggerWood) {
                    trigger("wood");
                }
            } else if (beat === 1) {
                if (shouldTriggerSnare) {
                    trigger("snareCombo");
                }
            }

            if (six === 0) {
                trigger("kick");
            } else if (six === 2) {
                if (shouldTriggerHH) {
                    trigger("hh");
                }
            }

            if (beat === 2) {
                if (six === 1) {
                    trigger("kick");
                } else if (six === 3) {
                    if (shouldTriggerClave) {
                        trigger("dsClave");
                    }
                }
            }

            if (beat === 3) {
                if (six === 2) {
                    if (shouldTriggerGlass) {
                        trigger("dsGlass");
                    }
                }
            }
        });
        this.parts.push(drumLoop);
    }

    public componentWillUnmount() {
        this.monoSynth.dispose();
        for (const p of this.parts) {
            p.stop();
        }
    }

    public render() {
        return (
            <Layout>
                <h3>Rhythm Generator</h3>
                <p>
                    Code of Music midterm project (<Link to="/blog/itp/code-of-music/midterm">blog post</Link>)
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
            this.parts.forEach((p) => p.stop());
            this.setState({ isPlaying: false });
        } else {
            Tone.Transport.start();
            this.parts.forEach((p) => p.start());
            this.setState({ isPlaying: true });
        }
    };

    // adapted from https://p5js.org/examples/hello-p5-drawing.html
    private sketch = (p: p5) => {
        let isPainting = false;
        let current: p5.Vector;
        let previous: p5.Vector;

        let nextParticleTimer = 0;
        let lastBeatTimer = 0;

        const MAX_BACKGROUND_DARKEN_ON_BEAT = 8;

        p.setup = () => {
            current = p.createVector(0, 0);
            previous = p.createVector(0, 0);
        };

        p.draw = () => {
            p.background(255);
            p.strokeWeight(1);
            const now = p.millis();
            const lengthOfSixteenth = Tone.Time("16n").toMilliseconds();

            if (now > nextParticleTimer && isPainting) {
                current.x = p.mouseX;
                current.y = p.mouseY;

                const force = p5.Vector.sub(current, previous);
                force.mult(0.05);
                this.paths[this.paths.length - 1].add(current, force);

                nextParticleTimer = now + p.random(100);
                previous.x = current.x;
                previous.y = current.y;
            }

            for (const path of this.paths) {
                path.update();
                path.display();
            }

            if (this.state.isPlaying) {
                const [_bar, _beat, sixteenth] = (Tone.Transport.position as Tone.Unit.BarsBeatsSixteenths).split(":");
                if (parseInt(sixteenth, 10) === 0) {
                    lastBeatTimer = now;
                }

                // draw border pulse, it should be above any other layers in the image
                const darken = Math.round(
                    p.map(now - lastBeatTimer, 0, lengthOfSixteenth, 0, MAX_BACKGROUND_DARKEN_ON_BEAT),
                );
                // draw border
                p.stroke(255 - darken);
                p.noFill();
                const weight = 4;
                p.strokeWeight(weight + 2);
                p.rect(weight, weight, p.width - 2 * weight, p.height - 2 * weight);
            } else {
                // no-op
            }
        };

        p.mousePressed = () => {
            nextParticleTimer = 0;
            isPainting = true;
            previous.x = p.mouseX;
            previous.y = p.mouseY;
            this.paths.push(new ParticlePath(p));

            const numActivePaths = this.paths.filter((path) => path.isActive()).length;
            if (this.monoSynth != null && numActivePaths > 3) {
                this.monoSynth.filter.Q.value = p.map(numActivePaths, 2, 16, 1, 8);
            } else {
                this.monoSynth.filter.Q.value = DEFAULT_FILTER_Q;
            }
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
    public particles: Particle[];
    public hue: number;

    constructor(private p: p5) {
        this.particles = [];
        this.hue = Math.round(p.random(255));
    }

    public isActive() {
        return this.particles.length > 0;
    }

    public add(position: IXYCoords, force: IXYCoords) {
        this.particles.push(new Particle(this.p, position, force, this.hue));
    }

    public clear() {
        this.particles = [];
    }

    public update() {
        this.particles.forEach((p) => p.update());
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

const PARTICLE_SIZE = 10;
const MAX_LIFESPAN = 60;
const PARTICLE_SATURATION = 160;
const PARTICLE_BRIGHTNESS = 160;

class Particle {
    public position: p5.Vector;
    public velocity: p5.Vector;
    public drag = 0.95;
    public lifespan = MAX_LIFESPAN;
    private color: p5.Color;

    constructor(private p: p5, position: IXYCoords, force: IXYCoords, hue: number) {
        this.p.colorMode(this.p.HSB, 255);
        this.position = p.createVector(position.x, position.y);
        this.velocity = p.createVector(force.x, force.y);
        this.color = p.color(hue, PARTICLE_SATURATION, PARTICLE_BRIGHTNESS);
    }

    public update() {
        this.position.add(this.velocity);
        this.velocity.mult(this.drag);
        this.lifespan--;
    }

    public display(other?: Particle) {
        this.setFill();
        this.p.noStroke();
        this.p.ellipse(this.position.x, this.position.y, PARTICLE_SIZE, PARTICLE_SIZE);
        if (other !== undefined) {
            this.setStroke();
            this.p.line(this.position.x, this.position.y, other.position.x, other.position.y);
        }
    }

    private setFill() {
        const alpha = this.p.map(this.lifespan, 0, MAX_LIFESPAN, 0, 128);
        this.p.fill(this.p.hue(this.color), this.p.saturation(this.color), this.p.brightness(this.color), alpha);
    }

    private setStroke() {
        const alpha = this.p.map(this.lifespan, 0, MAX_LIFESPAN, 0, 128);
        this.p.stroke(this.p.hue(this.color), this.p.saturation(this.color), this.p.brightness(this.color), alpha);
    }
}
