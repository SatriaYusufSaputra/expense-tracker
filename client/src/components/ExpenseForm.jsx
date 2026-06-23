import { useState, useEffect } from "react";
import { CATEGORIES } from "../constants/categories";
import { uploadImage } from "../utils/uploadService";

const TYPES = [
  {
    id: "expense",
    label: "Pengeluaran",
    emoji: "⬇️",
    color: "text-red-500",
    bg: "bg-red-50",
    ring: "ring-red-400",
  },
  {
    id: "income",
    label: "Pemasukan",
    emoji: "⬆️",
    color: "text-green-600",
    bg: "bg-green-50",
    ring: "ring-green-500",
  },
  {
    id: "transfer",
    label: "Transfer",
    emoji: "↔️",
    color: "text-blue-500",
    bg: "bg-blue-50",
    ring: "ring-blue-400",
  },
];

export default function ExpenseForm({
  name,
  setName,
  amount,
  setAmount,
  date,
  setDate,
  category,
  setCategory,
  image,
  setImage,
  type,
  setType,
  walletId,
  setWalletId,
  toWalletId,
  setToWalletId,
  wallets,
  editingId,
  onSubmit,
  onCancel,
  errorMsg,
}) {
  const [uploading, setUploading] = useState(false);
  const [visible, setVisible] = useState(false);

  // Animasi masuk
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onCancel, 300);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setImage(url);
    } catch {
      alert("Gagal upload gambar");
    } finally {
      setUploading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-green-600 focus:bg-white transition placeholder-gray-300";

  const isValid =
    name &&
    amount &&
    date &&
    walletId &&
    (type !== "transfer" || toWalletId) &&
    !uploading;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      />

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${visible ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
            <h2 className="text-sm font-bold text-gray-800">
              {editingId ? "Edit Transaksi" : "Tambah Transaksi"}
            </h2>
            <button
              onClick={handleClose}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
            >
              <svg
                className="w-4 h-4"
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

          <div className="p-5 flex flex-col gap-4">
            {/* Pilih tipe */}
            <div className="grid grid-cols-3 gap-2">
              {TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 transition font-semibold text-xs
                    ${
                      type === t.id
                        ? `${t.bg} ${t.color} border-transparent ring-2 ${t.ring}`
                        : "bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100"
                    }`}
                >
                  <span className="text-xl">{t.emoji}</span>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Keterangan + Jumlah */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                  Keterangan
                </label>
                <input
                  type="text"
                  placeholder={
                    type === "income"
                      ? "cth. Gaji"
                      : type === "transfer"
                        ? "cth. Isi GoPay"
                        : "cth. Makan siang"
                  }
                  className={inputClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                  Jumlah (Rp)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className={inputClass}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            {/* Tanggal */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                Tanggal
              </label>
              <input
                type="date"
                className={inputClass}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* Pilih wallet */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                {type === "transfer" ? "Dari Wallet" : "Wallet"}
              </label>
              {wallets.length === 0 ? (
                <p className="text-xs text-red-400 bg-red-50 px-3 py-2 rounded-xl">
                  Belum ada wallet. Tambah wallet dulu di menu Wallet.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {wallets.map((w) => (
                    <button
                      key={w._id}
                      onClick={() => setWalletId(w._id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition
                        ${
                          walletId === w._id
                            ? "border-green-600 bg-green-50 text-green-800 ring-2 ring-green-500"
                            : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
                        }`}
                    >
                      <span>{w.icon}</span>
                      <span>{w.name}</span>
                      <span className="text-gray-400 font-normal">
                        {new Intl.NumberFormat("id-ID", {
                          notation: "compact",
                          maximumFractionDigits: 1,
                        }).format(w.balance)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wallet tujuan (khusus transfer) */}
            {type === "transfer" && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                  Ke Wallet
                </label>
                <div className="flex flex-wrap gap-2">
                  {wallets
                    .filter((w) => w._id !== walletId) // exclude wallet asal
                    .map((w) => (
                      <button
                        key={w._id}
                        onClick={() => setToWalletId(w._id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition
                          ${
                            toWalletId === w._id
                              ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-400"
                              : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
                          }`}
                      >
                        <span>{w.icon}</span>
                        <span>{w.name}</span>
                        <span className="text-gray-400 font-normal">
                          {new Intl.NumberFormat("id-ID", {
                            notation: "compact",
                            maximumFractionDigits: 1,
                          }).format(w.balance)}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Kategori (khusus pengeluaran) */}
            {type === "expense" && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                  Kategori
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition
                        ${
                          category === cat.id
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
            )}

            {/* Upload struk (khusus pengeluaran) */}
            {type === "expense" && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                  Struk / Foto (opsional)
                </label>
                <div className="flex gap-2 w-full">
                  <label className="flex-1 flex flex-col items-center justify-center gap-1 border-2 border-dashed border-gray-200 hover:border-green-500 rounded-xl p-3 cursor-pointer transition bg-gray-50">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <svg
                      className="w-5 h-5 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      viewBox="0 0 24 24"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                    <p className="text-xs text-gray-400">Galeri</p>
                  </label>
                  <label className="flex-1 flex flex-col items-center justify-center gap-1 border-2 border-dashed border-gray-200 hover:border-green-500 rounded-xl p-3 cursor-pointer transition bg-gray-50">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <svg
                      className="w-5 h-5 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                    <p className="text-xs text-gray-400">Kamera</p>
                  </label>
                </div>
                {uploading && (
                  <p className="text-xs text-gray-400 text-center mt-1">
                    Mengupload...
                  </p>
                )}
                {image && !uploading && (
                  <img
                    src={image}
                    alt="preview"
                    className="h-16 rounded-lg object-cover mt-2 mx-auto"
                  />
                )}
              </div>
            )}

            {/* Error message */}
            {errorMsg && (
              <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl font-semibold">
                ⚠️ {errorMsg}
              </p>
            )}

            {/* Tombol simpan */}
            <button
              onClick={onSubmit}
              disabled={!isValid}
              className={`w-full font-semibold text-sm py-3.5 rounded-2xl transition
                ${
                  !isValid
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : type === "income"
                      ? "bg-green-700 hover:bg-green-800 text-white"
                      : type === "transfer"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                }`}
            >
              {uploading
                ? "Mengupload gambar..."
                : editingId
                  ? "Simpan Perubahan"
                  : type === "income"
                    ? "Tambah Pemasukan"
                    : type === "transfer"
                      ? "Transfer"
                      : "Tambah Pengeluaran"}
            </button>

            {/* Safe area untuk mobile */}
            <div className="h-4" />
          </div>
        </div>
      </div>
    </>
  );
}
