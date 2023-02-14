import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import typescript from '@rollup/plugin-typescript';
import pkg from "./package.json" assert {type: "json"};

export default [
  {
    input: "src/index.ts",
    output: {
      name: "edgee-tracking", 
      file: pkg.browser,
      format: "umd",
      dir: "lib"
    },
    plugins: [
      typescript(),
      resolve(),
      commonjs(),
      babel({
        exclude: ["node_modules/**"],
      }),
    ],
  },
  // {
  //   input: "src/index.ts", 
    
  //   output: [
  //     { file: pkg.main, format: "cjs", inlineDynamicImports: true, },
  //     { file: pkg.module, format: "es", inlineDynamicImports: true, },
  //   ],
  //   plugins: [
  //     typescript(),
  //     babel({
  //       exclude: ["node_modules/**"],
  //     }),
  //   ],
  // },
];