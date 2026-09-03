// Roda como parte do `postbuild`, antes de `apply-csp-hashes.mjs`. As fontes
// (@font-face em src/styles/_fonts.scss) são processadas pelo bundler como
// assets do CSS — saem com nome com hash em /media/*.woff2, o que as torna
// portáveis (funcionam tanto na raiz quanto sob um subcaminho, ex.: GitHub
// Pages) mas também significa que não dá pra escrever um <link rel="preload">
// com href fixo em src/index.html. Este script lê o CSS já buildado, acha os
// .woff2 referenciados em @font-face e substitui o marcador `<!-- FONT_PRELOADS -->`
// pelos <link rel="preload"> com o caminho (com hash) certo desta build.
import { readFileSync, writeFileSync, globSync } from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve(import.meta.dirname, '..', 'dist', 'mimo-kids', 'browser');

const htmlFiles = globSync('**/index.html', { cwd: DIST_DIR }).map((f) => path.join(DIST_DIR, f));
if (htmlFiles.length === 0) {
  console.warn('[inject-font-preload] Nenhum index.html encontrado em', DIST_DIR, '— pulei.');
  process.exit(0);
}

for (const htmlFile of htmlFiles) {
  const dir = path.dirname(htmlFile);
  let html = readFileSync(htmlFile, 'utf8');

  const cssFiles = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+\.css)"/g)].map((m) => m[1]);
  const fontUrls = new Set();
  for (const cssHref of cssFiles) {
    const cssPath = path.join(dir, cssHref);
    let css;
    try {
      css = readFileSync(cssPath, 'utf8');
    } catch {
      continue;
    }
    for (const match of css.matchAll(/url\((["']?)([^)"']+\.woff2)\1\)/g)) {
      // Resolve relative to the CSS file's own directory, same as the browser would.
      const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(cssHref), match[2]));
      fontUrls.add(resolved);
    }
  }

  const links = [...fontUrls]
    .map((href) => `    <link rel="preload" as="font" type="font/woff2" href="${href}" crossorigin="anonymous" />`)
    .join('\n');

  html = html.replace('<!-- FONT_PRELOADS -->', links);
  writeFileSync(htmlFile, html, 'utf8');
  console.log(`[inject-font-preload] ${path.relative(DIST_DIR, htmlFile)}: ${fontUrls.size} preload(s) de fonte injetado(s).`);
}
