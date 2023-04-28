![](logo.jpg)

<div align="center">
  <h1>vdom</h1>
  Simple JavaScript <a href="https://reactjs.org/docs/faq-internals.html">Virtual DOM</a>. Compatible with <a href="https://github.com/developit/htm">htm</a>.

![](https://cdn.rawgit.com/LunaGao/BlessYourCodeTag/master/tags/unicorn.svg) ![](https://img.shields.io/github/languages/top/talentlessguy/vdom)

</div>

## Install

```sh
# npm
npm i simple-vdom
# pnpm
pnpm i simple-vdom
# yarn
yarn add simple-vdom
```

## Example

### Try it yourself

To build the example, clone the repository and write this to command line:

```sh
pnpm example
```

It will build the example. Then, launch a server for `example` directory. For example:

```sh
serve -s example -p 3000
```

And open it in a browser.

### Code

```js
import { h, render, diff } from 'simple-vdom'
import htm from 'htm'

const html = htm.bind(h)

// Create App component with a prop "counter"
let App = (counter) => html`<p style="${{ fontSize: counter * 2 + 'px' }}">
  <span>${counter}</span>
</p>`

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

### `h`

A hyperscript function that returns vnode (a plain object)

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

### `renderNode`

Renders objects created by `h` to DOM nodes

```js
const vnode = renderNode(html`<h1>Hello World</h1>`)

console.log(vnode)

/*
[Object HTMLElement]
*/
```

### `render`

Append vnode to DOM container.

```js
render(html`<h1>Hello World</h1>`, document.getElementById('app'))
```

### `diff`

Check for differences in DOM and return patches.

```js
const App = html`<p>Hi</p>`

const newApp = html`<p>Hello</p>`

const dom = diff(App, newApp)

render(dom, document.getElementById('app'))
```

## License

MIT © [v1rtl](https://v1rtl.site)
