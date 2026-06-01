import { Plus } from "lucide-react";

export default function HeaderDebts({ debts, formatCurrency, openDialog }) {
  const totalDebts = debts?.reduce((sum, debt) => sum + debt.totalMount, 0);
  const totalDebtsPaid = debts?.reduce(
    (sum, debt) =>
      sum + debt.partialPayments.reduce((partialSum, partial) => partialSum + partial.mount, 0),
    0
  );

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-5 rounded-2xl bg-bg-card border border-border animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold text-fg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Gestión de Deudas</h2>
        <p className="text-sm text-fg-muted mt-0.5">
          Total: <span className="text-fg font-medium">{formatCurrency(totalDebts)}</span>
          {totalDebtsPaid > 0 && (
            <span className="text-fg-muted">
              {" "}
              • Pagado: <span className="text-success font-medium">{formatCurrency(totalDebtsPaid)}</span>
            </span>
          )}
        </p>
      </div>

      <button
        onClick={() => openDialog()}
        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        Nueva deuda
      </button>
    </div>
  );
}
