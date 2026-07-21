"use client";

import { useSession } from "next-auth/react";
import { User, Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
  title: string;
  description?: string;
  onMenuClick?: () => void;
}

export function Header({ title, description, onMenuClick }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b w-full">
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6 py-2 gap-2">
        {/* Title & Mobile menu section */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {onMenuClick && (
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden shrink-0 h-9 w-9 glass"
              onClick={onMenuClick}
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="min-w-0">
            <h1 className="text-base sm:text-2xl font-bold truncate leading-tight">{title}</h1>
            {description && (
              <p className="text-xs sm:text-sm text-muted-foreground truncate hidden xs:block sm:block">{description}</p>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Search */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="w-64 pl-9 bg-muted/50"
            />
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Notificaciones</TooltipContent>
          </Tooltip>

          {/* User */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium">{session?.user?.name}</p>
              <p className="text-xs text-muted-foreground">Usuario</p>
            </div>
            <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-primary/20">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback className="bg-gradient-primary text-white">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}