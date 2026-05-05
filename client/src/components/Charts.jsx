import {
  BarChart,
  Bar,
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

export default function Charts({ expenses }) {
  const barData = groupByDate(expenses);
  const categoryData = groupByCategory(expenses);
  const COLORS = ["#4ADE80", "#FBBF24", "#60A5FA", "#F87171", "#A78BFA"];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-6">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={barData}>
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis
            tickFormatter={(v) => `${v / 1000}k`}
            tick={{ fontSize: 11 }}
          />
          <Tooltip formatter={(v) => formatRupiah(v)} />
          <Bar dataKey="total" fill="#166534" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={220}>
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
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend
            formatter={(value) => {
              const cat = CATEGORIES.find((c) => c.id === value);
              return cat ? `${cat.emoji} ${cat.label}` : value;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}