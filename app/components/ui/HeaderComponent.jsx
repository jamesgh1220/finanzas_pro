"use client";

import { Wallet, LogOut } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <>
      <header className="border-b border-slate-600">
        <div className="container mx-auto px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Wallet className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">FinanzasPro</h1>
                <p className="text-sm text-foreground">Gestión financiera personal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-zinc-400 hidden sm:block">
                  {user.email}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}