// 应用入口 mount到html中,使用在webpack.config.client.js配置文件中.
import ReactDOM from 'react-dom'// 吧react组件渲染到dom中
import React from 'react' // 必须引入因为每一个jsx标签都是eval成React.createElement
import { AppContainer } from 'react-hot-loader'; // eslint-disable-line
// 使用AppContainer去包裹需要渲染的内容
import App from './App.jsx'

const root = document.getElementById('root')
const render = (Component) => {
  ReactDOM.hydrate( // eslint-disable-line
    <AppContainer>
      <Component />
    </AppContainer>
    , root,
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./App.jsx', () => {
    const NextApp = require('./App.jsx').default; // eslint-disable-line
    render(NextApp);
  })
}
