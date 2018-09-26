// @ts-check

const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
    if (stage === "build-html") {
        actions.setWebpackConfig({
            module: {
                rules: [
                    // exclude p5 from being loaded in SSR because it accesses window directly
                    {
                        test: /p5.*/,
                        use: loaders.null(),
                    },
                ],
            },
        })
    }
}

exports.onCreateNode = ({ node, getNode, actions }) => {
    const { createNodeField } = actions;
    if (node.internal.type === "MarkdownRemark") {
        const slug = createFilePath({ node, getNode, basePath: "content" });
        createNodeField({
            node,
            name: "slug",
            value: slug,
        });
    }
}

exports.createPages = ({ graphql, actions }) => {
    const { createPage } = actions;
    return new Promise((resolve, reject) => {
        graphql(`
            {
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
        `).then(result => {
            result.data.allMarkdownRemark.edges.forEach(({ node }) => {
                const { slug } = node.fields;
                const component = slug.startsWith("/blog/itp")
                    ? path.resolve(`./src/templates/blogPost.tsx`)
                    : path.resolve(`./src/templates/defaultMarkdownTemplate.tsx`);

                createPage({
                    path: slug,
                    component,
                    // data passed to context is available in page queries as GraphQL variables.
                    context: {
                        slug,
                    },
                })
            });
            resolve();
        });
    })
};
