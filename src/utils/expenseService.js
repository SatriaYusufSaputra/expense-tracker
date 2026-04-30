const BASE_URL = "http://localhost:3000/api/expenses";

export async function fetchExpenses() {
  const res = await fetch(BASE_URL);
  return res.json();
}

export async function insertExpense(expense) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
  return res.json();
}

export async function updateExpense(id, expense) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
  return res.json();
}

export async function deleteExpenseById(id) {
  await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
}
