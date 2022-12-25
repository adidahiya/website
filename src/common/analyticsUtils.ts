import { shouldRenderAnalytics } from "./locationUtils";

declare global {
    interface Window {
        // google analytics
        dataLayer: any;
    }
}

export function initGoogleAnalytics(location: Location) {
    if (shouldRenderAnalytics(location)) {
        // google analytics snippet
        window.dataLayer = window.dataLayer || [];
        gtag("js", new Date());
        gtag("config", "UA-126153749-1");
    }

    function gtag(...args: any[]) {
        window.dataLayer.push(args);
    }
}
