const UPLOAD_URL = `${import.meta.env.VITE_API_URL}/api/upload`;

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(UPLOAD_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      // jangan set Content-Type — biar browser set otomatis dengan boundary
    },
    body: formData,
  });

  const data = await res.json();
  return data.url; // return URL Cloudinary
}
