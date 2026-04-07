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

export default function GraphsHistory({ incomes }) {
  const mostRecent = incomes[incomes?.length - 1 ?? 0];
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
        <div className="grid gap-6 md:grid-cols-2">
          {pieChartData.length > 0 && (
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-primary/10">
                  <PieChart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Distribución de Gastos</h3>
                  <p className="text-sm text-zinc-500">{mostRecent.month} {mostRecent.year}</p>
                </div>
              </div>
              <div className="h-64 mt-4">
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
                      formatter={(value) => <span className="text-zinc-400 text-sm">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-accent/10">
                <BarChart className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Disponibilidad Mensual</h3>
                <p className="text-sm text-zinc-500">Balance después de gastos</p>
              </div>
            </div>
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enablePerMonth} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="rgba(255,255,255,0.3)" 
                    tick={{ fill: "#71717a", fontSize: 12 }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.3)"
                    tick={{ fill: "#71717a", fontSize: 12 }}
                    tickFormatter={formatCompact}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                  <Legend 
                    wrapperStyle={{ paddingTop: "10px" }}
                    formatter={(value) => <span className="text-zinc-400 text-sm">{value}</span>}
                  />
                  <Bar dataKey="disponible" fill="#22c55e" name="Disponible" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="gastos" fill="#ef4444" name="Gastos" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </>
  );
}