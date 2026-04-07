"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Header from '@/app/components/ui/HeaderComponent';
import Tabs from '@/app/components/ui/TabsComponent';
import HomeDashboard from '@/app/components/dashboard/Home';
import Debts from '@/app/components/debts/Debts';
import Income from '@/app/components/income/Income';

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <main>
        <Header />
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <section className="px-4">
          {activeTab === "dashboard" && <HomeDashboard />}
          {activeTab === "deudas" && <Debts />}
          {activeTab === "ingresos" && <Income />}
        </section>
      </main>
    </div>
  );
}