import esbuild from 'esbuild';
import { globbySync } from 'globby';
import wyw from './esbuild-wyw.mjs';
import { readFileSync, rm } from 'fs';
import { existsSync } from 'node:fs';

const entryPoints = globbySync('src/**/*.{ts,tsx}');

const rawJson = readFileSync('./package.json', 'utf-8');
const pkg = JSON.parse(rawJson);

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

const bundle = false;
const options = bundle
  ? {
      bundle: true,
      entryPoints: ['src/index.ts'],
      external: ['react', 'react-dom', ...Object.keys(pkg.devDependencies)]
    }
  : {
      bundle: false,
      entryPoints
    };

await esbuild.build({
  ...options,
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
