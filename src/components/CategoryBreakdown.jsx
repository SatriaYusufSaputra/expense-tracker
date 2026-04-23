import { formatRupiah } from "../utils/format";

export default function CategoryBreakdown({ breakdown, total }) {
  if (breakdown.length === 0) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
        Pengeluaran per Kategori
      </p>
      <div className="flex flex-col gap-2.5">
        {breakdown.map((cat) => {
          const pct = total > 0 ? Math.round((cat.total / total) * 100) : 0;
          return (
            <div key={cat.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{cat.emoji}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {cat.label}
                  </span>
                  <span className="text-xs text-gray-400">({cat.count}x)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{pct}%</span>
                  <span className="text-sm font-semibold text-gray-700">
                    {formatRupiah(cat.total)}
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-700 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
