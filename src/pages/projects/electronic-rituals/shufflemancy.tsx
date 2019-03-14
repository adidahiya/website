///<reference path="../../../../node_modules/spotify-web-api-js/src/typings/spotify-api.d.ts" />

import { Button } from "@blueprintjs/core";
import React from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { DefaultLayoutWithoutHeader as Layout } from "../../../components";

interface IState {
    loading: boolean;
    playlist?: SpotifyApi.PlaylistObjectFull;
    topArtists?: SpotifyApi.UsersTopArtistsResponse;
}

export default class extends React.PureComponent<{}, IState> {
    public state: IState = {
        loading: true,
    };

    public async componentDidMount() {
        try {
            await getWebPlaybackSDKPromise();
            const player = createSpotifyPlayer();
            const spotifyApi = createSpotifyApi();

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

            const me = await spotifyApi.getMe();
            const topArtists = await spotifyApi.getMyTopArtists({
                limit: 20,
                time_range: "long_term",
            });

            const playlists = await spotifyApi.getUserPlaylists(me.id);
            const existingPlaylist = playlists.items.find(p => p.name === "Shufflemancy");
            const playlistFull =
                existingPlaylist !== undefined
                    ? await spotifyApi.getPlaylist(existingPlaylist.id)
                    : await spotifyApi.createPlaylist(me.id, {
                          name: "Shufflemancy",
                          public: false,
                          description: "Divining tunes",
                      });
            this.setState({
                playlist: playlistFull,
                topArtists,
            });
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
                <br />
                <Button loading={loading} text="Shuffle" />
                <div style={{ display: "flex" }}>
                    {this.maybeRenderTopArtists()}
                    {this.maybeRenderPlaylist()}
                </div>
            </Layout>
        );
    }

    private maybeRenderTopArtists() {
        const { topArtists } = this.state;
        if (topArtists === undefined) {
            return;
        }

        return (
            <div style={{ maxWidth: 500, marginRight: 10 }}>
                <h3>Your top artists</h3>
                <ul>
                    {topArtists.items.map(a => (
                        <li>
                            <strong>{a.name}</strong> <small>({a.genres.join(", ")})</small>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    private maybeRenderPlaylist() {
        const { playlist } = this.state;
        if (playlist === undefined) {
            return;
        }

        return (
            <div>
                <h3>Playlist "{playlist.name}"</h3>
                <p>{playlist.tracks.total} tracks</p>
                <ul>
                    {playlist.tracks.items.map(t => (
                        <li>{t.track.name}</li>
                    ))}
                </ul>
            </div>
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
