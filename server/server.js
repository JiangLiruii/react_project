// 服务启动脚本

const express = require('express');
const ReactSSR = require('react-dom/server')
const app = express()
const fs = require('fs')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development'


if (!isDev) {
  const serverEntry = require('../dist/server-entry.js').default; // 不会读default的东西,是整个export出来的东西
  const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8');
  app.use('/public', express.static(path.join(__dirname, '../dist')))// public 是虚拟的,不存在的
  app.get('*', function (req, res) {
    const appString = ReactSSR.renderToString(serverEntry);
    res.send(template.replace('<!-- app -->', appString));
  })
} else {
  const devStatic = require('./utils/dev-static')
  devStatic(app);
}

app.listen(3333, function () {
  console.log('server is listenning 3333');
})
