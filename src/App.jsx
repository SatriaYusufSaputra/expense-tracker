import { useEffect, useState } from "react";
import { CATEGORIES } from "./constants/categories";
import Header from "./components/Header";
import AuthForm from "./components/AuthForm";
import StatCards from "./components/StatCards";
import CategoryBreakdown from "./components/CategoryBreakdown";
import ExpenseTable from "./components/ExpenseTable";
import ExpenseForm from "./components/ExpenseForm";
import Charts from "./components/Charts";
import {
  fetchExpenses,
  insertExpense,
  updateExpense,
  deleteExpenseById,
} from "./utils/expenseService";

const mapExpense = (expense) => ({
  ...expense,
  id: expense._id || expense.id,
});

export default function App() {
  const [expenses, setExpenses] = useState([]);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [image, setImage] = useState(null);
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("makanan");
  const [editingId, setEditingId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterCat, setFilterCat] = useState("semua"); // filter kategori di tabel
  const [adding, setAdding] = useState(false);
  const [chartMonth, setChartMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [user, setUser] = useState(() =>
    localStorage.getItem("token")
      ? localStorage.getItem("userName") || "user"
      : null,
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setUser(null);
    setExpenses([]);
  };

  useEffect(() => {
    if (!user) return;

    const loadExpenses = async () => {
      try {
        const data = await fetchExpenses();
        setExpenses(data.map(mapExpense));
      } catch (err) {
        console.error(err);
        handleLogout();
      }
    };

    loadExpenses();
  }, [user]);

  if (!user) return <AuthForm onLogin={(name) => setUser(name)} />;

  const addExpense = async () => {
    if (!name || !amount || !date) return;

    const expensePayload = {
      name,
      amount: Number(amount),
      date,
      category,
      image,
    };

    if (editingId) {
      const updated = await updateExpense(editingId, expensePayload);
      setExpenses((prev) =>
        prev.map((item) =>
          item.id === editingId ? mapExpense(updated) : item,
        ),
      );
      setEditingId(null);
    } else {
      const created = await insertExpense(expensePayload);
      setExpenses((prev) => [mapExpense(created), ...prev]);
    }

    setName("");
    setAmount("");
    setDate("");
    setImage(null);
    setCategory("makanan");
    setAdding(false);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setAmount(item.amount);
    setDate(item.date);
    setCategory(item.category);
    setImage(item.image);
    setAdding(true); // buka form
  };

  const deleteExpense = async (id) => {
    await deleteExpenseById(id);
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const total = expenses.reduce((acc, item) => acc + Number(item.amount), 0);

  // Filter: tanggal + kategori
  const filteredExpenses = expenses.filter((item) => {
    const inRange =
      !startDate || !endDate
        ? true
        : item.date >= startDate && item.date <= endDate;
    const inCat = filterCat === "semua" ? true : item.category === filterCat;
    return inRange && inCat;
  });

  const filteredTotal = filteredExpenses.reduce(
    (acc, item) => acc + Number(item.amount),
    0,
  );
  const avgExpense = filteredExpenses.length
    ? filteredTotal / filteredExpenses.length
    : 0;

  // Ringkasan per kategori (dari semua data, bukan filter)
  const categoryBreakdown = CATEGORIES.map((cat) => ({
    ...cat,
    total: expenses
      .filter((e) => e.category === cat.id)
      .reduce((acc, e) => acc + Number(e.amount), 0),
    count: expenses.filter((e) => e.category === cat.id).length,
  }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.total - a.total);

  // Filter sebelum dikirim ke Charts
  const chartExpenses = expenses.filter((e) => e.date.startsWith(chartMonth));

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-5 lg:gap-8">
        {/* Header */}
        <Header
          onAdd={() => setAdding(!adding)}
          onLogout={handleLogout}
          userName={user}
        />

        {/* Stat Cards */}
        <StatCards
          total={total}
          expenseCount={expenses.length}
          filteredTotal={filteredTotal}
          filteredCount={filteredExpenses.length}
          avg={avgExpense}
        />

        {/* Charts */}
        <Charts
          expenses={chartExpenses}
          month={chartMonth}
          onMonthChange={setChartMonth}
        />

        {/* Category Breakdown */}
        <CategoryBreakdown breakdown={categoryBreakdown} total={total} />

        {/* Add Form */}
        {adding && (
          <ExpenseForm
            name={name}
            setName={setName}
            amount={amount}
            setAmount={setAmount}
            date={date}
            setDate={setDate}
            category={category}
            setCategory={setCategory}
            image={image}
            setImage={setImage}
            editingId={editingId}
            onSubmit={addExpense}
            onCancel={() => {
              setAdding(false);
              setEditingId(null);
            }}
          />
        )}
        {/* Table */}
        <ExpenseTable
          filteredExpenses={filteredExpenses}
          filteredTotal={filteredTotal}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          filterCat={filterCat}
          setFilterCat={setFilterCat}
          onEdit={startEdit}
          onDelete={deleteExpense}
        />
      </div>
    </div>
  );
}
