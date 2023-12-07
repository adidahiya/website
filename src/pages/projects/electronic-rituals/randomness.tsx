import { Button, FormGroup } from "@blueprintjs/core";
import { Link } from "gatsby";
import React from "react";
import * as Tone from "tone";

import { DefaultLayoutWithoutHeader } from "../../../components";

const NUM_CHANNELS = 2;

export default class extends React.PureComponent {
    private toneContext?: Tone.Context;
    private bufferSources: Tone.ToneBufferSource[] = [];
    // eslint-disable-next-line deprecation/deprecation
    private scriptProcessorNodes: ScriptProcessorNode[] = [];

    private mouseX = 0;
    private mouseY = 0;
    private windowWidth = 100;
    private windowHeight = 100;

    public componentDidMount() {
        const noise = new Tone.Noise("brown");
        // eslint-disable-next-line no-console
        console.log(noise);

        this.toneContext = new Tone.Context();
        Tone.Destination.volume.value = -20;

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
                <p>
                    <Link to="/blog/itp/electronic-rituals/meditation-5">blog post</Link>
                </p>
                <FormGroup>
                    <Button
                        text="Start brown noise"
                        intent="success"
                        onClick={this.handleStartWithBufferClick}
                        style={{ marginRight: 20 }}
                    />
                    <Button
                        text="Start reactive noise with mouse position"
                        intent="primary"
                        onClick={this.handleStartWithMousePositionClick}
                        style={{ marginRight: 20 }}
                    />
                    <Button text="Stop" intent="danger" onClick={this.handleStopClick} />
                </FormGroup>
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
        brownNoise.toDestination();
        this.bufferSources.push(brownNoise);
    }

    private generateNoiseWithMousePosition(toneContext: Tone.Context) {
        const bufferSize = 4096;
        const brownNoise = (() => {
            const lastOut: number[] = [];
            for (let channelNum = 0; channelNum < NUM_CHANNELS; channelNum++) {
                lastOut[channelNum] = 0.0;
            }

            // eslint-disable-next-line deprecation/deprecation
            const node = toneContext.rawContext.createScriptProcessor(
                bufferSize,
                NUM_CHANNELS,
                NUM_CHANNELS,
            );
            // eslint-disable-next-line deprecation/deprecation
            node.onaudioprocess = (e) => {
                for (let channelNum = 0; channelNum < NUM_CHANNELS; channelNum++) {
                    // eslint-disable-next-line deprecation/deprecation
                    const output = e.outputBuffer.getChannelData(channelNum);
                    for (let i = 0; i < bufferSize; i++) {
                        const white = this.mouseAndDateBasedRandom() * 2 - 1;
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
        // gain.gain.value = -20;
        // brownNoise.connect(gain).connect(toneContext.rawContext.destination);
        brownNoise.connect(toneContext.rawContext.destination);
    }

    private mouseRandomState = 0;
    private mouseBasedRandom = () => {
        this.mouseRandomState++;
        return (((this.mouseX + this.mouseY) * this.mouseRandomState) % 100) / 100;
    };

    private dateState = 0;
    private mouseAndDateBasedRandom = () => {
        const m = this.mouseBasedRandom();
        const d = Date.now();
        this.dateState++;
        return (((m + (d % 100)) * this.dateState) % 100) / 100;
    };

    // @ts-ignore
    private mouseRatioBasedRandom = () => {
        const xRatio = this.mouseX / this.windowWidth;
        const yRatio = this.mouseY / this.windowHeight;
        this.mouseRandomState++;
        // ratio sum ranges between 0 -> 2
        // random state modulo ranges between 0 -> 5
        return ((xRatio + yRatio) * (this.mouseRandomState % 5)) / 10;
        // return (((xRatio + yRatio) * this.mouseRandomState) % 100) / 100;
    };

    // @ts-ignore
    private mouseRatio = () => {
        const xRatio = this.mouseX / this.windowWidth;
        const yRatio = this.mouseY / this.windowHeight;
        return (((xRatio + yRatio + 1) * 100) % 100) / 100;
    };
}

/* eslint-disable no-bitwise */

// @ts-ignore
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
