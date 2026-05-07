import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CATEGORIES } from "../constants/categories";

const getCatLabel = (id) => {
  const cat = CATEGORIES.find((c) => c.id === id);
  return cat ? `${cat.emoji} ${cat.label}` : id;
};

const formatRupiah = (num) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);

// ========== EXPORT EXCEL ==========
export function exportToExcel(expenses, filename = "laporan-pengeluaran") {
  const data = expenses.map((item) => ({
    Tanggal: new Date(item.date).toLocaleDateString("id-ID"),
    Nama: item.name,
    Kategori: getCatLabel(item.category),
    Jumlah: Number(item.amount),
  }));

  // Tambah baris total di bawah
  const total = expenses.reduce((acc, e) => acc + Number(e.amount), 0);
  data.push({ Tanggal: "", Nama: "", Kategori: "TOTAL", Jumlah: total });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Pengeluaran");
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

// ========== EXPORT PDF ==========
export function exportToPDF(expenses, filename = "laporan-pengeluaran") {
  const doc = new jsPDF();

  // Judul
  doc.setFontSize(16);
  doc.text("Laporan Pengeluaran", 14, 20);
  doc.setFontSize(10);
  doc.text(`Dicetak: ${new Date().toLocaleDateString("id-ID")}`, 14, 28);

  // Tabel
  const rows = expenses.map((item) => [
    new Date(item.date).toLocaleDateString("id-ID"),
    item.name,
    getCatLabel(item.category),
    formatRupiah(item.amount),
  ]);

  const total = expenses.reduce((acc, e) => acc + Number(e.amount), 0);

  autoTable(doc, {
    startY: 35,
    head: [["Tanggal", "Nama", "Kategori", "Jumlah"]],
    body: rows,
    foot: [["", "", "Total", formatRupiah(total)]],
    styles: { fontSize: 9 },
    headStyles: { fillColor: [22, 101, 52] }, // hijau
    footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
  });

  doc.save(`${filename}.pdf`);
}
