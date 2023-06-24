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
                            defaultAttributes: {
                                width: "100%",
                                height: "auto",
                                autoplay: true,
                                loop: true,
                                muted: true,
                            },
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
        {
            resolve: "gatsby-plugin-google-gtag",
            // see https://www.gatsbyjs.com/plugins/gatsby-plugin-google-gtag/
            options: {
                trackingIds: ["G-ZP08KYZV5E"],
                // This object gets passed directly to the gtag config command
                // This config will be shared across all trackingIds
                gtagConfig: {},
                // This object is used for configuration specific to this plugin
                pluginConfig: {
                    // Puts tracking script in the head instead of the body
                    head: false,
                    // Setting this parameter is also optional
                    respectDNT: true,
                    // Avoids sending pageview hits from custom paths
                    exclude: [],
                    // Delays processing pageview events on route update (in milliseconds)
                    delayOnRouteUpdate: 0,
                },
            },
        },
    ],
};
