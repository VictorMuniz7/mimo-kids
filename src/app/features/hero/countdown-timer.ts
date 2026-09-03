import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { animate } from 'animejs';
import { MotionService } from '../../shared/motion/motion.service';

interface Restante {
  readonly dias: number;
  readonly horas: number;
  readonly minutos: number;
  readonly segundos: number;
}

const ZERO: Restante = { dias: 0, horas: 0, minutos: 0, segundos: 0 };

function calcularRestante(alvoIso: string): Restante {
  const diffMs = new Date(alvoIso).getTime() - Date.now();
  if (diffMs <= 0) return ZERO;

  const totalSegundos = Math.floor(diffMs / 1000);
  return {
    dias: Math.floor(totalSegundos / 86400),
    horas: Math.floor((totalSegundos % 86400) / 3600),
    minutos: Math.floor((totalSegundos % 3600) / 60),
    segundos: totalSegundos % 60,
  };
}

/**
 * Contador regressivo até a inauguração. Só é exibido quando
 * `loja.config.ts` define `dataInauguracao` — sem essa data, a seção Hero
 * mostra apenas o selo "Em breve" (ver `Hero`).
 */
@Component({
  selector: 'app-countdown-timer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'timer', 'aria-live': 'off' },
  template: `
    <div class="contador" #root>
      @for (unidade of unidades(); track unidade.label) {
        <div class="contador__bloco">
          <span class="contador__valor" [attr.data-valor]="unidade.valor">{{ unidade.valor }}</span>
          <span class="contador__label">{{ unidade.label }}</span>
        </div>
      }
    </div>
  `,
  styleUrl: './countdown-timer.scss',
})
export class CountdownTimer implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly motion = inject(MotionService);
  private readonly hostEl: ElementRef<HTMLElement> = inject(ElementRef);
  private intervalId?: ReturnType<typeof setInterval>;

  readonly dataAlvo = input.required<string>();

  private readonly restante = signal<Restante>(ZERO);

  protected readonly unidades = computed(() => {
    const r = this.restante();
    return [
      { label: 'dias', valor: r.dias },
      { label: 'horas', valor: r.horas },
      { label: 'min', valor: r.minutos },
      { label: 'seg', valor: r.segundos },
    ];
  });

  constructor() {
    afterNextRender(() => this.animarEntrada());
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.restante.set(calcularRestante(this.dataAlvo()));
    this.intervalId = setInterval(() => this.restante.set(calcularRestante(this.dataAlvo())), 1000);
  }

  private animarEntrada(): void {
    if (!this.motion.canAnimate) return;

    const valores = this.hostEl.nativeElement.querySelectorAll<HTMLElement>('.contador__valor');
    valores.forEach((el, i) => {
      const alvo = Number(el.dataset['valor'] ?? 0);
      const proxy = { n: 0 };
      animate(proxy, {
        n: alvo,
        duration: 650,
        delay: i * 70,
        ease: 'outCubic',
        onUpdate: () => {
          el.textContent = String(Math.round(proxy.n)).padStart(2, '0');
        },
      });
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
