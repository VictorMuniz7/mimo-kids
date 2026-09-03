import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, PLATFORM_ID, inject, signal } from '@angular/core';
import { LOJA_CONFIG } from '../../core/config/loja.config';
import { IconWhatsapp } from '../../shared/ornaments/social-icons';
import { MotionService } from '../../shared/motion/motion.service';
import { smoothScrollTo } from '../../shared/motion/smooth-scroll';
import { buildWhatsappUrl } from '../../shared/utils/whatsapp';

interface NavLink {
  readonly href: string;
  readonly label: string;
}

const NAV_LINKS: readonly NavLink[] = [
  { href: 'sobre', label: 'Sobre' },
  { href: 'encontra-aqui', label: 'O que temos' },
  { href: 'cha-de-bebe', label: 'Chá de bebê' },
  { href: 'atendimento', label: 'Atendimento' },
];

@Component({
  selector: 'app-site-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconWhatsapp],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
})
export class SiteHeader implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly motion = inject(MotionService);

  protected readonly navLinks = NAV_LINKS;
  protected readonly loja = LOJA_CONFIG;
  protected readonly whatsappUrl = buildWhatsappUrl();
  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);

  private tickScheduled = false;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      this.document.addEventListener('keydown', this.onKeydown);
      this.onScroll();
    }
  }

  private readonly onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.menuOpen()) {
      this.closeMenu();
    }
  };

  private readonly onScroll = (): void => {
    if (this.tickScheduled) return;
    this.tickScheduled = true;
    requestAnimationFrame(() => {
      this.scrolled.set(window.scrollY > 24);
      this.tickScheduled = false;
    });
  };

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected onNavClick(event: Event, id: string): void {
    event.preventDefault();
    this.closeMenu();

    const target = this.document.getElementById(id);
    if (!target) return;

    if (this.motion.canAnimate) {
      const headerOffset = 88;
      const y = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      void smoothScrollTo(Math.max(y, 0));
    } else {
      target.scrollIntoView({ block: 'start' });
    }

    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.onScroll);
      this.document.removeEventListener('keydown', this.onKeydown);
    }
  }
}
