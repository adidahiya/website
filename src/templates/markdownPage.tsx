import { graphql } from "gatsby";
import React from "react";

import DefaultLayoutWithoutHeader from "../components/defaultLayoutWithoutHeader";
import * as styles from "./markdown.module.css";

export default ({ data }: any) => {
    const post = data.markdownRemark;
    return (
        <DefaultLayoutWithoutHeader>
            <h2>{post.frontmatter.title}</h2>
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
