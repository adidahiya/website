module.exports = {
    siteMetadata: {
        title: "adidahiya.github.io",
    },
    plugins: [
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "content",
                path: `${__dirname}/content`,
            },
        },
        "gatsby-plugin-sharp",
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
                    "gatsby-remark-emoji"
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
    ],
};
