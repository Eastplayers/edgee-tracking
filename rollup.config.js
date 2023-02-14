import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import bakedEnv from "rollup-plugin-baked-env";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import pkg from "./package.json" assert { type: "json" };

export default [
  {
    input: "src/index.ts",
    output: {
      name: "edgee-tracking",
      file: pkg.browser,
      format: "es",
      dir: "lib",
    },
    plugins: [
      json(),
      typescript(),
      resolve(),
      commonjs(),
      babel({
        exclude: ["node_modules/**"],
      }),
      terser(),
    ],
  },
  {
    input: "src/index.ts",

    output: {
      name: "edgee_tracking",
      file: "lib/index.min.js",
      format: "iife",
      extend: true,
    },
    plugins: [
      replace({
        preventAssignment: true,
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
      json(),
      typescript(),
      resolve(),
      commonjs(),
      babel({
        exclude: ["node_modules/**"],
      }),
      terser(),
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
