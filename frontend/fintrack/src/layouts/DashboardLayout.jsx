import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    <div className="flex min-h-screen text-gray-800 bg-[#131314]">
      {/* SIDEBAR DESKTOP FIXED */}
      <aside className="hidden md:flex fixed top-0 left-0 w-64 h-screen flex-col bg-[#131314] px-6 py-8 justify-between z-50">
        <div className="flex flex-col gap-8">
          <Link to="/dashboard" className="text-2xl font-bold text-[#facc15]">
            FinTrack
          </Link>

          <nav className="space-y-2">
            <MobileMenu.NavLinks isDesktop />
          </nav>
        </div>

        {/* Bas : Logout fixé */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-[#facc15]"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </aside>

      {/* MOBILE HEADER */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-[#131314] border-b border-[#1f1f1f] md:hidden">
        <header className="flex items-center justify-between px-4 py-3">
          <Link to="/dashboard" className="text-xl font-bold text-[#facc15]">
            FinTrack
          </Link>

          <MobileMenu />
        </header>
      </div>

      {/* MAIN CONTENT (Décalé à droite de la sidebar) */}
      <div className="flex flex-col flex-1 w-full md:ml-64">
        <main className="flex-1 p-6 mt-16 overflow-auto md:mt-0">
          {user && (
            <h2 className="mb-4 text-lg font-semibold text-white">
              Welcome,
              <span className="ml-1 font-bold text-[#facc15]">
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
