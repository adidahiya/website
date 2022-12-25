import request from "request";

/**
 * Tells you whether Adi is on a walk right now.
 */
export function handler(event, context, callback) {
    const { foursquare_client_id, foursquare_client_secret } = process.env;

    if (foursquare_client_id == null || foursquare_client_secret == null) {
        callback(new Error("Could not find foursquare API keys"));
        return;
    }

    request(
        {
            uri: "https://api.foursquare.com/v2/users/self",
            method: "GET",
            qs: {
                client_id: foursquare_client_id,
                client_secret: foursquare_client_secret,
                v: "201902013",
            },
        },
        (error, response, body) => {
            if (error != null) {
                callback(error);
            } else {
                callback(null, {
                    statusCode: 200,
                    body,
                });
            }
        },
    );
}
