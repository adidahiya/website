// @ts-check

const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");

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
                createPage({
                    path: slug,
                    component: path.resolve(`./src/templates/blogPost.tsx`),
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
