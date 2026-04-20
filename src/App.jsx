import { useState, useEffect } from "react";

function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  //State untuk menyimpan gambar
  const [image, setImage] = useState(null);
  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const addExpense = () => {
  if (!name || !amount || !date) return;

  const newExpense = {
    id: Date.now(),
    name,
    amount,
    date,
    image
  };

  setExpenses([...expenses, newExpense]);
  setName("");
  setAmount("");
  setDate("");
  setImage(null);
};

  //Handle Upload Gambar
  const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImage(URL.createObjectURL(file));
  }
  };

  //Fungsi Delete
  const deleteExpense = (id) => {
    const filtered = expenses.filter((item) => item.id !== id);
    setExpenses(filtered);
  }

  //Hitung Total Uang
  const total = expenses.reduce((acc, item) => acc + Number(item.amount), 0);
  
  //Logic Filter
  const filteredExpenses = expenses.filter((item) => {
  if (!startDate || !endDate) return true;

  return item.date >= startDate && item.date <= endDate;
  });

  //Total berdasarkan Filter
  const filteredTotal = filteredExpenses.reduce(
  (acc, item) => acc + Number(item.amount),
  0
  );
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Expense Tracker</h1>

    <div className="flex gap-2 mb-4">
    <input
      type="text"
      placeholder="Nama pengeluaran"
      className="border p-2 rounded w-full"
      value={name}
      onChange={(e) => setName(e.target.value)}
      />

      <input
      type="number"
      placeholder="jumlah"
      className="border p-2 rounded w-full"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      />
      </div>
      <input
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      className="mb-3"
      />
      
      {/* tampilkan preview gambar */}
      {image && (
        <img
        src={image}
        alt="preview"
        className="mb-3 rounded-lg max-h-40"
        />
      )}

      <input
        type="date"
        className="border p-2 rounded w-full mb-2"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button 
      onClick={addExpense}
      className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
      Tambah</button>
      <h2 className="mt-6 font-semibold ">Total Pengeluaran: Rp {total}</h2>
      <p className="text-sm text-gray-500">Daftar Pengeluaran:</p>
      <div className="mt-4 overflow-x-auto">
        <div className="mt-4 flex gap-2">
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            type="date"
            className="border p-2 rounded w-full"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Tampilkan total hasil filter */}
        <h2 className="mt-4 font-semibold">
          Total (Filter): Rp {filteredTotal}
        </h2>

        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Tanggal</th>
              <th className="p-2 border">Nama</th>
              <th className="p-2 border">Jumlah</th>
              <th className="p-2 border">Struk</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filteredExpenses.map((item) => (
              <tr key={item.id} className="text-center">
                <td className="p-2 border">{new Date(item.date).toLocaleDateString("id-ID")}</td>
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border">Rp {item.amount}</td>

                <td className="p-2 border">
                  {item.image ? (
                    <img
                      src={item.image}
                      className="h-12 mx-auto rounded"
                    />
                  ) : (
                    "-"
                  )}
                </td>

                <td className="p-2 border">
                  <button
                    onClick={() => deleteExpense(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}
export default App;