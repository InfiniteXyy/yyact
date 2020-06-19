import { Component, VNode, vdom } from "./common";
import { INode, JSXElement } from "./types";
import { isFuncElement, deepEqual } from "./utils";
import { createDOM, replaceDOM, updateDom } from "./dom";

export function reconcileChildren(node: Element, prevTree: INode, curTree: INode) {
  if (prevTree.type !== curTree.type) {
    // 若标签不同，则直接重新渲染
    replaceDOM(node, curTree);
  } else {
    // 若props不同，则对原来元素进行更新
    if (!deepEqual(prevTree.props, curTree.props)) {
      updateDom(node, node.parentNode as Element, prevTree.props!, curTree.props!);
    }
    // 结构性变化，直接重新渲染
    if (prevTree.children.length !== curTree.children.length) {
      replaceDOM(node, curTree);
    } else {
      // 若子元素个数相同，则一一比较
      for (let i = 0; i < prevTree.children.length; i++) {
        reconcileChildren(node.childNodes[i] as Element, prevTree.children[i], curTree.children[i]);
      }
    }
  }
}

export function buildVDOM(element: JSXElement): VNode {
  let vnode: VNode;
  if (typeof element !== "object") {
    /* 处理字符串 */
    vnode = new VNode("TEXT", { content: element.toString() }, []);
  } else if (isFuncElement(element)) {
    /* 处理函数组件 */
    const component = new Component(element.type, element.props, element.children);
    // 全局设置当前函数组件，供 Hook API 使用
    vdom.currentComponent = component;
    const unwrappedElement = component.render({ ...component.props, children: component.children });
    vnode = buildVDOM(unwrappedElement);
    // 将 vnode 绑定到组件，供更新使用
    component.refresh = () => {
      component.state.hookIndex = 0;
      const newVNode = buildVDOM(component.render({ ...component.props, children: component.children }));
      reconcileChildren(vnode.dom!, vnode, newVNode);
      vnode.props = newVNode.props;
      vnode.type = newVNode.type;
      console.log(vnode)
    };
  } else {
    /* 处理 HTML 组件 */
    vnode = new VNode(
      element.type,
      element.props,
      element.children.map((child) => buildVDOM(child))
    );
  }
  return vnode;
}

export const ReactDOM = {
  render(element: JSXElement, container: Element) {
    vdom.root = buildVDOM(element);
    container.appendChild(createDOM(vdom.root));
  },
};
