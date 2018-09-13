import React from "react";
import { uniq } from "lodash";
import Link from "gatsby-link";

const ITP_BLOG_ROOT = "/blog/itp/";

export default ({ data }: any) => {
    const { edges } = data.allMarkdownRemark;
    const blogPosts = edges
        .map((p: any) => p.node);
    const categories: string[] = uniq(
        blogPosts.map((p: any) =>
            p.fields.slug.substr(ITP_BLOG_ROOT.length).split("/")[0]
        )
    );

    return (
        <div>
            <h4>ITP blog</h4>
            <p>
                {categories.map(c => (
                    <Category name={c} blogPosts={blogPosts} />
                ))}
            </p>
        </div>
    );
};

const Category = (props: { name: string, blogPosts: any[] }) => {
    const categoryBlogPosts = props.blogPosts.filter((p: any) => p.fields.slug.indexOf(`${ITP_BLOG_ROOT}${props.name}`) === 0);
    return (
        <div className="blog-category">
            <h3>{props.name}</h3>
            <ul>
                {categoryBlogPosts.map(p => (
                    <li>
                        <Link to={p.fields.slug}>{p.frontmatter.title}</Link>
                        <small className="timestamp" style={{color: "gray", marginLeft: 20}}>
                            ({p.frontmatter.date})
                        </small>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// @ts-ignore
export const query = graphql`
    query ContentsQuery {
        allMarkdownRemark {
            edges {
                node {
                    frontmatter {
                        date(formatString: "DD MMMM, YYYY")
                        title
                    }
                    wordCount {
                        words
                    }
                    html
                    excerpt
                    fields {
                        slug
                    }
                }
            }
          }
    }
`
