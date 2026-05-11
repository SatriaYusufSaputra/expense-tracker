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
    id: "tambah",
    label: "Tambah",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        viewBox="0 0 24 24"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    isAdd: true,
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

export default function BottomNav({ activePage, onNavigate, onAdd }) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map((item) =>
          item.isAdd ? (
            // Tombol tambah di tengah — lebih besar dan highlighted
            <button
              key={item.id}
              onClick={onAdd}
              className="flex items-center justify-center w-12 h-12 bg-green-800 hover:bg-green-900 text-white rounded-2xl shadow-lg transition -mt-4"
            >
              {item.icon}
            </button>
          ) : (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition
                ${
                  activePage === item.id
                    ? "text-green-800"
                    : "text-gray-400 hover:text-gray-600"
                }`}
            >
              {item.icon}
              <span className="text-xs font-semibold">{item.label}</span>
            </button>
          ),
        )}
      </div>
    </nav>
  );
}
