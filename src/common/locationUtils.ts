export function isLegacyRoute(location: Location) {
    return location.pathname.indexOf("/public") === 0;
}
