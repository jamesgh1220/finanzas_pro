"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, TrendingDown, Trash2, Calendar, DollarSign, Calculator } from "lucide-react";

export default function DeudasSection() {
  const dialogRef = useRef(null);
  const abonoDialogRef = useRef(null);
  const [form, setForm] = useState({
    nombre: "",
    montoTotal: "",
    mesesEstimados: "",
  });
  const [abonoForm, setAbonoForm] = useState({
    monto: "",
    fecha: new Date().toISOString().split("T")[0],
    descripcion: "",
  });

  const openDialog = () => dialogRef.current?.showModal();
  const closeDialog = () => dialogRef.current?.close();

  const [deudas, setDeudas] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("deudas");
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
    }).format(value)

  const totalPagado = (deuda) => deuda.abonos.reduce((sum, abono) => sum + abono.monto, 0);

  const handleDelete = (id) => {
    setDeudas(deudas.filter((d) => d.id !== id));
  }

  const openAbonoDialog = (deuda) => {
    setDeudaSeleccionadaId(deuda.id)
    abonoDialogRef.current?.showModal()
  }

  const closeAbonoDialog = () => {
    abonoDialogRef.current?.close()
    setDeudaSeleccionadaId(null)
    setAbonoForm({
      monto: "",
      fecha: new Date().toISOString().split("T")[0],
      descripcion: "",
    })
  }

  const handleAddAbono = (e) => {
    e.preventDefault();

    if (!deudaSeleccionadaId) return;

    const nuevoAbono = {
      id: Date.now().toString(),
      monto: Number(abonoForm.monto),
      fecha: abonoForm.fecha,
      descripcion: abonoForm.descripcion || undefined,
    };
    
    setDeudas((prevDeudas) =>
      prevDeudas.map((deuda) =>
        deuda.id === deudaSeleccionadaId
          ? {
              ...deuda,
              abonos: [...(deuda.abonos ?? []), nuevoAbono],
            }
          : deuda
      )
    );

    closeAbonoDialog();
  }

  useEffect(() => {
    const storedDeudas = localStorage.getItem("deudas")
    if (storedDeudas) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDeudas(JSON.parse(storedDeudas));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("deudas", JSON.stringify(deudas))
  }, [deudas])

  return (
    <section className="space-y-6 bounceIn container mx-auto px-4 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Gestión de Deudas
          </h2>
          <p className="text-sm text-muted-foreground">
            Total deudas: {formatCurrency(
              deudas.reduce((s, d) => s + d.montoTotal, 0)
            )}
          </p>
        </div>

        <button onClick={openDialog} className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Nueva deuda
        </button>
      </div>

      {/* Lista de deudas */}
      <div className="grid gap-4 md:grid-cols-2 text-foreground! lg:grid-cols-3">
        {deudas.map((deuda) => {
          const pagado = totalPagado(deuda)
          const restante = deuda.montoTotal - pagado

          return (
            <div
              key={deuda.id}
              className="rounded-xl bg-zinc-900! border border-slate-600 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">
                  {deuda.nombre}
                </h3>

                <button
                  onClick={() => handleDelete(deuda.id)}
                  className="text-slate-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-col text-sm space-y-1">
                <div className="inline-flex items-center justify-center gap-x-2 border border-slate-600 px-2 py-1 rounded-lg w-fit">
                  <Calendar className="h-4 w-4" />
                  {deuda.mesesEstimados} meses
                </div>
                <div className="inline-flex items-center justify-center gap-x-2 border border-slate-600 px-2 py-1 rounded-lg w-fit">
                  <DollarSign className="h-4 w-4" />
                  Cuota: {formatCurrency(deuda.cuotaMinima)}
                </div>
                <div className="flex py-4">
                  <div className="flex-1">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-gray">Total deuda</p>
                      <p className="text-white! font-semibold">{formatCurrency(deuda.montoTotal)}</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-gray">Abonos</p>
                      <p className="text-white! font-semibold">{deuda.abonos.length} pagos</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-y-1 p-2 rounded-xl bg-zinc-800! mb-4">
                  <p className="text-gray">Último abono</p>
                  <p className="text-white! font-semibold">{formatCurrency(deuda.abonos[deuda.abonos.length - 1]?.monto ?? 0)}</p>
                  <p className="text-gray">{deuda.abonos[deuda.abonos.length - 1]?.fecha ?? ''}</p>
                </div>
                <button onClick={() => openAbonoDialog(deuda)} className="flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                  Agregar abono
                </button>
                <p className="text-green-500">
                  Pagado: {formatCurrency(pagado)}
                </p>
                <p className="text-red-500">
                  Restante: {formatCurrency(restante)}
                </p>
              </div>
            </div>
          )
        })}

        {/* Estado vacío */}
        {deudas.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12">
            <TrendingDown className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No tienes deudas registradas
            </h3>
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Agrega tu primera deuda para comenzar el seguimiento
            </p>
          </div>
        )}
      </div>

      {/* DIALOG */}
      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) {
            dialogRef.current.close()
          }
        }}
        className="bounceIn rounded-xl p-6 bg-zinc-900 text-white w-full max-w-md backdrop:bg-black/60 my-auto"
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
        ref={abonoDialogRef}
        className="rounded-xl p-6 bg-zinc-900 text-white w-full max-w-md backdrop:bg-black/60 bounceIn my-auto"
        onClick={(e) => {
          if (e.target === abonoDialogRef.current) {
            closeAbonoDialog()
          }
        }}
      >
        <h3 className="text-lg font-semibold mb-1">Agregar Abono</h3>
        <p className="text-sm text-gray-400 mb-4">
          Registra un pago para: <b>{deudaSeleccionada?.nombre}</b>
        </p>

        <form onSubmit={handleAddAbono} className="space-y-4">
          <div>
            <label className="text-sm">Monto del abono</label>
            <input
              type="number"
              className="w-full mt-1 px-3 py-2 rounded bg-zinc-800 border border-zinc-700"
              value={abonoForm.monto}
              onChange={(e) =>
                setAbonoForm({ ...abonoForm, monto: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="text-sm">Fecha del pago</label>
            <input
              type="date"
              className="w-full mt-1 px-3 py-2 rounded bg-zinc-800 border border-zinc-700"
              value={abonoForm.fecha}
              onChange={(e) =>
                setAbonoForm({ ...abonoForm, fecha: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="text-sm">Descripción (opcional)</label>
            <textarea
              rows={3}
              className="w-full mt-1 px-3 py-2 rounded bg-zinc-800 border border-zinc-700 resize-none"
              value={abonoForm.descripcion}
              onChange={(e) =>
                setAbonoForm({ ...abonoForm, descripcion: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeAbonoDialog}
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
