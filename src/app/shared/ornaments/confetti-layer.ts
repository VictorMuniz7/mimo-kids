import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeartShape, SparkleStar, DotShape } from './shapes';
import { ContinuousMotionDirective } from '../motion/continuous-motion.directive';

interface ConfettiItem {
  readonly kind: 'heart' | 'star' | 'dot';
  readonly top: string;
  readonly left: string;
  readonly size: number;
  readonly color: string;
  readonly delay: number;
}

const ITEMS: readonly ConfettiItem[] = [
  { kind: 'star', top: '8%', left: '6%', size: 18, color: '--mk-lilas', delay: 0 },
  { kind: 'heart', top: '18%', left: '92%', size: 20, color: '--mk-coral', delay: 300 },
  { kind: 'dot', top: '30%', left: '14%', size: 10, color: '--mk-verde', delay: 600 },
  { kind: 'star', top: '68%', left: '4%', size: 14, color: '--mk-laranja', delay: 900 },
  { kind: 'dot', top: '78%', left: '90%', size: 12, color: '--mk-azul', delay: 200 },
  { kind: 'heart', top: '55%', left: '96%', size: 16, color: '--mk-rosa', delay: 1100 },
  { kind: 'star', top: '90%', left: '50%', size: 12, color: '--mk-amarelo', delay: 500 },
  { kind: 'dot', top: '4%', left: '48%', size: 8, color: '--mk-coral', delay: 800 },
];

/**
 * Camada de confete ambiente (estrelas, corações, bolinhas flutuando devagar).
 * O elemento pai precisa de `position: relative` — a camada preenche 100%.
 */
@Component({
  selector: 'mk-confetti-layer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeartShape, SparkleStar, DotShape, ContinuousMotionDirective],
  host: { 'aria-hidden': 'true', role: 'presentation', 'data-ornamento': '', class: 'mk-confetti' },
  template: `
    @for (item of items; track $index) {
      <span class="mk-confetti__item" [style.top]="item.top" [style.left]="item.left" mkLoop="float" [mkLoopDelay]="item.delay">
        @switch (item.kind) {
          @case ('heart') {
            <mk-heart [size]="item.size" [color]="item.color" />
          }
          @case ('star') {
            <mk-sparkle [size]="item.size" [color]="item.color" />
          }
          @case ('dot') {
            <mk-dot [size]="item.size" [color]="item.color" />
          }
        }
      </span>
    }
  `,
  styles: `
    :host {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }

    .mk-confetti__item {
      position: absolute;
      display: block;
    }
  `,
})
export class ConfettiLayer {
  protected readonly items = ITEMS;
}
