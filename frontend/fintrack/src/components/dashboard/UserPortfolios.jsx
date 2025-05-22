import { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";

export default function UserPortfolios() {
  const [portfolioCount, setPortfolioCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/portfolios/mine", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (!res.ok) throw new Error("Loading error");

        const data = await res.json();
        setPortfolioCount(data.length);
      } catch (err) {
        setError("Porfolio data loading error");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  return (
    <DashboardCard
      title="Portefeuilles"
      description="Nombre total de portefeuilles"
      value={`${portfolioCount} portefeuille${portfolioCount > 1 ? "s" : ""}`}
      loading={loading}
      error={error}
    />
  );
}
