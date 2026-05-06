import { useState } from "react";
import { CATEGORIES, getCat } from "../constants/categories";
import { formatRupiah } from "../utils/format";


export default function ExpenseTable({
  filteredExpenses,
  filteredTotal,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  filterCat,
  setFilterCat,
  onEdit,
  onDelete,
}) {
  const [preview, setPreview] = useState(null);
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      {/* Table Header: filter tanggal */}
      <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-4 border-b border-gray-50">
        <h2 className="text-sm font-semibold text-gray-700">
          Riwayat Pengeluaran
        </h2>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-green-600 text-gray-600"
          />
          <span className="text-gray-300 text-sm">—</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-green-600 text-gray-600"
          />
        </div>
      </div>

      {/* Filter Kategori Pills */}
      <div className="flex gap-2 px-5 py-3 overflow-x-auto border-b border-gray-50">
        <button
          onClick={() => setFilterCat("semua")}
          className={`shrink-0 px-3 py-1 rounded-lg text-xs font-semibold transition border
                ${
                  filterCat === "semua"
                    ? "bg-green-800 text-white border-green-800"
                    : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                }`}
        >
          Semua
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() =>
              setFilterCat(cat.id === filterCat ? "semua" : cat.id)
            }
            className={`shrink-0 flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition border
                  ${
                    filterCat === cat.id
                      ? `${cat.bg} ${cat.text} border-transparent`
                      : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                  }`}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="py-12 flex flex-col items-center gap-2 text-gray-300">
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            viewBox="0 0 24 24"
          >
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <p className="text-sm">
            Belum ada pengeluaran
            {filterCat !== "semua" ? ` di kategori ini` : ""}.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left text-xs font-semibold uppercase tracking-wide text-gray-400 px-5 py-3">
                    Tanggal
                  </th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wide text-gray-400 px-5 py-3">
                    Keterangan
                  </th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wide text-gray-400 px-5 py-3">
                    Kategori
                  </th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wide text-gray-400 px-5 py-3">
                    Jumlah
                  </th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wide text-gray-400 px-5 py-3">
                    Struk
                  </th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((item) => {
                  const cat = getCat(item.category);
                  return (
                    <tr
                      key={item.id}
                      className="border-t border-gray-50 hover:bg-gray-50 transition"
                    >
                      <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(item.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-medium text-gray-700">
                        {item.name}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${cat.bg} ${cat.text}`}
                        >
                          {cat.emoji} {cat.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-green-700">
                        {formatRupiah(item.amount)}
                      </td>
                      <td className="px-5 py-3.5">
                        {item.image ? (
                          <img
                            src={item.image}
                            onClick={() => setPreview(item.image)}
                            className="w-11 h-9 object-cover rounded-lg cursor-pointer hover:scale-105 transition"
                            title="Klik untuk lihat"
                          />
                        ) : (
                          <span className="text-gray-200">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 flex items-center gap-2">
                        <button
                          onClick={() => onEdit(item)}
                          className="text-xs font-semibold text-gray-400 hover:text-blue-500 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="text-xs font-semibold text-gray-300 hover:text-red-500 hover:bg-red-50 px-2.5 py-1 rounded-lg transition"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {preview && (
              <div
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
                onClick={() => setPreview(null)}
              >
                <div
                  className="max-w-md w-full p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={preview}
                    className="w-full max-h-[80vh] object-contain rounded-xl shadow-xl"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              {filteredExpenses.length} transaksi ditampilkan
            </span>
            <span className="text-xs font-semibold text-green-700">
              Total: {formatRupiah(filteredTotal)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
