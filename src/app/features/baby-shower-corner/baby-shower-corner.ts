import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { ContinuousMotionDirective } from '../../shared/motion/continuous-motion.directive';
import { HeartShape } from '../../shared/ornaments/shapes';

@Component({
  selector: 'app-baby-shower-corner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, ContinuousMotionDirective, HeartShape],
  templateUrl: './baby-shower-corner.html',
  styleUrl: './baby-shower-corner.scss',
})
export class BabyShowerCorner {}
