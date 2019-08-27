import { h } from './src/h'
import { render } from './src/render'
import { diff } from './src/diff'
import htm from 'htm'

const html = htm.bind(h)

let App = counter => html`<p style="${{ fontSize: counter * 2 + 'px'}}"><span>${counter}</span></p>`

let AppWithProps = App(0)

let mount = render(AppWithProps, document.getElementById('app'))

setInterval(() => {
  const newCounter = parseInt(Math.random() * 10)
  
  const newApp = App(newCounter)

  const patch = diff(AppWithProps, newApp)

  AppWithProps = newApp

  mount = patch(mount)

  document.getElementById('app').firstChild.remove()
  document.getElementById('app').appendChild(mount)
}, 1000)