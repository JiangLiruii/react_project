
const MemoryFs = require('memory-fs')
const axios = require('axios')
const webpack = require('webpack')
const serverConfig = require('../../build/webpack.config.server')
const path = require('path')
const ReactDomServer = require('react-dom/server')
const proxy = require('http-proxy-middleware')
const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/index.html')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}
const Module = module.constructor

const mfs = new MemoryFs
let serverBundle
const serverCompiler = webpack(serverConfig);
serverCompiler.outputFileSystem = mfs // 将output通过mfs内存中读写
serverCompiler.watch({}, (err, states) => { // state 是webpack打包过程中的信息, 是一个很hack的做法
  if (err) throw err
  states = states.toJson()
  states.errors.forEach(err => console.log(err))
  states.warnings.forEach(warn => console.log(warn))

  const bundlePath = path.join( // 输出的bundle路径
    serverConfig.output.path,
    serverConfig.output.filename
  )
  const bundle = mfs.readFileSync(bundlePath, 'utf8')
  const m = new Module(); // 将字符串转化成一个可以使用的模块
  m._compile(bundle, 'server_entry1.js');//    动态编译也指定一个任意的文件名
  serverBundle = m.exports.default
});
module.exports = function (app) {
  // 用了proxy代理,将public中的静态内容都映射到这个target中
  app.use('/public', proxy({
    target: 'http://localhost:8888',
  }))
  app.get('*', function (req, res) {
    getTemplate().then(template => {
      const content = ReactDomServer.renderToString(serverBundle);
      res.send(template.replace('<!-- app -->', content))
    })
  })
}
