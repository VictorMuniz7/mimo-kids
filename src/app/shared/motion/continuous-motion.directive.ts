import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';
import { animate, type JSAnimation } from 'animejs';
import { MotionService } from './motion.service';

export type LoopKind = 'float' | 'pendulum' | 'pulse' | 'wiggle';

const LOOP_PRESETS: Record<LoopKind, () => Record<string, unknown>> = {
  float: () => ({
    translateY: [0, -14, 0],
    duration: 4200,
    ease: 'inOutSine',
  }),
  pendulum: () => ({
    rotate: [-8, 8],
    duration: 2600,
    ease: 'inOutSine',
    alternate: true,
    transformOrigin: 'top center',
  }),
  pulse: () => ({
    scale: [1, 1.12, 1],
    duration: 1600,
    ease: 'inOutSine',
  }),
  wiggle: () => ({
    rotate: [-4, 4, -4],
    duration: 3400,
    ease: 'inOutSine',
  }),
};

/**
 * Loop de movimento contínuo (flutuar, pêndulo, pulso, balanço) baseado em
 * anime.js. Só anima `transform` — nunca `top/left/width/height` — e fica
 * pausado enquanto o elemento está fora da viewport (IntersectionObserver).
 * O pause por aba oculta já é automático: `engine.pauseOnDocumentHidden` do
 * anime.js v4 cuida disso globalmente.
 */
@Directive({
  selector: '[mkLoop]',
  standalone: true,
  host: { 'data-ornamento': '' },
})
export class ContinuousMotionDirective implements OnInit, OnDestroy {
  private readonly el: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly motion = inject(MotionService);
  private observer?: IntersectionObserver;
  private instance?: JSAnimation;

  readonly mkLoop = input.required<LoopKind>();
  /** Atraso opcional (ms), útil para dessincronizar vários elementos iguais. */
  readonly mkLoopDelay = input(0);

  ngOnInit(): void {
    if (!this.motion.canAnimate) return;

    const preset = LOOP_PRESETS[this.mkLoop()]();
    this.instance = animate(this.el.nativeElement, {
      ...preset,
      loop: true,
      delay: this.mkLoopDelay(),
      autoplay: false,
    });

    if (typeof IntersectionObserver === 'undefined') {
      this.instance.play();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.instance?.play();
          } else {
            this.instance?.pause();
          }
        }
      },
      { threshold: 0.01 },
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.instance?.revert();
  }
}
