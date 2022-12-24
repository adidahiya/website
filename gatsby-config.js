module.exports = {
    siteMetadata: {
        title: "adi.pizza",
    },
    plugins: [
        "gatsby-plugin-pnpm",
        "gatsby-plugin-image",
        "gatsby-plugin-sharp",
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "content",
                path: `${__dirname}/content`,
            },
        },
        {
            resolve: "gatsby-transformer-remark",
            options: {
                plugins: [
                    {
                        resolve: "gatsby-remark-images",
                        options: {
                            maxWidth: 888,
                        },
                    },
                    "gatsby-remark-copy-linked-files",
                    "gatsby-remark-emoji",
                    {
                        resolve: "@stayradiated/gatsby-remark-video",
                        options: {
                            parentTag: "div",
                            parentClass: "gatsby-remark-video",
                            defaultAttributes: {},
                        },
                    },
                ],
            },
        },
        "gatsby-plugin-react-helmet",
        "gatsby-plugin-typescript",
        {
            resolve: "gatsby-plugin-typography",
            options: {
                pathToConfigModule: "src/typography.js",
            },
        },
        "gatsby-plugin-catch-links",
        "gatsby-transformer-sharp",
    ],
};
