import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type CategoryKind = 'roupas' | 'fralda' | 'leite' | 'lencos' | 'mamadeira' | 'chupeta' | 'mais';

/**
 * Ícone circular colorido por categoria, recriado em SVG inline (glifo branco
 * com contorno escuro, para manter contraste em qualquer cor pastel de fundo).
 */
@Component({
  selector: 'mk-category-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', role: 'presentation' },
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="32" [attr.fill]="'var(' + color() + ')'" />
      <g fill="#fff" stroke="var(--mk-texto)" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
        @switch (kind()) {
          @case ('roupas') {
            <path
              d="M21 13 26 8h12l5 5 8 6-5.5 7.5-4.5-3V50a2 2 0 0 1-2 2H25a2 2 0 0 1-2-2V23.5l-4.5 3L13 19z"
            />
          }
          @case ('fralda') {
            <rect x="10" y="17" width="9" height="7" rx="3" />
            <rect x="45" y="17" width="9" height="7" rx="3" />
            <path d="M16 20c0-6 5-10 16-10s16 4 16 10v6c0 13-16 19-16 19S16 39 16 26z" />
          }
          @case ('leite') {
            <path d="M22 18 32 10 42 18v28a2 2 0 0 1-2 2H24a2 2 0 0 1-2-2z" />
            <rect x="27" y="24" width="10" height="4" fill="var(--mk-texto)" stroke="none" />
          }
          @case ('lencos') {
            <rect x="12" y="22" width="40" height="28" rx="8" />
            <ellipse cx="32" cy="23" rx="11" ry="4" fill="var(--mk-texto)" stroke="none" />
            <path d="M24 23c3-7 13-7 16 0" fill="none" stroke="#fff" stroke-width="2.4" />
          }
          @case ('mamadeira') {
            <ellipse cx="32" cy="11" rx="5" ry="4" />
            <rect x="27" y="14" width="10" height="5" rx="2" />
            <rect x="19" y="19" width="26" height="32" rx="11" />
            <rect x="24" y="32" width="16" height="3" fill="var(--mk-texto)" stroke="none" />
            <rect x="24" y="39" width="16" height="3" fill="var(--mk-texto)" stroke="none" />
          }
          @case ('chupeta') {
            <circle cx="32" cy="17" r="9" fill="none" stroke-width="5" />
            <ellipse cx="32" cy="35" rx="15" ry="7" />
            <path d="M24 39c0 6 4 11 8 11s8-5 8-11z" />
          }
          @case ('mais') {
            <path d="M32 16v32M16 32h32" stroke-width="6" />
          }
        }
      </g>
    </svg>
  `,
})
export class CategoryIcon {
  readonly kind = input.required<CategoryKind>();
  readonly color = input('--mk-azul');
  readonly size = input(64);
}
