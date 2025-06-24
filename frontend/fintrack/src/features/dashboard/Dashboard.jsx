import DashboardLayout from "@/shared/components/DashboardLayout";
import UserPortfolios from "./UserPortfolios";
import PortfolioChart from "./PortfolioChart";
import TopAssets from "./TopAssets";
import RecentTransactions from "./RecentTransactions";
import PortfolioPerformance from "./PortfolioPerformance";
import PortfolioPerformanceChart from "./PortfolioPerformanceChart";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="mb-6"></div>
      <UserPortfolios />

      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3"></div>

      <div className="grid grid-cols-1 grid-rows-2 gap-6 mb-6 md:grid-rows-2 md:grid-cols-2">
        <PortfolioPerformanceChart />
        <PortfolioChart />
        <TopAssets />
        <PortfolioPerformance />
      </div>

      <div className="mb-6">
        <RecentTransactions />
      </div>
    </DashboardLayout>
  );
}
