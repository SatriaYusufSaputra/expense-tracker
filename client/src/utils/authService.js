const BASE_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

export async function loginUser(email, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function registerUser(name, email, password) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export async function getProfile() {
  const res = await fetch(`${BASE_URL}/profile`, { headers: getHeaders() });
  return res.json();
}

export async function updateProfile(name, email) {
  const res = await fetch(`${BASE_URL}/profile`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ name, email }),
  });
  return res.json();
}

export async function verifyPassword(password) {
  const res = await fetch(`${BASE_URL}/verify-password`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ password }),
  });
  return res.json();
}

export async function changePassword(currentPassword, newPassword) {
  const res = await fetch(`${BASE_URL}/change-password`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return res.json();
}
