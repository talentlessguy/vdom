![](logo.jpg)

Simple JavaScript [Virtual DOM](https://reactjs.org/docs/faq-internals.html). Compatible with [htm](https://github.com/developit/htm).

![](https://cdn.rawgit.com/LunaGao/BlessYourCodeTag/master/tags/unicorn.svg) ![](https://img.shields.io/github/languages/top/talentlessguy/vdom)
[![](https://img.shields.io/twitter/follow/v1rtl?style=social)](https://twitter.com/v1rtl)
[![](https://img.shields.io/badge/DEV-Article-black?style=flat-square)](https://dev.to/talentlessguy/my-experience-writing-virtual-dom-8bn)
[![](https://img.shields.io/badge/paypal-donate-blue.svg)](https://paypal.me/v1rtl)

## Installation

```sh
# npm
npm i talentlessguy/vdom
# pnpm
pnpm i talentlessguy/vdom
# yarn
yarn add talentlessguy/vdom
```

## Example

### Try it yourself

To run the example, clone the repository and write this to command line:

```sh
npm run example
```

It will build the example. Then, launch a server for `example` directory. For example:

```sh
serve -s example -p 3000
```

And open it in a browser.

### Code

```js
import { h, render, diff } from '@'
import htm from 'htm'

const html = htm.bind(h)

// Create App component with a prop "counter"
let App = (counter) =>
  html`
    <p style="${{ fontSize: counter * 2 + 'px' }}"><span>${counter}</span></p>
  `

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

  // Replace element
  document.getElementById('app').firstChild.replaceWith(patch(mount))
}, 1000)
```

## API

### `h` - hyperscript function

returns vnode (a plain object)

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
const vnode = renderNode(html` <h1>Hello World</h1> `)

console.log(vnode)

/*
[Object HTMLElement]
*/
```

### `render` - put vnode to container

```js
render(html` <h1>Hello World</h1> `, document.getElementById('app'))
```

### `diff` - check for differences in DOM and return patches

```js
const App = html` <p>Hi</p> `

const newApp = html` <p>Hello</p> `

const dom = diff(App, newApp)

render(dom, document.getElementById('app'))
```
