"use client";

import { useState, useRef, useEffect } from "react";
import HeaderIncomes from '@/app/components/income/HeaderIncomes';
import { Calculator } from "lucide-react";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default function Income() {
  const newMonthRef = useRef(null);
  const [incomes, setIncomes] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("incomes");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const now = new Date()
  const [mes, setMes] = useState(MESES[now.getMonth()]);
  const [anio, setAnio] = useState(now.getFullYear().toString());
  const [ingresoTotal, setIngresoTotal] = useState("");

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);


  const open = () => newMonthRef.current?.showModal();
  const close = () => newMonthRef.current?.close();

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!mes || !anio || !ingresoTotal) return

    const nuevoIngreso = {
      id: Date.now().toString(),
      mes,
      anio: Number(anio),
      ingresoTotal: Number(ingresoTotal),
      createdAt: new Date().toISOString(),
    }

    setIncomes((prev) => {
      const updated = [...prev, nuevoIngreso]
      localStorage.setItem("incomes", JSON.stringify(updated))
      return updated
    })

    setMes(MESES[now.getMonth()])
    setAnio(now.getFullYear().toString())
    setIngresoTotal("")
    close()
  }

  useEffect(() => {
    const storedIncomes = localStorage.getItem("incomes")
    if (storedIncomes) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIncomes(JSON.parse(storedIncomes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("incomes", JSON.stringify(incomes))
  }, [incomes]);

  return (
    <>
      <section className="space-y-6 bounceIn container mx-auto px-4 lg:px-8">
        {/* Header */}
        <HeaderIncomes openDialog={open} />

        {/* NEW MONTH */}
        {/* DIALOG */}
        <dialog
          ref={newMonthRef}
          onClick={(e) => {
            if (e.target === newMonthRef.current) {
              newMonthRef.current.close()
            }
          }}
          className="bounceIn rounded-xl p-6 bg-zinc-900 text-white w-full max-w-md backdrop:bg-black/60 my-auto"
        >
          <h3 className="text-center text-lg font-semibold mb-1">
            Nuevo registro rensual
          </h3>
          <p className="text-center text-sm text-gray-400 mb-4">
            Crea un nuevo registro para gestionar los ingresos del mes
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* MES / AÑO */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Mes</label>
                <select
                  value={mes}
                  onChange={(e) => setMes(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded bg-black border border-zinc-700"
                >
                  {MESES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm">Año</label>
                <select
                  value={anio}
                  onChange={(e) => setAnio(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded bg-black border border-zinc-700"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* INGRESO */}
            <div>
              <label className="text-sm">Ingreso total del mes</label>
              <input
                type="number"
                placeholder="5000000"
                value={ingresoTotal}
                onChange={(e) => setIngresoTotal(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded bg-black border border-zinc-700"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Total de ingresos que recibirás este mes
              </p>
            </div>

            {/* RESUMEN */}
            {ingresoTotal && (
              <div className="p-3 rounded bg-primary/10">
                <div className="flex items-center gap-2 text-primary">
                  <Calculator className="h-4 w-4" />
                  Ingreso registrado
                </div>
                <p className="text-xl font-bold">
                  ${Number(ingresoTotal).toLocaleString("es-CO")}
                </p>
              </div>
            )}

            {/* BOTONES */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={close}
                className="px-4 py-2 rounded border border-zinc-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-primary text-white"
              >
                Crear Mes
              </button>
            </div>
          </form>
        </dialog>
      </section>
    </>
  );
}