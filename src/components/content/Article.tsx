import Image from "next/image";
import { ph } from "@/lib/data/media";
import type { ArticleBlock } from "@/lib/data/editorial";

export function Article({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-5 py-14 leading-relaxed lg:py-20">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h":
            return (
              <h2 key={i} className="font-display pt-6 text-xl font-medium">
                {block.text}
              </h2>
            );
          case "p":
            return (
              <p key={i} className="text-[15px] leading-[1.75]">
                {block.text}
              </p>
            );
          case "quote":
            return (
              <blockquote key={i} className="border-l border-ink py-2 pl-6">
                <p className="font-display text-xl leading-snug">“{block.text}”</p>
                {block.by && <cite className="label mt-3 block not-italic text-ink-muted">{block.by}</cite>}
              </blockquote>
            );
          case "image":
            return (
              <figure key={i} className="-mx-5 my-10 sm:mx-0">
                <div className="relative aspect-[4/3] w-full bg-paper-raised">
                  <Image src={ph(block.src)} alt={block.alt} fill sizes="(min-width:768px) 42rem, 100vw" className="object-cover" />
                </div>
                {block.caption && (
                  <figcaption className="label mt-2 px-5 text-ink-muted sm:px-0">{block.caption}</figcaption>
                )}
              </figure>
            );
        }
      })}
    </div>
  );
}
