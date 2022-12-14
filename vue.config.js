module.exports = {
  publicPath: process.env.VUE_APP_MODE === "product" ? "./" : "/",
  devServer: {
    https: true,
    port: 8080,
  },
  chainWebpack: (config) => {
    /* disable insertion of assets as data urls b/c Phaser doesn't support it */
    const rules = [
      {
        name: "images",
        dir: "img",
      },
      {
        name: "media",
        dir: "media",
      },
    ];
    rules.forEach((rule) => {
      const ruleConf = config.module.rule(rule.name);

      ruleConf.uses.clear();

      ruleConf
        .use("file-loader")
        .loader("file-loader")
        .options({
          name: `${rule.dir}/[name].[hash:8].[ext]`,
        });
    });
    config.module
      .rule("media")
      .test(/\.(vtt|mp4|webm|ogg|mp3|m4a|wav|flac|aac)(\?.*)?$/);
  },
//   lintOnSave: false,
};
