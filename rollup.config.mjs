import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "cjs",
    exports: "named",
  },
  plugins: [nodeResolve(), commonjs(), typescript()],
};
