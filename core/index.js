let current;

class Component {
  constructor(element, state) {
    this.props = element.props;
    this.render = element.tag;
    this.state = state || {
      hooks: [],
      hookIndex: 0,
    };
  }
}

export const React = {
  createElement(tag, props, ...children) {
    return { tag, props: { ...props, children } };
  },
};

export const ReactDOM = {
  render(element, container) {
    if (typeof element !== "object") {
      container.appendChild(document.createTextNode(element));
      return;
    }
    const isComponent = element instanceof Component || typeof element.tag === "function";
    let vnode, dom, oldDom;
    if (isComponent) {
      current = element instanceof Component ? element : new Component(element);
      vnode = current.render(current.props);
      oldDom = current.dom;
      dom = document.createElement(vnode.tag);
      current.dom = dom;
      dom.__state__ = current.state;
    } else {
      vnode = element;
      dom = document.createElement(element.tag);
    }
    for (let key in vnode.props) {
      if (key === "children") continue;
      if (key.startsWith("on")) {
        dom.addEventListener(key.substring(2).toLowerCase(), vnode.props[key]);
      } else {
        dom.setAttribute(key, vnode.props[key]);
      }
    }
    vnode.props.children.forEach((child) => this.render(child, dom));
    if (oldDom) container.replaceChild(dom, oldDom);
    else container.appendChild(dom);
  },
};

export function useState(initValue) {
  const component = current;
  const { hooks, hookIndex } = component.state;
  if (hookIndex === hooks.length) {
    const newHook = {
      value: initValue,
      setState(newValue) {
        newHook.value = newValue;
        component.state.hookIndex = 0;
        ReactDOM.render(component, component.dom.parentNode);
      },
    };
    hooks.push(newHook);
  }
  const hook = hooks[hookIndex];
  component.state.hookIndex += 1;
  return [hook.value, hook.setState];
}
