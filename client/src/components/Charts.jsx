import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { groupByDate, groupByCategory } from "../utils/chartData";
import { CATEGORIES } from "../constants/categories";
import { formatRupiah } from "../utils/format";

export default function Charts({ expenses, month, onMonthChange }) {
  const barData = groupByDate(expenses);
  const categoryData = groupByCategory(expenses);
const CATEGORY_COLORS = {
  makanan: "#f97316", // orange
  transport: "#3b82f6", // blue
  belanja: "#ec4899", // pink
  kesehatan: "#ef4444", // red
  tagihan: "#eab308", // yellow
  hiburan: "#a855f7", // purple
  olahraga: "#06b6d4", // cyan
  pendidikan: "#8b5cf6", // violet
  lainnya: "#6b7280", // gray
};
  // Tambah fungsi navigasi bulan
  const prevMonth = () => {
    const [year, month] = month.split("-").map(Number);
    const date = new Date(year, month - 2); // month - 2 karena JS 0-indexed
    const newMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    onMonthChange(newMonth);
  };

  const nextMonth = () => {
    const [year, month] = month.split("-").map(Number);
    const date = new Date(year, month); // month - 2 karena JS 0-indexed
    const newMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    onMonthChange(newMonth);
  };

  const isCurrentMonth = month === new Date().toISOString().slice(0, 7);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition text-gray-500"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            viewBox="0 0 24 24"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <input
          type="month"
          value={month}
          onChange={(e) => onMonthChange(e.target.value)}
          className="text-sm font-semibold text-gray-700 bg-transparent border-none outline-none text-center cursor-pointer"
        />

        <button
          onClick={nextMonth}
          disabled={isCurrentMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition text-gray-500"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            viewBox="0 0 24 24"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={barData}
          margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
        >
          <defs>
            {/* Gradient hijau seperti grafik saham */}
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#166534" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#166534" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${v / 1000}k`}
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={35}
          />
          <Tooltip
            formatter={(v) => [formatRupiah(v), "Pengeluaran"]}
            contentStyle={{
              background: "#fff",
              border: "1px solid #f0f0f0",
              borderRadius: "12px",
              fontSize: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
            cursor={{
              stroke: "#166534",
              strokeWidth: 1,
              strokeDasharray: "4 4",
            }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#166534"
            strokeWidth={2}
            fill="url(#colorTotal)"
            dot={{ fill: "#166534", r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#166534", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={categoryData}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            fill="#8884d8"
            label={(entry) => {
              const cat = CATEGORIES.find((c) => c.id === entry.category);
              return cat ? cat.emoji : entry.category;
            }}
          >
            {categoryData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CATEGORY_COLORS[entry.category] || "#6b7280"}
              />
            ))}
          </Pie>
          <Legend
            formatter={(value) => {
              const cat = CATEGORIES.find((c) => c.id === value);
              return cat ? `${cat.emoji} ${cat.label}` : value;
            }}
            iconStyle={(value) => ({ fill: CATEGORY_COLORS[value] })}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}