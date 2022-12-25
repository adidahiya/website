import React from "react";
import * as Tone from "tone";
import * as styles from "./transport.module.css";

interface IState {
    position: {
        bar: number;
        beat: number;
        sixteenth: number;
    };
}

export default class extends React.Component<{}, IState> {
    public state: IState = {
        position: {
            bar: 0,
            beat: 0,
            sixteenth: 0,
        },
    };
    private transportEvent?: Tone.ToneEvent;

    public componentDidMount() {
        Tone.Transport.bpm.value = 126;
        this.transportEvent = new Tone.ToneEvent(() => {
            const [bar, beat, sixteenth] = (
                Tone.Transport.position as Tone.Unit.BarsBeatsSixteenths
            ).split(":");
            this.setState({
                position: {
                    bar: parseInt(bar, 10),
                    beat: parseInt(beat, 10),
                    sixteenth: parseInt(sixteenth, 10),
                },
            });
        });
        this.transportEvent.loop = true;
        this.transportEvent.loopEnd = "16t";
        this.transportEvent.start();
    }

    public componentWillUnmount() {
        this.transportEvent!.stop().dispose();
    }

    public render() {
        const { position } = this.state;
        const isPlaying =
            typeof window === "undefined" ? false : Tone.Transport.state === "started";
        const progress = position.beat * 4 + position.sixteenth;
        const progressPercentage = Math.round((progress / 16) * 100);

        return (
            <div className={styles.transport}>
                <div className={styles.transportBars}>
                    <TransportBar />
                    <TransportBar />
                    <TransportBar />
                    <TransportBar />
                </div>
                {isPlaying && (
                    <div
                        className={styles.transportIndicator}
                        style={{ left: `${progressPercentage}%` }}
                    />
                )}
            </div>
        );
    }
}

function TransportBar() {
    return (
        <div className={styles.transportBar}>
            <div className={styles.transportSixteenth} />
            <div className={styles.transportSixteenth} />
            <div className={styles.transportSixteenth} />
            <div className={styles.transportSixteenth} />
        </div>
    );
}
