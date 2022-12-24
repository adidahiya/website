import { Classes, Slider } from "@blueprintjs/core";
import classNames from "classnames";
import { mapValues } from "lodash-es";
import React from "react";
import * as Tone from "tone";
import * as styles from "./sessionView.module.css";

interface ISessionContext {
    tracks: {
        [trackName: string]: {
            clips: ISessionLoop[];
            slider?: () => React.ReactNode;
        };
    };
}

interface ISessionLoop {
    player: Tone.Player;
    toggle: () => void;
}

const SessionContext = React.createContext({ tracks: {} });

interface IState {
    sessionContext?: ISessionContext;
    padDroneSliderValue: number;
    steadySeqSliderValue: number;
}

export default class extends React.Component<{}, IState> {
    public state: IState = {
        padDroneSliderValue: 2,
        steadySeqSliderValue: 200,
    };

    public componentDidMount() {
        Tone.Transport.bpm.value = 126;
        const simplePlayerUrls = {
            kick: "/sounds/techno-landscape/drums/BD.mp3",
            clickyPerc: "/sounds/techno-landscape/drums/ClickyPerc.mp3",
            hh606: "/sounds/techno-landscape/drums/HH606ish.mp3",
            hhDecayRise: "/sounds/techno-landscape/drums/HHDecayRise.mp3",
            hhOff1: "/sounds/techno-landscape/drums/HHoff1.mp3",
            hhOff2: "/sounds/techno-landscape/drums/HHoff2.mp3",
            hhOff3: "/sounds/techno-landscape/drums/HHOff3.mp3",
            rim: "/sounds/techno-landscape/drums/Rim.mp3",
            bass: "/sounds/techno-landscape/instruments/Bass.mp3",
        };
        // use individual Players so that we can control individual levels
        const simpleLoopPlayers = mapValues(simplePlayerUrls, (_url, name) =>
            new Tone.Player((simplePlayerUrls as { [key: string]: string })[name]).toMaster(),
        );
        simpleLoopPlayers.clickyPerc.volume.value = 5;
        simpleLoopPlayers.rim.volume.value = 5;
        simpleLoopPlayers.bass.volume.value = 5;

        const createLoop = (player: Tone.Player, loopInterval: Tone.Unit.Time): ISessionLoop => {
            player.loop = false;
            player.loopEnd = loopInterval;
            let hasStarted = false;

            return {
                player,
                toggle: () => {
                    if (player.loop) {
                        player.loop = false;
                        Tone.Transport.scheduleOnce((time: Tone.Unit.Time) => {
                            console.log("stopping clip at ", time);
                            player.stop(time);
                            hasStarted = false;
                        }, "+1m");
                    } else {
                        player.loop = true;
                        if (!player.loaded) {
                            console.log("waiting for player to load...", player);
                        } else if (!hasStarted) {
                            // start playing for the first time, synced to Transport
                            const [bar, beat, sixteenth] = (
                                Tone.Transport.position as Tone.Unit.BarsBeatsSixteenths
                            ).split(":");
                            // start on first beat of next bar
                            const startTime = `${parseInt(bar, 10) + 1}:0:0`;
                            console.log(startTime);
                            player.sync().start(startTime);
                            hasStarted = true;
                        }
                    }
                },
            };
        };

        const simpleLoops = mapValues<typeof simpleLoopPlayers, ISessionLoop>(simpleLoopPlayers, (_p, name) =>
            createLoop(simpleLoopPlayers[name as keyof typeof simplePlayerUrls], "1m"),
        );

        const brassHook1Player = new Tone.Player(
            "/sounds/techno-landscape/instruments/BrassHook1(loopEnd13m).mp3",
        ).toMaster();
        brassHook1Player.volume.value = -3;
        const brassHook2Player = new Tone.Player(
            "/sounds/techno-landscape/instruments/BrassHook2(loopEnd38m).mp3",
        ).toMaster();
        brassHook2Player.volume.value = -3;
        const brassHookLoops = [createLoop(brassHook1Player, "13m"), createLoop(brassHook2Player, "38m")];

        const padDrone1Player = new Tone.Player("/sounds/techno-landscape/instruments/PadDrone1(loopEnd35m).mp3");
        padDrone1Player.volume.value = 6;
        const padDrone2Player = new Tone.Player("/sounds/techno-landscape/instruments/PadDrone2(loopEnd30m).mp3");
        padDrone2Player.volume.value = 6;
        const padDrone3Player = new Tone.Player("/sounds/techno-landscape/instruments/PadDrone3(loopEnd20m).mp3");
        const padDrone4Player = new Tone.Player("/sounds/techno-landscape/instruments/PadDrone4(loopEnd27m).mp3");
        const padDronePhaser = new Tone.Phaser({
            frequency: 10, // 2-10
            octaves: 5,
            baseFrequency: 500, // 500-1000
        }).toMaster();
        padDrone1Player.connect(padDronePhaser);
        padDrone2Player.connect(padDronePhaser);
        padDrone3Player.connect(padDronePhaser);
        padDrone4Player.connect(padDronePhaser);
        const padDroneLoops = [
            createLoop(padDrone1Player, "35m"),
            createLoop(padDrone2Player, "30m"),
            createLoop(padDrone3Player, "20m"),
            createLoop(padDrone4Player, "27m"),
        ];
        const padDroneSlider = () => (
            <Slider
                min={2}
                max={10}
                value={this.state.padDroneSliderValue}
                onChange={(val) => {
                    padDronePhaser.frequency.value = val;
                    const newBaseFreq = mapNumberRange(val, 2, 10, 500, 1000);
                    padDronePhaser.baseFrequency = newBaseFreq;
                    this.setState({
                        padDroneSliderValue: val,
                    });
                }}
                labelRenderer={false}
            />
        );

        const steadySeq1Player = new Tone.Player("/sounds/techno-landscape/instruments/SteadySeq1(loopEnd27m).mp3");
        // steadySeq1Player.loop = true;
        const steadySeq2Player = new Tone.Player("/sounds/techno-landscape/instruments/SteadySeq2(loopEnd24m).mp3");
        // steadySeq2Player.loop = true;
        const steadySeq3Player = new Tone.Player("/sounds/techno-landscape/instruments/SteadySeq3(loopEnd16m).mp3");
        // steadySeq3Player.loop = true;
        const steadySeq4Player = new Tone.Player("/sounds/techno-landscape/instruments/SteadySeq4(loopEnd25m).mp3");
        // steadySeq4Player.loop = true;
        const steadySeqFilter = new Tone.Filter({
            type: "highpass",
            frequency: 200,
            rolloff: -24,
            Q: 20,
            gain: 1,
        }).toMaster();
        steadySeq1Player.connect(steadySeqFilter);
        steadySeq2Player.connect(steadySeqFilter);
        steadySeq3Player.connect(steadySeqFilter);
        steadySeq4Player.connect(steadySeqFilter);
        const steadySeqLoops = [
            createLoop(steadySeq1Player, "27m"),
            createLoop(steadySeq2Player, "24m"),
            createLoop(steadySeq3Player, "16m"),
            createLoop(steadySeq4Player, "25m"),
        ];
        const steadySeqSlider = () => (
            <Slider
                min={200}
                max={1000}
                value={this.state.steadySeqSliderValue}
                onChange={(val) => {
                    steadySeqFilter.frequency.value = val;
                    steadySeqFilter.Q.value = mapNumberRange(val, 200, 1000, 1, 15);
                    this.setState({
                        steadySeqSliderValue: val,
                    });
                }}
                labelRenderer={false}
            />
        );

        // HACKHACK deeply nested state :(
        this.setState(
            {
                sessionContext: {
                    tracks: {
                        kick: {
                            clips: [simpleLoops.kick],
                        },
                        "hi hat": {
                            clips: [
                                simpleLoops.hh606,
                                simpleLoops.hhDecayRise,
                                simpleLoops.hhOff1,
                                simpleLoops.hhOff2,
                                simpleLoops.hhOff3,
                            ],
                        },
                        percussion: {
                            clips: [simpleLoops.clickyPerc, simpleLoops.rim],
                        },
                        bass: {
                            clips: [simpleLoops.bass],
                        },
                        brass: {
                            clips: brassHookLoops,
                        },
                        pad: {
                            clips: padDroneLoops,
                            slider: padDroneSlider,
                        },
                        beeps: {
                            clips: steadySeqLoops,
                            slider: steadySeqSlider,
                        },
                    },
                },
            },
            () => Tone.Transport.start(),
        );
    }

    public render() {
        const { sessionContext } = this.state;

        if (sessionContext === undefined) {
            // don't render anything in SSR
            return <div />;
        }

        const { tracks } = sessionContext;

        return (
            <SessionContext.Provider value={sessionContext}>
                <div className={styles.sessionView}>
                    {Object.keys(tracks).map((trackName, i) => (
                        <div className={styles.track} key={`track=${i}`}>
                            <div>{trackName}</div>
                            <br />
                            <div className={styles.clips}>
                                {tracks[trackName].clips.map((clip, j) => (
                                    <Clip {...clip} key={`clip-${j}`} />
                                ))}
                            </div>
                            {this.maybeRenderSlider(tracks[trackName])}
                        </div>
                    ))}
                </div>
            </SessionContext.Provider>
        );
    }

    public maybeRenderSlider(track: any) {
        if (typeof track.slider === "function") {
            return track.slider();
        }
    }

    public componentWillUnmount() {
        const { sessionContext } = this.state;
        if (sessionContext === undefined) {
            return;
        }

        for (const track of Object.keys(sessionContext.tracks)) {
            for (const clip of sessionContext.tracks[track].clips) {
                // clip.loop.stop().dispose();
                clip.player.dispose();
            }
        }

        Tone.Transport.stop();
    }
}

// tslint:disable-next-line:no-empty-interface
interface IClipProps extends ISessionLoop {
    // nothing
}

interface IClipState {
    isPlaying: boolean;
}

class Clip extends React.PureComponent<IClipProps, IClipState> {
    public state: IClipState = {
        // HACKHACK: should be using player.state for this instead
        isPlaying: false,
    };

    public render() {
        return (
            <div
                className={classNames(Classes.INTERACTIVE, Classes.CARD, styles.clip, {
                    [styles.clipPlaying]: this.state.isPlaying,
                })}
                onClick={this.handleClick}
            />
        );
    }

    private handleClick = () => {
        const { player, toggle } = this.props;
        toggle();
        setTimeout(() => this.setState({ isPlaying: player.loop === true }));
    };
}

function mapNumberRange(val: number, inMin: number, inMax: number, outMin: number, outMax: number) {
    return ((val - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
