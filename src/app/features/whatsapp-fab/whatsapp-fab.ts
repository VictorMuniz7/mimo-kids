import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconWhatsapp } from '../../shared/ornaments/social-icons';
import { buildWhatsappUrl } from '../../shared/utils/whatsapp';

@Component({
  selector: 'app-whatsapp-fab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconWhatsapp],
  templateUrl: './whatsapp-fab.html',
  styleUrl: './whatsapp-fab.scss',
})
export class WhatsappFab {
  protected readonly whatsappUrl = buildWhatsappUrl();
}
