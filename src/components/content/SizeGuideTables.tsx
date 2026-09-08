const CLOTHING = {
  head: ["Tamanho", "Busto (cm)", "Cintura (cm)", "Quadril (cm)", "BR"],
  rows: [
    ["PP", "78–82", "60–64", "86–90", "34"],
    ["P", "83–87", "65–69", "91–95", "36"],
    ["M", "88–93", "70–75", "96–101", "38–40"],
    ["G", "94–99", "76–81", "102–107", "42"],
    ["GG", "100–106", "82–88", "108–114", "44–46"],
  ],
};

const SHOES = {
  head: ["BR", "Comprimento do pé (cm)", "EU", "US"],
  rows: [
    ["34", "22,0", "35", "5"],
    ["35", "22,8", "36", "6"],
    ["36", "23,5", "37", "7"],
    ["37", "24,3", "38", "8"],
    ["38", "25,0", "39", "9"],
    ["39", "25,8", "40", "10"],
  ],
};

function Table({ data }: { data: { head: string[]; rows: string[][] } }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] border-collapse text-left">
        <thead>
          <tr className="border-b border-ink">
            {data.head.map((h) => (
              <th key={h} className="label py-3 pr-4 font-normal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row) => (
            <tr key={row[0]} className="border-b border-line">
              {row.map((cell, i) => (
                <td key={i} className={i === 0 ? "label py-3 pr-4" : "py-3 pr-4 text-ink-muted"}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SizeGuideTables() {
  return (
    <div className="space-y-12">
      <section>
        <h2 className="label-lg mb-4">Roupas</h2>
        <Table data={CLOTHING} />
      </section>
      <section>
        <h2 className="label-lg mb-4">Sapatos</h2>
        <Table data={SHOES} />
      </section>
      <section>
        <h2 className="label-lg mb-4">Como medir</h2>
        <ul className="max-w-2xl list-disc space-y-1.5 pl-5 leading-relaxed marker:text-ink-muted">
          <li>Busto: na parte mais larga, com a fita paralela ao chão.</li>
          <li>Cintura: na parte mais fina do tronco, geralmente acima do umbigo.</li>
          <li>Quadril: na parte mais larga, com os pés juntos.</li>
          <li>Pé: em pé, sobre uma folha, marque do calcanhar à ponta do dedo maior.</li>
        </ul>
        <p className="mt-4 text-ink-muted">
          Na dúvida entre dois tamanhos, escolha o maior — a alfaiataria pode ser ajustada sem custo
          na primeira semana.
        </p>
      </section>
    </div>
  );
}
