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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-6 overflow-x-hidden">
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
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl bg-bg-card border border-border animate-scale-in">
          <div className="relative mb-5">
            <div className="absolute inset-0 bg-danger/20 rounded-full blur-3xl" />
            <div className="relative p-4 rounded-full bg-bg-elevated">
              <Calculator className="h-8 w-8 text-danger" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-fg mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Sin deudas registradas</h3>
          <p className="text-fg-muted text-center max-w-md text-sm mb-6">
            Agrega tu primera deuda para comenzar a hacer seguimiento de tus pagos.
          </p>
          <button
            onClick={openDialog}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 cursor-pointer"
          >
            <Calculator className="h-4 w-4" />
            Agregar deuda
          </button>
        </div>
      )}

      {/* Dialog Nueva deuda */}
      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) {
            dialogRef.current.close();
          }
        }}
        className="rounded-2xl p-0 bg-bg-card w-full max-w-md m-auto"
      >
        <div className="relative p-5 border-b border-border">
          <button
            onClick={closeDialog}
            className="absolute right-4 top-4 p-2 text-fg-muted hover:text-fg transition-colors rounded-lg hover:bg-bg-hover cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-semibold text-fg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Nueva deuda</h3>
          <p className="text-sm text-fg-muted mt-0.5">
            Registra una nueva deuda para hacer seguimiento
          </p>
        </div>

        <form onSubmit={handleAddDebt} className="p-5 space-y-4">
          <div>
            <label className="text-xs text-fg-muted mb-1.5 block font-medium">Nombre de la deuda</label>
            <input
              className="w-full px-3.5 py-2.5 rounded-xl bg-bg-elevated border border-border text-fg placeholder-fg-subtle focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ej: Crédito educativo"
              required
            />
          </div>

          <div>
            <label className="text-xs text-fg-muted mb-1.5 block font-medium">Monto total</label>
            <input
              type="number"
              className="w-full px-3.5 py-2.5 rounded-xl bg-bg-elevated border border-border text-fg placeholder-fg-subtle focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
              value={form.totalMount}
              onChange={(e) => setForm({ ...form, totalMount: e.target.value })}
              placeholder="5000000"
              required
            />
          </div>

          <div>
            <label className="text-xs text-fg-muted mb-1.5 block font-medium">Tiempo estimado (meses)</label>
            <input
              type="number"
              className="w-full px-3.5 py-2.5 rounded-xl bg-bg-elevated border border-border text-fg placeholder-fg-subtle focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
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
              <p className="text-xl font-bold text-fg stat-value">{formatCurrency(minimumFee)}</p>
              <p className="text-xs text-fg-muted mt-0.5">por mes</p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={closeDialog}
              className="flex-1 px-4 py-2.5 rounded-xl border border-border text-fg-muted flex items-center justify-center hover:text-fg hover:bg-bg-hover transition-colors font-medium text-sm cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white flex items-center justify-center font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all text-sm cursor-pointer"
            >
              Crear Deuda
            </button>
          </div>
        </form>
      </dialog>

      {/* Dialog Abono */}
      <dialog
        ref={partialPaymentDialogRef}
        className="rounded-2xl p-0 bg-bg-card w-full max-w-md m-auto"
        onClick={(e) => {
          if (e.target === partialPaymentDialogRef.current) {
            closePartialPaymentDialog();
          }
        }}
      >
        <div className="relative p-5 border-b border-border">
          <button
            onClick={closePartialPaymentDialog}
            className="absolute right-4 top-4 p-2 text-fg-muted hover:text-fg transition-colors rounded-lg hover:bg-bg-hover cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-semibold text-fg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Agregar abono</h3>
          <p className="text-sm text-fg-muted mt-0.5">
            Para: <span className="text-primary font-medium">{selectedDebt?.name}</span>
          </p>
        </div>

        <form onSubmit={handleAddPartialPayment} className="p-5 space-y-4">
          <div>
            <label className="text-xs text-fg-muted mb-1.5 block font-medium">Monto del abono</label>
            <input
              type="number"
              className="w-full px-3.5 py-2.5 rounded-xl bg-bg-elevated border border-border text-fg placeholder-fg-subtle focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
              value={partialPaymentForm.mount}
              onChange={(e) =>
                setPartialPaymentForm({ ...partialPaymentForm, mount: e.target.value })
              }
              placeholder="250000"
              required
            />
          </div>

          <div>
            <label className="text-xs text-fg-muted mb-1.5 block font-medium">Fecha del pago</label>
            <input
              type="date"
              className="w-full px-3.5 py-2.5 rounded-xl bg-bg-elevated border border-border text-fg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
              value={partialPaymentForm.date}
              onChange={(e) =>
                setPartialPaymentForm({ ...partialPaymentForm, date: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="text-xs text-fg-muted mb-1.5 block font-medium">Descripción (opcional)</label>
            <textarea
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl bg-bg-elevated border border-border text-fg placeholder-fg-subtle focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none text-sm"
              value={partialPaymentForm.description}
              onChange={(e) =>
                setPartialPaymentForm({ ...partialPaymentForm, description: e.target.value })
              }
              placeholder="Pago adicional de..."
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={closePartialPaymentDialog}
              className="flex-1 px-4 py-2.5 rounded-xl border border-border text-fg-muted flex items-center justify-center hover:text-fg hover:bg-bg-hover transition-colors font-medium text-sm cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white flex items-center justify-center font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all text-sm cursor-pointer"
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
