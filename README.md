# Mimo Kids — Landing page de pré-inauguração

Landing page single-page para a **Mimo Kids**, loja de moda infantil (RN aos 12 anos) que vai abrir em **Sarandi/PR**. Construída em Angular 22 (standalone components, Signals, SSR/prerender), com identidade visual extraída da logo e do flyer-modelo da marca, animações em anime.js e foco em performance, acessibilidade, SEO e segurança.

## Como rodar

Pré-requisitos: Node.js 22.22+ ou 24.15+ (o projeto foi construído/testado com Node 24.19) e npm.

```bash
npm install
npm start          # http://localhost:4200 — recarrega ao salvar
```

## Como buildar

```bash
npm run build
```

Gera o site pré-renderizado (SSG) em `dist/mimo-kids/browser/` — é **HTML estático puro**, pronto para subir em qualquer host estático (Netlify, Vercel, Cloudflare Pages, S3+CloudFront, GitHub Pages, um Nginx simples, etc.). Não é necessário rodar Node em produção.

O comando `build` já roda automaticamente um passo `postbuild` (`scripts/inject-font-preload.mjs` + `scripts/apply-csp-hashes.mjs`) que injeta os `<link rel="preload">` das fontes com o hash certo da build e recalcula os hashes usados na política de segurança de conteúdo — ver [Segurança](#segurança) abaixo. Não edite esses trechos à mão.

Se preferir SSR sob demanda em vez de puramente estático (não é necessário para este site, já que ele tem uma única rota e sai 100% pré-renderizada), o build também gera um servidor Node em `dist/mimo-kids/server/`, iniciável com `npm run serve:ssr:mimo-kids`.

## Deploy no GitHub Pages

O repositório já vem com um workflow (`.github/workflows/deploy-pages.yml`) que builda e publica automaticamente a cada push na `main`, via GitHub Actions + `actions/deploy-pages` (o método oficial recomendado pelo GitHub, sem precisar commitar o build no git).

**Passo único e manual, na primeira vez** (o GitHub não deixa isso ser feito por push): no repositório, vá em **Settings → Pages → Build and deployment → Source** e selecione **"GitHub Actions"**. Depois disso, todo push na `main` publica sozinho — acompanhe em **Actions**. A URL fica algo como `https://<seu-usuário>.github.io/mimo-kids/`.

Como o site é servido num subcaminho (`/mimo-kids/`, não na raiz do domínio), o workflow usa `npm run build:gh-pages` — que roda `ng build --base-href /mimo-kids/` em vez do `--base-href /` padrão. Se o nome do repositório mudar, ajuste esse script no `package.json` de acordo. Quando o domínio próprio (`loja.config.ts` → `seo.urlCanonica`) estiver no ar, use `npm run build` (raiz) para esse host e pode até desativar o workflow do Pages.

## O que você precisa preencher antes de publicar

Tudo isso está centralizado em **[`src/app/core/config/loja.config.ts`](src/app/core/config/loja.config.ts)** — é o único arquivo que você precisa editar no dia a dia:

| O que | Onde |
|---|---|
| Endereço exato da loja | `loja.config.ts` → `endereco` |
| Horário de funcionamento | `loja.config.ts` → `horarios` |
| Formas de pagamento aceitas | `loja.config.ts` → `formasPagamento` |
| Data/hora da inauguração (ativa o contador regressivo do Hero) | `loja.config.ts` → `dataInauguracao` (formato ISO, ex: `'2026-12-01T09:00:00-03:00'`; enquanto for `null`, a seção Hero mostra só o selo "Em breve") |
| Domínio final do site (usado no SEO/Open Graph/JSON-LD e em `public/robots.txt` e `public/sitemap.xml`) | `loja.config.ts` → `seo.urlCanonica`, e os dois arquivos em `public/` |

Todo campo ainda com valor de exemplo está comentado no código com o prefixo `// TROCAR:`.

### Foto da loja

A seção "Sobre" (`src/app/features/about-store/about-store.html`) mostra por enquanto um placeholder ilustrado (moldura tracejada + ícone de câmera). O comentário `<!-- TROCAR: -->` naquele arquivo já traz o bloco `<picture>`/`<img>` pronto para colar (com `srcset`, `width`/`height` e `loading="lazy"`) — é só:

1. Gerar duas versões em WebP da foto da fachada (480w e 960w) e colocar em `src/assets/img/`.
2. Descomentar o bloco `<picture>` indicado e apagar o `<div class="sobre__foto-placeholder">`.
3. Ajustar `width`/`height` para as dimensões reais (mantendo a proporção, para não introduzir CLS).

## Identidade visual

Extraída da logo oficial (`LOGO-MIMO-KIDS.webp`) e do flyer-modelo (`Modelo Inspiração.jpeg`), com os tons originais (mais saturados/neon, usados só na logo) suavizados para pastel no restante do site, como no flyer.

**Paleta** (`src/styles/_tokens.scss`) — cada cor pastel tem uma variante "-texto" mais escura, calculada e validada para contraste AA (WCAG) durante o desenvolvimento:

| Token | Hex | Uso |
|---|---|---|
| `--mk-creme` | `#FDF4E6` | Fundo base |
| `--mk-rosa-claro` | `#FBB6C9` | Ondas, fundos decorativos |
| `--mk-rosa` / `--mk-rosa-forte` / `--mk-rosa-texto` | `#EE6D8C` / `#C23D66` / `#C23D66` | Marca, fitas, títulos |
| `--mk-azul` / `--mk-azul-texto` | `#92C9EA` / `#256E9C` | Onda, seção "Atendimento" |
| `--mk-amarelo` / `--mk-amarelo-texto` | `#F8C144` / `#8A6512` | Estrelinha, detalhes |
| `--mk-laranja` / `--mk-laranja-texto` | `#F5A445` / `#A05A12` | Categoria "Lenços" |
| `--mk-verde` / `--mk-verde-texto` / `--mk-verde-forte` | `#8CC474` / `#4C7A34` / `#1E7A45` | Categoria "Fraldas", CTA do WhatsApp |
| `--mk-lilas` / `--mk-lilas-texto` | `#B79BD9` / `#6B4B96` | Categoria "Chupetas" |
| `--mk-coral` / `--mk-coral-texto` | `#F27A6E` / `#C34534` | Acentos, corações |

**Tipografia:** títulos em **Baloo 2** (700/800), corpo em **Nunito** (400/700) — auto-hospedadas como `.woff2` em `src/assets/fonts/` (sem `<link>` para o Google Fonts, sem terceiro no caminho crítico), pré-carregadas no `index.html`.

**Ornamentos** (`src/app/shared/ornaments/`): ondas com contorno tracejado, a estrelinha sorridente, corações, confete, ícones circulares por categoria — todos recriados como **SVG inline**, não recortes do arquivo original. A logo (ilustração multicolorida à mão) continua como imagem raster (WebP, fundo removido/transparente, três densidades) — uma vetorização automática de um desenho de 10 cores perderia fidelidade; converter para SVG de verdade exigiria o arquivo-fonte vetorial (Illustrator/Figma) da logo, que não foi fornecido.

## Stack

- **Angular 22**, standalone components, `ChangeDetectionStrategy.OnPush` em todos os componentes, **Signals** para estado, TypeScript `strict`.
- **anime.js v4** para as animações (timeline de entrada do Hero, loops contínuos com pausa fora da viewport, scroll suave com easing customizado).
- **SCSS** com design tokens em CSS custom properties.
- **@angular/ssr** com pré-renderização estática (`RenderMode.Prerender`) — o site sai como HTML já pronto, sem esperar JS para o conteúdo aparecer.
- **sharp** (devDependency) só para o script `scripts/prep-assets.mjs`, que gera os favicons/ícones/imagem OG e as variantes da logo a partir do arquivo original — não roda em produção.

Nada de jQuery, frameworks de CSS pesados ou trackers de terceiros.

## Animações

Regras seguidas em todas as animações (`src/app/shared/motion/`):

- Só `transform`/`opacity` são animados — nunca `top/left/width/height`.
- Loops contínuos (estrelinha, confete) pausam com `IntersectionObserver` quando saem da viewport; o pause por aba oculta é automático via `engine.pauseOnDocumentHidden` do próprio anime.js v4.
- `prefers-reduced-motion: reduce` desliga loops/parallax e reduz tudo a transições curtas — ver `_base.scss`/`_motion.scss`.
- O sistema de "revelar ao rolar" (`RevealDirective`, classe `.mk-reveal`) anima **só `transform`**, nunca `opacity`: um trecho abaixo da dobra escondido por opacidade some do cálculo de contraste de qualquer auditoria (Lighthouse/axe) que não role a página — e também ficaria invisível para quem navega sem JavaScript. Por isso o conteúdo é sempre 100% opaco/legível; o que anima é só a posição.
- O elemento LCP do Hero (logo/H1) nunca começa oculto por JS — só os ornamentos ao redor dele animam a entrada.

## Performance — relatório Lighthouse

Rodado com o Lighthouse CLI contra o build estático de produção (`dist/mimo-kids/browser`), via Chromium headless (Microsoft Edge, já que o ambiente de build não tinha Chrome instalado). Relatórios completos em [`lighthouse/desktop.report.html`](lighthouse/desktop.report.html) e [`lighthouse/mobile.report.html`](lighthouse/mobile.report.html).

| | Performance | Acessibilidade | Boas práticas | SEO |
|---|---|---|---|---|
| **Desktop** | **100** | **100** | **100** | **100** |
| **Mobile** (throttling simulado) | **99** | **100** | **100** | **100** |

O único ponto fora de 100 é a Performance mobile, presa em 99 pela métrica de **LCP** (2,2s sob o throttling simulado de rede/CPU do Lighthouse — bem dentro do limite "bom" de 2,5s dos Core Web Vitals). É esperado: a maior parte desse tempo é o download/decode da logo grande e colorida do Hero — reduzir mais isso significaria diminuir a logo ou simplificá-la, o que vai contra o pedido explícito de um Hero visualmente exuberante. Considero esse 1 ponto tecnicamente aceitável dado o trade-off.

Para reproduzir:

```bash
npm run build
npx serve dist/mimo-kids/browser   # ou qualquer servidor estático
npx lighthouse http://localhost:3000 --preset=desktop   # desktop
npx lighthouse http://localhost:3000                    # mobile (padrão)
```

## Acessibilidade

- HTML semântico (`header`/`main`/`section`/`nav`/`footer`), hierarquia de headings, `lang="pt-BR"`.
- Todos os ornamentos decorativos com `aria-hidden="true"`/`role="presentation"`.
- Contraste AA verificado em todas as combinações texto/fundo usadas (ver tabela de paleta acima).
- Navegação completa por teclado: `:focus-visible` temático, menu mobile sai da ordem de tabulação quando fechado (`visibility:hidden`, não só `opacity`), fecha com `Esc`.
- Auditado com axe-core (0 violações WCAG2A/AA/2.1A/AA na última verificação) além do Lighthouse acima.
- Links externos (WhatsApp/Instagram) com `rel="noopener noreferrer"` e indicação de nova aba no `aria-label`.

## Segurança

- **CSP** restritiva em `<meta http-equiv="Content-Security-Policy">` no `index.html` — sem `unsafe-inline` em `script-src`. O Angular injeta, no HTML pré-renderizado, um `onload` inline no `<link>` de CSS não-crítico (técnica padrão de carregamento assíncrono de CSS — ver [web.dev](https://web.dev/articles/defer-non-critical-css)); em vez de abrir mão de `unsafe-inline`, o passo `postbuild` (`scripts/apply-csp-hashes.mjs`) calcula o hash SHA-256 exato desse handler e do que mais for inline, e atualiza a CSP com `'sha256-…'` + `'unsafe-hashes'` — só aquele conteúdo específico é liberado, qualquer outra coisa injetada continua bloqueada. Recalculado a cada build.
- A hidratação incremental do Angular (que injetaria outro script inline de bootstrap de eventos) está desligada em `app.config.ts` — o site não usa blocos `@defer`, então não perdemos nada, e a CSP fica mais simples.
- `frame-ancestors` não funciona em `<meta>` (só em cabeçalho HTTP) — por isso não está na meta tag. **Configure no seu servidor/CDN**, junto com os outros cabeçalhos recomendados:

  ```
  Content-Security-Policy: <mesma política do index.html, mais forte via header>
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), camera=(), microphone=()
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Frame-Options: DENY
  ```

- Nenhum `innerHTML` com conteúdo dinâmico, nenhum `bypassSecurityTrust*` — sanitização nativa do Angular intacta.
- Sem chaves/tokens no client, sem trackers de terceiros.
- `npm audit`: 0 vulnerabilidades.

## SEO

`<title>`/`meta description` focados em busca local, Open Graph + Twitter Card completos (com imagem 1200×630 gerada a partir da identidade visual, em `public/og-image.jpg`), JSON-LD `Store` (nome, cidade/UF, telefone, Instagram, faixa etária), `robots.txt`, `sitemap.xml`, favicon completo (`.ico` multi-tamanho + PNGs + `apple-touch-icon`) e `manifest.webmanifest` — tudo em `public/`, gerado a partir da logo por `scripts/prep-assets.mjs`.

## Estrutura de pastas

```
src/app/
  core/
    config/loja.config.ts   # único lugar a editar (endereço, horários, data, SEO)
    seo/seo.service.ts      # title/meta/OG/Twitter/JSON-LD
  shared/
    motion/                 # MotionService, RevealDirective, ContinuousMotionDirective, smooth-scroll
    ornaments/               # ondas, estrelinha, corações, confete, ícones de categoria — SVG inline
    utils/whatsapp.ts
  features/                 # uma pasta por seção da página (header, hero, sobre, categorias, chá de bebê, atendimento, cta, footer, fab)
src/styles/                 # tokens, fontes (.woff2), base, componentes utilitários, motion
scripts/
  prep-assets.mjs           # gera favicons/ícones/OG/variantes da logo a partir do arquivo original (rodar manualmente quando a logo mudar)
  inject-font-preload.mjs   # postbuild — injeta o <link rel="preload"> de cada fonte com o hash certo da build
  apply-csp-hashes.mjs      # postbuild — recalcula os hashes da CSP
.github/workflows/
  deploy-pages.yml          # build + publica no GitHub Pages a cada push na main
```

## Correção feita em relação ao flyer

O flyer-modelo trazia "LENÇOS UMIDECIDOS" — a grafia correta é **"LENÇOS UMEDECIDOS"**, já corrigida em todo o site (seção "O que você encontra aqui").

## Sugestões de melhorias futuras

- Galeria de produtos/moda (quando houver fotos).
- Captura de e-mail/WhatsApp para aviso de inauguração (precisa de um backend simples ou serviço tipo formulário-como-serviço — hoje o site não tem nenhum backend por design).
- Integração com catálogo/e-commerce se a loja passar a vender online.
- Testes automatizados (unitários e um smoke e2e) — não incluídos nesta entrega para manter o foco no pedido original; o projeto já está com `strict` TypeScript e sem erros de build/lint.
- Rastrear taxa de cliques nos CTAs de WhatsApp/Instagram com uma ferramenta de analytics **sem cookies/first-party**, se a loja quiser medir conversão sem contrariar a regra de "sem trackers de terceiros por padrão".
