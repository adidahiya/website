import Link from "gatsby-link";
import * as PropTypes from "prop-types";
import * as React from "react";
import Helmet from "react-helmet";

import * as styles from "./index.module.css";

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
    { name: "keywords", content: "portfolio" },
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

const TemplateWrapper: React.SFC<{
    children: () => React.ReactNode;
    location: Location;
}> = ({ children, location }) => {
    const isLegacyRoute = location.pathname.indexOf("/public") === 0;
    const childContentsWithHeader = (
        <>
            <Header />
            <div className={styles.body}>{children()}</div>
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
        </>
    );
};

TemplateWrapper.propTypes = {
    children: PropTypes.func,
};

export default TemplateWrapper;
