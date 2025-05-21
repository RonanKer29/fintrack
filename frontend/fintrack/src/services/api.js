export async function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const res = await fetch("http://localhost:8000/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return null;

    return await res.json();
  } catch (error) {
    console.error("Erreur getCurrentUser:", error);
    return null;
  }
}
