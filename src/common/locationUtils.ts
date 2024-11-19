export function isLegacyRoute(location: Location) {
    return location.pathname.startsWith("/public");
}
