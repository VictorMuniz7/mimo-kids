import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Estrelinha sorridente da logo, recriada em SVG plano (não é um recorte do
 * arquivo original) para poder ser reutilizada em vários tamanhos, animada
 * e mantida leve — ver `[[README]]` para a justificativa de não vetorizar a
 * logo completa.
 */
@Component({
  selector: 'mk-star-mascot',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', role: 'presentation', 'data-ornamento': '' },
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon
        points="50,4 61.17,34.63 93.75,35.79 68.07,55.87 77.04,87.21 50,69 22.96,87.21 31.93,55.87 6.25,35.79 38.83,34.63"
        fill="var(--mk-amarelo)"
        stroke="var(--mk-amarelo)"
        stroke-width="6"
        stroke-linejoin="round"
      />
      <circle cx="33" cy="58" r="4.2" fill="#F49CB8" opacity="0.85" />
      <circle cx="67" cy="58" r="4.2" fill="#F49CB8" opacity="0.85" />
      <circle cx="41" cy="52" r="3.1" fill="#3a2a12" />
      <circle cx="59" cy="52" r="3.1" fill="#3a2a12" />
      <path d="M42 59 Q50 67 58 59" stroke="#3a2a12" stroke-width="3.2" fill="none" stroke-linecap="round" />
    </svg>
  `,
})
export class StarMascot {
  readonly size = input(48);
}
