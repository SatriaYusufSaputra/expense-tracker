const BASE_URL = `${import.meta.env.VITE_API_URL}/api/wallets`;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export async function fetchWallets() {
  const res = await fetch(BASE_URL, { headers: getHeaders() });
  return res.json();
}

export async function createWallet(data) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateWallet(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateBalance(id, amount, operation) {
  const res = await fetch(`${BASE_URL}/${id}/balance`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ amount, operation }),
  });
  return res.json();
}

export async function deleteWallet(id) {
  await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
}
