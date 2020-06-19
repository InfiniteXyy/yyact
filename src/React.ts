import { AnyMap, JSXElement } from "./types";

export const React = {
  createElement(
    type: string | ((props: AnyMap & { children: JSXElement[] }) => JSXElement),
    props: AnyMap,
    ...children: (JSXElement | string | number)[]
  ): JSXElement {
    return <JSXElement>{ type, props, children };
  },
};
