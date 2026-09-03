import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Coraçãozinho decorativo — separador de lista, marcador, confete. */
@Component({
  selector: 'mk-heart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', role: 'presentation' },
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 26C16 26 2 17.6 2 9.4 2 4.6 5.6 1.4 9.8 1.4 12.6 1.4 14.8 2.9 16 5.2 17.2 2.9 19.4 1.4 22.2 1.4 26.4 1.4 30 4.6 30 9.4 30 17.6 16 26 16 26Z"
        [attr.fill]="'var(' + color() + ')'"
      />
    </svg>
  `,
})
export class HeartShape {
  readonly size = input(20);
  readonly color = input('--mk-coral');
}

/** Estrelinha simples (sem rosto) — confete de fundo, marcadores. */
@Component({
  selector: 'mk-sparkle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', role: 'presentation' },
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 0C16.8 8.6 23.4 15.2 32 16 23.4 16.8 16.8 23.4 16 32 15.2 23.4 8.6 16.8 0 16 8.6 15.2 15.2 8.6 16 0Z"
        [attr.fill]="'var(' + color() + ')'"
      />
    </svg>
  `,
})
export class SparkleStar {
  readonly size = input(16);
  readonly color = input('--mk-rosa');
}

/** Bolinha de confete. */
@Component({
  selector: 'mk-dot',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', role: 'presentation' },
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="10" [attr.fill]="'var(' + color() + ')'" />
    </svg>
  `,
})
export class DotShape {
  readonly size = input(10);
  readonly color = input('--mk-verde');
}
