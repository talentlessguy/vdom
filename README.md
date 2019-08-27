# vdom [Work In Progress]

Simple JavaScript Virtual DOM

## Docs

### `h` - hyperscript function

just returns this object:

```js
const node = h('h1', null, 'Hello')

console.log(node)

/*
{
  tag: 'h1',
  props: null,
  children: 'Hello'
}
*/
```

### `renderNode` - renders vnode (created with `h`)
