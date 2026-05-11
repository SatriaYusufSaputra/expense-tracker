export default function Footer() {
  return (
    <footer className="hidden lg:block border-t border-gray-100 bg-white">
      <div className="max-w-4xl mx-auto px-8 py-4 flex items-center justify-between">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} — Dibuat oleh Satria☕
        </p>

        <p className="text-xs text-gray-400">v1.0.0</p>
      </div>
    </footer>
  );
}
