// Mengubah expenses jadi data per hari, untuk bar chart
export function groupByDate(expenses) {
  const grouped = expenses.reduce((acc, item) => {
    acc[item.date] = (acc[item.date] || 0) + item.amount;
    return acc;
  }, {});

  return Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b)) // urutkan dari terlama ke terbaru
    .map(([date, total]) => ({
      date: new Date(date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      }),
      total,
    }));
}

// Mengubah expenses jadi data per kategori, untuk pie chart
export function groupByCategory(expenses) {
  const grouped = expenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  return Object.entries(grouped).map(([category, total]) => ({
    category,
    total,
  }));
}