import { Link } from "gatsby";
import { throttle } from "lodash-es";
import p5 from "p5";
import React from "react";
import Tone from "tone";
import DefaultLayoutWithoutHeader from "../../../components/defaultLayoutWithoutHeader";
import { P5Canvas } from "../../../components/p5Canvas";

const CANVAS_WIDTH = 888;
const CANVAS_HEIGHT = 400;
const ARDUINO_PORT_NAME = "/dev/cu.usbmodem1411";

// tslint:disable no-console

interface IState {
    delayTime: Tone.Types.Time;
    distortion: number;
    isPlaying: boolean;
    noiseVolume: Tone.Types.Decibels;
    pitch: Tone.Types.Frequency;
}

export default class extends React.PureComponent<{}, IState> {
    public state = {
        delayTime: 0.25,
        distortion: 0.1,
        isPlaying: false,
        noiseVolume: -5,
        pitch: "C4",
    };

    private serial: any;

    private distortion!: Tone.Distortion;
    private delay!: Tone.FeedbackDelay;
    private sineSynth!: Tone.Synth;
    private noise!: Tone.Source;
    private player!: Tone.Player;
    private hasStarted = false;
    private p5!: p5;

    public async componentDidMount() {
        this.serial = new (p5 as any).SerialPort();

        this.distortion = new Tone.Distortion(this.state.distortion);
        this.delay = new Tone.FeedbackDelay(this.state.delayTime).toMaster();

        this.sineSynth = new Tone.Synth({
            oscillator: {
                type: "sine",
            },
            envelope: {
                attack: 0.05,
                decay: 0.6,
                sustain: 1.0,
                release: 2,
            },
        })
            .connect(this.distortion)
            .connect(this.delay);
        this.sineSynth.volume.value = -5;

        this.noise = new Tone.Noise("brown").start();
        this.noise.volume.value = this.state.noiseVolume;
        const autoFilter = new Tone.AutoFilter({
            frequency: "8m",
            min: 800,
            max: 15000,
        }).toMaster();
        this.noise.connect(autoFilter);
        autoFilter.start();

        // repeat quarter notes infinitely
        const loop = new Tone.Loop((time: Tone.Types.Time) => {
            this.sineSynth.triggerAttackRelease(this.state.pitch, "2n", time);
        }, "4n");
        loop.start();

        this.player = new Tone.Player("/sounds/Crake.mp3")
            .connect(this.distortion)
            .connect(this.delay);
        this.player.volume.value = -10;
        this.player.sync();
        this.player.start();
    }

    public render() {
        return (
            <DefaultLayoutWithoutHeader>
                <h3>Physical Computing</h3>
                <p>
                    Steampunk arm (
                    <Link to="/blog/itp/physical-computing/steampunk-arm">blog post</Link>)
                </p>
                <button type="button" onClick={this.handlePlayToggle} style={{ marginBottom: 20 }}>
                    {this.state.isPlaying ? "Stop" : "Play"}
                </button>{" "}
                <span>{this.state.pitch}</span>
                <P5Canvas sketch={this.sketch} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
            </DefaultLayoutWithoutHeader>
        );
    }

    private sketch = (p: p5) => {
        this.p5 = p;

        p.setup = () => {
            // noop
        };

        p.draw = () => {
            p.clear();
            p.noStroke();
        };
    };

    private bindSerialEventHandlers() {
        this.serial.on("connected", () => console.log("connected"));
        this.serial.on("open", () => console.log("open"));
        this.serial.on("data", () => {
            const data = this.serial.readLine();
            // handshakes are more trouble than they're worth...
            // if (data === "hello computer") {
            //     console.log("got handshake");
            //     this.serial.write("hello arduino");
            //     // start playing audio
            //     this.handlePlayToggle();
            //     return;
            // }

            if (data != null && data.trim() !== "") {
                // expecing data of the form "pitch, roll"
                const matches = data.match(/(.*)\,\ (.*)/);
                if (matches != null && matches.length === 3) {
                    const pitch = parseInt(matches[1], 10);
                    const roll = parseInt(matches[2], 10);

                    const MIN_PITCH = -40;
                    const MAX_PITCH = 10;

                    let note: string;
                    if (pitch > MIN_PITCH && pitch < MAX_PITCH) {
                        const freq = Math.round(
                            this.p5.map(pitch, MIN_PITCH, MAX_PITCH, 200, 2000),
                        );
                        note = new Tone.Frequency(freq).toNote();
                        this.noise.volume.value = Math.round(
                            this.p5.map(pitch, MIN_PITCH, MAX_PITCH, -20, 0),
                        );
                    }

                    const MIN_ROLL = 0;
                    const MAX_ROLL = 100;

                    let delayTime: number;
                    let distortion: number;
                    if (roll > MIN_ROLL && roll < MAX_ROLL) {
                        distortion = this.p5.map(roll, MIN_ROLL, MAX_ROLL, 0, 1);
                        delayTime = this.p5.map(roll, MIN_ROLL, MAX_ROLL, 0, 1);
                        this.distortion.distortion = distortion;
                        this.delay.delayTime.value = delayTime;
                    }

                    this.logValues(pitch, roll, distortion!, note!);
                    this.setState({
                        delayTime: delayTime!,
                        distortion: distortion!,
                        pitch: note!,
                    });
                }
            }
        });
        this.serial.on("error", (err: any) => console.log("error", err));
        this.serial.on("close", () => console.log("closed"));
    }

    private logValues = throttle((x, y, distortion, note) => {
        console.log(`pitch, roll: ${x}, ${y} / dist, note: ${distortion}, ${note}`);
    }, 250);

    private handlePlayToggle = () => {
        if (this.state.isPlaying) {
            Tone.Transport.stop();
            this.serial.close(ARDUINO_PORT_NAME);
            this.setState({ isPlaying: false });
        } else {
            if (!this.hasStarted) {
                this.bindSerialEventHandlers();
                this.hasStarted = true;
            }
            Tone.Transport.start();
            this.serial.open(ARDUINO_PORT_NAME);
            this.setState({ isPlaying: true });
        }
    };
}
