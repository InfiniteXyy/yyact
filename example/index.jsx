import { React, useState } from "../core";
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>{count}</button>
  );
}
function App() {
  const [input, setInput] = useState("");
  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)}/>
      <Counter />
    </div>
  );
}

React.render(<App />, document.getElementById("root"));
// React.render(<Counter />, document.getElementById("root"));
