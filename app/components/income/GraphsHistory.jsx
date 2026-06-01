import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { CATEGORIES_COLORS } from '@/app/resources/constants';

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

export default function GraphsHistory({ incomes }) {
  const mostRecent = incomes[0];
  const incomesPerCategorie = mostRecent?.expenses.reduce(
    (acc, income) => {
      acc[income.categorie] = (acc[income.categorie] || 0) + income.mount;
      return acc;
    },
    {}
  );

  const pieChartData = incomesPerCategorie
    ? Object.entries(incomesPerCategorie).map(([categorie, mount]) => ({
        name: categorie,
        value: mount,
        color: CATEGORIES_COLORS[categorie] || CATEGORIES_COLORS["Otros"],
      }))
    : [];

  const enablePerMonth = incomes
    .slice(0, 6)
    .reverse()
    .map((month) => {
      const totalExpenses = month.expenses.reduce((sum, income) => sum + income.mount, 0);
      return {
        month: `${month.month.substring(0, 3)} ${month.year}`,
        disponible: month.totalIncomes - totalExpenses,
        gastos: totalExpenses,
      };
    });

  return (
    <>
      {incomes.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 min-w-0">
          {pieChartData.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-bg-card border border-border min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <PieChart className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-fg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Distribución de Gastos</h3>
                  <p className="text-xs text-fg-muted">{mostRecent.month} {mostRecent.year}</p>
                </div>
              </div>
              <div className="h-64 mt-4 min-w-0 overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      outerRadius={70}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="value"
                      stroke="transparent"
                      animationDuration={1000}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => <span className="text-fg-muted text-xs">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="p-4 sm:p-5 rounded-2xl bg-bg-card border border-border min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <BarChart className="h-4 w-4 text-accent" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-fg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Disponibilidad Mensual</h3>
                <p className="text-xs text-fg-muted">Balance después de gastos</p>
              </div>
            </div>
            <div className="h-64 mt-4 min-w-0 overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enablePerMonth} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    dataKey="month"
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
                  <Bar dataKey="disponible" fill="#22c55e" name="Disponible" radius={[4, 4, 0, 0]} animationDuration={1200} />
                  <Bar dataKey="gastos" fill="#ef4444" name="Gastos" radius={[4, 4, 0, 0]} animationDuration={1000} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
