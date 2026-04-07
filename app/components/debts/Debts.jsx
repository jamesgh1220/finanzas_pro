"use client";

import { useState, useRef } from "react";
import { Calculator, X } from "lucide-react";
import HeaderDebts from "@/app/components/debts/HeaderDebts";
import GraphsHistory from "@/app/components/debts/GraphsHistory";
import List from "@/app/components/debts/List";
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
    debtId: null,
  });

  const openDialog = () => dialogRef.current?.showModal();
  const closeDialog = () => dialogRef.current?.close();

  const { debts, addDebt, deleteDebt, addPartialPayment, deletePartialPayment, loading } =
    useDebts();

  const [selectedDebtId, setSelectedDebtId] = useState(null);
  const selectedDebt = debts.find((d) => d.id === selectedDebtId);

  const minimumFee =
    form.totalMount && form.estimateMonths
      ? Math.round(Number(form.totalMount) / Number(form.estimateMonths))
      : 0;

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
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);

  const handleDelete = (id, type, name, debtId = null) => {
    setDeleteConfirm({ open: true, id, type, name, debtId });
  };

  const confirmDelete = async () => {
    if (deleteConfirm.type === "debt") {
      await deleteDebt(deleteConfirm.id);
    } else if (deleteConfirm.type === "partialPayment" && deleteConfirm.debtId) {
      await deletePartialPayment(deleteConfirm.debtId, deleteConfirm.id);
    }
    setDeleteConfirm({ open: false, id: null, type: null, name: "", debtId: null });
  };

  const openPartialPaymentDialog = (deuda) => {
    setSelectedDebtId(deuda.id);
    partialPaymentDialogRef.current?.showModal();
  };

  const closePartialPaymentDialog = () => {
    partialPaymentDialogRef.current?.close();
    setSelectedDebtId(null);
    setPartialPaymentForm({
      mount: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
    });
  };

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
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-6">
      <HeaderDebts
        debts={debts}
        formatCurrency={formatCurrency}
        openDialog={openDialog}
      />

      {debts.length > 0 && (
        <GraphsHistory debts={debts} formatCurrency={formatCurrency} />
      )}

      <List
        debts={debts}
        formatCurrency={formatCurrency}
        handleDelete={handleDelete}
        openPartialPaymentDialog={openPartialPaymentDialog}
      />

      {debts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl bg-white/5 border border-white/5">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-danger/20 rounded-full blur-2xl" />
            <div className="relative p-4 rounded-full bg-white/10">
              <Calculator className="h-8 w-8 text-danger" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Sin deudas registradas</h3>
          <p className="text-zinc-500 text-center max-w-md mb-6">
            Agrega tu primera deuda para comenzar a hacer seguimiento de tus pagos.
          </p>
          <button
            onClick={openDialog}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-emerald-400 text-black font-medium rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 cursor-pointer"
          >
            <Calculator className="h-4 w-4" />
            Agregar Deuda
          </button>
        </div>
      )}

      {/* Dialog Nueva Deuda */}
      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) {
            dialogRef.current.close();
          }
        }}
        className="rounded-2xl p-0 bg-zinc-900 w-full max-w-md backdrop:bg-black/80 m-auto"
      >
        <div className="relative p-6 border-b border-white/10">
          <button
            onClick={closeDialog}
            className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
          <h3 className="text-xl font-semibold text-white">Nueva Deuda</h3>
          <p className="text-sm text-zinc-500 mt-1">
            Registra una nueva deuda para hacer seguimiento
          </p>
        </div>

        <form onSubmit={handleAddDebt} className="p-6 space-y-5">
          <div>
            <label className="text-sm text-zinc-400 mb-2 block">Nombre de la deuda</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ej: Crédito educativo"
              required
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400 mb-2 block">Monto total</label>
            <input
              type="number"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              value={form.totalMount}
              onChange={(e) => setForm({ ...form, totalMount: e.target.value })}
              placeholder="5000000"
              required
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400 mb-2 block">Tiempo estimado (meses)</label>
            <input
              type="number"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              value={form.estimateMonths}
              onChange={(e) => setForm({ ...form, estimateMonths: e.target.value })}
              placeholder="12"
              required
            />
          </div>

          {minimumFee > 0 && (
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Calculator className="h-4 w-4" />
                <span className="text-sm font-medium">Cuota mínima calculada</span>
              </div>
              <p className="text-2xl font-bold text-white">{formatCurrency(minimumFee)}</p>
              <p className="text-xs text-zinc-500 mt-1">por mes</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeDialog}
              className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors font-medium cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-emerald-400 text-black font-medium hover:shadow-lg hover:shadow-primary/25 transition-all cursor-pointer"
            >
              Crear Deuda
            </button>
          </div>
        </form>
      </dialog>

      {/* Dialog Abono */}
      <dialog
        ref={partialPaymentDialogRef}
        className="rounded-2xl p-0 bg-zinc-900 w-full max-w-md backdrop:bg-black/80 m-auto"
        onClick={(e) => {
          if (e.target === partialPaymentDialogRef.current) {
            closePartialPaymentDialog();
          }
        }}
      >
        <div className="relative p-6 border-b border-white/10">
          <button
            onClick={closePartialPaymentDialog}
            className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
          <h3 className="text-xl font-semibold text-white">Agregar Abono</h3>
          <p className="text-sm text-zinc-500 mt-1">
            Registra un pago para: <span className="text-primary">{selectedDebt?.name}</span>
          </p>
        </div>

        <form onSubmit={handleAddPartialPayment} className="p-6 space-y-5">
          <div>
            <label className="text-sm text-zinc-400 mb-2 block">Monto del abono</label>
            <input
              type="number"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              value={partialPaymentForm.mount}
              onChange={(e) =>
                setPartialPaymentForm({ ...partialPaymentForm, mount: e.target.value })
              }
              placeholder="250000"
              required
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400 mb-2 block">Fecha del pago</label>
            <input
              type="date"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              value={partialPaymentForm.date}
              onChange={(e) =>
                setPartialPaymentForm({ ...partialPaymentForm, date: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400 mb-2 block">Descripción (opcional)</label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
              value={partialPaymentForm.description}
              onChange={(e) =>
                setPartialPaymentForm({ ...partialPaymentForm, description: e.target.value })
              }
              placeholder="Pago adicional de..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closePartialPaymentDialog}
              className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors font-medium cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-emerald-400 text-black font-medium hover:shadow-lg hover:shadow-primary/25 transition-all cursor-pointer"
            >
              Agregar
            </button>
          </div>
        </form>
      </dialog>

      <ConfirmDialog
        isOpen={deleteConfirm.open}
        onClose={() =>
          setDeleteConfirm({ open: false, id: null, type: null, name: "", debtId: null })
        }
        onConfirm={confirmDelete}
        title={deleteConfirm.type === "partialPayment" ? "Eliminar abono" : "Eliminar deuda"}
        message={
          deleteConfirm.type === "partialPayment"
            ? `¿Eliminar el abono de "${deleteConfirm.name}"?`
            : `¿Eliminar la deuda "${deleteConfirm.name}"? Esta acción no se puede deshacer.`
        }
      />
    </section>
  );
}