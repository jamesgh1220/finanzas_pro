import { Plus, TrendingDown, Trash2, Calendar, DollarSign } from "lucide-react";

export default function List({ debts, formatCurrency, handleDelete, openPartialPaymentDialog }) {
  const totalPaid = (debt) => debt.abonos.reduce((sum, abono) => sum + abono.monto, 0);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 text-foreground!">
        {debts.map((debt) => {
          const paid = totalPaid(debt);
          const remaining = debt.montoTotal - paid;
          const percentage = Math.round((paid / debt.montoTotal) * 100);

          return (
            <div
              key={debt.id}
              className="rounded-xl bg-card border border-slate-600 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">
                  {debt.nombre}
                </h3>

                <button
                  onClick={() => handleDelete(debt.id)}
                  className="text-slate-400 cursor-pointer hover:text-red-500 transition-all duration-200 hover:scale-110"
                >
                  <Trash2 className="size-5" />
                </button>
              </div>

              <div className="flex flex-col text-sm space-y-1">
                <div className="flex gap-x-4">
                  <div className="inline-flex items-center justify-center gap-x-2 border border-slate-600 px-2 py-1 rounded-lg w-fit">
                    <Calendar className="h-4 w-4" />
                    {debt.mesesEstimados} meses
                  </div>
                  <div className="inline-flex items-center justify-center gap-x-2 border border-slate-600 px-2 py-1 rounded-lg w-fit">
                    <DollarSign className="h-4 w-4" />
                    Cuota: {formatCurrency(debt.cuotaMinima)}
                  </div>
                </div>
                <div className="py-4 space-y-1">
                  <div className="text-base text-gray inline-flex justify-between w-full">
                    <div>
                      Progreso:
                    </div>
                    <div className="text-primary font-semibold">
                      {percentage}%
                    </div>
                  </div>
                  <div className="relative h-2 bg-primary/50 rounded-xl ml-auto w-full">
                    <div
                      className="absolute left-0 top-0 h-full bg-primary rounded-xl"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-gray inline-flex justify-between w-full">
                    <div>
                      Pagado: {formatCurrency(paid)}
                    </div>
                    <div>
                      Resta: {formatCurrency(remaining)}
                    </div>
                  </div>
                </div>
                <div className="flex pb-4">
                  <div className="flex-1">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-gray">Total deuda</p>
                      <p className="text-white! font-semibold">{formatCurrency(debt.montoTotal)}</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-gray">Abonos</p>
                      <p className="text-white! font-semibold">{debt.abonos.length} pagos</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-y-1 p-3 rounded-xl bg-secondary/50 mb-4">
                  <p className="text-gray">Último abono</p>
                  <p className="text-white! font-semibold">{formatCurrency(debt.abonos[debt.abonos.length - 1]?.monto ?? 0)}</p>
                  <p className="text-gray">{debt.abonos[debt.abonos.length - 1]?.fecha ?? ''}</p>
                </div>
                <button onClick={() => openPartialPaymentDialog(debt)} className="cursor-pointer font-medium flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                  Agregar abono
                </button>
              </div>
            </div>
          )
        })}

        {/* Estado vacío */}
        {debts.length === 0 && (
          <div className="col-span-full flex flex-col bg-card items-center justify-center rounded-xl border border-dashed border-border py-12 w-96 mx-auto">
            <TrendingDown className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No tienes deudas registradas
            </h3>
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Agrega tu primera deuda para comenzar el seguimiento
            </p>
          </div>
        )}
      </div>
    </>
  );
}