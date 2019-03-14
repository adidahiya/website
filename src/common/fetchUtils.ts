const { NODE_ENV } = process.env;
const isProduction = NODE_ENV === "production";

type WhitelistedNetlifyFunction = "sendAdiMessage" | "getSpotifyAccessToken";

// consider using a development proxy route instead of this
export function fetchNetlifyFunction(
    url: WhitelistedNetlifyFunction,
    init: RequestInit = { method: "GET" },
): Promise<Response> {
    const urlPrefix = isProduction ? "/.netlify/functions" : "http://localhost:9000";

    if (!isProduction) {
        init.mode = "no-cors";
    }

    return fetch(`${urlPrefix}/${url}`, init);
}
