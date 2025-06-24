"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { Menu, LogOut, Home, Folder, CreditCard, User } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/utils/utils";

export const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: <Home className="w-5 h-5" /> },
  {
    label: "My Portfolio",
    to: "/portfolios",
    icon: <Folder className="w-5 h-5" />,
  },
  {
    label: "Transactions",
    to: "/transactions",
    icon: <CreditCard className="w-5 h-5" />,
  },
  { label: "My Profile", to: "/profile", icon: <User className="w-5 h-5" /> },
];

export function NavLinks() {
  const location = useLocation();

  return (
    <div className="flex flex-col gap-1">
      {navItems.map((item) => {
        const isActive = location.pathname === item.to;

        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors group",
              isActive
                ? "bg-[#212121] text-[#facc15] cursor-default"
                : "text-[#a1a1aa] hover:bg-[#212121] hover:text-white"
            )}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </div>
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
          <Menu className="w-12 h-12 text-[#a1a1aa]" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[260px] bg-[#0f0f0f] text-white flex flex-col h-full p-0"
      >
        <div className="flex flex-col h-full">
          <div className="px-6 pt-4">
            <SheetHeader>
              <Link
                to="/dashboard"
                className="text-xl font-bold text-[#facc15] text-left"
              >
                FinTrack
              </Link>
            </SheetHeader>
          </div>

          <nav className="flex-1 px-6 pt-4 overflow-y-auto">
            <NavLinks />
          </nav>

          <div className="border-t border-[#1f1f1f] px-6 py-4">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-[#a1a1aa] hover:text-[#facc15] transition"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

MobileMenu.NavLinks = NavLinks;
