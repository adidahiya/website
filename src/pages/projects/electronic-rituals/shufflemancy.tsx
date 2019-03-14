import { Button } from "@blueprintjs/core";
import React from "react";
// import { fetchNetlifyFunction } from "../../../common";
import { DefaultLayoutWithoutHeader as Layout } from "../../../components";

interface IState {
    loading: boolean;
}

export default class extends React.PureComponent<{}, IState> {
    public state: IState = {
        loading: true,
    };

    public async componentDidMount() {
        try {
            await getWebPlaybackSDKPromise();
            // const tokenResponse = await fetchNetlifyFunction("getSpotifyAccessToken");
            // const token = await tokenResponse.text();

            // dev token, expires hourly
            const token =
                "BQDBNan94x5AjKiiUtZ5m20skV4uAkpfN9ho-qHwuIQj1vMU3DDWj16fWMgDksiD4o5ysGW4tyA0QAbsvbaj0uzh-v02VffVuaT6L3STaFqapoGwZNxLzcf0hO5KT3UL2kfQfOKa96o8btOWqQgBPhkAy5o7lT-V3CZksHY";
            const player = new (window as any).Spotify.Player({
                name: "Shufflemancy web player",
                getOauthToken: (cb: any) => cb(token),
            });

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
        const { loading } = this.state;

        return (
            <Layout
                title="shufflemancy"
                remoteScripts={[{ src: "https://sdk.scdn.co/spotify-player.js" }]}
            >
                <p>shufflemancy</p>
                <Button loading={loading} text="Shuffle" />
            </Layout>
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
