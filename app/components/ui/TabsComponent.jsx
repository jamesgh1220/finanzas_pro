"use client";

import { LayoutDashboard, CreditCard, Wallet } from "lucide-react";

export default function Tabs({ activeTab, setActiveTab }) {
  const tabClass = (tab) =>
    `inline-flex items-center cursor-pointer px-2 py-1 rounded-xl transition-colors duration-300 lg:hover:bg-primary/70
     ${activeTab === tab ? "text-white bg-primary lg:px-10" : ""}`;

  return (
    <nav className="container mx-auto px-4 py-4 lg:px-8">
      <ul className="flex justify-between">
        <li
          className={tabClass("dashboard")}
          onClick={() => setActiveTab("dashboard")}
        >
          <LayoutDashboard className="mr-2 size-4 lg:size-6" />
          Dashboard
        </li>

        <li
          className={tabClass("deudas")}
          onClick={() => setActiveTab("deudas")}
        >
          <CreditCard className="mr-2 size-4 lg:size-6" />
          Deudas
        </li>

        <li
          className={tabClass("ingresos")}
          onClick={() => setActiveTab("ingresos")}
        >
          <Wallet className="mr-2 size-4 lg:size-6" />
          Ingresos
        </li>
      </ul>
    </nav>
  );
}
