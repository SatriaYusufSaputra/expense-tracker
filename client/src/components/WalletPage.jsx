import { useState } from "react";
import {
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

function WalletCard({ wallet, onEdit, onDelete, showBalance }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between hover:shadow-sm transition">
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: `${wallet.color || "#166534"}20` }}
        >
          {wallet.icon || "💰"}
        </div>

        <div>
          <p className="text-sm font-bold text-gray-800">{wallet.name}</p>
          <p
            className="text-lg font-bold mt-0.5"
            style={{ color: wallet.color || "#166534" }}
          >
            {showBalance ? formatRupiah(wallet.balance || 0) : "Rp ••••••••"}
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
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-green-600 focus:bg-white transition placeholder:text-gray-300";

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setLoading(true);

    try {
      await onSubmit({
        name,
        icon,
        color,
        balance: Number(balance || 0),
      });
    } finally {
      setLoading(false);
    }
  };

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
        {!initial && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
              Pilih Preset
            </label>

            <div className="flex flex-wrap gap-2">
              {WALLET_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
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
              onChange={(e) => setBalance(e.target.value)}
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
          onClick={handleSubmit}
          disabled={!name.trim() || loading}
          className="w-full bg-green-800 hover:bg-green-900 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition"
        >
          {loading
            ? "Menyimpan..."
            : initial
              ? "Simpan Perubahan"
              : "Tambah Wallet"}
        </button>
      </div>
    </div>
  );
}

export default function WalletPage({ wallets = [], setWallets }) {
  const [showForm, setShowForm] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);

  const totalSaldo = wallets.reduce(
    (acc, wallet) => acc + Number(wallet.balance || 0),
    0,
  );

  const handleCreate = async (data) => {
    const created = await createWallet(data);

    setWallets((prev) => [...prev, created]);

    setShowForm(false);
  };

  const handleEdit = async (data) => {
    const updated = await updateWallet(editingWallet._id, data);

    setWallets((prev) =>
      prev.map((wallet) => (wallet._id === updated._id ? updated : wallet)),
    );

    setEditingWallet(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus wallet ini?")) return;

    await deleteWallet(id);

    setWallets((prev) => prev.filter((wallet) => wallet._id !== id));
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingWallet(null);
  };

  return (
    <div className="flex flex-col gap-5 max-w-lg mx-auto w-full">
      <div className="bg-green-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-300">
            Total Saldo
          </p>

          <button
            onClick={() => setShowBalance((prev) => !prev)}
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

        <p className="text-3xl font-bold text-white tracking-wide">
          {showBalance ? formatRupiah(totalSaldo) : "Rp ••••••••"}
        </p>

        <p className="text-xs text-green-400 mt-1">
          {wallets.length} wallet aktif
        </p>

        {wallets.length > 0 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {wallets.map((wallet) => (
              <div
                key={wallet._id}
                className="shrink-0 bg-white/10 rounded-xl px-3 py-2 flex items-center gap-2"
              >
                <span className="text-sm">{wallet.icon}</span>

                <div>
                  <p className="text-xs text-green-200 font-medium">
                    {wallet.name}
                  </p>

                  <p className="text-xs font-bold text-white">
                    {showBalance ? formatRupiah(wallet.balance || 0) : "••••••"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {(showForm || editingWallet) && (
        <WalletForm
          key={editingWallet?._id || "create-wallet"}
          initial={editingWallet}
          onSubmit={editingWallet ? handleEdit : handleCreate}
          onCancel={handleCancel}
        />
      )}

      <div className="flex flex-col gap-3">
        {wallets.length === 0 && !showForm && !editingWallet ? (
          <div className="bg-white border border-gray-100 rounded-2xl py-12 flex flex-col items-center gap-2 text-gray-300">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <path d="M8 12h8" />
            </svg>

            <p className="text-sm">Belum ada wallet</p>
          </div>
        ) : (
          wallets.map((wallet) => (
            <WalletCard
              key={wallet._id}
              wallet={wallet}
              showBalance={showBalance}
              onEdit={(selectedWallet) => {
                setEditingWallet(selectedWallet);
                setShowForm(false);
              }}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

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
