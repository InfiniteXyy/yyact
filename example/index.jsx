import { React, ReactDOM, useState } from "../src";
function Simple(props) {
  return (
    <div>
      <h1>{props.name}</h1>
      <div>
        Hello, <b>fake react</b>
      </div>
    </div>
  );
}
function Counter() {
  const [count, setCount] = useState(2);

  return (
    <div>
      <h1>counter</h1>
      <button onClick={() => setCount(count + 1)}>{count}</button>
    </div>
  );
}
function App() {
  const [input, setInput] = useState("xyy");
  const [count, setCount] = useState(0);
  return (
    <div>
      <Simple name={"Hello " + input} />
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <input value={input} onInput={(e) => setInput(e.target.value)} />
      <Counter />
    </div>
  );
}
// ReactDOM.render("123", document.getElementById("root"));
// ReactDOM.render(<Simple name={"123"} />, document.getElementById("root"));
// ReactDOM.render(<Counter />, document.getElementById("root"));
ReactDOM.render(<App />, document.getElementById("root"));
