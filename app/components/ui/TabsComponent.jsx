"use client";

import { useState, useEffect, useRef } from "react";
import { LayoutDashboard, CreditCard, Wallet } from "lucide-react";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "deudas", label: "Deudas", icon: CreditCard },
  { id: "ingresos", label: "Ingresos", icon: Wallet },
];

export default function Tabs({ activeTab, setActiveTab }) {
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef([]);

  useEffect(() => {
    const activeIndex = tabs.findIndex((t) => t.id === activeTab);
    const activeTabEl = tabsRef.current[activeIndex];
    
    if (activeTabEl) {
      setIndicatorStyle({
        width: `${activeTabEl.offsetWidth}px`,
        transform: `translateX(${activeTabEl.offsetLeft}px)`,
      });
    }
  }, [activeTab]);

  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-center">
        <div className="relative flex items-center gap-1 p-1.5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-xl">
          <div
            className="absolute top-1.5 h-[calc(100%-12px)] rounded-xl bg-gradient-to-r from-primary to-emerald-400 shadow-lg shadow-primary/25 transition-all duration-300 ease-out"
            style={indicatorStyle}
          />
          
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                ref={(el) => (tabsRef.current[index] = el)}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 z-10 cursor-pointer
                  ${isActive 
                    ? "text-black" 
                    : "text-zinc-400 hover:text-zinc-200"
                  }
                `}
              >
                <Icon className={`relative w-4 h-4 ${isActive ? "text-black" : "text-zinc-400"}`} />
                <span className="relative">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}