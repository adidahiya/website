import { graphql, Link } from "gatsby";
import { uniq } from "lodash";
import { DateTime } from "luxon";
import React from "react";
import DefaultLayout from "../../../components/defaultLayout";

const ITP_BLOG_ROOT = "/blog/itp/";

export default ({ data }: any) => {
    const { edges } = data.allMarkdownRemark;
    const blogPosts = edges.map((p: any) => p.node);
    const categories: string[] = uniq(
        blogPosts.map((p: any) => p.fields.slug.substr(ITP_BLOG_ROOT.length).split("/")[0]),
    );

    return (
        <DefaultLayout>
            <h4>ITP blog</h4>
            <p>
                This blog contains notes and documentation from my projects at{" "}
                <a href="https://tisch.nyu.edu/itp">NYU's ITP program</a>.
            </p>
            <p>{categories.map(c => <Category key={c} name={c} blogPosts={blogPosts} />)}</p>
        </DefaultLayout>
    );
};

const Category = (props: { name: string; blogPosts: any[] }) => {
    const categoryBlogPosts = filterAndSortBlogPosts(props.blogPosts, props.name);
    return (
        <div className="blog-category">
            <h3>{props.name}</h3>
            <ul>{categoryBlogPosts.map(p => <PostItem key={p.fields.slug} post={p} />)}</ul>
        </div>
    );
};

const PostItem = ({ post }: { post: any }) => (
    <li>
        <Link to={post.fields.slug}>{post.frontmatter.title}</Link>
        <small className="timestamp" style={{ color: "gray", marginLeft: 20 }}>
            ({post.frontmatter.date})
        </small>
    </li>
);

function filterAndSortBlogPosts(posts: any[], categoryName: string) {
    return posts
        .filter((p: any) => p.fields.slug.indexOf(`${ITP_BLOG_ROOT}${categoryName}`) === 0)
        .sort((p1: any, p2: any) => {
            const d1 = DateTime.fromFormat(p1.frontmatter.date, "dd LLLL, yyyy");
            const d2 = DateTime.fromFormat(p2.frontmatter.date, "dd LLLL, yyyy");
            return -1 * d1.diff(d2).valueOf();
        });
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
`;
