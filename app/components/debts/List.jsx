import { Plus, Trash2, Calendar, DollarSign, CreditCard } from "lucide-react";

export default function List({ debts, handleDelete, openPartialPaymentDialog, formatCurrency }) {
  const totalPaid = (debt) => debt.partialPayments.reduce((sum, partial) => sum + partial.mount, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {debts.map((debt) => {
        const paid = totalPaid(debt);
        const remaining = debt.totalMount - paid;
        const percentage = Math.round((paid / debt.totalMount) * 100);

        return (
          <div
            key={debt.id}
            className="group relative p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-danger/10">
                    <CreditCard className="h-5 w-5 text-danger" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{debt.name}</h3>
                    <p className="text-sm text-zinc-500">{debt.estimateMonths} meses estimado</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(debt.id, "debt", debt.name)}
                  className="p-2 text-zinc-500 hover:text-danger transition-colors rounded-lg hover:bg-danger/10 cursor-pointer"
                >
                  <Trash2 className="size-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                  <Calendar className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm text-zinc-400">{debt.estimateMonths} meses</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                  <DollarSign className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm text-zinc-400">{formatCurrency(debt.minimumFee)}/mes</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-500">Progreso</span>
                  <span className="text-lg font-bold text-primary">{percentage}%</span>
                </div>
                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-success">Pagado: {formatCurrency(paid)}</span>
                  <span className="text-danger">Resta: {formatCurrency(remaining)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4 p-3 rounded-xl bg-white/5">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Total Deuda</p>
                  <p className="text-base font-semibold text-white">{formatCurrency(debt.totalMount)}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Abonos</p>
                  <p className="text-base font-semibold text-white">{debt.partialPayments.length} pagos</p>
                </div>
              </div>

              {debt.partialPayments?.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-white mb-3">Detalle de Abonos</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {debt.partialPayments.slice().reverse().map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                      >
                        <div>
                          <p className="font-semibold text-success">{formatCurrency(payment.mount)}</p>
                          <p className="text-xs text-zinc-500">{payment.date}</p>
                          {payment.description && (
                            <p className="text-sm text-zinc-400 mt-1">{payment.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() =>
                            handleDelete(payment.id, "partialPayment", formatCurrency(payment.mount), debt.id)
                          }
                          className="p-1.5 text-zinc-500 hover:text-danger transition-colors rounded-lg hover:bg-danger/10 cursor-pointer"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => openPartialPaymentDialog(debt)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-primary/20 text-white hover:text-primary border border-white/10 hover:border-primary/30 rounded-xl transition-all duration-300 font-medium cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Agregar Abono
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}