"use client";

import { useState, useRef, useEffect } from "react";
import { Calculator } from "lucide-react";
import HeaderDebts from '@/app/components/debts/HeaderDebts';
import GraphsHistory from '@/app/components/debts/GraphsHistory';
import List from '@/app/components/debts/List';
import { useDebts } from "@/app/hooks/useDebts";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";

export default function DeudasSection() {
  const dialogRef = useRef(null);
  const partialPaymentDialogRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    totalMount: "",
    estimateMonths: "",
  });
  const [partialPaymentForm, setPartialPaymentForm] = useState({
    mount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const [deleteConfirm, setDeleteConfirm] = useState({ 
    open: false, 
    id: null, 
    type: null,
    name: "",
    debtId: null
  });

  const openDialog = () => dialogRef.current?.showModal();
  const closeDialog = () => dialogRef.current?.close();

  const { debts, addDebt, deleteDebt, addPartialPayment, deletePartialPayment, loading } = useDebts();

  const [selectedDebtId, setSelectedDebtId] = useState(null);
  const selectedDebt = debts.find((d) => d.id === selectedDebtId);

  const minimumFee =
    form.totalMount && form.estimateMonths
      ? Math.round(Number(form.totalMount) / Number(form.estimateMonths))
      : 0

  const handleAddDebt = async (e) => {
    e.preventDefault();

    const newDebt = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      name: form.name,
      totalMount: Number(form.totalMount),
      estimateMonths: Number(form.estimateMonths),
      minimumFee,
      partialPayments: [],
    };

    const result = await addDebt(newDebt);
    if (result.success) {
      setForm({ name: "", totalMount: "", estimateMonths: "" });
      closeDialog();
    }
  }

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);

  const handleDelete = (id, type, name, debtId = null) => {
    setDeleteConfirm({ open: true, id, type, name, debtId });
  }

  const confirmDelete = async () => {
    if (deleteConfirm.type === 'debt') {
      await deleteDebt(deleteConfirm.id);
    } else if (deleteConfirm.type === 'partialPayment' && deleteConfirm.debtId) {
      await deletePartialPayment(deleteConfirm.debtId, deleteConfirm.id);
    }
    setDeleteConfirm({ open: false, id: null, type: null, name: "", debtId: null });
  };

  const openPartialPaymentDialog = (deuda) => {
    setSelectedDebtId(deuda.id)
    partialPaymentDialogRef.current?.showModal()
  }

  const closePartialPaymentDialog = () => {
    partialPaymentDialogRef.current?.close()
    setSelectedDebtId(null)
    setPartialPaymentForm({
      mount: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
    })
  }

  const handleAddPartialPayment = async (e) => {
    e.preventDefault();

    if (!selectedDebtId) return;

    const newPartialPayment = {
      id: Date.now().toString(),
      mount: Number(partialPaymentForm.mount),
      date: partialPaymentForm.date,
      description: partialPaymentForm.description || undefined,
    };

    await addPartialPayment(selectedDebtId, newPartialPayment);
    closePartialPaymentDialog();
  }

  useEffect(() => {}, []);

  return (
    <section className="space-y-6 bounceIn container mx-auto px-4 lg:px-8">
      {/* Header */}
      <HeaderDebts debts={debts} formatCurrency={formatCurrency} openDialog={openDialog} />
      {/* Graficas */}
      { debts.length > 0 &&  <GraphsHistory debts={debts} formatCurrency={formatCurrency} />}
      {/* Lista de deudas */}
      <List
        debts={debts}
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

        <form onSubmit={handleAddDebt} className="space-y-4">
          <div>
            <label className="text-sm">Nombre de la deuda</label>
            <input
              className="w-full mt-1 px-3 py-2 rounded-xl bg-black border border-zinc-700"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="text-sm">Monto total</label>
            <input
              type="number"
              className="w-full mt-1 px-3 py-2 rounded-xl bg-black border border-zinc-700"
              value={form.totalMount}
              onChange={(e) =>
                setForm({ ...form, totalMount: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="text-sm">Tiempo estimado (meses)</label>
            <input
              type="number"
              className="w-full mt-1 px-3 py-2 rounded-xl bg-black border border-zinc-700"
              value={form.estimateMonths}
              onChange={(e) =>
                setForm({ ...form, estimateMonths: e.target.value })
              }
              required
            />
          </div>

          {minimumFee > 0 && (
            <div className="p-3 rounded bg-primary/10">
              <div className="flex items-center gap-2 text-primary">
                <Calculator className="h-4 w-4" />
                Cuota mínima
              </div>
              <p className="text-xl font-bold">
                {formatCurrency(minimumFee)}
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
          Registra un pago para: <b>{selectedDebt?.nombre}</b>
        </p>

        <form onSubmit={handleAddPartialPayment} className="space-y-4">
          <div>
            <label className="text-sm">Monto del abono</label>
            <input
              type="number"
              className="w-full mt-1 px-3 py-2 rounded bg-zinc-800 border border-zinc-700"
              value={partialPaymentForm.mount}
              onChange={(e) =>
                setPartialPaymentForm({ ...partialPaymentForm, mount: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="text-sm">Fecha del pago</label>
            <input
              type="date"
              className="w-full mt-1 px-3 py-2 rounded bg-zinc-800 border border-zinc-700"
              value={partialPaymentForm.date}
              onChange={(e) =>
                setPartialPaymentForm({ ...partialPaymentForm, date: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="text-sm">Descripción (opcional)</label>
            <textarea
              rows={3}
              className="w-full mt-1 px-3 py-2 rounded bg-zinc-800 border border-zinc-700 resize-none"
              value={partialPaymentForm.description}
              onChange={(e) =>
                setPartialPaymentForm({ ...partialPaymentForm, description: e.target.value })
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

      <ConfirmDialog
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, id: null, type: null, name: "", debtId: null })}
        onConfirm={confirmDelete}
        title={deleteConfirm.type === 'partialPayment' ? "Eliminar abono" : "Eliminar deuda"}
        message={deleteConfirm.type === 'partialPayment' 
          ? `¿Estás seguro de que deseas eliminar el abono de "${deleteConfirm.name}"?` 
          : `¿Estás seguro de que deseas eliminar la deuda "${deleteConfirm.name}"? Esta acción no se puede deshacer.`
        }
      />
    </section>
  )
}
