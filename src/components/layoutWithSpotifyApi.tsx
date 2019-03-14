///<reference path="../../node_modules/spotify-web-api-js/src/typings/spotify-api.d.ts" />

import { Spinner } from "@blueprintjs/core";
import React from "react";
import SpotifyWebApi from "spotify-web-api-js";
import DefaultLayoutWithoutHeader from "./defaultLayoutWithoutHeader";

interface IProps {
    title: string;
    children: (renderProps: { player: any; api: SpotifyWebApi.SpotifyWebApiJs }) => React.ReactNode;
}

interface IState {
    loading: boolean;
    player?: any;
    api?: SpotifyWebApi.SpotifyWebApiJs;
}

// TODO: decouple this from DefaultLayout, it has no business with that
export default class extends React.PureComponent<IProps, IState> {
    public state: IState = {
        loading: true,
    };

    public async componentDidMount() {
        try {
            await getWebPlaybackSDKPromise();
            const player = createSpotifyPlayer();
            const api = createSpotifyApi();

            // Error handling
            const handleError = ({ message }: any) => console.error(message);
            player.addListener("initialization_error", handleError);
            player.addListener("authentication_error", handleError);
            player.addListener("account_error", handleError);
            player.addListener("playback_error", handleError);

            // Playback status updates
            player.addListener("player_state_changed", (state: any) => {
                console.log(state);
            });

            // Ready
            player.addListener("ready", ({ device_id }: any) => {
                console.log("Ready with Device ID", device_id);
                this.setState({
                    loading: false,
                    player,
                    api,
                });
            });

            // Not Ready
            player.addListener("not_ready", ({ device_id }: any) => {
                console.log("Device ID has gone offline", device_id);
            });

            // Connect to the player!
            player.connect();
        } catch (e) {
            console.error(e);
        }
    }

    public render() {
        const { children, title } = this.props;
        const { loading, player, api } = this.state;

        return (
            <DefaultLayoutWithoutHeader
                title={title}
                remoteScripts={[{ src: "https://sdk.scdn.co/spotify-player.js" }]}
            >
                <br />
                {loading ? <Spinner size={Spinner.SIZE_LARGE} /> : children({ player, api: api! })}
            </DefaultLayoutWithoutHeader>
        );
    }
}

function getWebPlaybackSDKPromise() {
    return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
            console.error("Spotify web playback SDK did not initialize after 10 seconds");
            reject();
        }, 10000);

        (window as any).onSpotifyWebPlaybackSDKReady = () => {
            clearTimeout(timeout);
            resolve();
        };
    });
}

// expires hourly
// const DEV_TOKEN = "BQDBNan94x5AjKiiUtZ5m20skV4uAkpfN9ho-qHwuIQj1vMU3DDWj16fWMgDksiD4o5ysGW4tyA0QAbsvbaj0uzh-v02VffVuaT6L3STaFqapoGwZNxLzcf0hO5KT3UL2kfQfOKa96o8btOWqQgBPhkAy5o7lT-V3CZksHY";
const DEV_TOKEN = process.env.spotify_access_token!;

function createSpotifyPlayer() {
    /**
     * globally injected script :(
     * @see https://github.com/spotify/web-playback-sdk/issues/14
     */
    const SpotifyPlayer = (window as any).Spotify.Player;

    // const tokenResponse = await fetchNetlifyFunction("getSpotifyAccessToken");
    // const token = await tokenResponse.text();
    const token = DEV_TOKEN;

    return new SpotifyPlayer({
        name: "Shufflemancy web player",
        getOauthToken: (cb: any) => cb(token),
    });
}

function createSpotifyApi() {
    const api = new SpotifyWebApi();
    api.setAccessToken(DEV_TOKEN);
    return api;
}
