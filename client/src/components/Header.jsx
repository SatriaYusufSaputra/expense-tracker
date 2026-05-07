import { useState } from "react";
import ProfileModal from "./ProfileModal";


export default function Header({ onAdd, onLogout, userName, onUpdateName }) {
const [showProfile, setShowProfile] = useState(false);
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
      {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Tombol profil */}
          <button
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-xl transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
            <span className="hidden sm:inline">{userName}</span>
          </button>

          {/* Tombol logout */}
          <button
            onClick={onLogout}
            className="text-xs font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl transition"
          >
            Keluar
          </button>

          {/* Tombol tambah */}
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 bg-green-800 hover:bg-green-900 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Tambah
          </button>
        </div>

      {/* Modal profil */}
      {showProfile && (
        <ProfileModal
          onClose={() => setShowProfile(false)}
          onUpdateName={(newName) => {
            onUpdateName(newName);
            setShowProfile(false);
          }}
        />
      )}
    </div>
  );
}
