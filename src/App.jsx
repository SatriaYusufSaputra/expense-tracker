import { useState, useEffect } from "react";

const formatRupiah = (num) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);

// Daftar kategori dengan emoji, label, dan warna badge
const CATEGORIES = [
  { id: "makanan",    label: "Makanan",     emoji: "🍜", bg: "bg-orange-100",  text: "text-orange-700" },
  { id: "transport",  label: "Transport",   emoji: "🚗", bg: "bg-blue-100",    text: "text-blue-700"   },
  { id: "belanja",    label: "Belanja",     emoji: "🛍️", bg: "bg-pink-100",    text: "text-pink-700"   },
  { id: "kesehatan",  label: "Kesehatan",   emoji: "💊", bg: "bg-red-100",     text: "text-red-700"    },
  { id: "tagihan",    label: "Tagihan",     emoji: "📄", bg: "bg-yellow-100",  text: "text-yellow-700" },
  { id: "hiburan",    label: "Hiburan",     emoji: "🎮", bg: "bg-purple-100",  text: "text-purple-700" },
  { id: "pendidikan", label: "Pendidikan",  emoji: "📚", bg: "bg-cyan-100",    text: "text-cyan-700"   },
  { id: "lainnya",    label: "Lainnya",     emoji: "📦", bg: "bg-gray-100",    text: "text-gray-600"   },
];

const getCat = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];

export default function App() {
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem("expenses");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [image, setImage] = useState(null);
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("makanan");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterCat, setFilterCat] = useState("semua"); // filter kategori di tabel

  const [adding, setAdding] = useState(false);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (!name || !amount || !date) return;
    setExpenses([{ id: Date.now(), name, amount: Number(amount), date, image, category }, ...expenses]);
    setName(""); setAmount(""); setDate(""); setImage(null); setCategory("makanan");
    setAdding(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const deleteExpense = (id) => setExpenses(expenses.filter((item) => item.id !== id));

  const total = expenses.reduce((acc, item) => acc + Number(item.amount), 0);

  // Filter: tanggal + kategori
  const filteredExpenses = expenses.filter((item) => {
    const inRange = (!startDate || !endDate) ? true : item.date >= startDate && item.date <= endDate;
    const inCat = filterCat === "semua" ? true : item.category === filterCat;
    return inRange && inCat;
  });

  const filteredTotal = filteredExpenses.reduce((acc, item) => acc + Number(item.amount), 0);
  const avgExpense = filteredExpenses.length ? filteredTotal / filteredExpenses.length : 0;

  // Ringkasan per kategori (dari semua data, bukan filter)
  const categoryBreakdown = CATEGORIES.map((cat) => ({
    ...cat,
    total: expenses.filter((e) => e.category === cat.id).reduce((acc, e) => acc + Number(e.amount), 0),
    count: expenses.filter((e) => e.category === cat.id).length,
  })).filter((c) => c.count > 0).sort((a, b) => b.total - a.total);

  const inputClass =
    "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-green-600 focus:bg-white transition placeholder-gray-300";

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-800 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Expense Tracker</h1>
              <p className="text-xs text-gray-400">Kelola pengeluaran harianmu</p>
            </div>
          </div>
          <button
            onClick={() => setAdding(!adding)}
            className="flex items-center gap-1.5 bg-green-800 hover:bg-green-900 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Tambah
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-800 rounded-2xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-300 mb-1">Total</p>
            <p className="text-lg font-bold text-white leading-tight">{formatRupiah(total)}</p>
            <p className="text-xs text-green-400 mt-0.5">{expenses.length} transaksi</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Filter</p>
            <p className="text-lg font-bold text-gray-800 leading-tight">{formatRupiah(filteredTotal)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{filteredExpenses.length} transaksi</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Rata-rata</p>
            <p className="text-lg font-bold text-gray-800 leading-tight">{formatRupiah(Math.round(avgExpense))}</p>
            <p className="text-xs text-gray-400 mt-0.5">per transaksi</p>
          </div>
        </div>

        {/* Category Breakdown */}
        {categoryBreakdown.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Pengeluaran per Kategori</p>
            <div className="flex flex-col gap-2.5">
              {categoryBreakdown.map((cat) => {
                const pct = total > 0 ? Math.round((cat.total / total) * 100) : 0;
                return (
                  <div key={cat.id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{cat.emoji}</span>
                        <span className="text-sm font-medium text-gray-700">{cat.label}</span>
                        <span className="text-xs text-gray-400">({cat.count}x)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{pct}%</span>
                        <span className="text-sm font-semibold text-gray-700">{formatRupiah(cat.total)}</span>
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

        {/* Add Form */}
        {adding && (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <h2 className="text-sm font-semibold text-gray-700">Tambah Pengeluaran</h2>
              <button onClick={() => setAdding(false)} className="text-xs font-semibold text-green-700 hover:text-green-900">
                Batal
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">

              {/* Nama + Jumlah */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Nama</label>
                  <input type="text" placeholder="cth. Makan siang" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Jumlah (Rp)</label>
                  <input type="number" placeholder="0" className={inputClass} value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
              </div>

              {/* Kategori Picker */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Kategori</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition
                        ${category === cat.id
                          ? `${cat.bg} ${cat.text} border-transparent ring-2 ring-offset-1 ring-green-600`
                          : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                        }`}
                    >
                      <span>{cat.emoji}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tanggal */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Tanggal</label>
                <input type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
              </div>

              {/* Upload Struk */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Struk / Foto (opsional)</label>
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-green-500 rounded-xl p-4 cursor-pointer transition bg-gray-50">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  {image ? (
                    <img src={image} alt="preview" className="h-16 rounded-lg object-cover" />
                  ) : (
                    <>
                      <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" viewBox="0 0 24 24">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <p className="text-xs text-gray-400">Klik untuk upload foto struk</p>
                    </>
                  )}
                </label>
              </div>

              <button
                onClick={addExpense}
                disabled={!name || !amount || !date}
                className="w-full bg-green-800 hover:bg-green-900 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition"
              >
                Simpan Pengeluaran
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          {/* Table Header: filter tanggal */}
          <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">Riwayat Pengeluaran</h2>
            <div className="flex items-center gap-2">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-green-600 text-gray-600" />
              <span className="text-gray-300 text-sm">—</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-green-600 text-gray-600" />
            </div>
          </div>

          {/* Filter Kategori Pills */}
          <div className="flex gap-2 px-5 py-3 overflow-x-auto border-b border-gray-50">
            <button
              onClick={() => setFilterCat("semua")}
              className={`shrink-0 px-3 py-1 rounded-lg text-xs font-semibold transition border
                ${filterCat === "semua"
                  ? "bg-green-800 text-white border-green-800"
                  : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"}`}
            >
              Semua
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCat(cat.id === filterCat ? "semua" : cat.id)}
                className={`shrink-0 flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition border
                  ${filterCat === cat.id
                    ? `${cat.bg} ${cat.text} border-transparent`
                    : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"}`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {filteredExpenses.length === 0 ? (
            <div className="py-12 flex flex-col items-center gap-2 text-gray-300">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="3" /><line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              <p className="text-sm">Belum ada pengeluaran{filterCat !== "semua" ? ` di kategori ini` : ""}.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left text-xs font-semibold uppercase tracking-wide text-gray-400 px-5 py-3">Tanggal</th>
                      <th className="text-left text-xs font-semibold uppercase tracking-wide text-gray-400 px-5 py-3">Keterangan</th>
                      <th className="text-left text-xs font-semibold uppercase tracking-wide text-gray-400 px-5 py-3">Kategori</th>
                      <th className="text-left text-xs font-semibold uppercase tracking-wide text-gray-400 px-5 py-3">Jumlah</th>
                      <th className="text-left text-xs font-semibold uppercase tracking-wide text-gray-400 px-5 py-3">Struk</th>
                      <th className="px-5 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map((item) => {
                      const cat = getCat(item.category);
                      return (
                        <tr key={item.id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                          <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">
                            {new Date(item.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </td>
                          <td className="px-5 py-3.5 text-sm font-medium text-gray-700">{item.name}</td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${cat.bg} ${cat.text}`}>
                              {cat.emoji} {cat.label}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-sm font-semibold text-green-700">{formatRupiah(item.amount)}</td>
                          <td className="px-5 py-3.5">
                            {item.image
                              ? <img src={item.image} alt="struk" className="w-11 h-9 object-cover rounded-lg border border-gray-100" />
                              : <span className="text-gray-200 text-sm">—</span>}
                          </td>
                          <td className="px-5 py-3.5">
                            <button onClick={() => deleteExpense(item.id)}
                              className="text-xs font-semibold text-gray-300 hover:text-red-500 hover:bg-red-50 px-2.5 py-1 rounded-lg transition">
                              Hapus
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
                <span className="text-xs text-gray-400">{filteredExpenses.length} transaksi ditampilkan</span>
                <span className="text-xs font-semibold text-green-700">Total: {formatRupiah(filteredTotal)}</span>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}