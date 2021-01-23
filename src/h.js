/**
 *
 * @param {string} tag
 *
 * @example
 *
 * ```js
 * const node = h('div', null, 'Hello World')
 * ```
 *
 * @description Returns vnode
 *
 * */
export const h = (tag = 'div', props = null, ...children) => ({
  tag,
  props,
  children
})
