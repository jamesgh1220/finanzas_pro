import { Plus } from "lucide-react";

export default function HeaderDebts({ debts, formatCurrency, openDialog }) {
  const totalDebts = debts?.reduce((sum, deuda) => sum + deuda.montoTotal, 0);
   const totalDebtsPaid = debts?.reduce(
    (sum, deuda) => sum + deuda.abonos.reduce((abonoSum, abono) => abonoSum + abono.monto, 0),
    0,
  );

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Gestión de deudas
          </h2>
          <p className="text-sm text-gray">
            Total: {formatCurrency(totalDebts)} • Pagado: {formatCurrency(totalDebtsPaid)}
          </p>
        </div>

        <button onClick={() => openDialog()} className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Nueva deuda
        </button>
      </div>
    </>
  );
}