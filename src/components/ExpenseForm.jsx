import { CATEGORIES } from "../constants/categories";

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
  editingId,
  onSubmit,
  onCancel,
}) {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };
  const inputClass =
    "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-green-600 focus:bg-white transition placeholder-gray-300";

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <h2 className="text-sm font-semibold text-gray-700">
          {editingId ? "Edit Pengeluaran" : "Tambah Pengeluaran"}
        </h2>
        <button
          onClick={() => {
            onSubmit(false);
            onCancel(null);
          }}
        >
          Batal
        </button>
      </div>
      <div className="p-5 flex flex-col gap-4">
        {/* Nama + Jumlah */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
              Nama
            </label>
            <input
              type="text"
              placeholder="cth. Makan siang"
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

        {/* Kategori Picker */}
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

        {/* Upload Struk */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
            Struk / Foto (opsional)
          </label>
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-green-500 rounded-xl p-4 cursor-pointer transition bg-gray-50">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            {image ? (
              <img
                src={image}
                alt="preview"
                className="h-16 rounded-lg object-cover"
              />
            ) : (
              <>
                <svg
                  className="w-6 h-6 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p className="text-xs text-gray-400">
                  Klik untuk upload foto struk
                </p>
              </>
            )}
          </label>
        </div>

        <button
          onClick={onSubmit}
          disabled={!name || !amount || !date}
          className="w-full bg-green-800 hover:bg-green-900 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition"
        >
          Simpan Pengeluaran
        </button>
      </div>
    </div>
  );
}
