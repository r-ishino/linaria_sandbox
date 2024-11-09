import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'lib/index.js',
  format: 'esm',
  external: ['react']
});
