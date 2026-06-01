import { Plus, Trash2, Calendar, DollarSign, CreditCard } from "lucide-react";

export default function List({ debts, handleDelete, openPartialPaymentDialog, formatCurrency }) {
  const totalPaid = (debt) => debt.partialPayments.reduce((sum, partial) => sum + partial.mount, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 min-w-0">
      {debts.map((debt) => {
        const paid = totalPaid(debt);
        const remaining = debt.totalMount - paid;
        const percentage = Math.round((paid / debt.totalMount) * 100);

        return (
          <div
            key={debt.id}
            className="group relative p-4 sm:p-5 rounded-2xl bg-bg-card border border-border hover:border-primary/30 transition-all duration-300 min-w-0 overflow-hidden"
          >
            <div className="absolute inset-0 bg-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />

            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-danger/10">
                    <CreditCard className="h-4 w-4 text-danger" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-fg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{debt.name}</h3>
                    <p className="text-xs text-fg-muted">{debt.estimateMonths} meses estimado</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(debt.id, "debt", debt.name)}
                  className="p-1.5 text-fg-muted hover:text-danger transition-colors rounded-lg hover:bg-danger/10 cursor-pointer"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-elevated border border-border">
                  <Calendar className="h-3.5 w-3.5 text-fg-muted" />
                  <span className="text-xs text-fg-muted">{debt.estimateMonths} meses</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-elevated border border-border">
                  <DollarSign className="h-3.5 w-3.5 text-fg-muted" />
                  <span className="text-xs text-fg-muted">{formatCurrency(debt.minimumFee)}/mes</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-fg-muted">Progreso</span>
                  <span className="text-base font-bold text-primary stat-value">{percentage}%</span>
                </div>
                <div className="relative h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-success">Pagado: {formatCurrency(paid)}</span>
                  <span className="text-danger">Resta: {formatCurrency(remaining)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4 p-3 rounded-xl bg-bg-elevated min-w-0">
                <div className="min-w-0">
                  <p className="text-xs text-fg-muted mb-0.5">Total Deuda</p>
                  <p className="text-sm font-semibold text-fg stat-value break-words">{formatCurrency(debt.totalMount)}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-fg-muted mb-0.5">Abonos</p>
                  <p className="text-sm font-semibold text-fg">{debt.partialPayments.length} pagos</p>
                </div>
              </div>

              {debt.partialPayments?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-fg-muted uppercase tracking-wider mb-3">Detalle de Abonos</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {debt.partialPayments.slice().reverse().map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-bg-elevated border border-border"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-success">{formatCurrency(payment.mount)}</p>
                          <p className="text-xs text-fg-muted">{payment.date}</p>
                          {payment.description && (
                            <p className="text-xs text-fg-muted mt-0.5 truncate">{payment.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() =>
                            handleDelete(payment.id, "partialPayment", formatCurrency(payment.mount), debt.id)
                          }
                          className="p-1.5 text-fg-muted hover:text-danger transition-colors rounded-lg hover:bg-danger/10 cursor-pointer shrink-0"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => openPartialPaymentDialog(debt)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-bg-elevated hover:bg-primary/[0.06] text-fg-muted hover:text-primary border border-border hover:border-primary/30 rounded-xl transition-all duration-300 font-medium text-sm cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Agregar abono
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
