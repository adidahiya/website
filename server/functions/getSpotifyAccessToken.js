/**
 * Retrieves the Spotify Web Playback SDK access token.
 */
export function handler(event, context, callback) {
    callback(null, {
        statusCode: 200,
        body: process.env.SPOTIFY_ACCESS_TOKEN,
    });
}
