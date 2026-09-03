import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, inject } from '@angular/core';
import { createTimeline, stagger } from 'animejs';
import { LOJA_CONFIG } from '../../core/config/loja.config';
import { MotionService } from '../../shared/motion/motion.service';
import { buildWhatsappUrl } from '../../shared/utils/whatsapp';
import { WaveDivider } from '../../shared/ornaments/wave-divider';
import { ConfettiLayer } from '../../shared/ornaments/confetti-layer';
import { StarMascot } from '../../shared/ornaments/star-mascot';
import { IconWhatsapp, IconInstagram } from '../../shared/ornaments/social-icons';
import { HeartShape } from '../../shared/ornaments/shapes';
import { ContinuousMotionDirective } from '../../shared/motion/continuous-motion.directive';
import { CountdownTimer } from './countdown-timer';

const RIBBON_TEXTO = 'EM BREVE EM SARANDI!';

@Component({
  selector: 'app-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WaveDivider, ConfettiLayer, StarMascot, IconWhatsapp, IconInstagram, HeartShape, ContinuousMotionDirective, CountdownTimer],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  private readonly motion = inject(MotionService);
  private readonly hostEl: ElementRef<HTMLElement> = inject(ElementRef);

  protected readonly loja = LOJA_CONFIG;
  protected readonly whatsappUrl = buildWhatsappUrl();
  protected readonly ribbonLetters = RIBBON_TEXTO.split('');
  protected readonly dataInauguracao = LOJA_CONFIG.dataInauguracao;

  constructor() {
    afterNextRender(() => this.animarEntrada());
  }

  private animarEntrada(): void {
    if (!this.motion.canAnimate) return;

    const root = this.hostEl.nativeElement;
    const timeline = createTimeline({ defaults: { ease: 'outElastic(1, .7)' } });

    timeline
      .add(root.querySelectorAll('.hero__wave'), { translateY: [-60, 0], ease: 'outCubic', duration: 700 }, 0)
      .add(root.querySelector('.hero__ribbon')!, { scale: [0.6, 1], duration: 900 }, 200)
      .add(
        root.querySelectorAll('.hero__ribbon-letter'),
        { translateY: [16, 0], duration: 500, ease: 'outBack(1.6)', delay: stagger(28) },
        260,
      )
      .add(root.querySelector('.hero__subtitle')!, { translateY: [18, 0], duration: 600, ease: 'outCubic' }, 500)
      .add(root.querySelector('.hero__countdown-wrap')!, { translateY: [18, 0], duration: 600, ease: 'outCubic' }, 620)
      .add(
        root.querySelectorAll('.hero__ctas > *'),
        { translateY: [22, 0], duration: 650, delay: stagger(110) },
        720,
      );
  }
}
