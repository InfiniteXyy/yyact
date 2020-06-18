import { Component, runtime } from "./common";
import { FuncElement, JSXElement, PureElement } from "./types";

function isFuncElement(element: JSXElement): element is FuncElement {
  return typeof element.type === "function";
}

/* 处理函数式组件 */
function handleFuncElement(component: Component, container: Element, oldDOM?: Element) {
  // 全局设置当前函数组件，供 Hook API 使用
  runtime.currentComponent = component;
  const vnode = component.render(component.props);
  // 继续递归处理后续函数组件，直至普通的 HTML 组件
  ReactDOM.render(vnode, container, oldDOM);
}

/* 处理 HTML 组件 */
function handlePureElement(element: PureElement, container: Element, oldDOM?: Element) {
  const dom = document.createElement(element.type);
  Object.getOwnPropertyNames(element.props).forEach((key) => {
    if (key === "children") return;
    if (key.startsWith("on")) {
      dom.addEventListener(key.substring(2).toLowerCase(), element.props[key]);
    } else {
      dom.setAttribute(key, element.props[key]);
    }
  });
  // 绑定状态更新逻辑到实际 DOM 节点
  if (runtime.currentComponent) {
    const component = runtime.currentComponent;
    component.dom = dom;
    (dom as any).__component__ = component;
    component.refresh = () => {
      handleFuncElement(component, container, component.dom);
    };
    runtime.currentComponent = null;
  }
  if (oldDOM) {
    for (let i = 0; i < oldDOM.childElementCount; i++) {
      if ("__component__" in oldDOM.children[i]) {
        const component: Component = (oldDOM.children[i] as any)["__component__"];
        component.state.hookIndex = 0;
        handleFuncElement(component, dom);
      } else {
        ReactDOM.render(element.props.children[i], dom);
      }
    }
    container.replaceChild(dom, oldDOM);
  } else {
    element.props.children.forEach((child) => {
      ReactDOM.render(child, dom);
    });
    container.appendChild(dom);
  }
}

export const ReactDOM = {
  render(element: JSXElement | string | number, container: Element, oldDOM?: Element) {
    if (typeof element !== "object") {
      container.appendChild(document.createTextNode(element.toString()));
      return;
    }
    if (isFuncElement(element)) {
      let component = new Component(element.type, element.props);
      handleFuncElement(component, container, oldDOM);
    } else {
      handlePureElement(element, container, oldDOM);
    }
  },
};
