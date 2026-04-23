export const CATEGORIES = [
  {
    id: "makanan",
    label: "Makanan",
    emoji: "🍜",
    bg: "bg-orange-100",
    text: "text-orange-700",
  },
  {
    id: "transport",
    label: "Transport",
    emoji: "🚗",
    bg: "bg-blue-100",
    text: "text-blue-700",
  },
  {
    id: "belanja",
    label: "Belanja",
    emoji: "🛍️",
    bg: "bg-pink-100",
    text: "text-pink-700",
  },
  {
    id: "kesehatan",
    label: "Kesehatan",
    emoji: "💊",
    bg: "bg-red-100",
    text: "text-red-700",
  },
  {
    id: "tagihan",
    label: "Tagihan",
    emoji: "📄",
    bg: "bg-yellow-100",
    text: "text-yellow-700",
  },
  {
    id: "hiburan",
    label: "Hiburan",
    emoji: "🎮",
    bg: "bg-purple-100",
    text: "text-purple-700",
  },
  {
    id: "pendidikan",
    label: "Pendidikan",
    emoji: "📚",
    bg: "bg-cyan-100",
    text: "text-cyan-700",
  },
  {
    id: "lainnya",
    label: "Lainnya",
    emoji: "📦",
    bg: "bg-gray-100",
    text: "text-gray-600",
  },
];

export const getCat = (id) =>
  CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
