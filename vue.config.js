// var nodeExternals = require('webpack-node-externals');
// module.exports = module.exports || {};
// module.exports = {
//     configureWebpack: config => {
//         config.target = 'node', // in order to ignore built-in modules like path, fs, etc.
//         config.externals = [nodeExternals()]; // in order to ignore all modules in node_modules folder
//         return config;
//     }
// }
const path = require('path')

module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set('@components', path.resolve(__dirname, 'src/components'))
    config.resolve.alias.set('@store', path.resolve(__dirname, 'src/store'))
    config.resolve.alias.set('@services', path.resolve(__dirname, 'src/services'))
    config.resolve.alias.set('@assets', path.resolve(__dirname, 'src/assets'))
  },
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/scss/_variables.scss";
        `
      }
    }
  }
}