import { h } from './src/h'
import { render, renderToDOM } from './src/render'
import { diff } from './src/diff'
import htm from 'htm'

const html = htm.bind(h)

let counter = 0

let App = counter =>
  html`
    <p>${counter}</p>
  `

let AppWithProps = App(0)

let mount = render(AppWithProps, document.getElementById('app'))

setInterval(() => {
  const newCounter = parseInt(Math.random() * 10)

  const newApp = App(newCounter)

  const patch = diff(App, newApp)

  AppWithProps = newApp

  mount = patch(mount)

  console.log(AppWithProps, mount.outerHTML)
}, 1000)
