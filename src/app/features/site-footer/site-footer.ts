import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LOJA_CONFIG } from '../../core/config/loja.config';
import { WaveDivider } from '../../shared/ornaments/wave-divider';
import { IconWhatsapp, IconInstagram } from '../../shared/ornaments/social-icons';
import { buildWhatsappUrl } from '../../shared/utils/whatsapp';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WaveDivider, IconWhatsapp, IconInstagram],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
})
export class SiteFooter {
  protected readonly loja = LOJA_CONFIG;
  protected readonly whatsappUrl = buildWhatsappUrl();
  protected readonly ano = new Date().getFullYear();
}
