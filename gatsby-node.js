// @ts-check

const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");

exports.onCreateWebpackConfig = ({ actions, getConfig, stage }) => {
    const config = getConfig();

    if (stage.startsWith("develop") && config.resolve) {
        config.resolve.alias = {
            ...config.resolve.alias,
            "react-dom": "@hot-loader/react-dom",
        };
    }

    if (stage === "build-html") {
        actions.setWebpackConfig({
            module: {
                rules: [
                    // exclude p5 from being loaded in SSR because it accesses window directly
                    {
                        test: require.resolve("p5"),
                        use: "null-loader",
                    },
                ],
            },
        })
    }

    // TODO: proxy /.netlify/functions/ requests to localhost:9000/
}

const ITP_BLOG_PREFIX = "/blog/itp";

exports.onCreateNode = ({ node, getNode, actions }) => {
    const { createNodeField } = actions;

    if (node.internal.type === "MarkdownRemark") {
        const slug = createFilePath({ node, getNode, basePath: "content" });

        createNodeField({
            node,
            name: "slug",
            value: slug,
        });

        if (slug.indexOf(ITP_BLOG_PREFIX) >= 0) {
            const category = slug.substr(ITP_BLOG_PREFIX.length + 1).split("/")[0];
            createNodeField({
                node,
                name: "category",
                value: category,
            });
        }
    }
}

exports.createPages = ({ graphql, actions }) => {
    const { createPage } = actions;
    return new Promise((resolve, reject) => {
        graphql(`
            {
                allDirectory {
                    edges {
                        node {
                            relativePath
                        }
                    }
                }
                allMarkdownRemark {
                    edges {
                        node {
                            fields {
                                slug
                            }
                        }
                    }
                }
            }
        `).then(({ data }) => {
            for (const { node } of data.allDirectory.edges) {
                const { relativePath } = node;
                const match = relativePath.match(/^blog\/itp\/([\w\-]*)$/);

                if (match != null) {
                    const category = match[1];
                    const pagePath = `/${relativePath}`;
                    // the category index page will query for its relevant posts
                    createPage({
                        path: pagePath,
                        component: path.resolve(`./src/templates/blogCategoryIndex.tsx`),
                        context: {
                            category,
                        }
                    })
                }
            }

            for (const { node } of data.allMarkdownRemark.edges) {
                const { slug } = node.fields;

                let component = path.resolve(`./src/templates/markdownPage.tsx`);
                if (slug.startsWith("/blog/itp")) {
                    component = path.resolve(`./src/templates/blogPost.tsx`);
                } else if (slug.startsWith("/projects/2014") || slug.startsWith("/projects/2018")) {
                    component = path.resolve(`./src/templates/markdownPageWithHeader.tsx`);
                }

                createPage({
                    path: slug,
                    component,
                    // data passed to context is available in page queries as GraphQL variables.
                    context: {
                        slug,
                    },
                })
            }

            resolve();
        });
    })
};
