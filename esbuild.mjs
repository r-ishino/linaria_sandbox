import esbuild from 'esbuild';
import { globbySync } from 'globby';
import wyw from './esbuild-wyw.mjs';
import { readFileSync, rm } from 'fs';
import { existsSync } from 'node:fs';

const entryPoints = globbySync('src/**/*.{ts,tsx}');

if (existsSync('./lib')) {
  rm(
    './lib',
    {
      recursive: true
    },
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
}

await esbuild.build({
  bundle: false,
  entryPoints,
  format: 'esm',
  outdir: './lib',
  platform: 'browser',
  minify: false,
  target: 'es2017',
  plugins: [
    wyw({
      debug: true,
      sourceMap: true
    })
  ]
});
