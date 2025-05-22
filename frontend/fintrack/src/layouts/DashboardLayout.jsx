import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/services/api";
import MobileMenu from "@/components/layout/MobileMenu";
import { LogOut } from "lucide-react";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser().then((data) => {
      if (data) setUser(data);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="flex flex-col min-h-screen text-gray-800 bg-gray-50 md:flex-row">
      {/* SIDEBAR DESKTOP */}
      <aside className="flex-col justify-between hidden w-64 px-6 py-8 bg-white border-r md:flex">
        <div className="space-y-8">
          <h1 className="text-2xl font-bold">FinTrack</h1>
          <nav className="space-y-2">
            <MobileMenu.NavLinks isDesktop />
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-red-600"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </aside>

      {/* HEADER MOBILE */}
      <div className="md:hidden">
        <header className="flex items-center justify-between px-4 py-3 bg-white border-b">
          <h1 className="text-xl font-bold">FinTrack</h1>
          <MobileMenu />
        </header>
      </div>

      {/* MAIN */}
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-6 overflow-auto">
          {user && (
            <h2 className="mb-4 text-lg font-semibold">
              Welcome,
              <span className="ml-1 font-bold text-primary">
                {user.username || user.email}
              </span>
            </h2>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
