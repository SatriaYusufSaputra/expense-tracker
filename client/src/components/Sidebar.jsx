const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: "grafik",
    label: "Grafik",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        viewBox="0 0 24 24"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: "transaksi",
    label: "Transaksi",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        viewBox="0 0 24 24"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="16" y2="17" />
      </svg>
    ),
  },
  {
    id: "profil",
    label: "Profil",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
];

export default function Sidebar({
  activePage,
  onNavigate,
  onAdd,
  userName,
  onLogout,
}) {
  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-white border-r border-gray-100 fixed top-0 left-0 z-30">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-50">
        <div className="w-9 h-9 bg-green-800 rounded-xl flex items-center justify-center shrink-0">
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
          <p className="text-sm font-bold text-gray-800">Expense Tracker</p>
          <p className="text-xs text-gray-400">{userName}</p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 p-4 flex-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition w-full text-left
              ${
                activePage === item.id
                  ? "bg-green-50 text-green-800"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}

        {/* Tombol Tambah */}
        <button
          onClick={onAdd}
          className="flex items-center gap-3 px-4 py-2.5 mt-2 rounded-xl text-sm font-semibold bg-green-800 hover:bg-green-900 text-white transition w-full"
        >
          <svg
            className="w-5 h-5"
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
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-50">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 transition w-full"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            viewBox="0 0 24 24"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Keluar
        </button>
      </div>
    </aside>
  );
}
