import { Location as LocationProvider } from "@reach/router";
import { Link } from "gatsby";
import React from "react";
import Helmet from "react-helmet";
import * as favicon16 from "../assets/favicon-16.png";
import * as favicon32 from "../assets/favicon-32.png";
import * as favicon48 from "../assets/favicon-48.png";
import { initGoogleAnalytics, isLegacyRoute, shouldRenderAnalytics } from "../common";
import styles from "./defaultLayout.module.css";

const Header = () => (
    <div className={styles.header}>
        <div>
            <h1>
                <Link to="/">adi.🍕</Link>
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
        href: favicon16,
        rel: "icon",
        sizes: "16x16",
        type: "image/png",
    },
    {
        href: favicon32,
        rel: "icon",
        sizes: "32x32",
        type: "image/png",
    },
    {
        href: favicon48,
        rel: "icon",
        sizes: "48x48",
        type: "image/png",
    },
];

export function DefaultLayoutHelmet({ location }: { location: Location }) {
    const maybeAnalyticsScript = shouldRenderAnalytics(location) ? (
        <script async={true} src="https://www.googletagmanager.com/gtag/js?id=UA-126153749-1" />
    ) : (
        undefined
    );
    return (
        <Helmet
            title="Adi Dahiya"
            link={LINK_TAGS}
            meta={isLegacyRoute(location) ? META_TAGS_WITH_REDIRECT : META_TAGS}
        >
            {maybeAnalyticsScript}
        </Helmet>
    );
}

export default class extends React.Component {
    public componentDidMount() {
        initGoogleAnalytics(window.location);
    }

    public render() {
        return (
            <LocationProvider>
                {({ location }) => {
                    const childContentsWithHeader = (
                        <>
                            <Header />
                            <div className={styles.body}>{this.props.children}</div>
                        </>
                    );
                    const redirectNotice = <p>Contents have moved... redirecting to root page</p>;

                    return (
                        <>
                            <DefaultLayoutHelmet location={location} />
                            {isLegacyRoute(location) ? redirectNotice : childContentsWithHeader}
                        </>
                    );
                }}
            </LocationProvider>
        );
    }
}
