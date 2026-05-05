const BASE_URL = "http://localhost:3000/api/expenses";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export async function fetchExpenses() {
  const res = await fetch(BASE_URL, { headers: getHeaders() });
  return res.json();
}

export async function insertExpense(expense) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(expense),
  });
  return res.json();
}

export async function updateExpense(id, expense) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(expense),
  });
  return res.json();
}

export async function deleteExpenseById(id) {
  await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
}
