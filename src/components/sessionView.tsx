import { Classes } from "@blueprintjs/core";
import classNames from "classnames";
import { mapValues } from "lodash-es";
import React from "react";
import Tone from "tone";
import styles from "./sessionView.module.css";

interface ISessionContext {
    tracks: {
        [trackName: string]: {
            clips: ISessionLoop[];
        };
    };
}

interface ISessionLoop {
    event: Tone.Event;
    player: Tone.Player;
    toggle: () => void;
}

const SessionContext = React.createContext({ tracks: {} });

interface IState {
    sessionContext?: ISessionContext;
}

export default class extends React.Component<{}, IState> {
    public state: IState = {};

    public componentDidMount() {
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

        const createLoop = (player: Tone.Player, loopEnd: Tone.Types.Time): ISessionLoop => {
            const e = new Tone.Event(() => {
                if (player.loaded) {
                    // console.log("Waiting for player to loade...", player);
                    player.start();
                }
            });
            // e.start();
            e.loop = false;
            e.loopEnd = loopEnd;
            let hasStarted = false;

            return {
                event: e,
                player,
                toggle: () => {
                    e.loop = !e.loop;
                    if (!hasStarted) {
                        e.start();
                        hasStarted = true;
                    }
                    this.setState(this.state);
                },
            };
        };

        const simpleLoops = mapValues(simpleLoopPlayers, (_p, name) =>
            createLoop(simpleLoopPlayers[name], "1m"),
        );

        const brassHook1Player = new Tone.Player(
            "/sounds/techno-landscape/instruments/BrassHook1(loopEnd13m).mp3",
        ).toMaster();
        const brassHook2Player = new Tone.Player(
            "/sounds/techno-landscape/instruments/BrassHook2(loopEnd38m).mp3",
        ).toMaster();
        const brassHookLoops = [
            createLoop(brassHook1Player, "13m"),
            createLoop(brassHook2Player, "38"),
        ];

        this.setState({
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
                },
            },
        });
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
                    {Object.keys(tracks).map(trackName => (
                        <div className={styles.track}>
                            <div>{trackName}</div>
                            <br />
                            <div className={styles.clips}>
                                {tracks[trackName].clips.map((clip, i) => (
                                    <Clip {...clip} key={`clip-${i}`} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </SessionContext.Provider>
        );
    }
}

interface IClipProps extends ISessionLoop {
    // nothing
}

class Clip extends React.PureComponent<IClipProps> {
    public static defaultProps = {
        isPlaying: false,
    };

    public render() {
        const { player } = this.props;
        return (
            <div
                className={classNames(Classes.INTERACTIVE, Classes.CARD, styles.clip, {
                    [styles.clipPlaying]: player && player.state === "started",
                })}
                onClick={this.handleClick}
            />
        );
    }

    private handleClick = () => {
        this.props.toggle();
    };
}
