///<reference path="../../../../node_modules/spotify-web-api-js/src/typings/spotify-api.d.ts" />

import { Button } from "@blueprintjs/core";
import React from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { LayoutWithSpotifyApi } from "../../../components";

interface IProps {
    spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
    spotifyPlayer: any;
}

interface IState {
    playlist?: SpotifyApi.PlaylistObjectFull;
    topArtists?: SpotifyApi.UsersTopArtistsResponse;
}

class Shufflemancy extends React.PureComponent<IProps, IState> {
    public state: IState = {};

    public async componentDidMount() {
        const { spotifyPlayer, spotifyApi } = this.props;

        try {
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
        return (
            <>
                <Button text="Shuffle" />
                <div style={{ display: "flex" }}>
                    {this.maybeRenderTopArtists()}
                    {this.maybeRenderPlaylist()}
                </div>
            </>
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

export default class extends React.PureComponent {
    public render() {
        return (
            <LayoutWithSpotifyApi title="shufflemancy">
                {({ player, api }) => <Shufflemancy spotifyPlayer={player} spotifyApi={api} />}
            </LayoutWithSpotifyApi>
        );
    }
}
