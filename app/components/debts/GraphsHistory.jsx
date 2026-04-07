import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const formatCompact = (value) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl">
        <p className="text-white font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString("es-CO")}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function GraphsHistory({ debts, formatCurrency }) {
  const chartData = debts.map((debt) => {
    const totalPaid = debt.partialPayments.reduce((sum, partialPayment) => sum + partialPayment.mount, 0);
    const pendingPayment = debt.totalMount - totalPaid;
    return {
      name: debt.name.length > 10 ? debt.name.substring(0, 10) + "..." : debt.name,
      fullName: debt.name,
      paid: totalPaid,
      pending: pendingPayment > 0 ? pendingPayment : 0,
    };
  });

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-primary/10">
          <BarChart className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Resumen de Deudas</h3>
          <p className="text-sm text-zinc-500">Comparación de montos pagados vs. por pagar</p>
        </div>
      </div>
      <div className="h-72 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="name" 
              stroke="rgba(255,255,255,0.3)" 
              tick={{ fill: "#71717a", fontSize: 12 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: "#71717a", fontSize: 12 }}
              tickFormatter={formatCompact}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
            <Legend 
              wrapperStyle={{ paddingTop: "10px" }}
              formatter={(value) => <span className="text-zinc-400 text-sm">{value}</span>}
            />
            <Bar 
              dataKey="paid" 
              fill="#22c55e" 
              name="Pagado" 
              radius={[6, 6, 0, 0]} 
            />
            <Bar 
              dataKey="pending" 
              fill="#ef4444" 
              name="Por pagar" 
              radius={[6, 6, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}