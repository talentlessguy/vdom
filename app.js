import { h } from './src/h'
import { render } from './src/render'
import { diff } from './src/diff'
import htm from 'htm'

const html = htm.bind(h)

let App = counter => {

  const app = h('p', {}, h('span', {}, counter))

  // console.log(JSON.stringify(app, null, 2))

  return app
}

let AppWithProps = App(0)


const root = document.getElementById('app')

let mount = render(AppWithProps, root)

window.onload = () => {
  setInterval(() => {
    const newCounter = parseInt(Math.random() * 10)
  
    const newApp = App(newCounter)
  
    const patch = diff(AppWithProps, newApp)
  
    AppWithProps = newApp
  
    mount = patch(mount)
  
    root.appendChild(mount)
    console.log(`document root html: ${document.body.children[0].outerHTML}`)
    console.log(`patched dom: ${root.outerHTML}`)
  
  }, 1000)
  
}