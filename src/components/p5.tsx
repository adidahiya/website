import p5 from "p5";
import React from "react";

import styles from "./p5.module.css";

export interface IP5Props {
    /**
     * Should the canvas element automatically get focus?
     * @default true
     */
    autoFocus?: boolean;

    /**
     * Run your sketch here.
     */
    sketch: (p: p5) => void;
}

export class P5 extends React.Component<IP5Props> {
    public static defaultProps: IP5Props = {
        autoFocus: true,
        sketch: () => undefined,
    };

    private containerEl?: HTMLDivElement | null;
    // @ts-ignore
    private instance?: p5;

    public componentDidMount() {
        if (this.containerEl != null) {
            this.instance = new p5(this.props.sketch, this.containerEl);
            if (this.props.autoFocus) {
                this.containerEl.focus();
            }
        }
    }

    public render() {
        return <div className={styles.processingSketch} ref={r => (this.containerEl = r)} />;
    }
}
