import { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";

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
    <DashboardCard
      title="Valeur totale"
      description="Montant global de vos actifs"
      value={`${totalValue} USD`}
      loading={loading}
      error={error}
    />
  );
}
