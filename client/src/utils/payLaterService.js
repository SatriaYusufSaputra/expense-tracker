const BASE_URL = `${import.meta.env.VITE_API_URL}/api/paylater`;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export async function fetchPayLaters() {
  const res = await fetch(BASE_URL, { headers: getHeaders() });
  return res.json();
}

export async function createPayLater(data) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updatePayLater(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deletePayLater(id) {
  await fetch(`${BASE_URL}/${id}`, { method: "DELETE", headers: getHeaders() });
}

export async function fetchPayLaterItems(payLaterId) {
  const res = await fetch(`${BASE_URL}/${payLaterId}/items`, {
    headers: getHeaders(),
  });
  return res.json();
}

export async function createPayLaterItem(payLaterId, data) {
  const res = await fetch(`${BASE_URL}/${payLaterId}/items`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

// Update fungsi markAsPaid — kirim walletId
export async function markAsPaid(itemId, walletId) {
  const res = await fetch(`${BASE_URL}/items/${itemId}/paid`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ walletId }), // ✅ kirim walletId
  });
  return res.json();
}

export async function deletePayLaterItem(itemId) {
  await fetch(`${BASE_URL}/items/${itemId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
}
