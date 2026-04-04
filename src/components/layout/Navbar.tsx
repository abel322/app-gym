"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Dumbbell, Apple, TrendingUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNutritionOpen, setIsNutritionOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleNutrition = () => setIsNutritionOpen(!isNutritionOpen);

  const menuItems = [
    { name: "Inicio", href: "/", icon: null },
    { name: "Entrenamientos", href: "/#entrenamientos", icon: Dumbbell },
    { name: "Progreso", href: "/#progreso", icon: TrendingUp },
  ];

  const nutritionSubmenu = [
    { name: "Guía Completa de Nutrición", href: "/nutricion-info" },
    { name: "Dieta Superávit", href: "/dieta-superavit" },
    { name: "Mediciones y Progreso", href: "/mediciones-progreso" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-glow-purple">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              FitTrack Pro
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors duration-200"
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.name}</span>
              </Link>
            ))}
            
            {/* Nutrition Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors duration-200"
                onMouseEnter={() => setIsNutritionOpen(true)}
                onMouseLeave={() => setIsNutritionOpen(false)}
              >
                <Apple className="h-4 w-4" />
                <span>Nutrición</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {/* Dropdown Menu */}
              <div
                className={`absolute top-full left-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-lg border border-purple-500/20 rounded-lg shadow-lg transition-all duration-200 ${
                  isNutritionOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onMouseEnter={() => setIsNutritionOpen(true)}
                onMouseLeave={() => setIsNutritionOpen(false)}
              >
                {nutritionSubmenu.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-500/10 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-purple-400">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                Registrarse
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white p-2 rounded-lg hover:bg-purple-500/10 transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-purple-500/20">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={toggleMenu}
                className="flex items-center space-x-2 px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-500/10 rounded-lg transition-all duration-200"
              >
                {item.icon && <item.icon className="h-5 w-5" />}
                <span>{item.name}</span>
              </Link>
            ))}
            
            {/* Mobile Nutrition Submenu */}
            <div>
              <button
                onClick={toggleNutrition}
                className="flex items-center justify-between w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-500/10 rounded-lg transition-all duration-200"
              >
                <div className="flex items-center space-x-2">
                  <Apple className="h-5 w-5" />
                  <span>Nutrición</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isNutritionOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isNutritionOpen && (
                <div className="ml-4 mt-2 space-y-2">
                  {nutritionSubmenu.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={toggleMenu}
                      className="block px-4 py-2 text-gray-400 hover:text-white hover:bg-purple-500/10 rounded-lg transition-all duration-200"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <div className="pt-4 space-y-2">
              <Link href="/login" onClick={toggleMenu}>
                <Button variant="ghost" className="w-full text-white hover:text-purple-400">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/register" onClick={toggleMenu}>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  Registrarse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
