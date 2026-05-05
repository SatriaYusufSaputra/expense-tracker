import { useState } from "react";
import { loginUser, registerUser } from "../utils/authService";

export default function AuthForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const result = isLogin
        ? await loginUser(email, password)
        : await registerUser(name, email, password);

      if (result.token) {
        localStorage.setItem("token", result.token);
        const username = result.name || name;
        localStorage.setItem("userName", username);
        onLogin(username);
      } else {
        setError(result.message || "Terjadi kesalahan");
      }
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-green-600 focus:bg-white transition placeholder-gray-300";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 w-full max-w-sm">
        {/* Icon + Judul */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-green-800 rounded-xl flex items-center justify-center mb-3">
            <svg
              className="w-6 h-6 text-white"
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
          <h1 className="text-lg font-bold text-gray-800">Expense Tracker</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {isLogin ? "Masuk ke akunmu" : "Buat akun baru"}
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-3">
          {!isLogin && (
            <input
              type="text"
              placeholder="Nama lengkap"
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Error message */}
          {error && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-800 hover:bg-green-900 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition"
          >
            {loading ? "Memproses..." : isLogin ? "Masuk" : "Daftar"}
          </button>
        </div>

        {/* Toggle login/register */}
        <p className="text-center text-xs text-gray-400 mt-5">
          {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-green-700 font-semibold hover:text-green-900"
          >
            {isLogin ? "Daftar di sini" : "Masuk di sini"}
          </button>
        </p>
      </div>
    </div>
  );
}
