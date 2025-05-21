"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, LogOut, Home, Folder, CreditCard, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// ✅ Mutualisé ici pour usage partagé
export const navItems = [
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

// ✅ Sous-composant exporté pour le layout desktop
export function NavLinks({ isDesktop = false }) {
  const location = useLocation();

  return (
    <>
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md font-medium hover:bg-muted transition",
            location.pathname === item.to &&
              "bg-primary text-white hover:bg-primary"
          )}
        >
          <span className="flex-shrink-0">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </>
  );
}

export default function MobileMenu() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[260px]">
        <SheetHeader>
          <h1 className="text-xl font-bold text-left">FinTrack</h1>
        </SheetHeader>

        <nav className="mt-6 space-y-2">
          <NavLinks />
        </nav>

        <div className="pt-4 mt-6 border-t">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center justify-center w-full gap-2"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// 👇 Permet l'import MobileMenu.NavLinks
MobileMenu.NavLinks = NavLinks;
