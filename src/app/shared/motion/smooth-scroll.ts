import { animate } from 'animejs';

/**
 * Rola até `targetY` com easing customizado via anime.js. Usada pela
 * navegação por âncoras do header — o `scroll-behavior: smooth` do CSS fica
 * como fallback caso `prefers-reduced-motion` esteja ativo (nesse caso nem
 * chamamos esta função — ver `SiteHeader`).
 */
export function smoothScrollTo(targetY: number, duration = 700): Promise<void> {
  const proxy = { y: window.scrollY };
  return new Promise((resolve) => {
    animate(proxy, {
      y: targetY,
      duration,
      ease: 'inOutCubic',
      onUpdate: () => window.scrollTo(0, proxy.y),
      onComplete: () => resolve(),
    });
  });
}
