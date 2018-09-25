import { Location as LocationProvider } from "@reach/router";
import Link from "gatsby-link";
import React from "react";
import Helmet from "react-helmet";

import styles from "./defaultLayout.module.css";

const Header = () => (
    <div className={styles.header}>
        <div>
            <h1>
                <Link to="/">Adi Dahiya</Link>
            </h1>
        </div>
    </div>
);

const META_TAGS = [
    { name: "description", content: "Adi Dahiya's website" },
    { name: "keywords", content: "portfolio, blog, ITP, photography, art, documentation" },
];
const META_TAGS_WITH_REDIRECT = [...META_TAGS, { "http-equiv": "refresh", content: "0; URL='/'" }];

const LINK_TAGS = [
    {
        href: require("../assets/favicon-16.png"),
        rel: "icon",
        sizes: "16x16",
        type: "image/png",
    },
    {
        href: require("../assets/favicon-32.png"),
        rel: "icon",
        sizes: "32x32",
        type: "image/png",
    },
    {
        href: require("../assets/favicon-48.png"),
        rel: "icon",
        sizes: "48x48",
        type: "image/png",
    },
];

declare global {
    // tslint:disable-next-line interface-name
    interface Window {
        // google analytics
        dataLayer: any;
    }
}

export default class extends React.Component {
    public componentDidMount() {
        if (this.shouldRenderAnalytics(window.location)) {
            // google analytics snippet
            window.dataLayer = window.dataLayer || [];
            gtag("js", new Date());
            gtag("config", "UA-126153749-1");
        }

        function gtag(...args: any[]) {
            window.dataLayer.push(args);
        }
    }

    public render() {
        return (
            <LocationProvider>
                {({ location }) => {
                    const isLegacyRoute = location.pathname.indexOf("/public") === 0;
                    const childContentsWithHeader = (
                        <>
                            <Header />
                            <div className={styles.body}>{this.props.children}</div>
                        </>
                    );
                    const redirectNotice = <p>Contents have moved... redirecting to root page</p>;

                    return (
                        <>
                            <Helmet
                                title="Adi Dahiya"
                                link={LINK_TAGS}
                                meta={isLegacyRoute ? META_TAGS_WITH_REDIRECT : META_TAGS}
                            />
                            {isLegacyRoute ? redirectNotice : childContentsWithHeader}
                            {this.shouldRenderAnalytics(location) && (
                                <script
                                    async={true}
                                    src="https://www.googletagmanager.com/gtag/js?id=UA-126153749-1"
                                />
                            )}
                        </>
                    );
                }}
            </LocationProvider>
        );
    }

    private shouldRenderAnalytics(location: Location) {
        return location.hostname !== "localhost";
    }
}
