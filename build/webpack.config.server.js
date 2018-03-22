// 配置webpack
const path = require('path');

const config = {
  target: 'node',// 使用在哪个环境中"web, node"
  entry: { // 资源文件路径
    app: path.join(__dirname, '../client/server-entry.js')
  },
  output: { //输出路径
    filename: 'server-entry.js', // 对app打包完成之后加一个hash值,一旦树目录下有任何更改就会发生hash值的更改--> 浏览器缓存,
    path: path.join(__dirname, '../dist'),
    publicPath: '/public', // 静态资源文件引用的路径的前缀,区分静态资源或其他请求. CDN
    libraryTarget: 'commonjs2'//amd, umd, cmd,commonjs 使用模块的方案
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
  }
}

module.exports = config
