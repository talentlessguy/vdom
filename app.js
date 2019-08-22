import { h } from './src/h'
import { render, renderToDOM } from './src/render'
import { diff } from './src/diff'
import htm from 'htm'

const html = htm.bind(h)

let App = counter =>
  html`
    <p fontSize="${counter * 10 + 'px'}">${counter}</p>
  `

let AppWithProps = App(0)

let mount = render(AppWithProps, document.getElementById('app'))

setInterval(() => {
  const newCounter = parseInt(Math.random() * 10)

  const newApp = App(newCounter)

  const patch = diff(AppWithProps, newApp)

  AppWithProps = newApp

  mount = patch(mount, document.getElementById('app'))

  console.log(AppWithProps, mount.outerHTML)
}, 1000)
