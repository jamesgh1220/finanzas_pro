import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { CATEGORIES_COLORS } from '@/app/resources/constants';

export default function GraphsHistory({ incomes }) {
  // Datos para gráfica de distribución de gastos (mes más reciente)
  const mostRecent = incomes[incomes?.length - 1 ?? 0];
  const incomesPerCategorie = mostRecent?.expenses.reduce(
    (acc, income) => {
      acc[income.categorie] = (acc[income.categorie] || 0) + income.mount
      return acc
    },
    {},
  )

  const pieChartData = incomesPerCategorie
    ? Object.entries(incomesPerCategorie).map(([categorie, mount]) => ({
        name: categorie,
        value: mount,
        color: CATEGORIES_COLORS[categorie] || CATEGORIES_COLORS["Otros"],
      }))
    : []

  // Datos para gráfica de disponible por mes
  const enablePerMonth = incomes
    .slice(0, 6)
    .reverse()
    .map((month) => {
      const totalIncome = month.expenses.reduce((sum, income) => sum + income.mount, 0)
      return {
        month: `${month.month.substring(0, 3)} ${month.year}`,
        enable: month.totalIncomes - totalIncome,
        expenses: totalIncome,
      }
    })

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <>
      {incomes.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Gráfica de pastel - Distribución de gastos */}
          {pieChartData.length > 0 && (
            <div className="bg-card rounded-xl p-4 border border-slate-600">
              <h3 className="font-semibold">Distribución de gastos</h3>
              <p className="text-gray mb-6">{mostRecent.month} {mostRecent.year}</p>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Gráfica de barras - Disponible por mes */}
          <div className="bg-card rounded-xl p-4 border border-slate-600">
            <h3 className="font-semibold">Dinero disponible por mes</h3>
            <p className="text-gray mb-6">Balance después de gastos</p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enablePerMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.7)" }} />
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
                  <Bar dataKey="enable" fill="#10B981" name="Disponible" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </>
  );
}