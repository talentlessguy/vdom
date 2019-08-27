import { isTextNode, renderNode } from './render'

const diffProps = (oldProps, newProps) => {
  const patches = []

  // setting new props
  if (newProps) {
    for (let [k, v] of Object.entries(newProps)) {
      patches.push(node => {
        if (k === 'style') {
          for (let [prop, val] of Object.entries(v)) {
            node.style[prop] = val
          }
        } else node.setAttribute(k, v)
        return node
      })
    }
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
      node.appendChild(renderNode(additionalVChild))
      return node
    })
  }

  return parent => {

    Array.from(parent.childNodes).map((child, i) => patches[i](child))

    for (let patch of additionalPatches) patch(parent)

    return parent
  }
}

export const diff = (oldTree, newTree) => {

  const renderAndReplace = node => {
    const newNode = renderNode(newTree)
    node.replaceWith(newNode)
    return newNode
  }

  if (newTree === undefined) {
    return node => {
      node.remove()
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

  const patchProps = diffProps(oldTree.props, newTree.props)
  const patchChildren = diffChildren(oldTree.children, newTree.children)

  return node => {
    patchProps(node)
    patchChildren(node)
    return node
  }
}
