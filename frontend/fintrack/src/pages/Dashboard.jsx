import DashboardStats from "@/components/dashboard/DashboardStats";
import PortfolioChart from "@/components/dashboard/PortfolioChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import TopAssets from "@/components/dashboard/TopAssets";
import DashboardLayout from "@/layouts/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardStats />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <PortfolioChart />
        <TopAssets />
      </div>
      <RecentTransactions />
    </DashboardLayout>
  );
}
