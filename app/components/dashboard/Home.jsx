import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertCircle,
  CreditCard,
  Wallet,
  PiggyBank,
  Target,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useDebts } from "@/app/hooks/useDebts";
import { useIncomes } from "@/app/hooks/useIncomes";

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const formatCompact = (value) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-card border border-border rounded-xl p-4 shadow-lg backdrop-blur-xl">
        <p className="text-fg-muted text-sm mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function HomeDashboard() {
  const { debts, loading: debtsLoading } = useDebts();
  const { incomes, loading: incomesLoading } = useIncomes();

  const mostRecentIncome = incomes[0];

  const totalIncomesActualMonth = () => {
    if (!incomes.length || !incomes[0].expenses) return 0;
    return incomes[0].expenses.reduce(
      (total, expense) => total + Number(Math.round(expense.mount)),
      0
    );
  };

  const getTotalDebts = (debts = []) =>
    debts.reduce((total, debt) => total + (debt.totalMount || 0), 0);

  const getTotalPartialPayment = (debts = []) =>
    debts.reduce((total, debt) => {
      const partialSum =
        debt.partialPayments?.reduce((sum, partial) => sum + (partial.mount || 0), 0) ?? 0;
      return total + partialSum;
    }, 0);

  const buildHistoryProgress = (debts) => {
    const monthsMap = {};
    const namesMonths = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    debts.forEach((debt) => {
      debt.partialPayments.forEach((partial) => {
        const fecha = new Date(partial.date);
        const mesIndex = fecha.getMonth();
        const monthName = namesMonths[mesIndex];
        if (!monthsMap[mesIndex]) {
          monthsMap[mesIndex] = { month: monthName, paid: 0 };
        }
        monthsMap[mesIndex].paid += partial.mount;
      });
    });
    let acc = 0;
    return Object.keys(monthsMap)
      .sort((a, b) => a - b)
      .map((mesIndex) => {
        acc += monthsMap[mesIndex].paid;
        return { month: monthsMap[mesIndex].month, paid: acc };
      });
  };

  const historyProgress = buildHistoryProgress(debts);

  const buildCashFlow = (incomes) => {
    const monthAbbreviaton = {
      Enero: "Ene", Febrero: "Feb", Marzo: "Mar", Abril: "Abr",
      Mayo: "May", Junio: "Jun", Julio: "Jul", Agosto: "Ago",
      Septiembre: "Sep", Octubre: "Oct", Noviembre: "Nov", Diciembre: "Dic",
    };
    return incomes.map((month) => {
      const totalIncome = month.expenses.reduce((acc, expense) => acc + expense.mount, 0);
      return {
        mes: monthAbbreviaton[month.month] || month.month,
        ingresos: month.totalIncomes,
        gastos: totalIncome,
        disponible: month.totalIncomes - totalIncome,
      };
    });
  };

  const cashFlow = buildCashFlow(incomes);

  const totalPaid = (debt) => debt.partialPayments.reduce((sum, partial) => sum + partial.mount, 0);

  const totalDebts = getTotalDebts(debts);
  const totalPaidDebts = getTotalPartialPayment(debts);
  const debtPercentage = totalDebts > 0 ? Math.round((totalPaidDebts / totalDebts) * 100) : 0;

  const totalIncomes = mostRecentIncome?.totalIncomes ?? 0;
  const totalExpenses = totalIncomesActualMonth();
  const available = totalIncomes - totalExpenses;
  const expensePercentage = totalIncomes > 0 ? Math.round((totalExpenses / totalIncomes) * 100) : 0;

  const loading = debtsLoading || incomesLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-fg-muted text-sm">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-6 overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Deudas */}
        <div className="group relative p-5 rounded-2xl bg-bg-card border border-border hover:border-danger/30 transition-all duration-300 card-hover animate-slide-up" style={{ animationDelay: '0ms' }}>
          <div className="absolute inset-0 bg-danger/[0.03] opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-fg-muted uppercase tracking-wider">Total Deudas</p>
              <div className="p-2 rounded-lg bg-danger/10">
                <AlertCircle className="h-4 w-4 text-danger" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-fg stat-value mb-3">{formatCurrency(totalDebts)}</h3>
            {debts?.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-fg-muted">Pagado</span>
                  <span className="text-success font-medium">{formatCurrency(totalPaidDebts)}</span>
                </div>
                <div className="relative h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-success to-emerald-400 rounded-full transition-all duration-700"
                    style={{ width: `${debtPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-fg-muted">{debtPercentage}% completado</p>
              </div>
            )}
          </div>
        </div>

        {/* Ingreso del Mes */}
        <div className="group relative p-5 rounded-2xl bg-bg-card border border-border hover:border-primary/30 transition-all duration-300 card-hover animate-slide-up" style={{ animationDelay: '80ms' }}>
          <div className="absolute inset-0 bg-primary/[0.03] opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-fg-muted uppercase tracking-wider">Ingreso del Mes</p>
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-fg stat-value mb-1">{formatCurrency(totalIncomes)}</h3>
            <p className="text-xs text-fg-muted">{mostRecentIncome?.month} {mostRecentIncome?.year}</p>
          </div>
        </div>

        {/* Gastos del Mes */}
        <div className="group relative p-5 rounded-2xl bg-bg-card border border-border hover:border-accent/30 transition-all duration-300 card-hover animate-slide-up" style={{ animationDelay: '160ms' }}>
          <div className="absolute inset-0 bg-accent/[0.03] opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-fg-muted uppercase tracking-wider">Gastos del Mes</p>
              <div className="p-2 rounded-lg bg-accent/10">
                <TrendingDown className="h-4 w-4 text-accent" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-fg stat-value mb-1">{formatCurrency(totalExpenses)}</h3>
            {incomes?.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-fg-muted">Del ingreso</span>
                  <span className="text-accent font-medium">{expensePercentage}%</span>
                </div>
                <div className="relative h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-accent to-orange-400 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(expensePercentage, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Disponible */}
        <div className="group relative p-5 rounded-2xl bg-bg-card border border-border hover:border-success/30 transition-all duration-300 card-hover animate-slide-up" style={{ animationDelay: '240ms' }}>
          <div className="absolute inset-0 bg-success/[0.03] opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-fg-muted uppercase tracking-wider">Disponible</p>
              <div className="p-2 rounded-lg bg-success/10">
                <DollarSign className="h-4 w-4 text-success" />
              </div>
            </div>
            <h3 className={`text-2xl font-bold stat-value mb-1 ${available >= 0 ? "text-success" : "text-danger"}`}>
              {formatCurrency(available)}
            </h3>
            <p className="text-xs text-fg-muted">Después de gastos</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-w-0">
        {/* Progreso de Deudas */}
        <div className="p-5 rounded-2xl bg-bg-card border border-border animate-slide-up min-w-0" style={{ animationDelay: '80ms' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-success/10">
              <Target className="h-4 w-4 text-success" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-fg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Progreso de Deudas</h3>
              <p className="text-xs text-fg-muted">Evolución de pagos realizados</p>
            </div>
          </div>
          <div className="h-72 mt-4 min-w-0 overflow-hidden">
            {historyProgress.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyProgress}>
                  <defs>
                    <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.15)" tick={{ fill: "var(--fg-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis
                    stroke="rgba(255,255,255,0.15)"
                    tick={{ fill: "var(--fg-muted)", fontSize: 11 }}
                    tickFormatter={formatCompact}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="paid"
                    stroke="#22c55e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorPaid)"
                    name="Pagado"
                    animationDuration={1200}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-fg-muted">
                <p className="text-sm">No hay datos de pagos</p>
              </div>
            )}
          </div>
        </div>

        {/* Flujo de Caja */}
        <div className="p-5 rounded-2xl bg-bg-card border border-border animate-slide-up min-w-0" style={{ animationDelay: '160ms' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <PiggyBank className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-fg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Flujo de Caja</h3>
              <p className="text-xs text-fg-muted">Ingresos vs Gastos mensuales</p>
            </div>
          </div>
          <div className="h-72 mt-4 min-w-0 overflow-hidden">
            {cashFlow.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cashFlow}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="mes" stroke="rgba(255,255,255,0.15)" tick={{ fill: "var(--fg-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis
                    stroke="rgba(255,255,255,0.15)"
                    tick={{ fill: "var(--fg-muted)", fontSize: 11 }}
                    tickFormatter={formatCompact}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ paddingTop: "8px", fontSize: "12px" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="ingresos"
                    stroke="var(--primary)"
                    strokeWidth={2.5}
                    name="Ingresos"
                    dot={{ fill: "var(--primary)", r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                    animationDuration={1200}
                  />
                  <Line
                    type="monotone"
                    dataKey="gastos"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Gastos"
                    dot={{ fill: "#ef4444", r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                    animationDuration={1400}
                  />
                  <Line
                    type="monotone"
                    dataKey="disponible"
                    stroke="#22c55e"
                    strokeWidth={2}
                    name="Disponible"
                    dot={{ fill: "#22c55e", r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                    animationDuration={1600}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-fg-muted">
                <p className="text-sm">No hay datos de flujo de caja</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deudas Activas */}
      {debts?.length > 0 && (
        <div className="p-5 rounded-2xl bg-bg-card border border-border animate-slide-up" style={{ animationDelay: '240ms' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-danger/10">
              <CreditCard className="h-4 w-4 text-danger" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-fg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Deudas Activas</h3>
              <p className="text-xs text-fg-muted">Estado actual de cada deuda</p>
            </div>
          </div>
          <div className="space-y-4">
            {debts.map((debt) => {
              const paid = totalPaid(debt);
              const remaining = debt.totalMount - paid;
              const percentage = Math.round((paid / debt.totalMount) * 100);

              return (
                <div key={debt.id} className="p-4 rounded-xl bg-bg-elevated border border-border hover:border-border-hover transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                    <div>
                      <h4 className="text-sm font-semibold text-fg">{debt.name}</h4>
                      <p className="text-xs text-fg-muted mt-0.5">
                        Cuota mínima: {formatCurrency(Math.round(debt.minimumFee))}/mes
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary stat-value">{percentage}%</p>
                      <p className="text-xs text-fg-muted">completado</p>
                    </div>
                  </div>
                  <div className="relative h-1.5 bg-bg-card rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-700"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-success">Pagado: {formatCurrency(paid)}</span>
                    <span className="text-danger">Falta: {formatCurrency(remaining)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {debts?.length === 0 && incomes?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl bg-bg-card border border-border animate-scale-in">
          <div className="relative mb-5">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
            <div className="relative p-4 rounded-full bg-bg-elevated">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-fg mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Bienvenido a FinanzasPro</h3>
          <p className="text-fg-muted text-center max-w-md text-sm">
            Comienza agregando tus deudas e ingresos para ver el resumen de tu situación financiera.
          </p>
        </div>
      )}
    </div>
  );
}
