import { H2 } from "@blueprintjs/core";
import { graphql } from "gatsby";
import React from "react";

import DefaultLayoutWithoutHeader from "../components/defaultLayoutWithoutHeader";
import * as styles from "./markdown.module.css";

export default ({ data }: any) => {
    const post = data.markdownRemark;
    return (
        <DefaultLayoutWithoutHeader>
            <H2>{post.frontmatter.title}</H2>
            <div className={styles.container} dangerouslySetInnerHTML={{ __html: post.html }} />
        </DefaultLayoutWithoutHeader>
    );
};

export const query = graphql`
    query ($slug: String!) {
        markdownRemark(fields: { slug: { eq: $slug } }) {
            html
            frontmatter {
                title
            }
            fields {
                slug
            }
        }
    }
`;
