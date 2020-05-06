/**
 *
 * @param {string} tag
 *
 * @example
 *
 * const node = h('div', null, 'Hello World')
 *
 * @description Returns vnode
 *
 * */
export const h = (tag = 'div', props = null, ...children) => ({
  tag,
  props,
  children,
})
