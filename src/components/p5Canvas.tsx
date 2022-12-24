import p5 from "p5";
import React from "react";
import * as styles from "./p5Canvas.module.css";

if (typeof window !== "undefined") {
    // require("p5/lib/addons/p5.sound");
    require("../../static/lib/p5.serialport");
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

    /** If both dimensions are set, a canvas will be created. */
    width?: number;
    height?: number;
}

export class P5Canvas extends React.Component<IP5Props> {
    public static defaultProps: IP5Props = {
        autoFocus: true,
        sketch: () => undefined,
    };

    private containerEl?: HTMLDivElement | null;

    public componentDidMount() {
        if (this.containerEl != null) {
            const { width, height } = this.props;

            // @ts-ignore
            const instance = new p5((p: p5) => {
                this.props.sketch(p);
                if (width != null && height != null) {
                    // inject some setup code
                    const oldSetup = p.setup;
                    p.setup = () => {
                        p.createCanvas(width, height);
                        oldSetup();
                    };
                }
            }, this.containerEl);

            if (this.props.autoFocus) {
                this.containerEl.focus();
            }
        }
    }

    public render() {
        const { width, height } = this.props;
        return (
            <div className={styles.processingSketch} ref={(r) => (this.containerEl = r)} style={{ width, height }} />
        );
    }
}
