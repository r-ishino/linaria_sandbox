/**
 * This file contains an esbuild loader for wyw-in-js.
 * It uses the transform.ts function to generate class names from source code,
 * returns transformed code without template literals and attaches generated source maps
 */

import { readFileSync, readdir, writeFileSync } from 'fs';
import {
  basename,
  dirname,
  isAbsolute,
  join,
  parse,
  posix,
  resolve
} from 'path';
import { transformSync } from 'esbuild';
import { slugify, transform, createFileReporter } from '@wyw-in-js/transform';
const nodeModulesRegex = /^(?:.*[\\/])?node_modules(?:[\\/].*)?$/;

export default function wywInJS({
  debug,
  sourceMap,
  preprocessor,
  esbuildOptions,
  filter = /\.(js|jsx|ts|tsx)$/,
  ...rest
} = {}) {
  return {
    name: 'wyw-in-js',
    setup(build) {
      const cssLookup = new Map();
      const { emitter, onDone } = createFileReporter({ print: true });
      const asyncResolve = async (token, importer) => {
        const context = isAbsolute(importer)
          ? dirname(importer)
          : join(process.cwd(), dirname(importer));
        const result = await build.resolve(token, {
          resolveDir: context,
          kind: 'import-statement'
        });
        if (result.errors.length > 0) {
          throw new Error(`Cannot resolve ${token}`);
        }
        return result.path.replace(/\\/g, posix.sep);
      };
      build.onEnd((args) => {
        const cssValues = Array.from(cssLookup.values());
        const combinedCss = cssValues.join('\n');
        writeFileSync(resolve('./lib/index.css'), combinedCss);
        onDone(process.cwd());
      });
      build.onLoad({ filter }, async (args) => {
        const rawCode = readFileSync(args.path, 'utf8');
        const { ext, dir, name: filename } = parse(args.path);
        const loader = ext.replace(/^\./, '');
        if (nodeModulesRegex.test(args.path)) {
          return {
            loader,
            contents: rawCode
          };
        }
        const transformed = transformSync(rawCode, {
          sourcefile: args.path,
          sourcemap: sourceMap,
          loader
        });
        let { code } = transformed;
        const transformServices = {
          options: {
            filename: args.path,
            root: process.cwd(),
            preprocessor,
            pluginOptions: rest
          },

          eventEmitter: emitter
        };
        const result = await transform(transformServices, code, asyncResolve);
        if (!result.cssText) {
          return {
            contents: code,
            loader,
            resolveDir: dirname(args.path)
          };
        }
        let { cssText } = result;
        const slug = slugify(cssText);
        const cssFilename = `${filename}_${slug}.wyw.css`;
        cssLookup.set(cssFilename, cssText);
        return {
          contents: result.code,
          loader,
          resolveDir: dirname(args.path)
        };
      });
    }
  };
}
