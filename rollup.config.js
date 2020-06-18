import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";

/** @type {import('rollup').RollupOptions} */
const config = {
  input: "./src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
    },
    {
      name: pkg.name,
      file: pkg.browser,
      format: "umd",
    },
    {
      file: pkg.module,
      format: "esm",
    },
  ],
  plugins: [typescript()],
};

export default config;
