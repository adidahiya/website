import Link from "gatsby-link";
import React from "react";

function getCategoryNameFromSlug(slug: string) {
    return slug.substr("/blog/itp/".length).split("/")[0];
}

export default ({ data }: any) => {
    const post = data.markdownRemark;
    return (
        <div>
            <h4>
                <Link to="/blog/itp">ITP blog</Link> &middot;{" "}
                {getCategoryNameFromSlug(post.fields.slug)}
            </h4>
            <h2>{post.frontmatter.title}</h2>
            <p className="timestamp" style={{ color: "gray" }}>
                {post.frontmatter.date}
            </p>
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
    );
};

// @ts-ignore
export const query = graphql`
    query BlogPostQuery($slug: String!) {
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
