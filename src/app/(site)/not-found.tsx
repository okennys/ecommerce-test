import Link from "next/link";

export default function SiteNotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-5 py-28 text-center">
      <p className="label text-ink-muted">Erro 404</p>
      <h1 className="font-display mt-3 text-[clamp(1.6rem,3vw,2.25rem)] font-medium">
        Página não encontrada
      </h1>
      <p className="mt-4 text-ink-muted">
        O endereço mudou ou a peça não está mais disponível.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="label flex h-[52px] items-center justify-center bg-black px-10 text-on-dark hover:bg-ink"
        >
          Ir para a home
        </Link>
        <Link
          href="/mulher"
          className="label flex h-[52px] items-center justify-center border border-ink px-10 hover:bg-ink hover:text-paper"
        >
          Ver a coleção
        </Link>
      </div>
    </div>
  );
}
