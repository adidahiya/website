/* eslint-disable camelcase */

import ky from "ky";

/**
 * Tells you whether Adi is on a walk right now.
 */
export async function handler() {
    const { foursquare_client_id, foursquare_client_secret } = process.env;

    if (foursquare_client_id == null || foursquare_client_secret == null) {
        callback(new Error("Could not find foursquare API keys"));
        return;
    }

    const response = await ky.get("https://api.foursquare.com/v2/users/self", {
        searchParams: {
            client_id: foursquare_client_id,
            client_secret: foursquare_client_secret,
            v: "201902013",
        },
    });

    if (response.ok) {
        const body = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(body),
        };
    } else {
        return {
            statusCode: 500,
            body: "Foursquare API call failed",
        };
    }
}
