import { useState, useRef, useEffect } from "react";
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, CreditCard, Wallet } from "lucide-react";
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

export default function HomeDashboard() {
  const [debts, setDebts] = useState([]);
  const [incomes, setIncomes] = useState([]);

  const mostRecentIncome = incomes[incomes?.length - 1 ?? 0];
  const totalIncomesActualMonth = () => {
    if (!incomes.length || !incomes[0].gastos) return 0

    return incomes[0].gastos.reduce(
      (total, gasto) => total + Number(gasto.monto),
      0
    )
  }

  const getTotalDebts = (debts = []) => debts.reduce((total, debt) => total + (debt.montoTotal || 0), 0);

  const getTotalPartialPayment = (debts = []) =>
    debts.reduce((total, debt) => {
      const abonosSum = debt.abonos?.reduce(
        (sum, abono) => sum + (abono.monto || 0),
        0
      ) ?? 0

      return total + abonosSum
    }, 0);

  const generarProgresoHistorico = (deudas) => {
    const mesesMap = {}
    const nombresMes = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

    const deudaTotal = deudas.reduce(
      (acc, deuda) => acc + deuda.montoTotal,
      0
    )

    // 1. Agrupar abonos por mes
    deudas.forEach(deuda => {
      deuda.abonos.forEach(abono => {
        const fecha = new Date(abono.fecha)
        const mesIndex = fecha.getMonth()
        const mesNombre = nombresMes[mesIndex]

        if (!mesesMap[mesIndex]) {
          mesesMap[mesIndex] = {
            mes: mesNombre,
            pagado: 0
          }
        }

        mesesMap[mesIndex].pagado += abono.monto
      })
    })

    // 2. Ordenar por mes y acumular pagos
    let acumulado = 0

    return Object.keys(mesesMap)
      .sort((a, b) => a - b)
      .map(mesIndex => {
        acumulado += mesesMap[mesIndex].pagado

        return {
          mes: mesesMap[mesIndex].mes,
          deuda: deudaTotal,
          pagado: acumulado
        }
      })
  }

  const progresoHistorico = generarProgresoHistorico(debts);

  const generarFlujoCaja = (meses) => {
    const abreviacionMes = {
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
    }

    return meses.map(mes => {
      const totalGastos = mes.gastos.reduce(
        (acc, gasto) => acc + gasto.monto,
        0
      )

      return {
        mes: abreviacionMes[mes.mes] || mes.mes,
        ingresos: mes.ingresoTotal,
        gastos: totalGastos,
        disponible: mes.ingresoTotal - totalGastos,
      }
    })
  }

  const flujoCaja = generarFlujoCaja(incomes);

  useEffect(() => {
    const storedDebts = localStorage.getItem("debts")
    if (storedDebts) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDebts(JSON.parse(storedDebts));
    }

    const storedIncomes = localStorage.getItem("incomes")
    if (storedIncomes) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIncomes(JSON.parse(storedIncomes));
    }
  }, []);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  return (
    <>
      <section className="space-y-8 container mx-auto px-4 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 bg-card border border-slate-700 rounded-3xl">
            <div className="flex justify-between items-center">
              <p className="text-gray text-base">Total deudas</p>
              <div className="p-2 bg-danger/20 rounded-xl">
                <AlertCircle className="h-5 w-5 text-danger" />
              </div>
            </div>
            <h3 className="font-bold text-2xl mt-6">$ {getTotalDebts(debts).toLocaleString("es-CO")}</h3>
            {debts?.length > 0 && <p className="text-gray">$ {getTotalPartialPayment(debts).toLocaleString("es-CO")} pagado ({Math.round((getTotalPartialPayment(debts) / getTotalDebts(debts)) * 100)}.0 %)</p>}
            {debts?.length > 0 && <div className="relative h-2 bg-primary/50 rounded-xl ml-auto w-full mt-4">
              <div
                className="absolute left-0 top-0 h-full bg-primary rounded-xl"
                style={{ width: `${Math.round((getTotalPartialPayment(debts) / getTotalDebts(debts)) * 100)}%` }}
              />
            </div>}
          </div>
          <div className="p-6 bg-card border border-slate-700 rounded-3xl">
            <div className="flex justify-between items-center">
              <p className="text-gray text-base">Ingreso del mes</p>
              <div className="p-2 bg-success/20 rounded-xl">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            </div>
            <h3 className="font-bold text-2xl mt-6">$ {mostRecentIncome?.ingresoTotal.toLocaleString("es-CO")}</h3>
            <h3 className="text-success">{mostRecentIncome?.mes} {mostRecentIncome?.anio}</h3>
          </div>
          <div className="p-6 bg-card border border-slate-700 rounded-3xl">
            <div className="flex justify-between items-center">
              <p className="text-gray text-base">Gastos del mes</p>
              <div className="p-2 bg-primary/20 rounded-xl">
                <TrendingDown className="h-5 w-5 text-primary" />
              </div>
            </div>
            <h3 className="font-bold text-2xl mt-6">$ {totalIncomesActualMonth().toLocaleString("es-CO")}</h3>
            {incomes?.length > 0 && <p className="text-gray">{Math.round((totalIncomesActualMonth() / mostRecentIncome?.ingresoTotal) * 100)}.0 % del ingreso</p>}
            {incomes?.length > 0 && <div className="relative h-2 bg-primary/50 rounded-xl ml-auto w-full mt-4">
              <div
                className="absolute left-0 top-0 h-full bg-primary rounded-xl"
                style={{ width: `${Math.round((totalIncomesActualMonth() / mostRecentIncome?.ingresoTotal) * 100)}%` }}
              />
            </div>}
          </div>
          <div className="p-6 bg-card border border-slate-700 rounded-3xl">
            <div className="flex justify-between items-center">
              <p className="text-gray text-base">Disponible</p>
              <div className="p-2 bg-success/20 rounded-xl">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
            </div>
            <h3 className="font-bold text-2xl mt-6 text-success">$ { (mostRecentIncome?.ingresoTotal - totalIncomesActualMonth()).toLocaleString("es-CO") }</h3>
            {incomes?.length > 0 && <p className="text-gray">Después de gastos</p>}
          </div>
        </div>

        {/* Gráficas principales */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Gráfica de progreso de deudas */}
          <div className="p-6 bg-card border border-slate-700 rounded-3xl">
            <h3 className="text-xl font-semibold">Progreso histórico de deudas</h3>
            <p className="text-gray">Evolución de pagos</p>
            <div className="h-72 w-full mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progresoHistorico}>
                  <defs>
                    <linearGradient id="colorPagado" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="mes" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.7)" }} />
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
                  <Area
                    type="monotone"
                    dataKey="pagado"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorPagado)"
                    name="Pagado"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfica de flujo de caja */}
          <div className="p-6 bg-card border border-slate-700 rounded-3xl">
            <h3 className="text-xl font-semibold">Flujo de Caja mensual</h3>
            <p className="text-gray">Ingresos, gastos y dinero disponible</p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={flujoCaja}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="mes" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.7)" }} />
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
                  <Line
                    type="monotone"
                    dataKey="ingresos"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="Ingresos"
                    dot={{ fill: "#10B981", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gastos"
                    stroke="#EF4444"
                    strokeWidth={2}
                    name="Gastos"
                    dot={{ fill: "#EF4444", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="disponible"
                    stroke="#60A5FA"
                    strokeWidth={2}
                    name="Disponible"
                    dot={{ fill: "#60A5FA", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}