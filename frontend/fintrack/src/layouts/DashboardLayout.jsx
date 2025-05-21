import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, Folder, CreditCard, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/services/api";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: <Home className="w-5 h-5" /> },
  {
    label: "Portefeuilles",
    to: "/portfolios",
    icon: <Folder className="w-5 h-5" />,
  },
  {
    label: "Transactions",
    to: "/transactions",
    icon: <CreditCard className="w-5 h-5" />,
  },
  { label: "Profil", to: "/profile", icon: <User className="w-5 h-5" /> },
];

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
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
    <div className="flex min-h-screen text-gray-800 bg-gray-50">
      {/* SIDEBAR */}
      <aside className="flex flex-col justify-between w-64 px-6 py-8 bg-white border-r">
        <div className="space-y-8">
          <h1 className="text-2xl font-bold">FinTrack</h1>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md font-medium hover:bg-blue-100 transition",
                  location.pathname === item.to &&
                    "bg-primary text-white hover:bg-primary"
                )}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </Button>
      </aside>

      {/* MAIN */}
      <div className="flex flex-col flex-1">
        {/* HEADER */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b">
          {user && (
            <h2 className="text-lg font-semibold">
              Bienvenue,
              <span className="ml-1 font-bold underline underline-offset-2">
                {user.username || user.email}
              </span>
            </h2>
          )}
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
