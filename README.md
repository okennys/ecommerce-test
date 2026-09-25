# JU RUDOLPH — deploy de teste

**Cópia congelada para aprovação.** É uma preview navegável do storefront
(frontend) para o cliente clicar e revisar **estrutura, navegação e fluxos**.
Sobe no **Vercel** só para este teste — o projeto de produção vai para a
**AWS Amplify**.

> Sem backend e sem pagamento real. Backend (Medusa JS + Stripe/Bling), estoque
> ao vivo e área de conta entram na **etapa 2**, no projeto principal. Alterações
> pedidas pelo cliente são portadas de volta manualmente — não editar direto
> aqui esperando que volte.

Referência de design: `ysl.com/pt-br`.

## O catálogo é real

São **38 produtos** — exatamente os que estão no ar hoje no site da marca, de
acordo com o `products.csv` exportado da plataforma dela. Nome, preço, SKU,
descrição, tamanhos, cores e fotos são os de verdade (532 fotos, ~28 MB em
`public/media/produtos/`).

Quando a lista mudar, basta reexportar o CSV e rodar o ingestor no projeto
principal — categorias sem produto somem sozinhas do menu.

O que ainda é placeholder: as imagens de campanha em `public/media/ph/` (ver
`CREDITS.md` lá) e o wordmark.

**Estoque não está modelado** — todo tamanho aparece como disponível. Entra na
etapa 2, junto com a Medusa.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind v4** — tokens em `src/app/globals.css` (`@theme`)
- Dados no formato da Medusa v2 Store API (`src/lib/data/*`, `src/types/medusa.ts`)

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## Subir no Vercel

Não precisa de configuração nem variável de ambiente. O projeto já está ligado a
este repositório — **cada push na `main` gera um deploy novo**. A preview sai com
`noindex`.

## O que dá para testar

- **Home** — hero com scroll empilhado, dois painéis de categoria e os trilhos
  de Novidades e Ícones
- **PLP** — `/mulher`, `/mulher/vestidos`, `/mulher/blusas`, `/mulher/calcas`,
  `/sale`, `/highlights`, `/presentes` … com filtro (tamanho / cor / preço),
  ordenação, densidade da grade e "carregar mais"
- **PDP** — `/produtos/[handle]` com troca de cor e tamanho, "adicionar à
  sacola" e galeria com zoom
- **Sale** — preço riscado e selo de desconto no card e na página do produto
- **Sacola** — `/carrinho` + gaveta lateral
- **Checkout** — `/checkout` → entrega → pagamento → revisão → confirmação
  (fluxo completo, simulado)
- **Conteúdo** — A Marca, Serviços, Ajuda (guia de tamanhos, rastrear pedido),
  Lojas, Legal, Cartão-presente

## Categorias

Vestidos · Blusas e camisas · Conjuntos · Calças · Saias · Casacos e jaquetas ·
Macacões

A árvore é montada a partir dos produtos: só aparece categoria que tem peça.

## Enquadramento das fotos

O ensaio mistura três proporções — 4:5 (still no fundo claro), 2:3 (modelo) e
9:16 (frame de vídeo). Cada tela lida com isso de um jeito: o PDP mostra cada
foto na proporção original, a grade mantém 4:5 ancorando no topo (o corte pega a
barra, nunca o rosto) e os painéis da home são 2:3, que é a proporção das fotos
de modelo.

## Swap points (grep `SWAP POINT`)

| O quê | Onde |
|---|---|
| Wordmark placeholder → logo real | `src/components/ui/Logo.tsx` |
| Bodoni Moda → tipografia da marca | `src/app/layout.tsx`, `globals.css` |
| Imagens de campanha → fotos reais | `public/media/ph/` (manter os nomes) |
| Fixtures → Medusa ao vivo | `src/lib/medusa.ts`, `src/lib/data/*`, `src/types/medusa.ts` |
| Checkout simulado → Medusa + pagamento | `src/context/CheckoutProvider.tsx`, `src/app/(checkout)/*` |
| `typedRoutes` reativar | `next.config.ts` |
