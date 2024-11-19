import { graphql } from "gatsby";
import React from "react";

import DefaultLayout from "../components/defaultLayout";
import * as styles from "./markdown.module.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default ({ data }: any) => {
    const post = data.markdownRemark;
    return (
        <DefaultLayout>
            <h2>{post.frontmatter.title}</h2>
            <div className={styles.container} dangerouslySetInnerHTML={{ __html: post.html }} />
        </DefaultLayout>
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
