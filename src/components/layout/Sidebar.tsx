"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  Ruler,
  Dumbbell,
  Utensils,
  BarChart3,
  TrendingUp,
  LogOut,
  Menu,
  X,
  Database,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Perfil", href: "/profile", icon: User },
  { name: "Mediciones", href: "/measurements", icon: Ruler },
  { name: "Entrenamientos", href: "/workouts", icon: Dumbbell },
  { name: "Nutrición", href: "/nutrition", icon: Utensils },
  { name: "Base de Datos", href: "/dashboard/food-database", icon: Database },
  { name: "Análisis", href: "/analytics", icon: BarChart3 },
  { name: "Progreso", href: "/progress", icon: TrendingUp },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [internalOpen, setInternalOpen] = useState(false);

  const isMobileOpen = isOpen !== undefined ? isOpen : internalOpen;
  const handleClose = onClose || (() => setInternalOpen(false));

  return (
    <>
      {/* Mobile sidebar overlay & drawer */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-300",
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={handleClose}
      >
        <div
          className={cn(
            "fixed left-0 top-0 h-full w-64 max-w-[85vw] bg-background border-r p-4 sm:p-6 transition-transform duration-300 shadow-2xl flex flex-col justify-between",
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <SidebarContent pathname={pathname} onClose={handleClose} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-64 lg:block">
        <div className="flex h-full flex-col bg-background border-r p-6">
          <SidebarContent pathname={pathname} />
        </div>
      </div>
    </>
  );
}

function SidebarContent({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        {/* Logo */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-purple shrink-0">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Body Transform</h1>
              <p className="text-xs text-muted-foreground">Planner</p>
            </div>
          </Link>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={onClose}
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-primary text-white shadow-lg"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="border-t pt-4 mt-auto">
        <button
          onClick={() => {
            if (onClose) onClose();
            signOut({ callbackUrl: "/login" });
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}