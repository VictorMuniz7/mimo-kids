import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withNoIncrementalHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  // O site não usa blocos `@defer`, então a hidratação incremental (que injeta
  // um bootstrap de captura de eventos inline) não traz benefício aqui — e
  // aquele inline script custaria abrir mão de parte da CSP (`unsafe-hashes`
  // para os manipuladores de evento). Desligamos para manter `script-src`
  // restrito a `'self'` + hashes exatos.
  providers: [provideBrowserGlobalErrorListeners(), provideClientHydration(withNoIncrementalHydration())],
};
