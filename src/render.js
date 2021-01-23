/**
 * @returns {boolean}
 * @description Check if node is text
 * @param {any} node
 * */
export const isTextNode = (node) =>
  ['string', 'boolean', 'number'].includes(typeof node)

/**
 * @description Renders a single node
 * @param {{
 * tag: string
 * props: any
 * children: any[]
 * }} vnode
 * @returns {HTMLElement | Text}
 */
export const renderNode = (vnode) => {
  if (isTextNode(vnode)) return document.createTextNode(vnode.toString())

  const { tag, props, children } = vnode

  const el = document.createElement(tag)

  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (k === 'style') {
        for (const [prop, val] of Object.entries(v)) el.style[prop] = val
      } else el.setAttribute(k, v)
    }
  }

  children.forEach((child) => el.appendChild(renderNode(child)))

  return el
}

/**
 * @description Appends vDOM inside of real DOM
 * @param {{
 * tag: string
 * props: { [key:string]: any }
 * children: any[]
 * }} vnode
 * @param {HTMLElement} target
 * @returns {HTMLElement | Text}
 */
export const render = (vnode, target) => {
  target.appendChild(renderNode(vnode))

  return renderNode(vnode)
}
