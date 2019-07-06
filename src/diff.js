import { isTextNode, renderToDOM } from './render'

const zip = (xs, ys) => {
  const zipped = []
  for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
    zipped.push([xs[i], ys[i]])
  }
  return zipped
}

const diffProps = (oldProps, newProps) => {
  const patches = []

  // setting new props
  for (let [k, v] of Object.entries(newProps)) {
    patches.push(node => {
      node.setAttribute(k, v)
      return node
    })
  }

  // removing props
  for (let k in oldProps) {
    if (!(k in newProps)) {
      patches.push(node => {
        node.removeAttribute(k)
        return node
      })
    }
  }

  return node => {
    for (let patch of patches) patch(node)
    return node
  }
}

const diffChildren = (oldChildren, newChildren) => {
  const patches = []

  oldChildren.map((oldChild, i) => patches.push(diff(oldChild, newChildren[i])))

  const additionalPatches = []
  for (let additionalVChild of newChildren.slice(oldChildren.length)) {
    additionalPatches.push(node => {
      node.appendChild(renderToDOM(additionalVChild))
      return node
    })
  }

  return parent => {
    for (let [patch, child] of zip(patches, parent.childNodes)) patch(child)

    for (let patch of additionalPatches) patch(parent)

    return parent
  }
}

export const diff = (oldTree, newTree) => {
  if (newTree === undefined) {
    return node => {
      node.remove()
      return undefined
    }
  }

  if (isTextNode(oldTree) || isTextNode(newTree)) {
    if (oldTree !== newTree) {
      return node => {
        const newNode = renderToDOM(newTree)
        node.replaceWith(newNode)
        return newNode
      }
    } else {
      return node => node
    }
  }

  if (oldTree.tag !== newTree.tag) {
    return node => {
      const newNode = renderToDOM(newTree)
      node.replaceWith(newNode)
      return newNode
    }
  }

  const patchProps = diffProps(oldTree.props, newTree.props)
  const patchChildren = diffChildren(oldTree.children, newTree.children)

  return node => {
    patchProps(node)
    patchChildren(node)
    return node
  }
}
