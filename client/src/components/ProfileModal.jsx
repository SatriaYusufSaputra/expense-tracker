import { useState, useEffect } from "react";
import {
  getProfile,
  updateProfile,
  changePassword,
  verifyPassword,
} from "../utils/authService";

export default function ProfileModal({ onClose, onUpdateName }) {
  const [tab, setTab] = useState("profil"); // "profil" | "password"
  const [isVerified, setIsVerified] = useState(false);
  const [verifyPasswordInput, setVerifyPasswordInput] = useState("");

  // Tab profil
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Tab password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" }); // type: "success" | "error"

  // Load profil saat modal dibuka
  useEffect(() => {
    getProfile().then((data) => {
      setName(data.name);
      setEmail(data.email);
    });
  }, []);

  const handleVerifyPassword = async () => {
    if (!verifyPasswordInput) {
      setMessage({ text: "Masukkan password terlebih dahulu", type: "error" });
      return;
    }
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const result = await verifyPassword(verifyPasswordInput);
      if (result.message === "Password verified") {
        setIsVerified(true);
        setVerifyPasswordInput("");
        setMessage({ text: "", type: "" });
      } else {
        setMessage({ text: result.message || "Password salah", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const result = await updateProfile(name, email);
      if (result._id) {
        localStorage.setItem("userName", result.name);
        onUpdateName(result.name); // update nama di Header
        setMessage({ text: "Profil berhasil diperbarui!", type: "success" });
        setTimeout(() => {
          setIsVerified(false);
        }, 1500);
      } else {
        setMessage({ text: result.message, type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ text: "Password baru tidak cocok!", type: "error" });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ text: "Password minimal 6 karakter", type: "error" });
      return;
    }
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const result = await changePassword(currentPassword, newPassword);
      if (result.message === "Password berhasil diubah") {
        setMessage({ text: result.message, type: "success" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage({ text: result.message, type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-green-600 focus:bg-white transition placeholder-gray-300";

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
          {/* Header modal */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">
              Pengaturan Akun
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                viewBox="0 0 24 24"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Tab */}
          {isVerified && (
            <div className="flex border-b border-gray-50">
              <button
                onClick={() => {
                  setTab("profil");
                  setMessage({ text: "", type: "" });
                }}
                className={`flex-1 py-3 text-xs font-semibold transition border-b-2 ${
                  tab === "profil"
                    ? "border-green-700 text-green-700"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                Edit Profil
              </button>
              <button
                onClick={() => {
                  setTab("password");
                  setMessage({ text: "", type: "" });
                }}
                className={`flex-1 py-3 text-xs font-semibold transition border-b-2 ${
                  tab === "password"
                    ? "border-green-700 text-green-700"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                Ganti Password
              </button>
            </div>
          )}

          {/* Body */}
          <div className="p-6 flex flex-col gap-4">
            {/* Verifikasi Password */}
            {!isVerified && (
              <>
                <p className="text-xs text-gray-500">
                  Untuk keamanan akun, masukkan password untuk melanjutkan.
                </p>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    className={inputClass}
                    value={verifyPasswordInput}
                    onChange={(e) => setVerifyPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleVerifyPassword()
                    }
                  />
                </div>
                <button
                  onClick={handleVerifyPassword}
                  disabled={loading || !verifyPasswordInput}
                  className="w-full bg-green-800 hover:bg-green-900 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition"
                >
                  {loading ? "Verifikasi..." : "Verifikasi"}
                </button>
              </>
            )}

            {/* Tab Profil */}
            {isVerified && tab === "profil" && (
              <>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                    Nama
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    className={inputClass}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleUpdateProfile}
                  disabled={loading || !name || !email}
                  className="w-full bg-green-800 hover:bg-green-900 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition"
                >
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </>
            )}

            {/* Tab Password */}
            {isVerified && tab === "password" && (
              <>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                    Password Lama
                  </label>
                  <input
                    type="password"
                    className={inputClass}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    className={inputClass}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    type="password"
                    className={inputClass}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <button
                  onClick={handleChangePassword}
                  disabled={
                    loading ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword
                  }
                  className="w-full bg-green-800 hover:bg-green-900 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition"
                >
                  {loading ? "Menyimpan..." : "Ganti Password"}
                </button>
              </>
            )}

            {/* Pesan sukses/error */}
            {message.text && (
              <p
                className={`text-xs text-center px-3 py-2 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-500"
                }`}
              >
                {message.text}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
