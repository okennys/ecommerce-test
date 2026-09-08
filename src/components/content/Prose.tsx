import type { ContentBlock } from "@/lib/data/content";

export function Prose({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="max-w-2xl space-y-5 leading-relaxed">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h":
            return (
              <h2 key={i} className="label-lg pt-4">
                {block.text}
              </h2>
            );
          case "p":
            return <p key={i}>{block.text}</p>;
          case "list":
            return (
              <ul key={i} className="list-disc space-y-1.5 pl-5 marker:text-ink-muted">
                {block.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            );
          case "faq":
            return (
              <dl key={i} className="divide-y divide-line border-y border-line">
                {block.items.map((qa, j) => (
                  <div key={j} className="py-4">
                    <dt className="label-lg">{qa.q}</dt>
                    <dd className="mt-1.5 text-ink-muted">{qa.a}</dd>
                  </div>
                ))}
              </dl>
            );
        }
      })}
    </div>
  );
}
