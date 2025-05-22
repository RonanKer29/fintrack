import DashboardLayout from "@/layouts/DashboardLayout";
import UserPortfolios from "@/components/dashboard/UserPortfolios";
import PortfolioChart from "@/components/dashboard/PortfolioChart";
import TopAssets from "@/components/dashboard/TopAssets";
import RecentTransactions from "@/components/dashboard/RecentTransactions";

export default function Dashboard() {
  return (
    <DashboardLayout>
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Main Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Follow your investments in real time
        </p>
      </div>

      {/* Portefeuilles de l'utilisateur */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
        <UserPortfolios />
      </div>

      {/* Graphiques : Répartition + Top actifs */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
        <PortfolioChart />
        <TopAssets />
      </div>

      {/* Historique des transactions */}
      <div className="mb-6">
        <RecentTransactions />
      </div>
    </DashboardLayout>
  );
}
