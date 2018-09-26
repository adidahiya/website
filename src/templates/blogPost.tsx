import { graphql, Link } from "gatsby";
import React from "react";
import DefaultLayout from "../components/defaultLayout";

const ITP_BLOG_PREFIX = "/blog/itp";

function getCategoryNameFromSlug(slug: string) {
    return slug.substr(ITP_BLOG_PREFIX.length).split("/")[0];
}

export default ({ data }: any) => {
    const post = data.markdownRemark;
    return (
        <DefaultLayout>
            <h4>
                <Link to={ITP_BLOG_PREFIX}>ITP blog</Link> &middot;{" "}
                {getCategoryNameFromSlug(post.fields.slug)}
            </h4>
            <h2>{post.frontmatter.title}</h2>
            <p className="timestamp" style={{ color: "gray" }}>
                {post.frontmatter.date}
            </p>
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </DefaultLayout>
    );
};

export const query = graphql`
    query($slug: String!) {
        markdownRemark(fields: { slug: { eq: $slug } }) {
            html
            frontmatter {
                date(formatString: "DD MMMM, YYYY")
                title
            }
            fields {
                slug
            }
        }
    }
`;
