import { Plus } from "lucide-react";

export default function HeaderDebts({ openDialog }) {

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Ingresos y Gastos
          </h2>
          <p className="text-sm text-gray">
            Gestiona tus ingresos mensuales y controla tus gastos
          </p>
        </div>

        <button onClick={() => openDialog()} className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Nuevo mes
        </button>
      </div>
    </>
  );
}