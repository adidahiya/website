export function shouldRenderAnalytics(location: Location) {
    return location.hostname !== "localhost";
}

export function isLegacyRoute(location: Location) {
    return location.pathname.indexOf("/public") === 0;
}
