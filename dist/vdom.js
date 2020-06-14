/**
 * @returns {boolean}
 * @description Check if node is text
 * @param {any} node
 * */
const isTextNode = node => ['string', 'boolean', 'number'].includes(typeof node);

/**
 * @description Renders a single node
 * @param {{
 * tag: string
 * props: any
 * children: any[]
 * }} vnode
 * @returns {HTMLElement | Text}
 */
const renderNode = vnode => {
  if (isTextNode(vnode)) {
    return document.createTextNode(vnode.toString())
  }

  const { tag, props, children } = vnode;

  let el = document.createElement(tag);

  if (props) {
    for (let [k, v] of Object.entries(props)) {
      if (k === 'style') {
        for (let [prop, val] of Object.entries(v)) {
          el.style[prop] = val;
        }
      } else el.setAttribute(k, v);
    }
  }

  children.map(child => el.appendChild(renderNode(child)));

  return el
};

/**
 * @description Appends vDOM inside of real DOM
 * @param {{
 * tag: string
 * props: any
 * children: any[]
 * }} vnode
 * @param {HTMLElement} target
 * @returns {HTMLElement | Text}
 */
const render = (vnode, target) => {
  target.appendChild(renderNode(vnode));

  return renderNode(vnode)
};

/**
 *
 * @param {any} oldProps
 * @param {any} newProps
 */
const diffProps = (oldProps, newProps) => {
  const patches = [];

  // setting new props
  if (newProps) {
    for (let [k, v] of Object.entries(newProps)) {
      patches.push(node => {
        if (k === 'style') {
          for (let [prop, val] of Object.entries(v)) {
            node.style[prop] = val;
          }
        } else node.setAttribute(k, v);
        return node
      });
    }
  }

  // removing props
  for (let k in oldProps) {
    if (!(k in newProps)) {
      patches.push(node => {
        node.removeAttribute(k);
        return node
      });
    }
  }

  return node => {
    for (let patch of patches) patch(node);
    return node
  }
};

const diffChildren = (oldChildren, newChildren) => {
  const patches = [];

  oldChildren.map((oldChild, i) => patches.push(diff(oldChild, newChildren[i])));

  const additionalPatches = [];
  for (let additionalVChild of newChildren.slice(oldChildren.length)) {
    additionalPatches.push(node => {
      node.appendChild(renderNode(additionalVChild));
      return node
    });
  }

  return parent => {
    Array.from(parent.childNodes).map((child, i) => patches[i](child));

    for (let patch of additionalPatches) patch(parent);

    return parent
  }
};

const diff = (oldTree, newTree) => {
  const renderAndReplace = node => {
    const newNode = renderNode(newTree);
    node.replaceWith(newNode);
    return newNode
  };

  if (newTree === undefined) {
    return node => {
      node.remove();
      return undefined
    }
  }

  if (isTextNode(oldTree) || isTextNode(newTree)) {
    if (oldTree !== newTree) {
      return renderAndReplace
    } else {
      return node => node
    }
  }

  if (oldTree.tag !== newTree.tag) {
    return renderAndReplace
  }

  const patchProps = diffProps(oldTree.props, newTree.props);
  const patchChildren = diffChildren(oldTree.children, newTree.children);

  return node => {
    patchProps(node);
    patchChildren(node);
    return node
  }
};

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
const h = (tag = 'div', props = null, ...children) => ({
  tag,
  props,
  children,
});

export { diff, h, isTextNode, render, renderNode };
