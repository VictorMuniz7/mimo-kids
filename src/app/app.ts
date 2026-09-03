import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from './core/seo/seo.service';
import { SiteHeader } from './features/site-header/site-header';
import { Hero } from './features/hero/hero';
import { AboutStore } from './features/about-store/about-store';
import { Categories } from './features/categories/categories';
import { BabyShowerCorner } from './features/baby-shower-corner/baby-shower-corner';
import { ServiceInfo } from './features/service-info/service-info';
import { CtaBanner } from './features/cta-banner/cta-banner';
import { SiteFooter } from './features/site-footer/site-footer';
import { WhatsappFab } from './features/whatsapp-fab/whatsapp-fab';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteHeader, Hero, AboutStore, Categories, BabyShowerCorner, ServiceInfo, CtaBanner, SiteFooter, WhatsappFab],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly seo = inject(SeoService);

  constructor() {
    this.seo.apply();
  }
}
