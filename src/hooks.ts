import { runtime } from "./common";

export function useState<T>(initValue: T): [T, (value: T) => void] {
  const component = runtime.currentComponent;
  if (component === null) throw new Error("use hooks outside of function");
  const { hooks, hookIndex } = component.state;
  if (hookIndex === hooks.length) {
    const newHook = {
      value: initValue,
      setState(value: T) {
        newHook.value = value;
        component.state.hookIndex = 0;
        if (component.refresh) component.refresh();
      },
    };
    hooks.push(newHook);
  }
  const hook = hooks[hookIndex];
  component.state.hookIndex += 1;
  return [hook.value, hook.setState];
}
