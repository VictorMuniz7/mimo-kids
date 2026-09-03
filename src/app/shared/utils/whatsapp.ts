import { LOJA_CONFIG } from '../../core/config/loja.config';

/** Monta a URL do WhatsApp com a mensagem pré-preenchida (ou uma customizada) já codificada. */
export function buildWhatsappUrl(mensagem: string = LOJA_CONFIG.whatsapp.mensagemPadrao): string {
  return `${LOJA_CONFIG.whatsapp.urlBase}?text=${encodeURIComponent(mensagem)}`;
}
