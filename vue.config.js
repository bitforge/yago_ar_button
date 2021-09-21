module.exports = {
  lintOnSave: false,

  // Workaround for wierd iOS JS Caching
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'development') {
      config.output.filename('[name].[hash].js').end()
    }
  }
};
