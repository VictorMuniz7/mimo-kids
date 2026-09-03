import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { IconCamera } from '../../shared/ornaments/social-icons';
import { HeartShape } from '../../shared/ornaments/shapes';

@Component({
  selector: 'app-about-store',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, IconCamera, HeartShape],
  templateUrl: './about-store.html',
  styleUrl: './about-store.scss',
})
export class AboutStore {}
