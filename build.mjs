import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.resolve(__dirname, 'dist');
const outputDir = path.dirname(outputPath);

await mkdir(outputDir, { recursive: true });

async function buildComponent(fileName) {
    const buildOptions = {
    bundle: true,
    minify: true,
    format: 'esm',
    sourcemap: false,
    target: ['es2020'],
  }

  await build({
    ...buildOptions,
    entryPoints: [
      path.resolve(__dirname, 'src', fileName),
    ],
    outfile: path.resolve(__dirname, 'dist', fileName),
  });
}

const components = [
  'upload-input.js',
  'bounding-boxes.js',
  'auto-suggest.js',
]

for (const component of components) {
  await buildComponent(component);
}

console.log('Build completed.');
