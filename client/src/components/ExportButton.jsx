import { useState } from "react";
import { exportToExcel, exportToPDF } from "../utils/exportService";

export default function ExportButton({ expenses }) {
  const [open, setOpen] = useState(false);

  const filename = `laporan-${new Date().toISOString().slice(0, 7)}`; // contoh: laporan-2025-04

  const handleExcel = () => {
    exportToExcel(expenses, filename);
    setOpen(false);
  };

  const handlePDF = () => {
    exportToPDF(expenses, filename);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 text-xs font-semibold px-3 py-2 rounded-xl transition"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          viewBox="0 0 24 24"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Export
      </button>

      {open && (
        <>
          {/* overlay untuk close kalau klik luar */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
            <button
              onClick={handleExcel}
              className="w-full flex items-center gap-2 px-4 py-3 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
            >
              <span>📊</span> Export Excel
            </button>
            <div className="border-t border-gray-50" />
            <button
              onClick={handlePDF}
              className="w-full flex items-center gap-2 px-4 py-3 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
            >
              <span>📄</span> Export PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
}
