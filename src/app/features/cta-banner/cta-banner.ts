import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LOJA_CONFIG } from '../../core/config/loja.config';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { ConfettiLayer } from '../../shared/ornaments/confetti-layer';
import { IconWhatsapp, IconInstagram } from '../../shared/ornaments/social-icons';
import { buildWhatsappUrl } from '../../shared/utils/whatsapp';

@Component({
  selector: 'app-cta-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, ConfettiLayer, IconWhatsapp, IconInstagram],
  templateUrl: './cta-banner.html',
  styleUrl: './cta-banner.scss',
})
export class CtaBanner {
  protected readonly loja = LOJA_CONFIG;
  protected readonly whatsappUrl = buildWhatsappUrl();
}
