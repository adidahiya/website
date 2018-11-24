import { Classes } from "@blueprintjs/core";
import classNames from "classnames";
// import { Link } from "gatsby";
import React from "react";
import Tone from "tone";
import { DefaultLayoutWithoutHeader as Layout, SessionView, Transport } from "../../../components";
import styles from "../../../pageStyles/techno-landscape.module.css";

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
            <Layout className={classNames(Classes.DARK, styles.container)} title="techno session">
                <p>techno session</p>
                <Transport />
                <SessionView />
            </Layout>
        );
    }
}
