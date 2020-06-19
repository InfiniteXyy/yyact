import { FuncElement, INode, PureElement } from "./types";

export function isFuncElement(element: PureElement | FuncElement): element is FuncElement {
  return typeof element.type === "function";
}
function isPrimitive(obj: any) {
  return obj !== Object(obj);
}
export function deepEqual(obj1: any, obj2: any) {
  if (obj1 === obj2) return true;
  if (isPrimitive(obj1) && isPrimitive(obj2))
    // compare primitives
    return obj1 === obj2;
  if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
  for (let key in obj1) {
    if (!(key in obj2)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }
  return true;
}
export function toCSS(cssObj: { [k: string]: string }): string {
  let result = "";
  for (const key in cssObj) {
    const value = cssObj[key];
    const propName = key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
    let propValue = value;
    if (Number.isInteger(+value)) {
      propValue += "px";
    }
    result += `${propName}:${propValue};`;
  }
  return result;
}
