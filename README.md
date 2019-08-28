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