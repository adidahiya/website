import { graphql } from "gatsby";
import React from "react";

import * as styles from "./markdown.module.css";
import DefaultLayout from "../components/defaultLayout";

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
