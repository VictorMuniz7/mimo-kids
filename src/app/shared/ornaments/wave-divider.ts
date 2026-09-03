import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Onda orgânica com contorno tracejado branco, usada no topo/rodapé e como
 * divisor entre seções. Empilhe várias instâncias (cores/opacidades
 * diferentes) para o efeito de camadas do flyer-modelo.
 */
@Component({
  selector: 'mk-wave-divider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    role: 'presentation',
    'data-ornamento': '',
    class: 'mk-wave',
    '[class.mk-wave--bottom]': "edge() === 'bottom'",
    '[style.--mk-wave-h.px]': 'height()',
  },
  template: `
    <svg viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0,50 C180,92 360,8 540,50 C720,92 900,8 1080,50 C1260,92 1350,30 1440,50 L1440,0 L0,0 Z"
        [attr.fill]="'var(' + color() + ')'"
      />
      <path
        d="M0,50 C180,92 360,8 540,50 C720,92 900,8 1080,50 C1260,92 1350,30 1440,50"
        fill="none"
        stroke="#fff"
        stroke-width="3"
        stroke-dasharray="11 12"
        stroke-linecap="round"
      />
    </svg>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      line-height: 0;
    }

    svg {
      display: block;
      width: 100%;
      height: var(--mk-wave-h, 90px);
    }

    :host(.mk-wave--bottom) {
      transform: scaleY(-1);
    }
  `,
})
export class WaveDivider {
  readonly color = input('--mk-rosa-claro');
  readonly edge = input<'top' | 'bottom'>('top');
  readonly height = input(90);
}
