export type AnyMap = { [key: string]: any };

export type JSXElement = FuncElement | PureElement | string | number;

export type FuncElement = {
  type: (props: AnyMap & { children: JSXElement[] }) => JSXElement;
  props: AnyMap;
  children: JSXElement[];
};

export type PureElement = {
  type: string;
  props: AnyMap;
  children: JSXElement[];
};

export type HookState = { hooks: any[]; hookIndex: number };

export interface IComponent {
  render: (props: AnyMap & { children: JSXElement[] }) => JSXElement;
  props: AnyMap;
  children: JSXElement[];
  state: HookState;

  refresh(): void;
}

export type INode = {
  type: string;
  props: AnyMap | null;
  children: INode[];
  dom: Element | Text | null;
};
