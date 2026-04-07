import { Calendar, Trash2, Plus, TrendingDown, TrendingUp } from "lucide-react";

export default function List({ incomes, openAddIncomeDialog, handleDelete }) {
  const getTotalIncomesByMonth = (income) => (income.expenses ?? []).reduce((total, expense) => total + expense.mount, 0);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {incomes.map((income) => {
        const totalExpenses = getTotalIncomesByMonth(income);
        const available = income.totalIncomes - totalExpenses;
        const expensePercentage = Math.round((totalExpenses / income.totalIncomes) * 100);

        return (
          <div
            key={income.id}
            className="group relative p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            
            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {income.month} {income.year}
                    </h3>
                    <p className="text-sm text-zinc-500">
                      Ingreso: <span className="text-white font-medium">{income.totalIncomes.toLocaleString("es-CO")}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(income.id, 'income', `${income.month} ${income.year}`)}
                  className="p-2 text-zinc-500 hover:text-danger transition-colors rounded-lg hover:bg-danger/10 cursor-pointer"
                >
                  <Trash2 className="size-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-4 rounded-xl bg-danger/10 border border-danger/20">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="h-4 w-4 text-danger" />
                    <span className="text-xs text-zinc-400">Gastos</span>
                  </div>
                  <p className="text-xl font-bold text-white">{totalExpenses.toLocaleString("es-CO")}</p>
                  <p className="text-xs text-zinc-500 mt-1">{expensePercentage}% del ingreso</p>
                </div>
                <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-xs text-zinc-400">Disponible</span>
                  </div>
                  <p className="text-xl font-bold text-white">{available.toLocaleString("es-CO")}</p>
                  <p className="text-xs text-zinc-500 mt-1">{100 - expensePercentage}% del ingreso</p>
                </div>
              </div>

              {income.expenses?.length > 0 ? (
                <div className="mb-4">
                  <p className="text-sm font-medium text-white mb-3">Detalle de Gastos</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {income.expenses.map((gasto) => (
                      <div
                        key={gasto.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white truncate">{gasto.categorie}</p>
                          <p className="text-sm text-danger">{gasto.mount.toLocaleString("es-CO")}</p>
                          {gasto.description && (
                            <p className="text-xs text-zinc-500 mt-1 truncate">{gasto.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDelete(gasto.id, 'expense', gasto.categorie, income.id)}
                          className="p-1.5 text-zinc-500 hover:text-danger transition-colors rounded-lg hover:bg-danger/10 cursor-pointer"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-4 p-4 rounded-xl bg-white/5 text-center">
                  <p className="text-zinc-500 text-sm">No hay gastos registrados</p>
                </div>
              )}

              <button 
                onClick={() => openAddIncomeDialog(income)} 
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-primary/20 text-white hover:text-primary border border-white/10 hover:border-primary/30 rounded-xl transition-all duration-300 font-medium cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Agregar Gasto
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}