import { H2, H4 } from "@blueprintjs/core";
import { graphql, Link } from "gatsby";
import React from "react";

import { DefaultLayout, Timestamp } from "../components";
import * as styles from "./blogPost.module.css";
import "./markdown.module.css";

export default ({ data }: any) => {
    const post = data.markdownRemark;
    return (
        <DefaultLayout>
            <H4>
                <Link to="/blog/itp">ITP blog</Link> &middot;{" "}
                <Link to={`/blog/itp/${post.fields.category}`}>{post.fields.category}</Link>
            </H4>
            <H2>{post.frontmatter.title}</H2>
            <Timestamp date={post.frontmatter.date} />
            <div className={styles.postBody} dangerouslySetInnerHTML={{ __html: post.html }} />
        </DefaultLayout>
    );
};

export const query = graphql`
    query ($slug: String!) {
        markdownRemark(fields: { slug: { eq: $slug } }) {
            html
            frontmatter {
                date(formatString: "D MMMM YYYY")
                title
            }
            fields {
                category
                slug
            }
        }
    }
`;
