"use client";

import { useState, useRef, useEffect } from "react";
import { Calculator } from "lucide-react";
import HeaderDebts from '@/app/components/debts/HeaderDebts';
import GraphsHistory from '@/app/components/debts/GraphsHistory';
import List from '@/app/components/debts/List';

export default function DeudasSection() {
  const dialogRef = useRef(null);
  const partialPaymentDialogRef = useRef(null);
  const [form, setForm] = useState({
    nombre: "",
    montoTotal: "",
    mesesEstimados: "",
  });
  const [partialPaymentForm, setPartialPaymentForm] = useState({
    monto: "",
    fecha: new Date().toISOString().split("T")[0],
    descripcion: "",
  });

  const openDialog = () => dialogRef.current?.showModal();
  const closeDialog = () => dialogRef.current?.close();

  const [deudas, setDeudas] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("debts");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [deudaSeleccionadaId, setDeudaSeleccionadaId] = useState(null);
  const deudaSeleccionada = deudas.find((d) => d.id === deudaSeleccionadaId);

  const cuotaMinima =
    form.montoTotal && form.mesesEstimados
      ? Number(form.montoTotal) / Number(form.mesesEstimados)
      : 0

  const handleCreateDeuda = (e) => {
    e.preventDefault();

    const nuevaDeuda = {
      id: Date.now().toString(),
      fecha: new Date().toISOString(),
      nombre: form.nombre,
      montoTotal: Number(form.montoTotal),
      mesesEstimados: Number(form.mesesEstimados),
      cuotaMinima,
      abonos: [],
    };

    setDeudas((prev) => [...prev, nuevaDeuda]);
    setForm({ nombre: "", montoTotal: "", mesesEstimados: "" });
    closeDialog();
  }

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);

  const handleDelete = (id) => {
    setDeudas(deudas.filter((d) => d.id !== id));
  }

  const openPartialPaymentDialog = (deuda) => {
    setDeudaSeleccionadaId(deuda.id)
    partialPaymentDialogRef.current?.showModal()
  }

  const closePartialPaymentDialog = () => {
    partialPaymentDialogRef.current?.close()
    setDeudaSeleccionadaId(null)
    setPartialPaymentForm({
      monto: "",
      fecha: new Date().toISOString().split("T")[0],
      descripcion: "",
    })
  }

  const handleAddPartialPayment = (e) => {
    e.preventDefault();

    if (!deudaSeleccionadaId) return;

    const newPartialPayment = {
      id: Date.now().toString(),
      monto: Number(partialPaymentForm.monto),
      fecha: partialPaymentForm.fecha,
      descripcion: partialPaymentForm.descripcion || undefined,
    };
    
    setDeudas((prevDeudas) =>
      prevDeudas.map((deuda) =>
        deuda.id === deudaSeleccionadaId
          ? {
              ...deuda,
              abonos: [...(deuda.abonos ?? []), newPartialPayment],
            }
          : deuda
      )
    );

    closePartialPaymentDialog();
  }

  useEffect(() => {
    const storedDeudas = localStorage.getItem("debts")
    if (storedDeudas) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDeudas(JSON.parse(storedDeudas));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("debts", JSON.stringify(deudas))
  }, [deudas]);

  return (
    <section className="space-y-6 bounceIn container mx-auto px-4 lg:px-8">
      {/* Header */}
      <HeaderDebts debts={deudas} formatCurrency={formatCurrency} openDialog={openDialog} />
      {/* Graficas */}
      { deudas.length > 0 &&  <GraphsHistory debts={deudas} formatCurrency={formatCurrency} />}
      {/* Lista de deudas */}
      <List
        debts={deudas}
        formatCurrency={formatCurrency}
        handleDelete={handleDelete}
        openPartialPaymentDialog={openPartialPaymentDialog}
      />

      {/* DIALOG */}
      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) {
            dialogRef.current.close()
          }
        }}
        className="bounceIn rounded-xl p-6 bg-zinc-900 text-white w-full max-w-md backdrop:bg-black/60 m-auto"
      >
        <h3 className="text-lg font-semibold mb-1 text-center">Nueva Deuda</h3>
        <p className="text-sm text-gray-400 mb-4 text-center">
          Registra una nueva deuda para llevar su control y seguimiento
        </p>

        <form onSubmit={handleCreateDeuda} className="space-y-4">
          <div>
            <label className="text-sm">Nombre de la deuda</label>
            <input
              className="w-full mt-1 px-3 py-2 rounded-xl bg-black border border-zinc-700"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="text-sm">Monto total</label>
            <input
              type="number"
              className="w-full mt-1 px-3 py-2 rounded-xl bg-black border border-zinc-700"
              value={form.montoTotal}
              onChange={(e) =>
                setForm({ ...form, montoTotal: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="text-sm">Tiempo estimado (meses)</label>
            <input
              type="number"
              className="w-full mt-1 px-3 py-2 rounded-xl bg-black border border-zinc-700"
              value={form.mesesEstimados}
              onChange={(e) =>
                setForm({ ...form, mesesEstimados: e.target.value })
              }
              required
            />
          </div>

          {cuotaMinima > 0 && (
            <div className="p-3 rounded bg-primary/10">
              <div className="flex items-center gap-2 text-primary">
                <Calculator className="h-4 w-4" />
                Cuota mínima
              </div>
              <p className="text-xl font-bold">
                {formatCurrency(cuotaMinima)}
              </p>
            </div>
          )}

          <div className="flex flex-col justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-primary text-white"
            >
              Crear deuda
            </button>
            <button
              type="button"
              onClick={closeDialog}
              className="px-4 py-2 rounded-xl border border-zinc-600 bg-black"
            >
              Cancelar
            </button>
          </div>
        </form>
      </dialog>

      {/* ABONO DIALOG */}
      <dialog
        ref={partialPaymentDialogRef}
        className="rounded-xl p-6 bg-zinc-900 text-white w-full max-w-md backdrop:bg-black/60 bounceIn m-auto"
        onClick={(e) => {
          if (e.target === partialPaymentDialogRef.current) {
            closePartialPaymentDialog()
          }
        }}
      >
        <h3 className="text-lg font-semibold mb-1">Agregar Abono</h3>
        <p className="text-sm text-gray-400 mb-4">
          Registra un pago para: <b>{deudaSeleccionada?.nombre}</b>
        </p>

        <form onSubmit={handleAddPartialPayment} className="space-y-4">
          <div>
            <label className="text-sm">Monto del abono</label>
            <input
              type="number"
              className="w-full mt-1 px-3 py-2 rounded bg-zinc-800 border border-zinc-700"
              value={partialPaymentForm.monto}
              onChange={(e) =>
                setPartialPaymentForm({ ...partialPaymentForm, monto: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="text-sm">Fecha del pago</label>
            <input
              type="date"
              className="w-full mt-1 px-3 py-2 rounded bg-zinc-800 border border-zinc-700"
              value={partialPaymentForm.fecha}
              onChange={(e) =>
                setPartialPaymentForm({ ...partialPaymentForm, fecha: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="text-sm">Descripción (opcional)</label>
            <textarea
              rows={3}
              className="w-full mt-1 px-3 py-2 rounded bg-zinc-800 border border-zinc-700 resize-none"
              value={partialPaymentForm.descripcion}
              onChange={(e) =>
                setPartialPaymentForm({ ...partialPaymentForm, descripcion: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closePartialPaymentDialog}
              className="px-4 py-2 rounded border border-zinc-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-primary text-white"
            >
              Agregar Abono
            </button>
          </div>
        </form>
      </dialog>
    </section>
  )
}
