import { Calendar, Trash2, Plus, TrendingDown, TrendingUp } from "lucide-react";

export default function List({ incomes, openAddIncomeDialog, handleDelete }) {
  const getTotalIncomesByMonth = (income) => (income.expenses ?? []).reduce((total, expense) => total + expense.mount, 0);

  return (
    <div className="grid gap-4 lg:grid-cols-2 min-w-0">
      {incomes.map((income) => {
        const totalExpenses = getTotalIncomesByMonth(income);
        const available = income.totalIncomes - totalExpenses;
        const expensePercentage = Math.round((totalExpenses / income.totalIncomes) * 100);

        return (
          <div
            key={income.id}
            className="group relative p-4 sm:p-5 rounded-2xl bg-bg-card border border-border hover:border-primary/30 transition-all duration-300 min-w-0 overflow-hidden"
          >
            <div className="absolute inset-0 bg-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />

            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-fg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                      {income.month} {income.year}
                    </h3>
                    <p className="text-xs text-fg-muted">
                      Ingreso: <span className="text-fg font-medium">{income.totalIncomes.toLocaleString("es-CO")}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(income.id, 'income', `${income.month} ${income.year}`)}
                  className="p-1.5 text-fg-muted hover:text-danger transition-colors rounded-lg hover:bg-danger/10 cursor-pointer"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 min-w-0">
                <div className="p-3 sm:p-4 rounded-xl bg-danger/[0.04] border border-danger/20 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="h-3.5 w-3.5 text-danger" />
                    <span className="text-xs text-fg-muted">Gastos</span>
                  </div>
                  <p className="text-base sm:text-xl font-bold text-fg stat-value break-words">{totalExpenses.toLocaleString("es-CO")}</p>
                  <p className="text-xs text-fg-muted mt-1">{expensePercentage}% del ingreso</p>
                </div>
                <div className="p-3 sm:p-4 rounded-xl bg-success/[0.04] border border-success/20 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-3.5 w-3.5 text-success" />
                    <span className="text-xs text-fg-muted">Disponible</span>
                  </div>
                  <p className="text-base sm:text-xl font-bold text-fg stat-value break-words">{available.toLocaleString("es-CO")}</p>
                  <p className="text-xs text-fg-muted mt-1">{100 - expensePercentage}% del ingreso</p>
                </div>
              </div>

              {income.expenses?.length > 0 ? (
                <div className="mb-4">
                  <p className="text-xs font-medium text-fg-muted uppercase tracking-wider mb-3">Detalle de Gastos</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {income.expenses.map((gasto) => (
                      <div
                        key={gasto.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-bg-elevated border border-border"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-fg truncate">{gasto.categorie}</p>
                          <p className="text-xs text-danger font-medium">{gasto.mount.toLocaleString("es-CO")}</p>
                          {gasto.description && (
                            <p className="text-xs text-fg-muted mt-0.5 truncate">{gasto.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDelete(gasto.id, 'expense', gasto.categorie, income.id)}
                          className="p-1.5 text-fg-muted hover:text-danger transition-colors rounded-lg hover:bg-danger/10 cursor-pointer shrink-0"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-4 p-4 rounded-xl bg-bg-elevated text-center">
                  <p className="text-fg-muted text-xs">No hay gastos registrados</p>
                </div>
              )}

              <button
                onClick={() => openAddIncomeDialog(income)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-bg-elevated hover:bg-primary/[0.06] text-fg-muted hover:text-primary border border-border hover:border-primary/30 rounded-xl transition-all duration-300 font-medium text-sm cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Agregar gasto
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
