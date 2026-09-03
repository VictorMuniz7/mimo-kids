/**
 * Configuração central da loja Mimo Kids.
 *
 * Edite APENAS este arquivo para atualizar dados de contato, endereço,
 * horários e a data de inauguração — nenhum outro lugar do código precisa
 * ser tocado. Todo campo marcado com `// TROCAR:` está com um valor de
 * exemplo e precisa ser substituído antes de publicar o site.
 */

export interface FormaPagamento {
  readonly label: string;
}

export interface HorarioFuncionamento {
  readonly dias: string;
  readonly horario: string;
}

export const LOJA_CONFIG = {
  nome: 'Mimo Kids',
  cidade: 'Sarandi',
  estado: 'PR',
  cidadeEstado: 'Sarandi/PR',

  instagram: {
    usuario: '@mimokids',
    url: 'https://instagram.com/mimokids',
  },

  whatsapp: {
    numero: '5544988122940',
    numeroFormatado: '(44) 98812-2940',
    mensagemPadrao: 'Olá! Vi o site da Mimo Kids e gostaria de saber mais 💛',
    urlBase: 'https://wa.me/5544988122940',
  },

  // TROCAR: endereço exato da loja (rua, número, bairro, CEP) assim que fechado o ponto comercial.
  endereco: {
    logradouro: 'Endereço a confirmar',
    bairro: 'Sarandi/PR',
    cep: '',
    linkMapa: '',
  },

  // TROCAR: horário de funcionamento definitivo da loja.
  horarios: [
    { dias: 'Segunda a sexta', horario: 'A confirmar' },
    { dias: 'Sábado', horario: 'A confirmar' },
    { dias: 'Domingo', horario: 'Fechado' },
  ] as HorarioFuncionamento[],

  // TROCAR: formas de pagamento aceitas pela loja.
  formasPagamento: [
    { label: 'Pix' },
    { label: 'Cartão de crédito' },
    { label: 'Cartão de débito' },
    { label: 'Dinheiro' },
  ] as FormaPagamento[],

  // TROCAR: data e hora reais da inauguração (ISO 8601, com fuso de Brasília).
  // Enquanto não houver data definida, o contador da seção Hero permanece oculto
  // e mostra apenas o selo "Em breve".
  dataInauguracao: null as string | null,
  // Exemplo de preenchimento: '2026-12-01T09:00:00-03:00',

  seo: {
    titulo: 'Mimo Kids — Moda infantil e artigos para bebês em Sarandi/PR',
    descricao:
      'Mimo Kids chegando em Sarandi/PR: moda infantil completa do RN aos 12 anos, fraldas, leite, lenços umedecidos, mamadeiras, chupetas e um cantinho especial para o chá de bebê.',
    urlCanonica: 'https://www.mimokids.com.br/',
    // TROCAR: domínio definitivo assim que o site for publicado.
  },
} as const;
