import { formatRupiah } from "../utils/format";
export default function StatCards({
  total,
  expenseCount,
  filteredTotal,
  filteredCount,
  avg,
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-green-800 rounded-2xl p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-green-300 mb-1">
          Total
        </p>
        <p className="text-lg font-bold text-white leading-tight">
          {formatRupiah(total)}
        </p>
        <p className="text-xs text-green-400 mt-0.5">
          {expenseCount} transaksi
        </p>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
          Filter
        </p>
        <p className="text-lg font-bold text-gray-800 leading-tight">
          {formatRupiah(filteredTotal)}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {filteredCount} transaksi
        </p>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
          Rata-rata
        </p>
        <p className="text-lg font-bold text-gray-800 leading-tight">
          {formatRupiah(Math.round(avg))}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">per transaksi</p>
      </div>
    </div>
  );
}
