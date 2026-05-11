export default function MobileHeader({ userName }) {
  return (
    <header className="lg:hidden flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100 sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-green-800 rounded-lg flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
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
        <p className="text-sm font-bold text-gray-800">Expense Tracker</p>
      </div>
      <p className="text-xs text-gray-400 font-medium">Halo, {userName} 👋</p>
    </header>
  );
}
