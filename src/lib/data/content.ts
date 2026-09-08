/**
 * Static content pages (A Marca / Serviços / Ajuda / Legal). Mock copy for the
 * approval build — plausible pt-BR placeholder text, clearly not final.
 *
 * SWAP POINT: move to a CMS. One registry keyed by "<section>/<slug>".
 */

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[] }
  | { type: "faq"; items: { q: string; a: string }[] };

export interface ContentPage {
  section: "a-marca" | "servicos" | "ajuda" | "legal";
  slug: string;
  title: string;
  intro?: string;
  updated?: string;
  blocks: ContentBlock[];
}

export interface ContentSection {
  key: ContentPage["section"];
  title: string;
  intro: string;
  image?: string;
  links: { label: string; href: string }[];
}

export const contentSections: ContentSection[] = [
  {
    key: "a-marca",
    title: "A Marca",
    intro: "Uma casa de moda autoral brasileira, feita à mão em São Paulo.",
    image: "editorial-atelier",
    links: [
      { label: "Nossa história", href: "/a-marca/historia" },
      { label: "Sustentabilidade", href: "/a-marca/sustentabilidade" },
      { label: "Trabalhe conosco", href: "/a-marca/carreiras" },
      { label: "Imprensa", href: "/a-marca/imprensa" },
      { label: "Lojas", href: "/lojas" },
    ],
  },
  {
    key: "servicos",
    title: "Serviços",
    intro: "Do provador ao pós-venda — o cuidado JU RUDOLPH com cada peça.",
    image: "editorial-roupas",
    links: [
      { label: "Agendar atendimento", href: "/servicos/agendar" },
      { label: "Reserva na loja", href: "/servicos/reserva" },
      { label: "Cuidados com a peça", href: "/servicos/cuidados" },
      { label: "Embalagem para presente", href: "/servicos/presente" },
    ],
  },
  {
    key: "ajuda",
    title: "Atendimento ao cliente",
    intro: "Encontre respostas rápidas ou fale com a nossa equipe.",
    links: [
      { label: "Fale com a gente", href: "/ajuda/atendimento" },
      { label: "Envio e prazos", href: "/ajuda/envio" },
      { label: "Trocas e devoluções", href: "/ajuda/trocas" },
      { label: "Guia de tamanhos", href: "/ajuda/tamanhos" },
      { label: "Rastrear pedido", href: "/ajuda/pedido" },
    ],
  },
  {
    key: "legal",
    title: "Informações legais",
    intro: "Termos, privacidade e políticas da JU RUDOLPH.",
    links: [
      { label: "Termos de uso", href: "/legal/termos" },
      { label: "Política de privacidade", href: "/legal/privacidade" },
      { label: "Política de cookies", href: "/legal/cookies" },
      { label: "Acessibilidade", href: "/legal/acessibilidade" },
    ],
  },
];

const P = (text: string): ContentBlock => ({ type: "p", text });
const H = (text: string): ContentBlock => ({ type: "h", text });

export const contentPages: Record<string, ContentPage> = {
  // ---------------------------------------------------------------- A MARCA
  "a-marca/historia": {
    section: "a-marca",
    slug: "historia",
    title: "Nossa história",
    intro: "A JU RUDOLPH nasceu de um ateliê de alfaiataria no bairro da Vila Madalena, em São Paulo.",
    blocks: [
      P("O que começou como um serviço de sob-medida para amigas virou, em poucos anos, uma casa de moda com ponto de venda próprio e uma coleção pensada estação a estação."),
      H("Feito à mão, em São Paulo"),
      P("Todas as peças de alfaiataria e as bolsas-ícone são produzidas no ateliê da marca, por uma equipe de costureiras e artesãos com décadas de experiência."),
      P("A produção é feita em pequenos lotes: preferimos repor um modelo que vende bem a empurrar estoque que vira remarcação."),
      H("O que nos guia"),
      P("Roupa que se move com o corpo, que envelhece bem e que pode voltar para o ateliê para ajustes em vez de ir para o descarte."),
    ],
  },
  "a-marca/sustentabilidade": {
    section: "a-marca",
    slug: "sustentabilidade",
    title: "Sustentabilidade",
    intro: "Menos, melhor e por mais tempo.",
    blocks: [
      P("Nossa abordagem de sustentabilidade não está num selo — está no modelo de negócio: coleções curtas, produção sob demanda e um serviço de conserto vitalício para as peças de alfaiataria."),
      H("Materiais"),
      { type: "list", items: [
        "Lãs de fornecedores com certificação de bem-estar animal.",
        "Couro de curtumes rastreáveis, subproduto da indústria alimentícia.",
        "Forros e etiquetas em viscose de fonte responsável.",
      ] },
      H("Circularidade"),
      P("O programa JU RUDOLPH Renova recompra peças em bom estado e as revende com desconto, estendendo o ciclo de vida de cada roupa."),
      P("Esta página é um rascunho de conteúdo para aprovação de estrutura; os números finais entram antes do lançamento."),
    ],
  },
  "a-marca/carreiras": {
    section: "a-marca",
    slug: "carreiras",
    title: "Trabalhe conosco",
    intro: "Estamos sempre à procura de gente boa — no ateliê, nas lojas e no time de e-commerce.",
    blocks: [
      H("Vagas abertas"),
      { type: "list", items: [
        "Costureira(o) de alfaiataria — São Paulo, presencial",
        "Consultora(o) de vendas — Loja Oscar Freire",
        "Pessoa desenvolvedora front-end — híbrido, São Paulo",
        "Analista de e-commerce (CRM) — remoto",
      ] },
      P("Envie currículo e portfólio para carreiras@jurudolph.com.br com o nome da vaga no assunto."),
    ],
  },
  "a-marca/imprensa": {
    section: "a-marca",
    slug: "imprensa",
    title: "Imprensa",
    intro: "Materiais e contato para veículos de imprensa e criadores de conteúdo.",
    blocks: [
      P("Para solicitações de imagens em alta resolução, empréstimo de peças e entrevistas, escreva para imprensa@jurudolph.com.br."),
      H("Kit de imprensa"),
      P("O kit da coleção Outono Inverno 26 (lookbook, ficha técnica e fotos de campanha) estará disponível para download nesta página."),
    ],
  },

  // -------------------------------------------------------------- SERVIÇOS
  "servicos/agendar": {
    section: "servicos",
    slug: "agendar",
    title: "Agendar atendimento",
    intro: "Reserve um horário com uma consultora para um atendimento exclusivo em loja.",
    blocks: [
      P("O atendimento agendado inclui provador privativo, curadoria de looks e ajustes de alfaiataria sem custo na primeira semana após a compra."),
      H("Como funciona"),
      { type: "list", items: [
        "Escolha a loja e o melhor dia e horário.",
        "Conte o que procura — uma ocasião, uma peça específica, uma renovação de guarda-roupa.",
        "Receba a confirmação por e-mail e WhatsApp.",
      ] },
      P("O formulário de agendamento entra nesta página na etapa 2, integrado à agenda das lojas."),
    ],
  },
  "servicos/reserva": {
    section: "servicos",
    slug: "reserva",
    title: "Reserva na loja",
    intro: "Reserve uma peça do site para experimentar na loja antes de comprar.",
    blocks: [
      P("Disponível no site em todos os produtos com estoque na loja escolhida. A reserva vale por 48 horas, sem compromisso de compra."),
      P("Botão “Encontrar na loja” já aparece na página de produto; a disponibilidade em tempo real vem do estoque na etapa 2."),
    ],
  },
  "servicos/cuidados": {
    section: "servicos",
    slug: "cuidados",
    title: "Cuidados com a peça",
    intro: "Conserto, limpeza especializada e hidratação de couro — para toda a vida da peça.",
    blocks: [
      H("Alfaiataria"),
      P("Ajustes de barra, cintura e mangas são gratuitos na primeira semana e têm preço de custo depois disso, para sempre."),
      H("Couro"),
      P("Serviço de hidratação e reparo de alças e ferragens em qualquer loja JU RUDOLPH."),
      P("Leia também o editorial “Como cuidar das suas bolsas de couro”."),
    ],
  },
  "servicos/presente": {
    section: "servicos",
    slug: "presente",
    title: "Embalagem para presente",
    intro: "Toda compra pode chegar pronta para presentear, sem custo.",
    blocks: [
      P("No carrinho, marque a opção “Embalar para presente” e escreva um cartão. A peça segue na caixa rígida da marca, com laço de fita de algodão e sem informação de preço."),
      P("Para pedidos com entrega direta a quem recebe, a nota fiscal vai por e-mail para quem compra."),
    ],
  },

  // ----------------------------------------------------------------- AJUDA
  "ajuda/atendimento": {
    section: "ajuda",
    slug: "atendimento",
    title: "Fale com a gente",
    intro: "Nosso time responde de segunda a sábado, das 9h às 18h.",
    blocks: [
      { type: "list", items: [
        "WhatsApp: +55 11 90000-0000",
        "E-mail: atendimento@jurudolph.com.br",
        "Telefone: 0800 000 0000",
      ] },
      { type: "faq", items: [
        { q: "Qual o prazo de resposta por e-mail?", a: "Até um dia útil." },
        { q: "Vocês têm atendimento aos domingos?", a: "As lojas abrem aos domingos; o atendimento on-line volta na segunda." },
      ] },
    ],
  },
  "ajuda/envio": {
    section: "ajuda",
    slug: "envio",
    title: "Envio e prazos",
    intro: "Enviamos para todo o Brasil. Frete grátis acima de R$ 1.500.",
    blocks: [
      H("Prazos"),
      { type: "list", items: [
        "Entrega padrão: 3 a 7 dias úteis.",
        "Entrega expressa: 1 a 2 dias úteis (capitais).",
        "Retirada em loja: pronto em 24h.",
      ] },
      H("Rastreamento"),
      P("Assim que o pedido é despachado, você recebe o código de rastreio por e-mail. Também dá para acompanhar em “Rastrear pedido”."),
      { type: "faq", items: [
        { q: "O prazo conta a partir de quando?", a: "Da confirmação do pagamento." },
        { q: "Vocês entregam no exterior?", a: "Ainda não — por enquanto só Brasil." },
      ] },
    ],
  },
  "ajuda/trocas": {
    section: "ajuda",
    slug: "trocas",
    title: "Trocas e devoluções",
    intro: "Primeira troca grátis. Você tem 30 dias a partir do recebimento.",
    blocks: [
      H("Como solicitar"),
      { type: "list", items: [
        "Acesse “Rastrear pedido” e clique em “Solicitar troca”.",
        "Escolha os itens e o motivo.",
        "Imprima a etiqueta de postagem que enviamos por e-mail.",
      ] },
      H("Condições"),
      P("A peça deve estar sem uso, com etiquetas e na embalagem original. Peças de alfaiataria já ajustadas não têm troca, apenas conserto."),
      { type: "faq", items: [
        { q: "Quanto tempo leva o reembolso?", a: "Até 10 dias úteis após recebermos a peça de volta." },
        { q: "Posso trocar em loja?", a: "Sim, em qualquer loja JU RUDOLPH, com a nota." },
      ] },
    ],
  },

  // ----------------------------------------------------------------- LEGAL
  "legal/termos": {
    section: "legal",
    slug: "termos",
    title: "Termos de uso",
    updated: "2026-08-01",
    intro: "Condições gerais de uso do site e da loja on-line JU RUDOLPH.",
    blocks: [
      P("Este é um texto de exemplo para a revisão de estrutura. O conteúdo jurídico final será fornecido pelo departamento legal antes do lançamento."),
      H("1. Aceitação"),
      P("Ao navegar e comprar neste site, você concorda com estes termos e com a Política de Privacidade."),
      H("2. Preços e pagamento"),
      P("Os preços estão em reais, com impostos incluídos, e podem mudar sem aviso. A compra só é confirmada após a aprovação do pagamento."),
      H("3. Propriedade intelectual"),
      P("Marcas, textos, imagens e código deste site são de propriedade da JU RUDOLPH e não podem ser reproduzidos sem autorização."),
    ],
  },
  "legal/privacidade": {
    section: "legal",
    slug: "privacidade",
    title: "Política de privacidade",
    updated: "2026-08-01",
    intro: "Como tratamos os seus dados pessoais, conforme a LGPD.",
    blocks: [
      P("Texto de exemplo para revisão de estrutura. A versão final segue a Lei Geral de Proteção de Dados (Lei 13.709/2018)."),
      H("Dados que coletamos"),
      { type: "list", items: [
        "Cadastro: nome, e-mail, telefone, CPF e endereço.",
        "Navegação: páginas visitadas, itens vistos e cookies.",
        "Compra: histórico de pedidos e forma de pagamento (sem guardar o número completo do cartão).",
      ] },
      H("Seus direitos"),
      P("Você pode pedir acesso, correção ou exclusão dos seus dados a qualquer momento pelo e-mail privacidade@jurudolph.com.br."),
    ],
  },
  "legal/cookies": {
    section: "legal",
    slug: "cookies",
    title: "Política de cookies",
    updated: "2026-08-01",
    intro: "O que são cookies e como você pode gerenciá-los.",
    blocks: [
      P("Usamos cookies essenciais (para o site funcionar), de desempenho (para entender o uso) e de marketing (para personalizar comunicação)."),
      P("Você pode recusar os cookies não essenciais no banner de consentimento ou nas configurações do navegador."),
    ],
  },
  "legal/acessibilidade": {
    section: "legal",
    slug: "acessibilidade",
    title: "Acessibilidade",
    updated: "2026-08-01",
    intro: "Nosso compromisso com um site utilizável por todas as pessoas.",
    blocks: [
      P("Trabalhamos para atender às diretrizes WCAG 2.2 nível AA: contraste adequado, navegação por teclado, textos alternativos em imagens e respeito à preferência de movimento reduzido."),
      P("Encontrou uma barreira? Escreva para acessibilidade@jurudolph.com.br e nos ajude a corrigir."),
    ],
  },
};

export function getContentPage(section: string, slug: string): ContentPage | undefined {
  return contentPages[`${section}/${slug}`];
}

export function getContentSection(key: string): ContentSection | undefined {
  return contentSections.find((s) => s.key === key);
}

export function slugsForSection(section: ContentPage["section"]): string[] {
  return Object.values(contentPages)
    .filter((p) => p.section === section)
    .map((p) => p.slug);
}
