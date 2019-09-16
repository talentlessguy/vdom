# vdom

![](https://cdn.rawgit.com/LunaGao/BlessYourCodeTag/master/tags/unicorn.svg) ![](https://img.shields.io/github/languages/top/talentlessguy/vdom) ![Twitter Follow](https://img.shields.io/twitter/follow/v1rtl?style=social)

Simple JavaScript Virtual DOM. Compatible with `htm`

## Example

```js
import { h } from './src/h'
import { render } from './src/render'
import { diff } from './src/diff'
import htm from 'htm'

const html = htm.bind(h)

// Create App component with a prop "counter"
let App = counter => html`<p style="${{ fontSize: counter * 2 + 'px'}}"><span>${counter}</span></p>`

// Return component with passed prop
let AppWithProps = App(0)

// Mount first state of app to container
let mount = render(AppWithProps, document.getElementById('app'))

setInterval(() => {
  // Generate random number
  const newCounter = parseInt(Math.random() * 10)
  
  // Return new state of app with new prop
  const newApp = App(newCounter)

  // Check for changes and collect patches
  const patch = diff(AppWithProps, newApp)
  
  // Replace old app with new one
  AppWithProps = newApp

  // Mount patched app
  mount = patch(mount)

  // TODO: get rid of these lines
  document.getElementById('app').firstChild.remove()
  document.getElementById('app').appendChild(mount)
}, 1000)
```

## API

### `h` - hyperscript function

just returns this object:

```js
const el = h('h1', null, 'Hello')

console.log(el)

/*
{
  tag: 'h1',
  props: null,
  children: 'Hello'
}
*/
```

### `renderNode` - renders single vnode (created with `h`)

Converts objects created by `h` to DOM nodes

```js
const vnode = renderNode(html`<h1>Hello World</h1>`)

console.log(vnode)

/*
[Object HTMLElement]
*/
```

### `render` - put vnode to container

```js
render(html`<h1>Hello World</h1>`, document.getElementById('app'))
```

### `diff` - check for differences in DOM and return patches

```js
const App = html`<p>Hi</p>`

const newApp = html`<p>Hello</p>`

const dom = diff(App, newApp)

render(dom, document.getElementById('app'))
```
