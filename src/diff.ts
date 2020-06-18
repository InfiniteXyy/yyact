// import { PureElement } from "./types";
// import { Component } from "./common";
// import { handleFuncElement, ReactDOM } from "./ReactDOM";
//
// export function mount(element: PureElement, container: Element, oldDOM: Element): Element {
//   const dom = document.createElement(element.type);
//
//   Object.getOwnPropertyNames(element.props).forEach((key) => {
//     if (key === "children") return;
//     if (key.startsWith("on")) {
//       dom.addEventListener(key.substring(2).toLowerCase(), element.props[key]);
//     } else {
//       dom.setAttribute(key, element.props[key]);
//     }
//   });
//
//   for (let i = 0; i < oldDOM.childElementCount; i++) {
//     if ("__component__" in oldDOM.children[i]) {
//       const component: Component = (oldDOM.children[i] as any)["__component__"];
//       component.state.hookIndex = 0;
//       handleFuncElement(component, dom);
//     } else {
//       ReactDOM.render(element.props.children[i], dom);
//     }
//   }
//   container.replaceChild(dom, oldDOM);
//
//   return dom;
// }
