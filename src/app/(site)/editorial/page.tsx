import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { articles } from "@/lib/data/editorial";
import { ph } from "@/lib/data/media";

export const metadata: Metadata = {
  title: "Editorial",
  description: "Bastidores, coleção e serviço — as histórias da JU RUDOLPH.",
};

export default function EditorialPage() {
  const [lead, ...rest] = articles;

  return (
    <div className="px-5 py-12 lg:px-gutter">
      <h1 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-medium">Editorial</h1>

      <Link href={`/editorial/${lead.slug}`} className="group mt-10 block">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-paper-raised">
          <Image
            src={ph(lead.hero)}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </div>
        <p className="label mt-4 text-ink-muted">{lead.kicker}</p>
        <h2 className="font-display mt-1 text-2xl font-medium">{lead.title}</h2>
        <p className="mt-2 max-w-2xl text-ink-muted">{lead.dek}</p>
      </Link>

      <ul className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((a) => (
          <li key={a.slug}>
            <Link href={`/editorial/${a.slug}`} className="group block">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-raised">
                <Image
                  src={ph(a.hero)}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>
              <p className="label mt-4 text-ink-muted">{a.kicker}</p>
              <h3 className="font-display mt-1 text-lg font-medium">{a.title}</h3>
              <p className="mt-2 text-ink-muted">{a.dek}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
