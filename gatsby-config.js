const themeColor = "#6496c4";
const bgColor = "#496D8F";

module.exports = {
  siteMetadata: {
    title: `Architus Docs`,
    description: `General purpose Discord bot supporting advanced role management, custom emotes for non-nitro users, configurable response commands, and more.`,
    author: `architus`,
    siteUrl: `https://docs.archit.us`,
    themeColor,
    msTileColor: "#2b5797",
    githubRoot: "https://github.com/architus/docs.archit.us/tree/master/docs"
  },
  pathPrefix: "/",
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/docs/`,
        name: "docs"
      }
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/data/`,
        name: "data"
      }
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        gatsbyRemarkPlugins: [
          {
            resolve: "gatsby-remark-smartypants",
            options: {}
          },
          {
            resolve: "gatsby-remark-slug",
            options: {}
          },
          {
            resolve: "gatsby-remark-copy-linked-files",
            options: {}
          },
          {
            resolve: "gatsby-remark-embed-snippet",
            options: {
              directory: `${__dirname}/docs/`
            }
          },
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 1500,
              withWebp: true,
              backgroundColor: bgColor,
              linkImagesToOriginal: true
            }
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {}
            }
          }
        ],
        // ! remove plugins when https://github.com/gatsbyjs/gatsby/issues/16242 gets merged
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1500,
              withWebp: true,
              backgroundColor: bgColor,
              linkImagesToOriginal: true
            }
          }
        ]
      }
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    `gatsby-transformer-yaml`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-offline`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-remove-trailing-slashes`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-catch-links`,
    `gatsby-plugin-react-svg`
  ]
};
