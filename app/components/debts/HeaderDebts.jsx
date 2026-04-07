import { Plus } from "lucide-react";

export default function HeaderDebts({ debts, formatCurrency, openDialog }) {
  const totalDebts = debts?.reduce((sum, debt) => sum + debt.totalMount, 0);
  const totalDebtsPaid = debts?.reduce(
    (sum, debt) =>
      sum + debt.partialPayments.reduce((partialSum, partial) => partialSum + partial.mount, 0),
    0
  );

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6 rounded-2xl bg-white/5 border border-white/5">
      <div>
        <h2 className="text-xl font-semibold text-white">Gestión de Deudas</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Total: <span className="text-white font-medium">{formatCurrency(totalDebts)}</span>
          {totalDebtsPaid > 0 && (
            <span className="text-zinc-500">
              {" "}
              • Pagado: <span className="text-primary font-medium">{formatCurrency(totalDebtsPaid)}</span>
            </span>
          )}
        </p>
      </div>

      <button
        onClick={() => openDialog()}
        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-emerald-400 text-black font-medium rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 btn-shine cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        Nueva Deuda
      </button>
    </div>
  );
}