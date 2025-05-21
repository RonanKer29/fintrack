import { useEffect, useState } from "react";

export default function DashboardStats() {
  const [totalValue, setTotalValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }

        const data = await res.json();
        setTotalValue(data.total_value);
      } catch (err) {
        setError("Impossible de charger les statistiques.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 text-center bg-white rounded-md shadow max-w-1/4">
      <h2 className="text-lg font-semibold text-gray-700">Valeur totale</h2>
      <p className="mt-2 text-2xl font-bold text-primary">{totalValue} USD</p>
    </div>
  );
}
