import { HookState, IComponent, JSXElement, INode, AnyMap } from "./types";

const vdom: { currentComponent: Component | null; root: INode | null } = {
  currentComponent: null,
  root: null,
};
export { vdom };
export class VNode implements INode {
  constructor(
    public type: string,
    public props: AnyMap | null,
    public children: INode[],
    public dom: Element | null = null
  ) {}
}

export class Component implements IComponent {
  public refresh: () => void = () => {};
  constructor(
    public render: (props: AnyMap & { children: JSXElement[] }) => JSXElement,
    public props: AnyMap,
    public children: JSXElement[],
    public state: HookState = {
      hooks: [],
      hookIndex: 0,
    }
  ) {}
}
