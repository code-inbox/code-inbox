import esbuild from "rollup-plugin-esbuild"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import replace from "@rollup/plugin-replace"
import postcss from "rollup-plugin-postcss"
import {glob} from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {generate} from "astring"


function reactMountPlugin() {
  return {
    name: "react-mount-plugin",
    order: "pre",
    async transform(code, id) {
      if (id.endsWith(".tsx")) {
        // Append the mounting logic with the default component import
        code += `\n\nimport React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import Component from './${id.slice(id.lastIndexOf("/") + 1, -4)}';
const root = createRoot(document.getElementById('root'));
root.render(<Component />);`
      }
      return code
    },
  }
}

function getStaticInfoPlugin() {
  return {
    name: "get-static-info",
    moduleParsed({ id, ...rest }) {
      if (id.endsWith(".tsx")) {
        const componentName = id.slice(id.lastIndexOf("/") + 1, -4)
        const exportNodes = rest.ast.body.filter(
          (n) => n.type === "ExportNamedDeclaration"
        )
        const source = exportNodes
          .map((n) => {
            const name = n.declaration.declarations[0].id.name
            const definition = generate(n.declaration.declarations[0].init)
            const cjsExport = `module.exports.${name} = ${definition};`
            return cjsExport
          })
          .join("\n")
        this.emitFile({
          type: "asset",
          fileName: `${componentName}.static.js`,
          source,
        })
      }
    },
  }
}

export default [
  {
    input: Object.fromEntries(
		glob.sync('src/views/*.tsx').map(file => [
			// This remove `src/` as well as the file extension from each
			// file, so e.g. src/nested/foo.js becomes nested/foo
			path.relative(
				'src/views',
				file.slice(0, file.length - path.extname(file).length)
			),
			// This expands the relative paths to absolute paths, so e.g.
			// src/nested/foo becomes /project/src/nested/foo.js
			fileURLToPath(new URL(file, import.meta.url))
		])
	),
    watch: true,
    output: {
      dir: "dist/chromium",
      format: "esm",
    },
    plugins: [
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
      reactMountPlugin(),
      getStaticInfoPlugin(),
      esbuild(),
      nodeResolve(),
      commonjs(),
      postcss({
        modules: true,
      }),
    ],
  },

  {
    input: "extension.ts",
    watch: true,
    output: {
      dir: "dist/node",
      format: "cjs",
    },
    plugins: [
      json(),
      nodeResolve({
        mainFields: ["main", "module"], // this is the trick. the bug is in the "esm" version of the Magicbell package.
      }),
      commonjs(),
      esbuild(),
    ],
  },
]
