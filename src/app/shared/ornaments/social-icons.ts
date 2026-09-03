import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'mk-icon-whatsapp',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', role: 'presentation' },
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 2C8.3 2 2 8.3 2 16c0 2.6.7 5 1.9 7.1L2 30l7.1-1.9C11.1 29.3 13.5 30 16 30c7.7 0 14-6.3 14-14S23.7 2 16 2Zm0 25.5c-2.3 0-4.4-.6-6.3-1.7l-.5-.3-4.3 1.1 1.2-4.2-.3-.5C4.6 20.1 4 18.1 4 16 4 9.4 9.4 4 16 4s12 5.4 12 12-5.4 11.5-12 11.5Z"
      />
      <path
        d="M22.1 18.9c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2-.2.3-.9 1.1-1.1 1.3-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.7-1.7-1-.9-1.7-2-1.9-2.3-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.5.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6-.1-.2-.8-1.9-1.1-2.6-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.6c.2.3 2.4 3.7 5.9 5.1.8.3 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 2-.8 2.3-1.6.3-.8.3-1.4.2-1.6-.1-.1-.3-.2-.6-.4Z"
      />
    </svg>
  `,
})
export class IconWhatsapp {
  readonly size = input(24);
}

@Component({
  selector: 'mk-icon-instagram',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', role: 'presentation' },
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="26" height="26" rx="8" stroke="currentColor" stroke-width="2.4" />
      <circle cx="16" cy="16" r="6.5" stroke="currentColor" stroke-width="2.4" />
      <circle cx="23.2" cy="8.8" r="1.6" fill="currentColor" />
    </svg>
  `,
})
export class IconInstagram {
  readonly size = input(24);
}

@Component({
  selector: 'mk-icon-camera',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', role: 'presentation' },
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 16a4 4 0 0 1 4-4h4l2.4-3.6A3 3 0 0 1 18.9 7h10.2a3 3 0 0 1 2.5 1.4L34 12h4a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4Z"
        fill="var(--mk-rosa-claro)"
        stroke="var(--mk-rosa)"
        stroke-width="2.2"
        stroke-linejoin="round"
      />
      <circle cx="24" cy="25" r="8" fill="#fff" stroke="var(--mk-rosa)" stroke-width="2.2" />
    </svg>
  `,
})
export class IconCamera {
  readonly size = input(48);
}
