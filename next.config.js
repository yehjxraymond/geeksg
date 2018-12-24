const withMDX = require("@zeit/next-mdx")();
const withCss = require("@zeit/next-css");

const PAGES = 10;

module.exports = withMDX(
  withCss({
    webpack(config) {
      config.module.rules.push({
        test: /\.(png|svg|eot|otf|ttf|woff|woff2)$/i,
        use: {
          loader: "url-loader",
          options: {
            limit: 8192,
            publicPath: "./",
            outputPath: "static/css/",
            name: "[name].[ext]"
          }
        }
      });
      return config;
    },
    pageExtensions: ["js", "mdx"],
    exportPathMap(defaultPathMap) {
      const pathMap = Object.assign({}, defaultPathMap);
      const pages = {};
      for (let i = 0; i < PAGES; i += 1) {
        pages[`/page/${i}`] = { page: "/", query: { page: i } };
      }
      delete pathMap["/index"];
      return { ...pathMap, ...pages };
    }
  })
);
