import { useState } from "react";
import { formatRupiah } from "../utils/format";
import { CATEGORIES } from "../constants/categories";

function getDaysLeft(dueDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
}

export default function Dashboard({
  expenses = [],
  wallets = [],
  payLaters = [],
  onNavigate,
}) {
  const [showBalance, setShowBalance] = useState(false);

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0",
  )}`;

  // Hitung pemasukan & pengeluaran bulan ini
  const thisMonthExpenses = expenses.filter((e) =>
    e.date?.startsWith(thisMonth),
  );

  const totalIncome = thisMonthExpenses
    .filter((e) => e.type === "income")
    .reduce((acc, e) => acc + Number(e.amount || 0), 0);

  const totalExpense = thisMonthExpenses
    .filter((e) => e.type === "expense" || !e.type)
    .reduce((acc, e) => acc + Number(e.amount || 0), 0);

  // Total saldo semua wallet
  const totalSaldo = wallets.reduce(
    (acc, w) => acc + Number(w.balance || 0),
    0,
  );

  // Alert paylater — tagihan yang <= 7 hari lagi atau overdue
  const urgentItems = payLaters
    .flatMap((pl) =>
      (pl.items || [])
        .filter((item) => !item.isPaid && getDaysLeft(item.dueDate) <= 7)
        .map((item) => ({
          ...item,
          payLaterName: pl.name,
          payLaterIcon: pl.icon,
        })),
    )
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  // 5 transaksi terakhir
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-5">
      {/* ── Total Saldo ── */}
      <div className="bg-green-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-300">
            Total Saldo
          </p>

          <button
            onClick={() => setShowBalance(!showBalance)}
            className="text-green-300 hover:text-white transition"
          >
            {showBalance ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                viewBox="0 0 24 24"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                viewBox="0 0 24 24"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            )}
          </button>
        </div>

        <p className="text-3xl font-bold text-white">
          {showBalance ? formatRupiah(totalSaldo) : "Rp ••••••••"}
        </p>

        <p className="text-xs text-green-400 mt-1">
          {wallets.length} wallet aktif
        </p>

        {/* Mini wallet list */}
        {wallets.length > 0 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {wallets.map((w) => (
              <div
                key={w._id}
                className="shrink-0 bg-white/10 rounded-xl px-3 py-2 flex items-center gap-2"
              >
                <span className="text-sm">{w.icon}</span>

                <div>
                  <p className="text-xs text-green-200 font-medium">{w.name}</p>

                  <p className="text-xs font-bold text-white">
                    {showBalance ? formatRupiah(w.balance || 0) : "••••••"}
                  </p>
                </div>
              </div>
            ))}

            <button
              onClick={() => onNavigate("wallet")}
              className="shrink-0 bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2 text-xs text-green-200 font-semibold transition"
            >
              Kelola →
            </button>
          </div>
        )}

        {wallets.length === 0 && (
          <button
            onClick={() => onNavigate("wallet")}
            className="mt-3 text-xs text-green-300 hover:text-white underline"
          >
            + Tambah wallet
          </button>
        )}
      </div>

      {/* ── Pemasukan vs Pengeluaran ── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-gray-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 text-green-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                viewBox="0 0 24 24"
              >
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </div>

            <p className="text-xs font-semibold text-gray-400">Pemasukan</p>
          </div>

          <p className="text-lg font-bold text-green-700">
            {formatRupiah(totalIncome)}
          </p>

          <p className="text-xs text-gray-400 mt-0.5">bulan ini</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 text-red-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                viewBox="0 0 24 24"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
            </div>

            <p className="text-xs font-semibold text-gray-400">Pengeluaran</p>
          </div>

          <p className="text-lg font-bold text-red-500">
            {formatRupiah(totalExpense)}
          </p>

          <p className="text-xs text-gray-400 mt-0.5">bulan ini</p>
        </div>
      </div>

      {/* ── Alert PayLater ── */}
      {urgentItems.length > 0 && (
        <div className="bg-white border border-red-100 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-red-50 bg-red-50">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-red-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                viewBox="0 0 24 24"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>

              <p className="text-xs font-bold text-red-600">
                Tagihan Mendekati Jatuh Tempo
              </p>
            </div>

            <button
              onClick={() => onNavigate("paylater")}
              className="text-xs font-semibold text-red-500 hover:text-red-700"
            >
              Lihat Semua →
            </button>
          </div>

          <div className="flex flex-col">
            {urgentItems.slice(0, 3).map((item, i) => {
              const days = getDaysLeft(item.dueDate);

              return (
                <div
                  key={i}
                  className="flex items-center justify-between px-5 py-3 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{item.payLaterIcon}</span>

                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {item.name}
                      </p>

                      <p className="text-xs text-gray-400">
                        {item.payLaterName}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-red-500">
                      {formatRupiah(item.amount)}
                    </p>

                    <p
                      className={`text-xs font-semibold ${
                        days < 0
                          ? "text-red-600"
                          : days <= 3
                            ? "text-red-500"
                            : "text-amber-500"
                      }`}
                    >
                      {days < 0
                        ? `Terlambat ${Math.abs(days)} hari`
                        : days === 0
                          ? "Hari ini!"
                          : `${days} hari lagi`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Transaksi Terakhir ── */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 className="text-sm font-semibold text-gray-700">
            Transaksi Terakhir
          </h2>

          <button
            onClick={() => onNavigate("transaksi")}
            className="text-xs font-semibold text-green-700 hover:text-green-900"
          >
            Lihat Semua →
          </button>
        </div>

        {recentExpenses.length === 0 ? (
          <div className="py-8 text-center text-gray-300 text-sm">
            Belum ada transaksi
          </div>
        ) : (
          <div className="flex flex-col">
            {recentExpenses.map((item) => {
              const cat = CATEGORIES.find((c) => c.id === item.category);
              const wallet = wallets.find((w) => w._id === item.walletId);
              const isIncome = item.type === "income";
              const isTransfer = item.type === "transfer";

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-5 py-3 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
                        isIncome
                          ? "bg-green-50"
                          : isTransfer
                            ? "bg-blue-50"
                            : "bg-gray-50"
                      }`}
                    >
                      {isTransfer ? "↔️" : cat ? cat.emoji : "📦"}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {item.name}
                      </p>

                      <div className="flex items-center gap-1.5 mt-0.5">
                        <p className="text-xs text-gray-400">
                          {new Date(item.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>

                        {wallet && (
                          <>
                            <span className="text-gray-200">·</span>
                            <p className="text-xs text-gray-400">
                              {wallet.icon} {wallet.name}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <p
                    className={`text-sm font-bold ${
                      isIncome
                        ? "text-green-600"
                        : isTransfer
                          ? "text-blue-500"
                          : "text-red-500"
                    }`}
                  >
                    {isIncome ? "+" : isTransfer ? "" : "-"}
                    {formatRupiah(item.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Ringkasan Kategori ── */}
      {thisMonthExpenses.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">
              Pengeluaran per Kategori
            </h2>

            <button
              onClick={() => onNavigate("grafik")}
              className="text-xs font-semibold text-green-700 hover:text-green-900"
            >
              Grafik →
            </button>
          </div>

          <div className="p-5 flex flex-col gap-3">
            {CATEGORIES.map((cat) => {
              const total = thisMonthExpenses
                .filter(
                  (e) =>
                    e.category === cat.id && (e.type === "expense" || !e.type),
                )
                .reduce((acc, e) => acc + Number(e.amount || 0), 0);

              if (total === 0) return null;

              const pct =
                totalExpense > 0 ? Math.round((total / totalExpense) * 100) : 0;

              return (
                <div key={cat.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{cat.emoji}</span>

                      <span className="text-xs font-medium text-gray-600">
                        {cat.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{pct}%</span>

                      <span className="text-xs font-semibold text-gray-700">
                        {formatRupiah(total)}
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
      )}
    </div>
  );
}
