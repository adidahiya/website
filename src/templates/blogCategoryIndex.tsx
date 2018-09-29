import { graphql, Link } from "gatsby";
import React from "react";
import { DefaultLayout, Timestamp } from "../components";

export default ({ data, pageContext }: any) => {
    const posts = data.allMarkdownRemark.edges;
    return (
        <DefaultLayout>
            <h4>
                <Link to="/blog/itp">ITP blog</Link> &middot; {pageContext.category}
            </h4>
            <br />
            <ul>
                {posts.map(({ node: post }: any) => (
                    <li>
                        <Link to={post.fields.slug}>{post.frontmatter.title}</Link>
                        <Timestamp
                            date={post.frontmatter.date}
                            small={true}
                            style={{ marginLeft: 20 }}
                        />
                    </li>
                ))}
            </ul>
        </DefaultLayout>
    );
};

export const query = graphql`
    query($category: String!) {
        allMarkdownRemark(
            filter: { fields: { category: { eq: $category } } }
            sort: { fields: frontmatter___date, order: DESC }
        ) {
            edges {
                node {
                    fields {
                        slug
                    }
                    frontmatter {
                        title
                        date(formatString: "DD MMMM, YYYY")
                    }
                }
            }
        }
    }
`;
