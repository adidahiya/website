import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = new URL("..", import.meta.url).pathname;
const publicDirectory = join(root, "public");

test("the Gatsby build emits the primary site pages", () => {
    const pages = ["index.html", "photos/index.html", "blog/itp/index.html"];

    for (const page of pages) {
        const pagePath = join(publicDirectory, page);
        assert.ok(existsSync(pagePath), `Expected build output: ${page}`);
        assert.match(readFileSync(pagePath, "utf8"), /<html/i);
    }
});

test("the deployable Netlify functions have handlers", () => {
    const functions = ["getSpotifyAccessToken.js", "isAdiWalking.js", "sendAdiMessage.js"];

    for (const functionName of functions) {
        const functionPath = join(root, "server", "functions", functionName);
        assert.ok(existsSync(functionPath), `Expected function source: ${functionName}`);
        assert.match(readFileSync(functionPath, "utf8"), /export (async )?function handler/);
    }
});
