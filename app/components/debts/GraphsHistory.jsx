import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const formatCompact = (value) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-card border border-border rounded-xl p-4 shadow-lg">
        <p className="text-fg font-medium mb-2">{label}</p>
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
    <div className="p-5 rounded-2xl bg-bg-card border border-border min-w-0">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <BarChart className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-fg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Resumen de Deudas</h3>
          <p className="text-xs text-fg-muted">Comparación de montos pagados vs. por pagar</p>
        </div>
      </div>
      <div className="h-72 mt-4 min-w-0 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="name"
              stroke="rgba(255,255,255,0.15)"
              tick={{ fill: "var(--fg-muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.15)"
              tick={{ fill: "var(--fg-muted)", fontSize: 11 }}
              tickFormatter={formatCompact}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingTop: "8px", fontSize: "12px" }}
            />
            <Bar
              dataKey="paid"
              fill="#22c55e"
              name="Pagado"
              radius={[4, 4, 0, 0]}
              animationDuration={1200}
            />
            <Bar
              dataKey="pending"
              fill="#ef4444"
              name="Por pagar"
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
