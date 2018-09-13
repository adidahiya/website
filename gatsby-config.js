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
        "gatsby-transformer-remark",
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
