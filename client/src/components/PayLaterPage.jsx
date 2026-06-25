import { useState } from "react";
import {
  createPayLater,
  deletePayLater,
  fetchPayLaterItems,
  createPayLaterItem,
  markAsPaid,
  deletePayLaterItem,
} from "../utils/payLaterService";
import { formatRupiah } from "../utils/format";
import PayWalletModal from "./PayWalletModal";

// Hitung sisa hari
function getDaysLeft(dueDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  return diff;
}

function DueBadge({ dueDate }) {
  const days = getDaysLeft(dueDate);

  if (days < 0) {
    return (
      <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-red-100 text-red-600">
        Terlambat {Math.abs(days)} hari
      </span>
    );
  }

  if (days <= 3) {
    return (
      <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-red-50 text-red-500">
        {days} hari lagi ⚠️
      </span>
    );
  }

  if (days <= 7) {
    return (
      <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-amber-50 text-amber-600">
        {days} hari lagi
      </span>
    );
  }

  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-gray-100 text-gray-500">
      {days} hari lagi
    </span>
  );
}

function PayLaterCard({ payLater, onDelete, wallets, onWalletsUpdate }) {
  const [items, setItems] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [payingItem, setPayingItem] = useState(null); // item yang sedang mau dibayar

  const handlePaid = async (itemId, walletId) => {
    const result = await markAsPaid(itemId, walletId);
    if (result.message && !result.isPaid) {
      alert(result.message);
      return;
    }
    setItems(items.map((i) => (i._id === itemId ? result : i)));
    setPayingItem(null);
    // Refresh wallets
    if (onWalletsUpdate) onWalletsUpdate();
  };

  const loadItems = async () => {
    try {
      const data = await fetchPayLaterItems(payLater._id);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert("Gagal memuat tagihan");
    }
  };

  const handleExpand = async () => {
    if (!expanded) {
      await loadItems();
    }

    setExpanded(!expanded);
  };

  const handleAddItem = async () => {
    if (!name || !amount || !dueDate) return;

    setLoading(true);

    try {
      const created = await createPayLaterItem(payLater._id, {
        name,
        amount: Number(amount),
        dueDate,
      });

      setItems((prev) => [...prev, created]);

      setName("");
      setAmount("");
      setDueDate("");
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan tagihan");
    } finally {
      setLoading(false);
    }
  };



  const handleDeleteItem = async (itemId) => {
    try {
      await deletePayLaterItem(itemId);
      setItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus tagihan");
    }
  };

  const activeItems = items.filter((item) => !item.isPaid);
  const paidItems = items.filter((item) => item.isPaid);

  const totalTagihan = activeItems.reduce(
    (acc, item) => acc + Number(item.amount || 0),
    0,
  );

  const inputClass =
    "w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-green-600 focus:bg-white transition placeholder-gray-300";

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-5">
        <div
          className="flex items-center gap-3 flex-1 cursor-pointer"
          onClick={handleExpand}
        >
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
            style={{ backgroundColor: `${payLater.color || "#ef4444"}20` }}
          >
            {payLater.icon || "💳"}
          </div>

          <div>
            <p className="text-sm font-bold text-gray-800">{payLater.name}</p>

            <p className="text-xs text-gray-400 mt-0.5">
              {payLater.itemCount || activeItems.length} tagihan aktif •{" "}
              <span className="font-semibold text-red-500">
                {formatRupiah(payLater.totalTagihan ?? totalTagihan)}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExpand}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition"
          >
            <svg
              className={`w-4 h-4 transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              viewBox="0 0 24 24"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <button
            onClick={() => onDelete(payLater._id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              viewBox="0 0 24 24"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            </svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-50">
          {activeItems.length === 0 && !showForm && (
            <div className="px-5 py-4 text-sm text-gray-300">
              Belum ada tagihan aktif
            </div>
          )}

          {activeItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between px-5 py-3 border-b border-gray-50"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">{item.name}</p>

                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-400">
                    {new Date(item.dueDate).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>

                  <DueBadge dueDate={item.dueDate} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-sm font-bold text-red-500">
                  {formatRupiah(item.amount)}
                </p>

                <button
                  onClick={() => setPayingItem(item)}
                  className="text-xs font-semibold text-green-700 hover:text-green-900 bg-green-50 hover:bg-green-100 px-2.5 py-1 rounded-lg transition"
                >
                  Bayar
                </button>

                <button
                  onClick={() => handleDeleteItem(item._id)}
                  className="text-gray-300 hover:text-red-500 transition"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    viewBox="0 0 24 24"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          {/* Modal pilih wallet */}
          {payingItem && (
            <PayWalletModal
              item={payingItem}
              wallets={wallets}
              onConfirm={handlePaid}
              onClose={() => setPayingItem(null)}
            />
          )}

          {paidItems.length > 0 && (
            <div className="px-5 py-2 bg-gray-50">
              <p className="text-xs font-semibold text-gray-400 mb-2">
                Sudah lunas
              </p>

              {paidItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between py-2"
                >
                  <p className="text-sm text-gray-400 line-through">
                    {item.name}
                  </p>

                  <p className="text-sm text-gray-400 line-through">
                    {formatRupiah(item.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {showForm && (
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama tagihan"
                className={inputClass}
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Jumlah (Rp)"
                  className={inputClass}
                />

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100 transition"
                >
                  Batal
                </button>

                <button
                  onClick={handleAddItem}
                  disabled={!name || !amount || !dueDate || loading}
                  className="flex-1 py-2 bg-green-800 hover:bg-green-900 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-semibold rounded-xl transition"
                >
                  {loading ? "Menyimpan..." : "Tambah"}
                </button>
              </div>
            </div>
          )}

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-green-700 hover:bg-green-50 transition"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                viewBox="0 0 24 24"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Tambah Tagihan
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Tambah props di PayLaterPage:
export default function PayLaterPage({ payLaters = [], setPayLaters, wallets = [], onWalletsUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("💳");
  const [color, setColor] = useState("#ef4444");

  const PRESETS = [
    { name: "Shopee PayLater", icon: "🛒", color: "#f97316" },
    { name: "Kredivo", icon: "💳", color: "#3b82f6" },
    { name: "Akulaku", icon: "💳", color: "#a855f7" },
    { name: "GoPay Later", icon: "💚", color: "#166534" },
    { name: "Kartu Kredit", icon: "💰", color: "#eab308" },
    { name: "Hutang", icon: "🤝", color: "#6b7280" },
  ];

  const totalSemua = payLaters.reduce(
    (acc, payLater) => acc + Number(payLater.totalTagihan || 0),
    0,
  );

  const handleCreate = async () => {
    if (!name) return;

    try {
      const created = await createPayLater({ name, icon, color });

      setPayLaters((prev) => [
        ...prev,
        {
          ...created,
          totalTagihan: 0,
          itemCount: 0,
        },
      ]);

      setName("");
      setIcon("💳");
      setColor("#ef4444");
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan paylater");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus paylater ini beserta semua tagihannya?")) return;

    try {
      await deletePayLater(id);
      setPayLaters((prev) => prev.filter((payLater) => payLater._id !== id));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus paylater");
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-green-600 focus:bg-white transition placeholder-gray-300";

  return (
    <div className="flex flex-col gap-5 max-w-lg mx-auto w-full">
      {totalSemua > 0 && (
        <div className="bg-red-500 rounded-2xl p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-red-200 mb-1">
            Total Tagihan Aktif
          </p>

          <p className="text-3xl font-bold text-white">
            {formatRupiah(totalSemua)}
          </p>

          <p className="text-xs text-red-200 mt-1">
            {payLaters.length} akun paylater
          </p>
        </div>
      )}

      {showForm && (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">
              Tambah PayLater
            </h2>

            <button
              onClick={() => setShowForm(false)}
              className="text-xs font-semibold text-green-700"
            >
              Batal
            </button>
          </div>

          <div className="p-5 flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setName(preset.name);
                    setIcon(preset.icon);
                    setColor(preset.color);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    name === preset.name
                      ? "border-green-600 bg-green-50 text-green-800"
                      : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {preset.icon} {preset.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                  Nama
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama paylater"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                  Icon
                </label>

                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <button
              onClick={handleCreate}
              disabled={!name}
              className="w-full bg-green-800 hover:bg-green-900 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm py-3 rounded-xl transition"
            >
              Tambah
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {payLaters.length === 0 && !showForm ? (
          <div className="bg-white border border-gray-100 rounded-2xl py-12 flex flex-col items-center gap-2 text-gray-300">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              viewBox="0 0 24 24"
            >
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>

            <p className="text-sm">Belum ada paylater</p>
          </div>
        ) : (
          payLaters.map((payLater) => (
            <PayLaterCard
              key={payLater._id}
              payLater={payLater}
              onDelete={handleDelete}
              wallets={wallets} // ✅ tambah ini
              onWalletsUpdate={onWalletsUpdate} // ✅ tambah ini
            />
          ))
        )}
      </div>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 hover:border-green-500 rounded-2xl text-sm font-semibold text-gray-400 hover:text-green-700 transition"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            viewBox="0 0 24 24"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah PayLater
        </button>
      )}
    </div>
  );
}
