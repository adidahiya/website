import { Link } from "gatsby";
import p5 from "p5";
import React from "react";
import Tone from "tone";
import DefaultLayout from "../../../components/defaultLayout";
import { P5Canvas } from "../../../components/p5Canvas";

require("../../../../static/lib/p5.serialport");

const CANVAS_WIDTH = 888;
const CANVAS_HEIGHT = 400;
const ARDUINO_PORT_NAME = "/dev/cu.usbmodem1411";

// tslint:disable no-console

export default class extends React.PureComponent<
    {},
    { isPlaying: boolean; pitch: Tone.Types.Frequency }
> {
    public state = {
        isPlaying: false,
        pitch: "C4",
    };

    private serial: any;
    private synth!: Tone.Synth;
    private hasStarted = false;
    private p5!: p5;

    public async componentDidMount() {
        this.serial = new p5.SerialPort();
        this.synth = new Tone.Synth({
            oscillator: {
                // type: "fmsine",
                // modulationType: "triangle",
                type: "sine",
            },
            envelope: {
                attack: 0.05,
                decay: 0.6,
                sustain: 1.0,
                release: 2,
            },
        }).toMaster();
        // this.synth.volume.value = -5;
        // this.synth.sync();

        // repeat quarter notes infinitely
        const loop = new Tone.Loop((time: Tone.Types.Time) => {
            this.synth.triggerAttackRelease(this.state.pitch, "2n", time);
        }, "4n");
        loop.start();
    }

    public render() {
        return (
            <DefaultLayout>
                <h3>Physical Computing</h3>
                <p>
                    Week 6 serial communication labs (
                    <Link to="/blog/itp/physical-computing/week-6-labs">blog post</Link>)
                </p>
                <button type="button" onClick={this.handlePlayToggle} style={{ marginBottom: 20 }}>
                    {this.state.isPlaying ? "Stop" : "Play"}
                </button>{" "}
                <P5Canvas sketch={this.sketch} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
            </DefaultLayout>
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
            // const data = Number(this.serial.readLine());
            const data = this.serial.readLine();
            // console.log(data);
            if (data != null && data.trim() !== "") {
                // console.log(data);
                const matches = data.match(/(.*)\,\ (.*)/);
                if (matches != null && matches.length === 3) {
                    const duration1 = parseInt(matches[1], 10);
                    const mappedPitch = this.p5.map(duration1, 0, 10, 200, 2000);
                    this.setState({
                        pitch: new Tone.Frequency(mappedPitch).toNote(),
                    });
                }
            }
        });
        this.serial.on("error", (err: any) => console.log("error", err));
        this.serial.on("close", () => console.log("closed"));
    }

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
