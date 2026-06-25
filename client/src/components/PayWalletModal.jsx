import { useState } from "react";
import { formatRupiah } from "../utils/format";

export default function PayWalletModal({ item, wallets, onConfirm, onClose }) {
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selectedWallet) {
      setError("Pilih wallet dulu");
      return;
    }
    const wallet = wallets.find((w) => w._id === selectedWallet);
    if (wallet.balance < item.amount) {
      setError(`Saldo ${wallet.name} tidak cukup`);
      return;
    }
    setLoading(true);
    await onConfirm(item._id, selectedWallet);
    setLoading(false);
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-bold text-gray-800">Bayar Tagihan</h2>
            <p className="text-xs text-gray-400 mt-0.5">{item.name}</p>
          </div>

          <div className="p-5 flex flex-col gap-4">
            {/* Info tagihan */}
            <div className="bg-red-50 rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-red-600">
                Total Bayar
              </span>
              <span className="text-sm font-bold text-red-600">
                {formatRupiah(item.amount)}
              </span>
            </div>

            {/* Pilih wallet */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                Bayar dari Wallet
              </label>
              <div className="flex flex-col gap-2">
                {wallets.map((w) => {
                  const cukup = w.balance >= item.amount;
                  return (
                    <button
                      key={w._id}
                      onClick={() => {
                        setSelectedWallet(w._id);
                        setError("");
                      }}
                      disabled={!cukup}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border transition
                        ${
                          selectedWallet === w._id
                            ? "border-green-600 bg-green-50 ring-2 ring-green-500"
                            : cukup
                              ? "border-gray-200 bg-gray-50 hover:bg-gray-100"
                              : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{w.icon}</span>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-gray-700">
                            {w.name}
                          </p>
                          <p
                            className={`text-xs font-medium ${cukup ? "text-gray-400" : "text-red-400"}`}
                          >
                            {formatRupiah(w.balance)}
                            {!cukup && " — tidak cukup"}
                          </p>
                        </div>
                      </div>
                      {selectedWallet === w._id && (
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          viewBox="0 0 24 24"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl">
                ⚠️ {error}
              </p>
            )}

            {/* Tombol */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedWallet || loading}
                className="flex-1 py-2.5 bg-green-800 hover:bg-green-900 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition"
              >
                {loading ? "Memproses..." : "Konfirmasi Bayar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
