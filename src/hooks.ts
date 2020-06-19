import { vdom } from "./common";

export function useState<T>(initValue: T): [T, (value: T) => void] {
  const component = vdom.currentComponent;
  if (!component) throw new Error("use hooks outside of function");
  const { hooks, hookIndex } = component.state;
  if (hookIndex === hooks.length) {
    const currentHook = {
      value: initValue,
      setState(value: T) {
        vdom.currentComponent = component;
        currentHook.value = value;
        component.state.hookIndex = 0;
        component.refresh();
      },
    };
    hooks.push(currentHook);
  }
  const hook = hooks[hookIndex];
  component.state.hookIndex += 1;
  return [hook.value, hook.setState];
}
