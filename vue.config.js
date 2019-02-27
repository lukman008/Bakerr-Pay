module.exports = {
  lintOnSave: false,
  outputDir:'dist/public',
  configureWebpack: {
    devServer: {
      historyApiFallback: true
    }
  }
  
}
