import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CategoryIcon, type CategoryKind } from '../../shared/ornaments/category-icon';
import { RevealDirective } from '../../shared/motion/reveal.directive';

interface Categoria {
  readonly kind: CategoryKind;
  readonly cor: string;
  readonly titulo: string;
  readonly detalhe: string;
}

const CATEGORIAS: readonly Categoria[] = [
  { kind: 'roupas', cor: '--mk-rosa-claro', titulo: 'Roupas', detalhe: 'Do RN aos 12 anos' },
  { kind: 'fralda', cor: '--mk-verde', titulo: 'Fraldas', detalhe: 'Para cada fasinho' },
  { kind: 'leite', cor: '--mk-azul', titulo: 'Leite', detalhe: 'Fórmulas infantis' },
  { kind: 'lencos', cor: '--mk-laranja', titulo: 'Lenços umedecidos', detalhe: 'Sempre à mão' },
  { kind: 'mamadeira', cor: '--mk-rosa-claro', titulo: 'Mamadeiras', detalhe: 'Pra hora da papinha' },
  { kind: 'chupeta', cor: '--mk-lilas', titulo: 'Chupetas', detalhe: 'Conforto e carinho' },
];

@Component({
  selector: 'app-categories',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CategoryIcon, RevealDirective],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories {
  protected readonly categorias = CATEGORIAS;
}
