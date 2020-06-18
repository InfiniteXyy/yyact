import { HookState, JSXElement, PropsType } from "./types";

const runtime: { currentComponent: Component | null } = { currentComponent: null };
export { runtime };

export class Component {
  public dom?: Element;
  public refresh?: () => void;
  constructor(
    public render: (props: PropsType) => JSXElement,
    public props: PropsType,
    public state: HookState = {
      hooks: [],
      hookIndex: 0,
    }
  ) {}
}
