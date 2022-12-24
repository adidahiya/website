import { graphql, Link } from "gatsby";
import { uniq } from "lodash-es";
import React from "react";
import { DefaultLayout, Timestamp } from "../../../components";

const ITP_BLOG_ROOT = "/blog/itp/";

export default ({ data }: any) => {
    const { edges } = data.allMarkdownRemark;
    const blogPosts = edges.map((p: any) => p.node).filter((p: any) => p.fields.slug.indexOf(ITP_BLOG_ROOT) === 0);
    const categories: string[] = uniq(
        blogPosts.map((p: any) => p.fields.slug.substr(ITP_BLOG_ROOT.length).split("/")[0]),
    );

    return (
        <DefaultLayout>
            <h4>ITP blog</h4>
            <p>
                {categories.map((c) => (
                    <Category key={c} name={c} blogPosts={blogPosts} />
                ))}
            </p>
        </DefaultLayout>
    );
};

const Category = (props: { name: string; blogPosts: any[] }) => {
    const categoryBlogPosts = filterBlogPosts(props.blogPosts, props.name);
    return (
        <div className="blog-category">
            <h3>
                <Link to={`/blog/itp/${props.name}`}>{props.name}</Link>
            </h3>
            <ul>
                {categoryBlogPosts.map((p) => (
                    <PostItem key={p.fields.slug} post={p} />
                ))}
            </ul>
        </div>
    );
};

const PostItem = ({ post }: { post: any }) => (
    <li>
        <Link to={post.fields.slug}>{post.frontmatter.title}</Link>
        <Timestamp date={post.frontmatter.date} small={true} style={{ marginLeft: 20 }} />
    </li>
);

// TODO: do this with GraphQL grouping
function filterBlogPosts(posts: any[], categoryName: string) {
    return posts.filter((p: any) => p.fields.slug.indexOf(`${ITP_BLOG_ROOT}${categoryName}`) === 0);
}

export const query = graphql`
    query {
        allMarkdownRemark(sort: { frontmatter: { date: DESC } }, filter: { frontmatter: { draft: { ne: true } } }) {
            edges {
                node {
                    frontmatter {
                        date(formatString: "D MMMM YYYY")
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
`;
