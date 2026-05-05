export default function Header({ onAdd, onLogout, userName }) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-800 rounded-xl flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            viewBox="0 0 24 24"
          >
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-800">Expense Tracker</h1>
          <p className="text-xs text-gray-400">Kelola pengeluaran harianmu</p>
          {userName && (
            <p className="text-xs text-gray-500">Halo, {userName}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 bg-green-800 hover:bg-green-900 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
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
          Tambah
        </button>
        {onLogout && (
          <button
            onClick={onLogout}
            className="text-sm font-semibold text-gray-600 hover:text-red-600 hover:bg-gray-100 px-4 py-2 rounded-xl transition"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
