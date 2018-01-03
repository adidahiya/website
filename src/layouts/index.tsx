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

const META_ATTRIBUTES = [
    { name: "description", content: "Sample" },
    { name: "keywords", content: "sample, something" },
];

const TemplateWrapper: React.SFC<{
    children: () => React.ReactNode;
}> = ({ children }) => (
    <div>
        <Helmet title="Adi Dahiya" meta={META_ATTRIBUTES} />
        <Header />
        <div className={styles.body}>{children()}</div>
    </div>
);

TemplateWrapper.propTypes = {
    children: PropTypes.func,
};

export default TemplateWrapper;
