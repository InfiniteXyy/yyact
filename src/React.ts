import { AnyMap, JSXElement, PropsType } from "./types";

export const React = {
  createElement(
    type: string | ((props: PropsType) => JSXElement),
    props: AnyMap,
    ...children: (JSXElement | string | number)[]
  ) {
    return <JSXElement>{ type, props: { ...props, children } };
  },
};
