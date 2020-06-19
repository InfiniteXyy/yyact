import { AnyMap, INode } from "./types";
import { toCSS } from "./utils";

const isEvent = (key: string) => key.startsWith("on");
const isProperty = (key: string) => !isEvent(key);
const isNew = (prev: AnyMap, next: AnyMap) => (key: string) => prev[key] !== next[key];
const isGone = (prev: AnyMap, next: AnyMap) => (key: string) => !(key in next);

export function updateDom(dom: Element, parentDom: Element, prevProps: AnyMap, nextProps: AnyMap) {
  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom.removeAttribute(name);
    });

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      if (name === "content") {
        parentDom.innerHTML = nextProps[name];
      } else if (name === "style") {
        dom.setAttribute("style", toCSS(nextProps[name]));
      } else {
        dom.setAttribute(name, nextProps[name]);
      }
    });

  // Remove prev listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // Update event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

export function createDOM(vnode: INode): Text | Element {
  // 将 VNode 转为标准的 document node
  const { type, children } = vnode;
  const props = vnode.props || {};

  // 1、若 type 为 TEXT 说明是字符串
  if (type === "TEXT") {
    vnode.dom = document.createTextNode(props.content || "");
    return vnode.dom;
  }

  // 2、根据 type 生成对应元素
  const element = document.createElement(type);
  vnode.dom = element;

  // 3、如果 props 中含有 html 标记，则不需要对其他内容做任何处理
  if (props.dangerouslySetInnerHTML && props.dangerouslySetInnerHTML.__html) {
    element.innerHTML = props.dangerouslySetInnerHTML.__html;
    return element;
  }

  // 4、遍历 props 参数，应用到 element 中，对于特殊的参数名进行处理
  Object.getOwnPropertyNames(props).forEach((name) => {
    const value = props[name];
    if (!value) return;
    if (name === "className") element.setAttribute("class", value);
    else if (name === "style") element.setAttribute("style", toCSS(value));
    else if (name.startsWith("on")) element.addEventListener(name.toLowerCase().slice(2), value);
    else if (name === "key") return;
    else element.setAttribute(name, value);
  });

  // 5、将 children 中的每一个 DOMElement 转变为 Element 元素 并添加到父组件中，children 默认为 []
  children.map(createDOM).forEach((child) => element.appendChild(child));
  return element;
}

export function replaceDOM(dom: Element, newVNode: INode) {
  dom.parentNode!.replaceChild(createDOM(newVNode), dom);
}
