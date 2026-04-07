"use client";

import { useState } from "react";
import { Wallet, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";

export default function Header() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 rounded-xl blur-xl animate-pulse" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-400 shadow-lg shadow-primary/20">
                  <Wallet className="h-5 w-5 text-black" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-gradient">FinanzasPro</h1>
                <p className="text-xs text-zinc-500">Gestión financiera</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm text-zinc-400">{user.email}</span>
                </div>
              )}
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
                <span>Salir</span>
              </button>
            </div>

            <button
              className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/5 animate-slide-up">
              {user && (
                <div className="flex items-center gap-2 px-3 py-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm text-zinc-400">{user.email}</span>
                </div>
              )}
              <button
                onClick={() => {
                  setShowLogoutConfirm(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
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