import { useEffect, useState } from "react";
import { CATEGORIES } from "./constants/categories";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import MobileHeader from "./components/MobileHeader";
import AuthForm from "./components/AuthForm";
import ExpenseTable from "./components/ExpenseTable";
import ExpenseForm from "./components/ExpenseForm";
import Charts from "./components/Charts";
import Footer from "./components/Footer";
import ProfilePage from "./components/ProfilePage";
import WalletPage from "./components/WalletPage";
import PayLaterPage from "./components/PayLaterPage";
import Dashboard from "./components/Dashboard";
import { fetchWallets } from "./utils/walletService";
import { fetchPayLaters } from "./utils/payLaterService";
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
  const [activePage, setActivePage] = useState("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [wallets, setWallets] = useState([]);
  const [payLaters, setPayLaters] = useState([]);
  const [type, setType] = useState("expense");
  const [walletId, setWalletId] = useState("");
  const [toWalletId, setToWalletId] = useState("");
  const [formError, setFormError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterCat, setFilterCat] = useState("semua");
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
    const loadAll = async () => {
      try {
        const [expensesData, walletsData, payLatersData] = await Promise.all([
          fetchExpenses(),
          fetchWallets(),
          fetchPayLaters(),
        ]);
        setExpenses(expensesData.map(mapExpense));
        setWallets(walletsData);
        setPayLaters(payLatersData);
      } catch (err) {
        console.error(err);
        handleLogout();
      }
    };
    loadAll();
  }, [user]);

  if (!user) return <AuthForm onLogin={(name) => setUser(name)} />;

  // ✅ handleCancel didefinisikan SEBELUM dipakai
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormError("");
    setName("");
    setAmount("");
    setDate("");
    setImage(null);
    setCategory("makanan");
    setType("expense");
    setWalletId("");
    setToWalletId("");
  };

  const addExpense = async () => {
    if (!name || !amount || !date) return;
    if (type === "transfer" && !toWalletId) return;
    setFormError("");

    const expensePayload = {
      type,
      name,
      amount: Number(amount),
      date,
      category: type === "expense" ? category : null,
      walletId: walletId || null,
      toWalletId: type === "transfer" ? toWalletId : null,
      image: type === "expense" ? image : null,
    };

    try {
      if (editingId) {
        const updated = await updateExpense(editingId, expensePayload);
        if (updated.message) {
          setFormError(updated.message);
          return;
        }
        setExpenses((prev) =>
          prev.map((item) =>
            item.id === editingId ? mapExpense(updated) : item,
          ),
        );
        setEditingId(null);
      } else {
        const created = await insertExpense(expensePayload);
        if (created.message) {
          setFormError(created.message);
          return;
        }
        setExpenses((prev) => [mapExpense(created), ...prev]);
      }

      // Refresh wallets supaya saldo terupdate
      const updatedWallets = await fetchWallets();
      setWallets(updatedWallets);

      // Reset form
      setName("");
      setAmount("");
      setDate("");
      setImage(null);
      setCategory("makanan");
      setType("expense");
      setWalletId("");
      setToWalletId("");
      setShowForm(false);
    } catch {
      setFormError("Gagal menyimpan transaksi");
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setAmount(String(item.amount));
    setDate(item.date);
    setCategory(item.category || "makanan");
    setImage(item.image);
    setType(item.type || "expense");
    setWalletId(item.walletId || "");
    setToWalletId(item.toWalletId || "");
    setShowForm(true);
    setActivePage("transaksi");
  };

  const deleteExpense = async (id) => {
    await deleteExpenseById(id);
    setExpenses((prev) => prev.filter((item) => item.id !== id));
    // Refresh wallets supaya saldo terupdate
    const updatedWallets = await fetchWallets();
    setWallets(updatedWallets);
  };

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

  const chartExpenses = expenses.filter((e) => e.date.startsWith(chartMonth));

  const handleNavigate = (page) => setActivePage(page);

  const handleAdd = () => {
    // Reset form sebelum buka
    setEditingId(null);
    setName("");
    setAmount("");
    setDate("");
    setImage(null);
    setCategory("makanan");
    setType("expense");
    setWalletId("");
    setToWalletId("");
    setFormError("");
    setShowForm(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
        <Sidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          onAdd={handleAdd}
          userName={user}
          onLogout={handleLogout}
        />

        <MobileHeader userName={user} />

        <main className="flex-1 lg:ml-60 px-4 lg:px-8 py-6 pb-24 lg:pb-8">
          <div className="max-w-4xl mx-auto flex flex-col gap-5">
            {activePage === "dashboard" && (
              <Dashboard
                expenses={expenses}
                wallets={wallets}
                payLaters={payLaters}
                onNavigate={handleNavigate}
              />
            )}

            {activePage === "grafik" && (
              <Charts
                expenses={chartExpenses}
                month={chartMonth}
                onMonthChange={setChartMonth}
              />
            )}

            {activePage === "transaksi" && (
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
            )}

            {activePage === "wallet" && (
              <WalletPage wallets={wallets} setWallets={setWallets} />
            )}

            {activePage === "paylater" && (
              <PayLaterPage
                payLaters={payLaters}
                setPayLaters={setPayLaters}
                wallets={wallets}
                onWalletsUpdate={async () => {
                  const updated = await fetchWallets();
                  setWallets(updated);
                }}
              />
            )}

            {activePage === "profil" && (
              <ProfilePage
                userName={user}
                onLogout={handleLogout}
                onUpdateName={(newName) => setUser(newName)}
              />
            )}
          </div>
        </main>

        <BottomNav
          activePage={activePage}
          onNavigate={handleNavigate}
          onAdd={handleAdd}
        />
      </div>

      <Footer />

      {/* ✅ ExpenseForm sebagai bottom sheet — di luar main, di level paling atas */}
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
          type={type}
          setType={setType}
          walletId={walletId}
          setWalletId={setWalletId}
          toWalletId={toWalletId}
          setToWalletId={setToWalletId}
          wallets={wallets}
          editingId={editingId}
          onSubmit={addExpense}
          onCancel={handleCancel}
          errorMsg={formError}
        />
      )}
    </div>
  );
}
