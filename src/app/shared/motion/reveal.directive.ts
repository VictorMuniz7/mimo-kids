import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';
import { MotionService } from './motion.service';

/**
 * Revela o elemento (fade + translateY curto, só transform/opacity) quando ele
 * entra na viewport. Sem JS, sem suporte a IntersectionObserver, ou com
 * `prefers-reduced-motion: reduce`, o elemento já nasce visível — ver
 * `.mk-reveal` em `_motion.scss`, que só esconde o conteúdo dentro de
 * `@media (prefers-reduced-motion: no-preference)`.
 */
@Directive({
  selector: '[mkReveal]',
  standalone: true,
  host: {
    class: 'mk-reveal',
    '[style.--mk-reveal-delay.ms]': 'mkRevealDelay()',
  },
})
export class RevealDirective implements OnInit, OnDestroy {
  private readonly el: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly motion = inject(MotionService);
  private observer?: IntersectionObserver;

  readonly mkRevealDelay = input(0);

  ngOnInit(): void {
    if (!this.motion.isBrowser || typeof IntersectionObserver === 'undefined') {
      this.el.nativeElement.classList.add('is-visible');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.el.nativeElement.classList.add('is-visible');
            this.observer?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
