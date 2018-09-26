import p5 from "p5";
import React from "react";
import styles from "./p5Canvas.module.css";

if (typeof window !== "undefined") {
    // tslint:disable no-var-requires
    require("p5/lib/addons/p5.dom");
    require("p5/lib/addons/p5.sound");
}

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

export class P5Canvas extends React.Component<IP5Props> {
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
