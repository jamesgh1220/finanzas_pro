import { Calendar, Trash2, Plus } from "lucide-react";

export default function List({ incomes, openAddIncomeDialog, handleDelete }) {
  const getTotalIncomesByMonth = (income) => (income.expenses ?? []).reduce((total, income) => total + income.mount, 0);

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        {incomes.map((income) => (
          <div
            key={income.id}
            className="rounded-xl border border-zinc-800 bg-card p-4 flex flex-col"
          >
            <div className="w-full flex items-center justify-between">
              {/* Info izquierda */}
              <div>
                <div className="flex items-center gap-x-2">
                  <Calendar className="size-5 text-primary" />
                  <h3 className="text-lg font-semibold text-white">
                    {income.month} {income.year}
                  </h3>
                </div>
                <p className="text-sm text-zinc-400">
                  Ingreso: ${income.totalIncomes.toLocaleString("es-CO")}
                </p>
              </div>

              {/* Monto */}
              <div className="text-right">
                <button
                  onClick={() => handleDelete(income.id)}
                  className="text-slate-400 cursor-pointer hover:text-red-500 transition-all duration-200 hover:scale-110"
                >
                  <Trash2 className="size-5" />
                </button>
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="grid grid-cols-2 gap-x-4">
                <div className="bg-secondary/50 rounded-xl p-3 space-y-1">
                  <p className="text-gray">Gastos</p>
                  <p className="text-danger font-semibold">$ {getTotalIncomesByMonth(income).toLocaleString("es-CO")}</p>
                  <p className="text-gray text-sm">{Math.round((getTotalIncomesByMonth(income) / income.totalIncomes) * 100)}.0 %</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-3 space-y-1">
                  <p className="text-gray">Disponible</p>
                  <p className="text-success font-semibold">$ {(income.totalIncomes - getTotalIncomesByMonth(income)).toLocaleString("es-CO")}</p>
                  <p className="text-gray text-sm">{Math.round(((income.totalIncomes - getTotalIncomesByMonth(income)) / income.totalIncomes) * 100)}.0 %</p>
                </div>
              </div>
              <div className="space-y-4 text-sm text-zinc-300">
                <span className="font-semibold text-base">Detalle de gastos</span>
                {income.expenses?.length > 0 ? (
                  income.expenses.map((gasto) => (
                    <div
                      key={gasto.id}
                      className="flex justify-between bg-secondary/50 p-4 rounded-xl mt-1"
                    >
                      <div>
                        <p className="font-semibold">{gasto.categorie} - ${gasto.mount.toLocaleString("es-CO")}</p>
                        {gasto.description && (
                          <p className="text-sm text-zinc-400">{gasto.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(gasto.id)}
                        className="text-gray cursor-pointer hover:text-red-500 transition-all duration-200 hover:scale-110"
                      >
                        <Trash2 className="size-5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-500 text-sm">No hay gastos registrados</p>
                )}
              </div>
              <button onClick={() => openAddIncomeDialog(income)} className="w-full cursor-pointer font-medium flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Agregar gasto
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Estado vacío */}
        {incomes.length === 0 && (
          <div className="rounded-xl border border-dashed border-zinc-700 bg-card p-8 text-center w-fit mx-auto">
            <div className="mb-4 text-zinc-500 text-4xl">📊</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No hay ingresos registrados
            </h3>
            <p className="text-sm text-zinc-400 mb-4">
              Registra tu primer ingreso mensual para comenzar el control
            </p>
          </div>
        )}
    </>
  );
}