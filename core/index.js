function renderVNode (vnode) {
  // init element
  if (typeof vnode !== 'object') return document.createTextNode(vnode)
  const node = document.createElement(vnode.tag)
  // add props
  for (let key in vnode.props) {
    if (key === 'children') continue
    if (key.startsWith('on')) {
      node.addEventListener(key.substring(2).toLowerCase(), vnode.props[key])
    } else {
      node.setAttribute(key, vnode.props[key])
    }
  }
  // render children
  for (let child of vnode.props.children) {
    React.render(child, node)
  }
  return node
}

export const React = {
  currentElement: null,
  currentContainer: null,
  render (element, container) {
    this.currentElement = element
    this.currentContainer = container
    if (typeof element.tag === 'function') {
      const vnode = element.tag(element.props)
      element.alternate = vnode
      const newNode = renderVNode(vnode)
      if (element.dom) {
        container.replaceChild(newNode, element.dom)
      } else {
        container.appendChild(newNode)
      }
      element.dom = newNode
    } else {
      container.appendChild(renderVNode(element))
    }
  },
  createElement (tag, props, ...children) {
    const element = { tag, props: { ...props, children }, dom: null, alternate: null }
    if (typeof tag === 'function')
      return { ...element, state: { hooks: element.alternate?.state.hooks ?? [], hookIndex: 0 } }
    return element
  },
}

export function useState (initValue) {
  const [element, container] = [React.currentElement, React.currentContainer]
  const { state } = element
  if (state.hookIndex === state.hooks.length) {
    const newHook = {
      value: initValue,
      setState (newValue) {
        newHook.value = newValue
        state.hookIndex = 0
        React.render(element, container)
      },
    }
    state.hooks.push(newHook)
  }
  const hook = state.hooks[element.state.hookIndex]
  state.hookIndex += 1
  return [hook.value, hook.setState]
}
