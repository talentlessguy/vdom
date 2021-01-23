import { h, render, diff } from '../../dist/vdom'

import htm from 'htm'

const html = htm.bind(h)

const App = (counter) =>
  html`
    <p style="${{ fontSize: counter * 10 + 'px' }}"><span>${counter}</span></p>
  `

let AppWithProps = App(0)

const mount = render(AppWithProps, document.getElementById('app'))

setInterval(() => {
  const newCounter = parseInt(Math.random() * 10)

  const newApp = App(newCounter)

  const patch = diff(AppWithProps, newApp)

  AppWithProps = newApp

  document.getElementById('app').firstChild.replaceWith(patch(mount))
}, 1000)
