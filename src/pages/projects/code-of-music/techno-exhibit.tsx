import { Button } from "@blueprintjs/core";
// import { Link } from "gatsby";
import p5 from "p5";
import React from "react";
import Tone from "tone";
// import { createLoopWithPlayers } from "../../../common";
import { DefaultLayoutWithoutHeader as Layout, SessionView, Transport } from "../../../components";
// import { P5Canvas } from "../../../components/p5Canvas";

// const CANVAS_WIDTH = 888;
// const CANVAS_HEIGHT = 500;

interface IState {
    isPlaying: boolean;
}

export default class extends React.PureComponent<{}, IState> {
    public state = {
        isPlaying: false,
    };

    private parts: Array<Tone.Part | Tone.Loop> = [];

    public componentDidMount() {
        Tone.Transport.bpm.value = 120;
    }

    public componentWillUnmount() {
        for (const p of this.parts) {
            p.stop();
        }
    }

    public render() {
        return (
            <Layout>
                <h3>Techno Landscape</h3>
                <Button
                    icon={this.state.isPlaying ? "stop" : "play"}
                    intent={this.state.isPlaying ? "danger" : "primary"}
                    onClick={this.handlePlayToggle}
                    style={{ marginBottom: 20 }}
                    text={this.state.isPlaying ? "Stop" : "Play"}
                />
                <Transport />
                <SessionView />
            </Layout>
        );
    }

    private handlePlayToggle = () => {
        if (Tone.Transport.state === "started") {
            Tone.Transport.stop();
            this.parts.forEach(p => p.stop());
            this.setState({ isPlaying: false });
        } else {
            Tone.Transport.start();
            this.parts.forEach(p => p.start());
            this.setState({ isPlaying: true });
        }
    };

    private sketch = (p: p5) => {
        p.setup = () => {
            // noop
        };

        p.draw = () => {
            // noop
        };
    };
}
