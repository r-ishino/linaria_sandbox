import esbuild from 'esbuild';
import wyw from '@wyw-in-js/esbuild';
import { globbySync } from 'globby';
import { customEsbuildSample } from './custom-esbuild-sample.ts';

const entryPoints = globbySync('src/**/*.{ts,tsx}');

await esbuild.build({
  bundle: false,
  entryPoints,
  format: 'esm',
  outdir: './lib',
  platform: 'node',
  minify: false,
  target: 'es2017',
  plugins: [
    customEsbuildSample(),
    wyw({
      filter: /\.(js|jsx|ts|tsx)$/,
      sourceMap: false,
      debug: true
    })
  ]
  // sourcemap: true
});
