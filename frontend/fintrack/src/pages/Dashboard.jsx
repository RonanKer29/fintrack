import DashboardLayout from "@/layouts/DashboardLayout";
import UserPortfolios from "@/components/dashboard/UserPortfolios";
import PortfolioChart from "@/components/dashboard/PortfolioChart";
import TopAssets from "@/components/dashboard/TopAssets";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import PortfolioPerformance from "@/components/dashboard/PortfolioPerformance";
import PortfolioPerformanceChart from "@/components/dashboard/PortfolioPerformanceChart";

export default function Dashboard() {
  return (
    <DashboardLayout>
      {/* En-tête */}
      <div className="mb-6"></div>
      <UserPortfolios />
      {/* Portefeuilles de l'utilisateur */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3"></div>

      {/* Graphiques : Répartition + Top actifs */}
      <div className="grid grid-cols-1 grid-rows-2 gap-6 mb-6 md:grid-rows-2 md:grid-cols-2">
        <PortfolioPerformanceChart />
        <PortfolioChart />
        <TopAssets />
        <PortfolioPerformance />
      </div>

      {/* Historique des transactions */}
      <div className="mb-6">
        <RecentTransactions />
      </div>
    </DashboardLayout>
  );
}
