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

São **95 produtos** da JU RUDOLPH, com nome, preço, SKU, descrição, tamanhos,
cores e fotos vindos do site atual da marca. As fotos ficam em
`public/media/produtos/` (821 arquivos, ~39 MB).

O que ainda é placeholder: as imagens de campanha/editorial em
`public/media/ph/` (ver `CREDITS.md` lá) e o wordmark.

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
npm run build    # build de produção
npm run lint
```

## Subir no Vercel

Não precisa de nenhuma configuração nem variável de ambiente. O projeto já está
ligado a este repositório — **cada push na `main` gera um deploy novo**.

A preview sai com `noindex` (não é listada em buscadores).

## O que dá para testar

- **Home** — hero com scroll empilhado, dois painéis de categoria e os trilhos
  de Novidades e Ícones
- **PLP** — `/mulher`, `/mulher/vestidos`, `/mulher/blusas`, `/mulher/denim`,
  `/mulher/joias`, `/sale`, `/highlights`, `/presentes` … com filtro
  (tamanho / cor / preço), ordenação, densidade da grade e "carregar mais"
- **PDP** — `/produtos/[handle]` (95 produtos) com troca de cor e tamanho,
  "adicionar à sacola", galeria com zoom
- **Sale** — preço riscado e selo de desconto no card e na página do produto
- **Sacola** — `/carrinho` + gaveta lateral
- **Checkout** — `/checkout` → entrega → pagamento → revisão → confirmação
  (fluxo completo, simulado)
- **Conteúdo** — A Marca, Serviços, Ajuda (guia de tamanhos, rastrear pedido),
  Lojas, Legal, Cartão-presente

## Categorias

Vestidos · Blusas e camisas · Conjuntos · Calças · Denim · Saias ·
Casacos e jaquetas · Macacões · Joias

Só isso — a marca não vende bolsas, sapatos nem acessórios além de joias.

## Swap points (grep `SWAP POINT`)

| O quê | Onde |
|---|---|
| Wordmark placeholder → logo real | `src/components/ui/Logo.tsx` |
| Bodoni Moda → tipografia da marca | `src/app/layout.tsx`, `globals.css` |
| Imagens de campanha → fotos reais | `public/media/ph/` (manter os nomes) |
| Fixtures → Medusa ao vivo | `src/lib/medusa.ts`, `src/lib/data/*`, `src/types/medusa.ts` |
| Checkout simulado → Medusa + pagamento | `src/context/CheckoutProvider.tsx`, `src/app/(checkout)/*` |
| `typedRoutes` reativar | `next.config.ts` |
