module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(pdf)$/,
          loader: 'file-loader',
          options: {
            objectAssign: 'Object.assign'
          }
        }
      ]
    }
  }
}
