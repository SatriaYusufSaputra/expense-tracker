import { useState, useEffect } from "react";
import {
  fetchWallets,
  createWallet,
  updateWallet,
  deleteWallet,
} from "../utils/walletService";
import { formatRupiah } from "../utils/format";

const WALLET_PRESETS = [
  { name: "Cash", icon: "💵", color: "#166534" },
  { name: "BCA", icon: "🏦", color: "#3b82f6" },
  { name: "BRI", icon: "🏧", color: "#3b82f6" },
  { name: "Mandiri", icon: "🏦", color: "#eab308" },
  { name: "BNI", icon: "🏦", color: "#f97316" },
  { name: "DANA", icon: "💙", color: "#3b82f6" },
  { name: "ShopeePay", icon: "🛒", color: "#f97316" },
  { name: "GoPay", icon: "💚", color: "#166534" },
  { name: "OVO", icon: "💜", color: "#a855f7" },
];

function WalletCard({ wallet, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between hover:shadow-sm transition">
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: wallet.color + "20" }}
        >
          {wallet.icon}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800">{wallet.name}</p>
          <p
            className="text-lg font-bold mt-0.5"
            style={{ color: wallet.color }}
          >
            {formatRupiah(wallet.balance)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(wallet)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            viewBox="0 0 24 24"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(wallet._id)}
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
            <path d="M10 11v6" />
            <path d="M14 11v6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function WalletForm({ initial, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [icon, setIcon] = useState(initial?.icon || "💰");
  const [color, setColor] = useState(initial?.color || "#166534");
  const [balance, setBalance] = useState(initial?.balance ?? "");

  const inputClass =
    "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-green-600 focus:bg-white transition placeholder-gray-300";

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <h2 className="text-sm font-semibold text-gray-700">
          {initial ? "Edit Wallet" : "Tambah Wallet"}
        </h2>
        <button
          onClick={onCancel}
          className="text-xs font-semibold text-green-700 hover:text-green-900"
        >
          Batal
        </button>
      </div>

      <div className="p-5 flex flex-col gap-4">
        {/* Preset */}
        {!initial && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
              Pilih Preset
            </label>
            <div className="flex flex-wrap gap-2">
              {WALLET_PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setName(p.name);
                    setIcon(p.icon);
                    setColor(p.color);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition
                    ${name === p.name ? "border-green-600 bg-green-50 text-green-800" : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
                >
                  {p.icon} {p.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
              Nama
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="cth. BCA"
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
              placeholder="💰"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
              Saldo Awal (Rp)
            </label>
            <input
              type="number"
              placeholder="0"
              className={inputClass}
              value={balance}
              onChange={(e) => setBalance(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
              Warna
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
              />
              <span className="text-xs text-gray-400">{color}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onSubmit({ name, icon, color, balance })}
          disabled={!name}
          className="w-full bg-green-800 hover:bg-green-900 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition"
        >
          {initial ? "Simpan Perubahan" : "Tambah Wallet"}
        </button>
      </div>
    </div>
  );
}

export default function WalletPage() {
  const [wallets, setWallets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWallets()
      .then(setWallets)
      .finally(() => setLoading(false));
  }, []);

  const totalSaldo = wallets.reduce((acc, w) => acc + w.balance, 0);

  const handleCreate = async (data) => {
    const created = await createWallet(data);
    setWallets([...wallets, created]);
    setShowForm(false);
  };

  const handleEdit = async (data) => {
    const updated = await updateWallet(editingWallet._id, data);
    setWallets(wallets.map((w) => (w._id === updated._id ? updated : w)));
    setEditingWallet(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus wallet ini?")) return;
    await deleteWallet(id);
    setWallets(wallets.filter((w) => w._id !== id));
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-12 text-gray-300 text-sm">
        Memuat wallet...
      </div>
    );

  return (
    <div className="flex flex-col gap-5 max-w-lg mx-auto w-full">
      {/* Total saldo */}
      <div className="bg-green-800 rounded-2xl p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-green-300 mb-1">
          Total Saldo
        </p>
        <p className="text-3xl font-bold text-white">
          {formatRupiah(totalSaldo)}
        </p>
        <p className="text-xs text-green-400 mt-1">
          {wallets.length} wallet aktif
        </p>
      </div>

      {/* Form tambah/edit */}
      {showForm && (
        <WalletForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}
      {editingWallet && (
        <WalletForm
          initial={editingWallet}
          onSubmit={handleEdit}
          onCancel={() => setEditingWallet(null)}
        />
      )}

      {/* List wallet */}
      <div className="flex flex-col gap-3">
        {wallets.length === 0 && !showForm ? (
          <div className="bg-white border border-gray-100 rounded-2xl py-12 flex flex-col items-center gap-2 text-gray-300">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              viewBox="0 0 24 24"
            >
              <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7" />
              <path d="M16 19h6" />
              <path d="M19 16v6" />
            </svg>
            <p className="text-sm">Belum ada wallet</p>
          </div>
        ) : (
          wallets.map((wallet) => (
            <WalletCard
              key={wallet._id}
              wallet={wallet}
              onEdit={setEditingWallet}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Tombol tambah */}
      {!showForm && !editingWallet && (
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
          Tambah Wallet
        </button>
      )}
    </div>
  );
}
