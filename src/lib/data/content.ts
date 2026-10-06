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
  /** Banner paths under /public — desktop wide cut and phone cut. */
  image?: string;
  imageMobile?: string;
  links: { label: string; href: string }[];
}

export const contentSections: ContentSection[] = [
  {
    key: "a-marca",
    title: "A Marca",
    intro: "Uma casa de moda autoral brasileira, feita à mão em São Paulo.",
    image: "/media/marca/a-marca-desktop.jpg",
    imageMobile: "/media/marca/a-marca-mobile.jpg",
    links: [
      { label: "Nossa história", href: "/a-marca/historia" },
      { label: "Sustentabilidade", href: "/a-marca/sustentabilidade" },
      { label: "Trabalhe conosco", href: "/a-marca/carreiras" },
      { label: "Imprensa", href: "/a-marca/imprensa" },
      { label: "Contato", href: "/contato" },
    ],
  },
  {
    key: "servicos",
    title: "Serviços",
    intro: "Do provador ao pós-venda — o cuidado JU RUDOLPH com cada peça.",
    image: "/media/marca/servicos-desktop.jpg",
    imageMobile: "/media/marca/servicos-mobile.jpg",
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
      { label: "Formas de pagamento", href: "/ajuda/pagamentos" },
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

import { brand, fullAddress } from "./brand";

const P = (text: string): ContentBlock => ({ type: "p", text });
const H = (text: string): ContentBlock => ({ type: "h", text });

export const contentPages: Record<string, ContentPage> = {
  // ---------------------------------------------------------------- A MARCA
  "a-marca/historia": {
    section: "a-marca",
    slug: "historia",
    title: "Nossa história",
    intro: "A Ju Rudolph Brand foi fundada em 2021 pela empresária Juliane Rudolph.",
    blocks: [
      P("A inspiração veio dos anos em que trabalhou como modelo e da lembrança da infância em meio às máquinas de costura da família."),
      P("Com a crise social e econômica da pandemia, teve a ideia de criar as próprias roupas e abrir um e-commerce. Antes disso já era empreendedora — fundadora de uma startup, com jornadas de catorze horas — e, pela primeira vez, tinha tempo."),
      P("Começou testando o mercado on-line com multimarcas, e a experiência deu certo. No mesmo período estudou alta-costura e níveis de matéria-prima para entender o que realmente queria fazer. Decidiu criar peças no seu estilo atemporal."),
      H("Alfaiataria moderna"),
      P("Sempre foi apaixonada por alfaiataria moderna — looks que funcionam do tênis à bota, passando por todos os modelos de sapato, deixando a produção mais formal ou mais descolada conforme o dia."),
      P("Acredita na moda inteligente: peças que atravessam anos sem sair do conceito e sem temporada para serem usadas. Looks funcionais no seu closet."),
      H("Tecido e acabamento"),
      P("Tecidos de alta qualidade e acabamentos impecáveis, para que a sofisticação deixe a identidade na roupa e em quem a veste. A Ju é detalhista da criação do look até a experiência de compra."),
      P("Hoje viaja pelo mundo para trazer novidades e tendências em primeira mão, frequentando lugares do mais alto padrão e elaborando produtos de alto luxo."),
      P("Queremos que vocês tenham peças exclusivas, com a essência da mulher elegante e empoderada na sua feminilidade — o clássico e o atual juntos num só look."),
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
        "Lãs e tricôs de fornecedores com certificação de bem-estar animal.",
        "Denim de lavanderias que reaproveitam a água do processo.",
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
      P("As vagas abertas serão publicadas nesta página."),
      P(`Envie currículo e portfólio para ${brand.email} com o nome da vaga no assunto.`),
    ],
  },
  "a-marca/imprensa": {
    section: "a-marca",
    slug: "imprensa",
    title: "Imprensa",
    intro: "Materiais e contato para veículos de imprensa e criadores de conteúdo.",
    blocks: [
      P(`Para solicitações de imagens em alta resolução, empréstimo de peças e entrevistas, escreva para ${brand.email}.`),
      H("Kit de imprensa"),
      P("O kit da coleção (lookbook, ficha técnica e fotos de campanha) estará disponível para download nesta página."),
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
    intro: "Conserto, ajuste e limpeza especializada — para toda a vida da peça.",
    blocks: [
      H("Alfaiataria"),
      P("Ajustes de barra, cintura e mangas são gratuitos na primeira semana e têm preço de custo depois disso, para sempre."),
      H("Lurex, paetê e tricô"),
      P("Reparo de fios puxados, troca de zíper e reforço de alças em qualquer loja JU RUDOLPH."),
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
    intro: `Compre com uma personal shopper pelo WhatsApp. ${brand.hours}.`,
    blocks: [
      { type: "list", items: [
        `WhatsApp: ${brand.phoneDisplay}`,
        `E-mail: ${brand.email}`,
        fullAddress,
      ] },
      { type: "faq", items: [
        { q: "Qual o prazo de resposta?", a: "Até um dia útil, no horário de atendimento." },
        { q: "Dá para comprar com atendimento pessoal?", a: "Sim — chame no WhatsApp e uma personal shopper acompanha a escolha das peças." },
      ] },
    ],
  },
  "ajuda/envio": {
    section: "ajuda",
    slug: "envio",
    title: "Envio e prazos",
    intro: "Enviamos para todo o Brasil, em até 7 dias úteis após a confirmação do pagamento.",
    blocks: [
      P("Todos os produtos são enviados de acordo com o método escolhido por você, em até 7 dias úteis após a confirmação do pagamento."),
      P("O prazo de entrega varia conforme a forma de envio escolhida e fica a cargo dos Correios ou da transportadora selecionada."),
      H("Rastreamento"),
      P("Assim que o pedido é postado, você recebe o código de rastreio. Também dá para acompanhar em “Rastrear pedido”."),
      { type: "faq", items: [
        { q: "O prazo conta a partir de quando?", a: "Da confirmação do pagamento." },
        { q: "Vocês entregam no exterior?", a: "Ainda não — por enquanto só Brasil." },
      ] },
    ],
  },
  "ajuda/pagamentos": {
    section: "ajuda",
    slug: "pagamentos",
    title: "Formas de pagamento",
    intro: "Crédito em até 5x sem juros. À vista, 5% de desconto.",
    blocks: [
      P("Trabalhamos com diferentes formas de pagamento. Depois de completar a compra, você escolhe a que preferir — as instruções seguintes aparecem conforme o método escolhido."),
      { type: "list", items: [
        "Cartão de crédito em até 5x sem juros.",
        "À vista, com 5% de desconto.",
      ] },
      P("A finalização acontece em ambiente seguro e nenhum dado de cartão fica armazenado conosco."),
    ],
  },
  "ajuda/trocas": {
    section: "ajuda",
    slug: "trocas",
    title: "Trocas e devoluções",
    intro: "A primeira troca é grátis, em até 30 dias corridos após a compra.",
    blocks: [
      H("Troca"),
      P("Você pode fazer a 1ª troca grátis pelo site em até 30 dias corridos após a compra, pelo mesmo produto ou por similares no valor que pagou."),
      H("Devolução"),
      P("Em até 7 dias corridos após o recebimento, a desistência da compra gera o cancelamento do pagamento e a devolução do crédito pelo mesmo meio usado na compra."),
      P("Passado esse prazo, o crédito fica à sua disposição para usar em compras futuras."),
      H("Condições"),
      P("A peça deve estar sem uso, com etiquetas e na embalagem original. Peças de alfaiataria já ajustadas não têm troca, apenas conserto."),
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
    intro: "Como tratamos os seus dados pessoais.",
    blocks: [
      P("Nos comprometemos a preservar os dados de todos os clientes. Informações importantes como senha e CPF são criptografadas no momento do cadastro, antes de serem salvas."),
      P("A finalização da sua compra é realizada em ambiente seguro, e nenhuma informação relacionada a cartões de crédito ou contas bancárias é armazenada em nossos bancos de dados."),
      P("Os dados cadastrais dos clientes não são vendidos, trocados ou divulgados a terceiros, exceto quando necessários para o processo de entrega, para cobrança ou para a participação em promoções solicitadas por você."),
      H("Cookies"),
      P("Nosso site usa cookies e informações da sua navegação para entender o perfil de quem visita o site e aperfeiçoar serviços, produtos e conteúdos. Essas informações são registradas automaticamente e mantidas em sigilo."),
      H("Seus direitos"),
      P(`Você pode pedir acesso, correção ou exclusão dos seus dados a qualquer momento pelo e-mail ${brand.email}.`),
      P("Qualquer alteração nesta política será informada nesta página."),
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
      P(`Encontrou uma barreira? Escreva para ${brand.email} e nos ajude a corrigir.`),
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
