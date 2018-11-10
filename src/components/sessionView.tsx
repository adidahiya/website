import { Classes } from "@blueprintjs/core";
import classNames from "classnames";
import React from "react";
import Tone from "tone";
import styles from "./sessionView.module.css";

export default class extends React.Component {
    public render() {
        return (
            <div className={styles.sessionView}>
                <div className={styles.track}>
                    <h3>Bass drum</h3>
                    <div className={styles.clips}>
                        <Clip isPlaying={true} />
                        <Clip />
                        <Clip />
                    </div>
                </div>
                <div className={styles.track}>
                    <h3>Hi hat</h3>
                    <div className={styles.clips}>
                        <Clip />
                        <Clip />
                        <Clip />
                    </div>
                </div>
                <div className={styles.track}>
                    <h3>Click</h3>
                    <div className={styles.clips}>
                        <Clip />
                        <Clip />
                        <Clip />
                    </div>
                </div>
                <div className={styles.track}>
                    <h3>Pad</h3>
                    <div className={styles.clips}>
                        <Clip />
                        <Clip />
                        <Clip />
                    </div>
                </div>
            </div>
        );
    }
}

interface IClipProps {
    isPlaying?: boolean;
}

class Clip extends React.PureComponent<IClipProps> {
    public static defaultProps = {
        isPlaying: false,
    };

    public render() {
        return (
            <div
                className={classNames(Classes.INTERACTIVE, Classes.CARD, styles.clip, {
                    [styles.clipPlaying]: this.props.isPlaying,
                })}
            />
        );
    }
}
