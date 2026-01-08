"use client";

import { useState } from "react";
import Header from '@/app/components/ui/HeaderComponent';
import Tabs from '@/app/components/ui/TabsComponent';

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
          {activeTab === "deudas" && <p>💳 Contenido de Deudas</p>}
          {activeTab === "ingresos" && <p>💰 Contenido de Ingresos</p>}
        </section>
      </main>
    </div>
  );
}
