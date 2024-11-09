import { TransformOptions, Plugin, Loader, transformSync } from 'esbuild';
import { basename, parse } from 'path';
import { readFileSync } from 'fs';
import { transform } from '@wyw-in-js/transform';

export const customEsbuildSample = (): Plugin => {
  const cssLookup = new Map<string, string>();
  console.log('custom');
  return {
    name: 'custom-sample',
    setup(build) {
      build.onResolve({ filter: /.(ts|tsx)/ }, (args) => {
        return {
          namespace: 'custom-sample',
          path: args.path
        };
      });

      build.onLoad(
        { filter: /.*/, namespace: 'custom-sample' },
        async (args) => {
          const rawCode = readFileSync(args.path, 'utf8');
          const isUseClient = rawCode.match(/'use client';/) !== null;
          const contents = isUseClient
            ? rawCode.replace(/'use client';/, '')
            : rawCode;
          return {
            contents: isUseClient ? `'use client';\n${contents}` : contents,
            loader: 'tsx'
          };
        }
      );
    }
  };
};
