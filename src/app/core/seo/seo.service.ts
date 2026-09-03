import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { LOJA_CONFIG } from '../config/loja.config';

/**
 * Aplica title/meta/OG/Twitter/canonical/JSON-LD uma única vez, na
 * inicialização do `App`. Roda tanto no servidor (prerender) quanto no
 * browser — o HTML estático já sai completo para buscadores e redes sociais.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);

  apply(): void {
    // Evita duplicar <link rel="canonical"> e o JSON-LD quando o construtor do
    // `App` roda de novo no browser durante a hidratação (a marcação já saiu
    // pronta do prerender/SSR).
    if (this.document.head.querySelector('script[type="application/ld+json"]')) return;

    const { seo, nome, cidadeEstado, whatsapp, instagram } = LOJA_CONFIG;

    this.titleService.setTitle(seo.titulo);

    this.meta.addTag({ name: 'description', content: seo.descricao });
    this.meta.addTag({ name: 'theme-color', content: '#fdf4e6' });

    this.meta.addTag({ property: 'og:type', content: 'website' });
    this.meta.addTag({ property: 'og:site_name', content: nome });
    this.meta.addTag({ property: 'og:title', content: seo.titulo });
    this.meta.addTag({ property: 'og:description', content: seo.descricao });
    this.meta.addTag({ property: 'og:url', content: seo.urlCanonica });
    this.meta.addTag({ property: 'og:image', content: `${seo.urlCanonica}og-image.jpg` });
    this.meta.addTag({ property: 'og:image:width', content: '1200' });
    this.meta.addTag({ property: 'og:image:height', content: '630' });
    this.meta.addTag({ property: 'og:locale', content: 'pt_BR' });

    this.meta.addTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.addTag({ name: 'twitter:title', content: seo.titulo });
    this.meta.addTag({ name: 'twitter:description', content: seo.descricao });
    this.meta.addTag({ name: 'twitter:image', content: `${seo.urlCanonica}og-image.jpg` });

    const canonical = this.document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', seo.urlCanonica);
    this.document.head.appendChild(canonical);

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: nome,
      description: seo.descricao,
      url: seo.urlCanonica,
      telephone: `+${whatsapp.numero}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: LOJA_CONFIG.cidade,
        addressRegion: LOJA_CONFIG.estado,
        addressCountry: 'BR',
      },
      areaServed: cidadeEstado,
      sameAs: [instagram.url],
      audience: {
        '@type': 'PeopleAudience',
        suggestedMinAge: 0,
        suggestedMaxAge: 12,
      },
    };

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    this.document.head.appendChild(script);
  }
}
