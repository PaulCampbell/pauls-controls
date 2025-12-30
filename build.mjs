import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, 'dist');
const outputDir = path.dirname(outputPath);

await mkdir(outputDir, { recursive: true });

await build({
  entryPoints: [
    path.resolve(__dirname, 'src', 'bounding-boxes.js'),
  ],
  bundle: true,
  minify: true,
  format: 'esm',
  outfile: path.resolve(__dirname, 'dist', 'bounding-boxes.js'),
  sourcemap: false,
  target: ['es2020'],
});

await build({
  entryPoints: [
    path.resolve(__dirname, 'src', 'auto-suggest.js'),
  ],
  bundle: true,
  minify: true,
  format: 'esm',
  outfile: path.resolve(__dirname, 'dist', 'auto-suggest.js'),
  sourcemap: false,
  target: ['es2020'],
});

