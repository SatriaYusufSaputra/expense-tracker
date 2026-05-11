import { useState, useEffect } from "react";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../utils/authService";

// ── Password strength ──────────────────────────────────────────
function getStrength(pwd) {
  if (!pwd) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { score, label: "Lemah", color: "bg-red-400" };
  if (score <= 3) return { score, label: "Sedang", color: "bg-amber-400" };
  return { score, label: "Kuat", color: "bg-green-500" };
}

// ── Alert ──────────────────────────────────────────────────────
function Alert({ type, text, onClose }) {
  if (!text) return null;
  const styles =
    type === "success"
      ? "bg-green-50 border-green-200 text-green-700"
      : "bg-red-50 border-red-200 text-red-600";
  const icon =
    type === "success" ? (
      <svg
        className="w-4 h-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        viewBox="0 0 24 24"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ) : (
      <svg
        className="w-4 h-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    );
  return (
    <div
      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium ${styles} animate-pulse-once`}
    >
      {icon}
      <span className="flex-1">{text}</span>
      <button
        onClick={onClose}
        className="opacity-50 hover:opacity-100 transition"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          viewBox="0 0 24 24"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

// ── Input field ────────────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

// ── Password input with show/hide ─────────────────────────────
function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-green-600 focus:bg-white transition placeholder-gray-300"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
      >
        {show ? (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            viewBox="0 0 24 24"
          >
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            viewBox="0 0 24 24"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}

// ── Avatar ─────────────────────────────────────────────────────
function Avatar({ name }) {
  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";
  return (
    <div className="w-16 h-16 bg-green-800 rounded-full flex items-center justify-center shrink-0">
      <span className="text-white text-xl font-bold">{initials}</span>
    </div>
  );
}

// ── Tab Profil ─────────────────────────────────────────────────
function TabProfil({ initialName, initialEmail, onUpdateName }) {
  const [name, setName] = useState(initialName || "");
  const [email, setEmail] = useState(initialEmail || "");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", text: "" });

  const isDirty = name !== initialName || email !== initialEmail;

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Nama tidak boleh kosong";
    if (!email.trim()) e.email = "Email tidak boleh kosong";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Format email tidak valid";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setAlert({ type: "", text: "" });
    try {
      const result = await updateProfile(name, email);
      if (result._id) {
        localStorage.setItem("userName", result.name);
        onUpdateName(result.name);
        setAlert({ type: "success", text: "Profil berhasil diperbarui!" });
      } else {
        setAlert({
          type: "error",
          text: result.message || "Gagal memperbarui profil",
        });
      }
    } catch {
      setAlert({ type: "error", text: "Gagal terhubung ke server" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <Alert
        type={alert.type}
        text={alert.text}
        onClose={() => setAlert({ type: "", text: "" })}
      />

      <Field label="Nama Lengkap" error={errors.name}>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((prev) => ({ ...prev, name: "" }));
          }}
          placeholder="Nama kamu"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-green-600 focus:bg-white transition placeholder-gray-300"
        />
      </Field>

      <Field label="Email" error={errors.email}>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
          placeholder="email@kamu.com"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-green-600 focus:bg-white transition placeholder-gray-300"
        />
      </Field>

      <button
        onClick={handleSubmit}
        disabled={!isDirty || loading}
        className="w-full bg-green-800 hover:bg-green-900 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Menyimpan...
          </span>
        ) : (
          "Simpan Perubahan"
        )}
      </button>
    </div>
  );
}

// ── Tab Password ───────────────────────────────────────────────
function TabPassword() {
  const [current, setCurrent] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", text: "" });

  const strength = getStrength(newPwd);

  const validate = () => {
    const e = {};
    if (!current) e.current = "Masukkan password lama";
    if (!newPwd) e.newPwd = "Masukkan password baru";
    else if (newPwd.length < 3) e.newPwd = "Password minimal 3 karakter";
    else if (newPwd === current)
      e.newPwd = "Password baru tidak boleh sama dengan yang lama";
    if (!confirm) e.confirm = "Konfirmasi password dulu";
    else if (confirm !== newPwd) e.confirm = "Password tidak cocok";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setAlert({ type: "", text: "" });
    try {
      const result = await changePassword(current, newPwd);
      if (result.message === "Password berhasil diubah") {
        setAlert({ type: "success", text: result.message });
        setCurrent("");
        setNewPwd("");
        setConfirm("");
        setErrors({});
      } else {
        setAlert({
          type: "error",
          text: result.message || "Gagal mengganti password",
        });
      }
    } catch {
      setAlert({ type: "error", text: "Gagal terhubung ke server" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <Alert
        type={alert.type}
        text={alert.text}
        onClose={() => setAlert({ type: "", text: "" })}
      />

      <Field label="Password Lama" error={errors.current}>
        <PasswordInput
          value={current}
          onChange={(e) => {
            setCurrent(e.target.value);
            setErrors((p) => ({ ...p, current: "" }));
          }}
          placeholder="••••••••"
        />
      </Field>

      <Field label="Password Baru" error={errors.newPwd}>
        <PasswordInput
          value={newPwd}
          onChange={(e) => {
            setNewPwd(e.target.value);
            setErrors((p) => ({ ...p, newPwd: "" }));
          }}
          placeholder="••••••••"
        />
        {/* Indikator kekuatan */}
        {newPwd && (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex gap-1 flex-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : "bg-gray-200"}`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-gray-400">
              {strength.label}
            </span>
          </div>
        )}
      </Field>

      <Field label="Konfirmasi Password Baru" error={errors.confirm}>
        <PasswordInput
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
            setErrors((p) => ({ ...p, confirm: "" }));
          }}
          placeholder="••••••••"
        />
      </Field>

      <button
        onClick={handleSubmit}
        disabled={!current || !newPwd || !confirm || loading}
        className="w-full bg-green-800 hover:bg-green-900 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Menyimpan...
          </span>
        ) : (
          "Ganti Password"
        )}
      </button>
    </div>
  );
}

// ── Main ProfilePage ───────────────────────────────────────────
export default function ProfilePage({ userName, onLogout, onUpdateName }) {
  const [tab, setTab] = useState("profil");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile().then((data) => {
      if (data && data._id) setProfile(data);
    });
  }, []);

  const name = profile?.name || userName || "";
  const email = profile?.email || "";

  return (
    <div className="flex flex-col gap-5 max-w-lg mx-auto w-full pb-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-4">
          <Avatar name={name} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-gray-800 truncate">
                {name || "—"}
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Active
              </span>
            </div>
            <p className="text-sm text-gray-400 truncate mt-0.5">
              {email || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Settings Card */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-gray-50">
          {["profil", "password"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3.5 text-xs font-semibold uppercase tracking-wide transition border-b-2 ${
                tab === t
                  ? "border-green-700 text-green-800 bg-green-50/40"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {t === "profil" ? "Edit Profil" : "Ganti Password"}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6">
          {tab === "profil" && profile && (
            <TabProfil
              initialName={profile.name}
              initialEmail={profile.email}
              onUpdateName={onUpdateName}
            />
          )}
          {tab === "profil" && !profile && (
            <div className="flex items-center justify-center py-8 text-gray-300 text-sm">
              Memuat profil...
            </div>
          )}
          {tab === "password" && <TabPassword />}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-4">
          Sesi
        </p>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100 text-red-500 font-semibold text-sm transition"
        >
          <svg
            className="w-4 h-4"
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
          Keluar dari Akun
        </button>
      </div>
    </div>
  );
}
