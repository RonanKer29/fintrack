import PortfolioChart from "@/components/dashboard/PortfolioChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import TopAssets from "@/components/dashboard/TopAssets";
import UserPortfolios from "@/components/dashboard/UserPortfolios";
import DashboardLayout from "@/layouts/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground">
          Suivi de vos investissements en temps réel.
        </p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
        <UserPortfolios />
      </div>

      {/* Graphique + Top actifs */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
        <PortfolioChart />
        <TopAssets />
      </div>

      {/* Transactions récentes */}
      <div className="mb-6">
        <RecentTransactions />
      </div>
    </DashboardLayout>
  );
}
