"use client";

import { useState } from "react";
import Header from '@/app/components/ui/HeaderComponent';
import Tabs from '@/app/components/ui/TabsComponent';
import Debts from '@/app/components/debts/Debts';
import Income from '@/app/components/income/Income';

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div>
      <main>
        {/* Header */}
        <Header />
        {/* Tabs */}
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Contenido dinámico */}
        <section className="px-4">
          {activeTab === "dashboard" && <p>📊 Contenido del Dashboard</p>}
          {activeTab === "deudas" && <Debts />}
          {activeTab === "ingresos" && <Income />}
        </section>
      </main>
    </div>
  );
}
