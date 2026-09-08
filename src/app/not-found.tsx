import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] flex-col items-center justify-center gap-6 px-5 pt-header text-center">
      <p className="label text-ink-muted">Erro 404</p>
      <h1 className="font-display text-[clamp(2rem,6vw,4rem)] font-medium leading-tight">
        Página não encontrada
      </h1>
      <p className="label max-w-sm text-ink-muted">
        Esta seção ainda está sendo construída ou o endereço mudou.
      </p>
      <ButtonLink href="/" variant="outline" className="mt-2">
        Voltar ao início
      </ButtonLink>
    </section>
  );
}
