import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function GraphsHistory({ debts, formatCurrency }) {
  const chartData = debts.map((debt) => {
    const totalPaid = debt.abonos.reduce((sum, partialPayment) => sum + partialPayment.monto, 0)
    const pendingPayment = debt.montoTotal - totalPaid
    return {
      nombre: debt.nombre,
      paid: totalPaid,
      pendingPayment: pendingPayment > 0 ? pendingPayment : 0,
    }
  });

  return (
    <div className="rounded-xl bg-zinc-900! border border-slate-600 p-4">
      <h3 className="text-lg font-semibold">Visualización de deudas</h3>
      <p className="text-gray mb-6">Comparación de montos pagados vs. por pagar</p>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="nombre" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.7)" }} />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: "rgba(255,255,255,0.7)" }}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(30, 30, 40, 0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
              formatter={(value) => formatCurrency(value)}
            />
            <Legend />
            <Bar dataKey="paid" fill="#60A5FA" name="Pagado" radius={[8, 8, 0, 0]} />
            <Bar dataKey="pendingPayment" fill="#EF4444" name="Por pagar" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}