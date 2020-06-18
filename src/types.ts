export type AnyMap = { [key: string]: any };

export type PropsType = { children: (JSXElement | string | number)[] } & AnyMap;

export type FuncElement = {
  type: (props: PropsType) => JSXElement;
  props: PropsType;
};

export type PureElement = {
  type: string;
  props: PropsType;
};

export type JSXElement = FuncElement | PureElement;

export type HookState = { hooks: any[]; hookIndex: 0 };
