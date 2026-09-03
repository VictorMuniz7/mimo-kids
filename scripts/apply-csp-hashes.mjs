// Roda como `postbuild`: o Angular injeta, no HTML pré-renderizado, alguns
// <script> inline próprios (bootstrap de event-replay da hidratação). Uma CSP
// `script-src 'self'` sem exceção bloquearia esses scripts — em vez de abrir
// mão com 'unsafe-inline', calculamos o hash SHA-256 exato de cada um e
// atualizamos a meta tag de CSP em todo HTML gerado. Isso é determinístico
// por build: se o app mudar (novos bindings de evento etc.), os hashes mudam
// junto automaticamente na próxima build.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve(import.meta.dirname, '..', 'dist', 'mimo-kids', 'browser');

const EXECUTABLE_TYPES = new Set(['', 'text/javascript', 'application/javascript', 'module']);

function sha256(text) {
  return `'sha256-${createHash('sha256').update(text, 'utf8').digest('base64')}'`;
}

// Angular's build-time critical CSS inliner (Beasties) defers non-critical CSS
// with `<link ... media="print" onload="this.media='all'">` — a well-known,
// legitimate pattern (see web.dev's CSP guide), but it IS an inline event
// handler attribute. Hashes alone don't cover event handlers per the CSP3
// spec — they need `'unsafe-hashes'` too. That keyword only re-allows
// handlers whose content matches one of our declared hashes; anything else
// (e.g. an injected onerror=) stays blocked.
function extractInlineHashes(html) {
  const scriptHashes = new Set();
  const eventHandlerHashes = new Set();

  const scriptTagRe = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = scriptTagRe.exec(html))) {
    const [, attrs, content] = match;
    if (/\bsrc\s*=/i.test(attrs)) continue;
    if (!content.trim()) continue;

    const typeMatch = /type\s*=\s*["']([^"']+)["']/i.exec(attrs);
    const type = typeMatch?.[1] ?? '';
    if (!EXECUTABLE_TYPES.has(type)) continue;

    scriptHashes.add(sha256(content));
  }

  // Só procura atributos on* dentro de aberturas de tag reais (evita falso
  // positivo em texto/JSON solto em outras partes do HTML).
  const tagOpenRe = /<[a-zA-Z][^>]*>/g;
  const eventHandlerRe = /\son[a-z]+\s*=\s*(["'])([\s\S]*?)\1/gi;
  while ((match = tagOpenRe.exec(html))) {
    const tag = match[0];
    let handlerMatch;
    eventHandlerRe.lastIndex = 0;
    while ((handlerMatch = eventHandlerRe.exec(tag))) {
      const content = handlerMatch[2];
      if (!content.trim()) continue;
      eventHandlerHashes.add(sha256(content));
    }
  }

  return { scriptHashes: [...scriptHashes], eventHandlerHashes: [...eventHandlerHashes] };
}

function updateCsp(html, scriptHashes, eventHandlerHashes) {
  const additions = [...scriptHashes, ...eventHandlerHashes, ...(eventHandlerHashes.length > 0 ? ["'unsafe-hashes'"] : [])];
  return html.replace(
    /(<meta\s+http-equiv="Content-Security-Policy"\s+content=")([^"]*)(")/i,
    (_full, pre, content, post) => {
      const updated = content.replace(/script-src 'self'/, `script-src 'self' ${additions.join(' ')}`);
      return `${pre}${updated}${post}`;
    },
  );
}

const files = globSync('**/index.html', { cwd: DIST_DIR }).map((f) => path.join(DIST_DIR, f));

if (files.length === 0) {
  console.warn('[apply-csp-hashes] Nenhum index.html encontrado em', DIST_DIR, '— pulei.');
  process.exit(0);
}

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const { scriptHashes, eventHandlerHashes } = extractInlineHashes(html);
  const total = scriptHashes.length + eventHandlerHashes.length;
  const updated = total > 0 ? updateCsp(html, scriptHashes, eventHandlerHashes) : html;
  writeFileSync(file, updated, 'utf8');
  console.log(
    `[apply-csp-hashes] ${path.relative(DIST_DIR, file)}: ${scriptHashes.length} hash(es) de <script>, ${eventHandlerHashes.length} de atributo de evento.`,
  );
}
