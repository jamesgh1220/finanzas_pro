"use client";

import { useState, useEffect } from "react";
import { Wallet, LogOut, Menu, X, Sun, Moon } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";

export default function Header() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-black shadow-lg shadow-primary/20">
                <Wallet className="h-5 w-5" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-semibold text-fg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  FinanzasPro
                </h1>
                <p className="text-xs text-fg-muted">Gestión financiera</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 text-fg-muted hover:text-fg hover:bg-bg-hover rounded-lg transition-colors cursor-pointer"
                title={isDark ? "Modo claro" : "Modo oscuro"}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {user && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-elevated text-sm text-fg-muted border border-border">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="max-w-[160px] truncate">{user.email}</span>
                </div>
              )}
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-fg-muted hover:text-fg hover:bg-bg-hover rounded-lg transition-colors cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
                <span>Salir</span>
              </button>
            </div>

            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 text-fg-muted hover:text-fg hover:bg-bg-hover rounded-lg transition-colors cursor-pointer"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button
                className="p-2 text-fg-muted hover:text-fg transition-colors cursor-pointer"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border animate-slide-up">
              {user && (
                <div className="flex items-center gap-2 px-3 py-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-sm text-fg-muted truncate">{user.email}</span>
                </div>
              )}
              <button
                onClick={() => {
                  setShowLogoutConfirm(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-fg-muted hover:text-fg hover:bg-bg-hover rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Cerrar sesión"
        message="¿Estás seguro de que deseas cerrar sesión?"
        confirmText="Cerrar sesión"
        cancelText="Cancelar"
      />
    </>
  );
}
