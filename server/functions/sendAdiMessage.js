/* eslint-disable camelcase */

import twilio from "twilio";

/**
 * Sends Adi a message.
 * Expects request body { message: string }
 */
export function handler(event, context, callback) {
    const { twilio_client_id, twilio_client_secret } = process.env;

    if (twilio_client_id == null || twilio_client_secret == null) {
        callback(new Error("Could not find twilio API keys"));
        return;
    }

    const { message } = JSON.parse(event.body);

    const client = new twilio(twilio_client_id, twilio_client_secret);
    client.messages
        .create({
            body: message,
            to: "+19082940182",
            from: "+19082937178",
        })
        .then((responseMessage) => {
            // console.log(responseMessage.sid);
            callback(null, {
                statusCode: 200,
                body: responseMessage.sid,
            });
        });
}
