// 配置webpack
const webpack = require('webpack')
const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const isDev = process.env.Node_ENV === 'development';
const config = {
  entry: { // 资源文件路径
    app: path.join(__dirname, '../client/app.js')
  },
  output: { //输出路径
    filename: '[name].[hash].js', // 对app打包完成之后加一个hash值,一旦树目录下有任何更改就会发生hash值的更改--> 浏览器缓存,
    path: path.join(__dirname, '../dist'),
    publicPath: '/public/' // 静态资源文件引用的路径的前缀,区分静态资源或其他请求. CDN
  },
  mode: "development",
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /.(jsx|js)/,
        loader: 'eslint-loader',
        exclude: [
          path.resolve(__dirname, '../node_modules')
        ]
      },
      {
        test: /.jsx$/, // 那种类型的文件为jsx语法
        loader: 'babel-loader', // 默认使用babel进行编译
      },
      {
        test: /.js$/, // 那种类型的文件为jsx语法
        loader: 'babel-loader', // 默认使用babel进行编译
        exclude: [
          path.join(__dirname, '../node_modules')
        ]
      }
    ]
  },
  mode: "development",
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, '../client/template.html')
    })
  ]
}
// 只在开发环境中使用

if (isDev) {
  config.devServer = {
    host: '0.0.0.0', // 指向本机ip
    port: '8888',
    contentBase: path.join(__dirname, '../dist'),// 文件目录
    hot: true,
    overlay: {// 如果有任何错误会显示一层黑色弹窗显示错误 ,只弹出error
      errors: true
    },
    publicPath: '/public/', // 均在这个路径之下
    historyApiFallback: {
      index: '/public/index.html' //404的请求均返回这个index.html
    }
  }
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
  config.entry = {
    app: [
      'react-hot-loader/patch', // react hot loader可以在之后直接引用
      path.join(__dirname, '../client/app.js'),
    ]
  }
}
module.exports = config;
