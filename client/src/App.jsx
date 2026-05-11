import { useEffect, useState } from "react";
import { CATEGORIES } from "./constants/categories";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import MobileHeader from "./components/MobileHeade";
import AuthForm from "./components/AuthForm"; // ✅ cukup sekali
import StatCards from "./components/StatCards";
import CategoryBreakdown from "./components/CategoryBreakdown";
import ExpenseTable from "./components/ExpenseTable";
import ExpenseForm from "./components/ExpenseForm";
import Charts from "./components/Charts";
import ProfileModal from "./components/ProfileModal";
import Footer from "./components/Footer";
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

const getToday = () => {
  return new Date().toISOString().split("T")[0];
};

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [image, setImage] = useState(null);
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("makanan");
  const [editingId, setEditingId] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [startDate, setStartDate] = useState(getToday());
  const [endDate, setEndDate] = useState(getToday());
  const [filterCat, setFilterCat] = useState("semua");
  const [chartMonth, setChartMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    });

  // ✅ Deklarasi user & handleLogout cukup sekali, di sini
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
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setAmount(item.amount);
    setDate(item.date);
    setCategory(item.category);
    setImage(item.image);

    setShowForm(true);
    setActivePage("transaksi");
  };

  const deleteExpense = async (id) => {
    await deleteExpenseById(id);
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const total = expenses.reduce((acc, item) => acc + Number(item.amount), 0);

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

  const categoryBreakdown = CATEGORIES.map((cat) => ({
    ...cat,
    total: expenses
      .filter((e) => e.category === cat.id)
      .reduce((acc, e) => acc + Number(e.amount), 0),
    count: expenses.filter((e) => e.category === cat.id).length,
  }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.total - a.total);

  const chartExpenses = expenses.filter((e) => e.date.startsWith(chartMonth));
  
  const handleNavigate = (page) => {
    if (page === "profil") {
      setShowProfile(true);
    } else {
      setActivePage(page);
    }
  };

  const handleAdd = () => {
    setShowForm(true);
    setActivePage("transaksi"); // pindah ke halaman transaksi saat tambah
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
        {/* Sidebar — hanya desktop */}
        <Sidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          onAdd={handleAdd}
          userName={user}
          onLogout={handleLogout}
        />

        {/* Header — hanya mobile */}
        <MobileHeader userName={user} />

        {/* Main content — bergeser ke kanan di desktop karena sidebar */}
        <main className="flex-1 lg:ml-60 px-4 lg:px-8 py-6 pb-24 lg:pb-8">
          <div className="max-w-4xl mx-auto flex flex-col gap-5">
            {/* Dashboard */}
            {activePage === "dashboard" && (
              <>
                <StatCards
                  total={total}
                  expenseCount={expenses.length}
                  filteredTotal={filteredTotal}
                  filteredCount={filteredExpenses.length}
                  avg={avgExpense}
                />
                <CategoryBreakdown
                  breakdown={categoryBreakdown}
                  total={total}
                />
              </>
            )}

            {/* Grafik */}
            {activePage === "grafik" && (
              <Charts
                expenses={chartExpenses}
                month={chartMonth}
                onMonthChange={setChartMonth}
              />
            )}

            {/* Transaksi */}
            {activePage === "transaksi" && (
              <>
                {showForm && (
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
                      setShowForm(false);
                      setEditingId(null);
                    }}
                  />
                )}
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
              </>
            )}
          </div>
        </main>

        {/* Bottom Nav — hanya mobile */}
        <BottomNav
          activePage={activePage}
          onNavigate={handleNavigate}
          onAdd={handleAdd}
        />

        {/* Profile Modal */}
        {showProfile && (
          <ProfileModal
            onClose={() => setShowProfile(false)}
            onUpdateName={(name) => {
              setUser(name);
              setShowProfile(false);
            }}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
