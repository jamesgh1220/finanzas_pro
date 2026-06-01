import { Plus } from "lucide-react";

export default function HeaderIncomes({ openDialog }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-5 rounded-2xl bg-bg-card border border-border animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold text-fg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Ingresos y Gastos</h2>
        <p className="text-sm text-fg-muted mt-0.5">
          Gestiona tus ingresos mensuales y controla tus gastos
        </p>
      </div>
      <button
        onClick={() => openDialog()}
        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        Nuevo mes
      </button>
    </div>
  );
}
