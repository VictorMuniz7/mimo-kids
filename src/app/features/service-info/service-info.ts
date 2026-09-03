import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LOJA_CONFIG } from '../../core/config/loja.config';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { HeartShape } from '../../shared/ornaments/shapes';

@Component({
  selector: 'app-service-info',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, HeartShape],
  templateUrl: './service-info.html',
  styleUrl: './service-info.scss',
})
export class ServiceInfo {
  protected readonly loja = LOJA_CONFIG;
}
