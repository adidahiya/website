import { Button } from "@blueprintjs/core";
import React from "react";
import Tone from "tone";
import { DefaultLayoutWithoutHeader } from "../../../components";

const NUM_CHANNELS = 2;

export default class extends React.PureComponent {
    private toneContext?: Tone.Context;
    private bufferSources: Tone.BufferSource[] = [];
    private scriptProcessorNodes: ScriptProcessorNode[] = [];

    private mouseX = 0;
    private mouseY = 0;
    private windowWidth = 100;
    private windowHeight = 100;

    public componentDidMount() {
        const noise = new Tone.Noise("brown");
        console.log(noise);

        this.toneContext = new Tone.Context();
        Tone.Master.volume.value = -20;

        document.addEventListener("mousemove", (e: MouseEvent) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        window.addEventListener("resize", () => {
            this.windowWidth = window.innerWidth;
            this.windowHeight = window.innerHeight;
        });
    }

    public render() {
        return (
            <DefaultLayoutWithoutHeader>
                <h3>random noise generator</h3>
                <Button
                    text="Start noise with buffer"
                    intent="success"
                    onClick={this.handleStartWithBufferClick}
                    style={{ marginRight: 20 }}
                />
                <Button
                    text="Start noise with mouse position"
                    intent="primary"
                    onClick={this.handleStartWithMousePositionClick}
                    style={{ marginRight: 20 }}
                />
                <Button text="Stop" intent="danger" onClick={this.handleStopClick} />
            </DefaultLayoutWithoutHeader>
        );
    }

    private handleStartWithBufferClick = () => {
        if (this.toneContext !== undefined) {
            this.generateNoiseWithBuffer(this.toneContext);
        }
    };

    private handleStartWithMousePositionClick = () => {
        if (this.toneContext !== undefined) {
            this.generateNoiseWithMousePosition(this.toneContext);
        }
    };

    private handleStopClick = () => {
        this.clearBuffers();
        this.clearScriptProcessorNodes();
    };

    private clearBuffers() {
        for (const b of this.bufferSources) {
            b.stop();
            b.dispose();
        }
        this.bufferSources = [];
    }

    private clearScriptProcessorNodes() {
        for (const n of this.scriptProcessorNodes) {
            n.disconnect();
        }
        this.scriptProcessorNodes = [];
    }

    private generateNoiseWithBuffer(toneContext: Tone.Context) {
        this.clearBuffers();

        const bufferSize = 2 * toneContext.rawContext.sampleRate;
        const buffer: Float32Array[] = [];

        for (let channelNum = 0; channelNum < NUM_CHANNELS; channelNum++) {
            const channel = new Float32Array(bufferSize);
            buffer[channelNum] = channel;
            let lastOut = 0.0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                channel[i] = (lastOut + 0.02 * white) / 1.02;
                lastOut = channel[i];
                channel[i] *= 3.5; // (roughly) compensate for gain
            }
        }
        const brown = new Tone.Buffer().fromArray(buffer);
        const brownNoise = new Tone.BufferSource(brown);
        brownNoise.loop = true;
        brownNoise.start(0);
        brownNoise.toMaster();
        this.bufferSources.push(brownNoise);
    }

    private generateNoiseWithMousePosition(toneContext: Tone.Context) {
        const bufferSize = 4096;
        const brownNoise = (() => {
            const lastOut: number[] = [];
            for (let channelNum = 0; channelNum < NUM_CHANNELS; channelNum++) {
                lastOut[channelNum] = 0.0;
            }

            const node = toneContext.rawContext.createScriptProcessor(
                bufferSize,
                NUM_CHANNELS,
                NUM_CHANNELS,
            );
            node.onaudioprocess = e => {
                for (let channelNum = 0; channelNum < NUM_CHANNELS; channelNum++) {
                    const output = e.outputBuffer.getChannelData(channelNum);
                    // const myRandom = xorshift(this.mouseBasedRandom());
                    // const myRandom = xorshift(this.mouseRatio() + 1);
                    // const myRandom = Math.random;
                    const myRandom = this.mouseBasedRandom;
                    for (let i = 0; i < bufferSize; i++) {
                        const white = myRandom() * 2 - 1;
                        output[i] = (lastOut[channelNum] + 0.02 * white) / 1.02;
                        lastOut[channelNum] = output[i];
                        output[i] *= 1.5; // (roughly) compensate for gain
                    }
                }
            };
            return node;
        })();

        this.scriptProcessorNodes.push(brownNoise);
        // const gain = new GainNode(toneContext.rawContext, { gain: -20 });
        // // gain.gain.value = -20;
        // brownNoise.connect(gain).connect(toneContext.rawContext.destination);
        brownNoise.connect(toneContext.rawContext.destination);
    }

    private mouseRandomState = 0;
    private mouseBasedRandom = () => {
        this.mouseRandomState++;
        return (((this.mouseX + this.mouseY) * this.mouseRandomState) % 100) / 100;
    };

    private mouseRatioBasedRandom = () => {
        const xRatio = this.mouseX / this.windowWidth;
        const yRatio = this.mouseY / this.windowHeight;
        this.mouseRandomState++;
        // ratio sum ranges between 0 -> 2
        // random state modulo ranges between 0 -> 5
        return ((xRatio + yRatio) * (this.mouseRandomState % 5)) / 10;
        // return (((xRatio + yRatio) * this.mouseRandomState) % 100) / 100;
    };

    private mouseRatio = () => {
        const xRatio = this.mouseX / this.windowWidth;
        const yRatio = this.mouseY / this.windowHeight;
        return (((xRatio + yRatio + 1) * 100) % 100) / 100;
    };
}

// tslint:disable no-bitwise

function xorshift(seed: number) {
    // let state = 1;
    let state = seed;
    return () => {
        // adapted from http://excamera.com/sphinx/article-xorshift.html
        state ^= state << 13;
        state ^= state >> 17;
        state ^= state << 5;
        // javascript numbers overflow as negative, so map output to modulo
        // plus 0.5
        const ret = (state % 100) / 200 + 0.5;
        return ret;
    };
}

// @ts-ignore
function generateWhiteNoiseBuffer(audioContext: AudioContext) {
    const bufferSize = 2 * audioContext.sampleRate;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    return noiseBuffer;
}
