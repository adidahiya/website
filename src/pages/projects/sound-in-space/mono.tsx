import { Button } from "@blueprintjs/core";
import React from "react";
import * as Tone from "tone";
import { DefaultLayoutWithoutHeader as Layout } from "../../../components";
import * as styles from "./mono.module.css";

const soundUrl = (filename: string) => `/sounds/sound-in-space/${filename}`;
const impulseResponseUrl = (name: string) =>
    `https://raw.githubusercontent.com/GoogleChromeLabs/web-audio-samples/gh-pages/samples/audio/impulse-responses/${name}.wav`;

interface IState {
    buffersLoaded: boolean;
}

export default class extends React.PureComponent<{}, IState> {
    public state: IState = {
        buffersLoaded: false,
    };

    private sampleBuffer?: Tone.ToneAudioBuffer;
    private sampleBuffer2?: Tone.ToneAudioBuffer;
    private convolver?: Tone.Convolver;

    public async componentDidMount() {
        const lowBoost = new Tone.Filter(200, "lowshelf");
        lowBoost.gain.value = 10;

        [this.sampleBuffer, this.sampleBuffer2] = await Promise.all([
            Tone.Buffer.fromUrl(soundUrl("glitches-clicking.mp3")),
            Tone.Buffer.fromUrl(soundUrl("glitches-interference-1.mp3")),
        ]);
        this.sampleBuffer.reverse = true;

        this.convolver = new Tone.Convolver(impulseResponseUrl("echo-chamber"))
            .connect(new Tone.Filter(3000, "lowpass", -24))
            .connect(lowBoost)
            .toDestination();
        // TODO(adidahiya): figure out a way to bring back this dry/wet setting in Tone.js v14
        // this.convolver.wet.value = 0.8;

        this.setState({ buffersLoaded: true });
    }

    public render() {
        const { buffersLoaded } = this.state;

        return (
            <Layout className={styles.container} title="Mono composition">
                <Button
                    loading={!buffersLoaded}
                    text="play"
                    intent="success"
                    onClick={this.handleClick}
                />
            </Layout>
        );
    }

    private handleClick = () => {
        const { buffersLoaded } = this.state;

        if (!buffersLoaded) {
            return;
        }

        const intervals = [0, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];
        const now = Tone.now();

        intervals.forEach((interval, i) => {
            const source = new Tone.BufferSource(this.sampleBuffer!).connect(this.convolver!);
            source.fadeOut = "1n";

            const source2 = new Tone.BufferSource(this.sampleBuffer2!).connect(this.convolver!);
            source2.fadeOut = "1n";

            const startTime = now + i / 4;
            const freqRatio = Tone.intervalToFrequencyRatio(interval);

            source.start(startTime);
            source.playbackRate.setValueAtTime(1, startTime);
            source.playbackRate.linearRampToValueAtTime(freqRatio, startTime + 0.1);

            // source2.start(startTime);
            // source2.playbackRate.setValueAtTime(1, startTime);
            // source2.playbackRate.linearRampToValueAtTime(freqRatio, startTime + 0.1);

            source.stop("+1m");
            source2.stop("+1m");
        });
    };
}
