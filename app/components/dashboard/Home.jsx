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
      <div className="bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl">
        <p className="text-zinc-400 text-sm mb-2">{label}</p>
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

  const mostRecentIncome = incomes[incomes?.length - 1 ?? 0];

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

    const deudaTotal = debts.reduce((acc, debt) => acc + debt.montoTotal, 0);

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
        return {
          month: monthsMap[mesIndex].month,
          debt: deudaTotal,
          paid: acc,
        };
      });
  };

  const historyProgress = buildHistoryProgress(debts);

  const buildCashFlow = (incomes) => {
    const monthAbbreviaton = {
      Enero: "Ene",
      Febrero: "Feb",
      Marzo: "Mar",
      Abril: "Abr",
      Mayo: "May",
      Junio: "Jun",
      Julio: "Jul",
      Agosto: "Ago",
      Septiembre: "Sep",
      Octubre: "Oct",
      Noviembre: "Nov",
      Diciembre: "Dic",
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
          <p className="text-zinc-500 text-sm">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Deudas */}
        <div className="group relative p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-danger/30 transition-all duration-300 card-hover animate-slide-up" style={{ animationDelay: '0ms' }}>
          <div className="absolute inset-0 bg-danger/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-zinc-500 font-medium">Total Deudas</p>
              <div className="p-2 rounded-xl bg-danger/10">
                <AlertCircle className="h-5 w-5 text-danger" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{formatCurrency(totalDebts)}</h3>
            {debts?.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">Pagado</span>
                  <span className="text-primary font-medium">{formatCurrency(totalPaidDebts)}</span>
                </div>
                <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${debtPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-500">{debtPercentage}% completado</p>
              </div>
            )}
          </div>
        </div>

        {/* Ingreso del Mes */}
        <div className="group relative p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all duration-300 card-hover animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-zinc-500 font-medium">Ingreso del Mes</p>
              <div className="p-2 rounded-xl bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{formatCurrency(totalIncomes)}</h3>
            <p className="text-sm text-zinc-500">{mostRecentIncome?.month} {mostRecentIncome?.year}</p>
          </div>
        </div>

        {/* Gastos del Mes */}
        <div className="group relative p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/30 transition-all duration-300 card-hover animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-zinc-500 font-medium">Gastos del Mes</p>
              <div className="p-2 rounded-xl bg-accent/10">
                <TrendingDown className="h-5 w-5 text-accent" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{formatCurrency(totalExpenses)}</h3>
            {incomes?.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">Del ingreso</span>
                  <span className="text-accent font-medium">{expensePercentage}%</span>
                </div>
                <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-accent to-orange-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(expensePercentage, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Disponible */}
        <div className="group relative p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-success/30 transition-all duration-300 card-hover animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="absolute inset-0 bg-success/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-zinc-500 font-medium">Disponible</p>
              <div className="p-2 rounded-xl bg-success/10">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
            </div>
            <h3 className={`text-2xl font-bold mb-1 ${available >= 0 ? "text-success" : "text-danger"}`}>
              {formatCurrency(available)}
            </h3>
            <p className="text-sm text-zinc-500">Después de gastos</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progreso de Deudas */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Progreso de Deudas</h3>
              <p className="text-sm text-zinc-500">Evolución de pagos realizados</p>
            </div>
          </div>
          <div className="h-72 mt-6">
            {historyProgress.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyProgress}>
                  <defs>
                    <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fill: "#71717a", fontSize: 12 }} />
                  <YAxis
                    stroke="rgba(255,255,255,0.3)"
                    tick={{ fill: "#71717a", fontSize: 12 }}
                    tickFormatter={formatCompact}
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
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-500">
                <p>No hay datos de pagos</p>
              </div>
            )}
          </div>
        </div>

        {/* Flujo de Caja */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-accent/10">
              <PiggyBank className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Flujo de Caja</h3>
              <p className="text-sm text-zinc-500">Ingresos vs Gastos mensuales</p>
            </div>
          </div>
          <div className="h-72 mt-6">
            {cashFlow.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cashFlow}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="mes" stroke="rgba(255,255,255,0.3)" tick={{ fill: "#71717a", fontSize: 12 }} />
                  <YAxis
                    stroke="rgba(255,255,255,0.3)"
                    tick={{ fill: "#71717a", fontSize: 12 }}
                    tickFormatter={formatCompact}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: "10px" }} />
                  <Line
                    type="monotone"
                    dataKey="ingresos"
                    stroke="#22c55e"
                    strokeWidth={2}
                    name="Ingresos"
                    dot={{ fill: "#22c55e", r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gastos"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Gastos"
                    dot={{ fill: "#ef4444", r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="disponible"
                    stroke="#fbbf24"
                    strokeWidth={2}
                    name="Disponible"
                    dot={{ fill: "#fbbf24", r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-500">
                <p>No hay datos de flujo de caja</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deudas Activas */}
      {debts?.length > 0 && (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-danger/10">
              <CreditCard className="h-5 w-5 text-danger" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Deudas Activas</h3>
              <p className="text-sm text-zinc-500">Estado actual de cada deuda</p>
            </div>
          </div>
          <div className="space-y-6">
            {debts.map((debt) => {
              const paid = totalPaid(debt);
              const remaining = debt.totalMount - paid;
              const percentage = Math.round((paid / debt.totalMount) * 100);

              return (
                <div key={debt.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                      <h4 className="text-base font-semibold text-white">{debt.name}</h4>
                      <p className="text-sm text-zinc-500">
                        Cuota mínima: {formatCurrency(Math.round(debt.minimumFee))}/mes
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{percentage}%</p>
                      <p className="text-xs text-zinc-500">completado</p>
                    </div>
                  </div>
                  <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-3 text-sm">
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
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl bg-white/5 border border-white/5">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
            <div className="relative p-4 rounded-full bg-white/10">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Bienvenido a FinanzasPro</h3>
          <p className="text-zinc-500 text-center max-w-md">
            Comienza agregando tus deudas e ingresos para ver el resumen de tu situación financiera.
          </p>
        </div>
      )}
    </div>
  );
}