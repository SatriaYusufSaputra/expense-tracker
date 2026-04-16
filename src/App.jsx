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
  
  const addExpense = () => {
    if (!name || !amount) return;

    const newExpense = {
      id: Date.now(),
      name,
      amount
    };

    setExpenses([...expenses, newExpense]);
    setName("");
    setAmount("");
  };

  //State untuk menyimpan gambar
  const [image, setImage] = useState(null);

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
        className="mb-3 rounded-lg max-h-40 object-cover"
        />
      )}


      <button 
      onClick={addExpense}
      className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
      Tambah</button>
      <h2 className="mt-6 font-semibold ">Total Pengeluaran: Rp {total}</h2>
      <p className="text-sm text-gray-500">Daftar Pengeluaran:</p>
      <ul className="mt-2 space-y-2">
        {expenses.map((item) => (
        <li key={item.id}
        className="flex justify-between items-center bg-gray-50 p-2 rounded"
        >
          <div>
            <p>{item.name}</p> 
            <p className="text-sm text-gray-500">Rp {item.amount}</p>
          </div>
          
          <button
            onClick={() => deleteExpense(item.id)}
            className="text-red-500 hover:text-red-700"
          >
          Hapus</button>
        </li>
      ))}
      </ul>
    </div>
    </div>
  );
}
export default App;