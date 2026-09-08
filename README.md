# JU RUDOLPH — deploy de teste

**Cópia congelada para aprovação.** É uma preview navegável do storefront (frontend)
para o cliente clicar e revisar **estrutura, navegação e fluxos**. Sobe no
**Vercel** só para este teste — o projeto de produção vai para a **AWS Amplify**.

> Tudo aqui é **mock**: sem backend, sem pagamento real. Backend (Medusa JS +
> Stripe/Bling), produtos reais e área de conta entram na **etapa 2**, no projeto
> principal. Alterações pedidas pelo cliente são portadas de volta manualmente —
> não editar direto aqui esperando que volte.

Referência de design: `ysl.com/pt-br`.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind v4** — tokens em `src/app/globals.css` (`@theme`)
- **Fixtures** no formato da Medusa v2 Store API (`src/lib/data/*`, `src/types/medusa.ts`)
- Imagens 100% locais em `public/media/ph/` (Unsplash, licença livre — ver
  `public/media/ph/CREDITS.md`). São placeholders.

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
npm run lint
```

## Subir no Vercel

Não precisa de nenhuma configuração nem variável de ambiente.

1. `git init && git add . && git commit -m "deploy de teste JU RUDOLPH"`
2. Criar um repositório no GitHub e dar `git push`.
3. Em vercel.com → **Add New… → Project** → importar o repositório.
   O Vercel detecta **Next.js** sozinho. Clicar em **Deploy**.

A preview já sai com `noindex` (não é listada em buscadores).

## O que dá para testar

- **Home** — hero com scroll empilhado (efeito da referência)
- **PLP** — `/mulher`, `/mulher/roupas`, `/mulher/roupas/vestidos`, `/mulher/bolsas`,
  `/highlights`, `/presentes` … com filtro (tamanho / cor / preço), ordenação,
  densidade da grade e "carregar mais"
- **PDP** — `/produtos/[handle]` (36 produtos) com troca de cor e tamanho,
  "adicionar à sacola", galeria com zoom
- **Sacola** — `/carrinho` + gaveta lateral
- **Checkout** — `/checkout` → entrega → pagamento → revisão → confirmação
  (fluxo completo, simulado)
- **Conteúdo** — A Marca, Serviços, Ajuda (guia de tamanhos, rastrear pedido),
  Lojas, Editorial, Legal, Cartão-presente

## Swap points (grep `SWAP POINT`)

| O quê | Onde |
|---|---|
| Wordmark placeholder → logo real | `src/components/ui/Logo.tsx` |
| Bodoni Moda → tipografia da marca | `src/app/layout.tsx`, `globals.css` |
| Imagens placeholder → fotos de campanha | `public/media/ph/` (manter os nomes) |
| Fixtures → Medusa ao vivo | `src/lib/medusa.ts`, `src/lib/data/*`, `src/types/medusa.ts` |
| Checkout simulado → Medusa + pagamento | `src/context/CheckoutProvider.tsx`, `src/app/(checkout)/*` |
| `typedRoutes` reativar | `next.config.ts` |
