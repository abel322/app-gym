"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "purple" | "pink" | "blue" | "green" | "orange";
  className?: string;
}

const colorClasses = {
  purple: {
    bg: "bg-purple-500/10",
    icon: "text-purple-500",
    gradient: "from-purple-500/20",
  },
  pink: {
    bg: "bg-pink-500/10",
    icon: "text-pink-500",
    gradient: "from-pink-500/20",
  },
  blue: {
    bg: "bg-blue-500/10",
    icon: "text-blue-500",
    gradient: "from-blue-500/20",
  },
  green: {
    bg: "bg-green-500/10",
    icon: "text-green-500",
    gradient: "from-green-500/20",
  },
  orange: {
    bg: "bg-orange-500/10",
    icon: "text-orange-500",
    gradient: "from-orange-500/20",
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "purple",
  className,
}: StatCardProps) {
  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={cn(
          "relative overflow-hidden hover:shadow-xl transition-shadow duration-300",
          className
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-0 hover:opacity-100 transition-opacity duration-300",
            colors.gradient,
            "to-transparent"
          )}
        />
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold mt-1">{value}</p>
              {trend && (
                <p
                  className={cn(
                    "text-sm mt-2 font-medium",
                    trend.isPositive ? "text-green-500" : "text-red-500"
                  )}
                >
                  {trend.isPositive ? "+" : ""}
                  {trend.value}% esta semana
                </p>
              )}
            </div>
            <div
              className={cn(
                "h-14 w-14 rounded-2xl flex items-center justify-center",
                colors.bg
              )}
            >
              <Icon className={cn("h-7 w-7", colors.icon)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}