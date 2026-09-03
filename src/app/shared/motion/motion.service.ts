import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Ponto único de verdade sobre "é seguro animar agora?". Toda animação
 * contínua ou disparada por scroll no site consulta este serviço antes de
 * rodar — assim `prefers-reduced-motion` e SSR ficam resolvidos uma vez só.
 */
@Injectable({ providedIn: 'root' })
export class MotionService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly reducedMotion = signal(false);

  constructor() {
    if (!this.isBrowser) return;

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reducedMotion.set(query.matches);
    query.addEventListener('change', (event) => this.reducedMotion.set(event.matches));
  }

  /** true quando é seguro iniciar animações JS (browser + sem preferência por movimento reduzido). */
  get canAnimate(): boolean {
    return this.isBrowser && !this.reducedMotion();
  }
}
