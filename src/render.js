/*

vnode - h('h1', null, 'Hello World')

*/

export const isTextNode = node =>
  ['string', 'boolean', 'number'].includes(typeof node)

export const renderNode = vnode => {
  let el
  const { tag, props, children } = vnode

  if (isTextNode(vnode)) {
    return document.createTextNode(vnode)
  }

  el = document.createElement(tag)

  if (props) {
    for (let [k, v] of Object.entries(props)) {
      if (k in el) {
        el.setAttribute(k, v)
      } else if (k === 'style') {
        for (let [prop, val] of v) {
          el.style[prop] = val
        }
      }
    }
  }

  children.map(child => el.appendChild(renderNode(child)))

  return el
}

export const renderToDOM = vnode => {
  let vToRender

  // Render vnode
  if (
    renderNode(vnode) instanceof HTMLElement ||
    isTextNode(renderNode(vnode))
  ) {
    vToRender = renderNode(vnode)
    console.log(vToRender)
  }

  return vToRender
}

export const render = (vnode, target) => {
  target.appendChild(renderToDOM(vnode))

  return renderToDOM(vnode)
}
