"use client";

import { useState, useRef } from "react";
import { Calculator, X, TrendingUp } from "lucide-react";
import HeaderIncomes from "@/app/components/income/HeaderIncomes";
import List from "@/app/components/income/List";
import GraphsHistory from "@/app/components/income/GraphsHistory";
import { MONTHS, QUINCENAL, CATEGORIES_INCOMES } from "@/app/resources/constants";
import { useIncomes } from "@/app/hooks/useIncomes";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";

export default function Income() {
  const newMonthRef = useRef(null);
  const addGastoRef = useRef(null);
  const open = () => newMonthRef.current?.showModal();
  const close = () => newMonthRef.current?.close();

  const { incomes, addIncome, addExpense, deleteIncome, deleteExpense, loading } = useIncomes();
  const [expenseForm, setExpenseForm] = useState({
    categorie: "",
    mount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    id: null,
    type: null,
    name: "",
    incomeId: null,
  });

  const now = new Date();
  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);

  const [mode, setMode] = useState("mensual");
  const enabledMonths = mode === "mensual" ? MONTHS : QUINCENAL;
  const [month, setMonth] = useState(enabledMonths[0]);
  const [year, setYear] = useState(now.getFullYear().toString());
  const [totalIncomes, setIngresoTotal] = useState("");
  const [selectedIncome, setSelectedIncome] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!month || !year || !totalIncomes) return;

    const newIncome = {
      id: Date.now().toString(),
      month,
      year: Number(year),
      totalIncomes: Number(totalIncomes),
      date: new Date().toISOString(),
      expenses: [],
    };

    const result = await addIncome(newIncome);
    if (result.success) {
      setMonth(enabledMonths[0]);
      setYear(now.getFullYear().toString());
      setIngresoTotal("");
      close();
    }
  };

  const openAddIncomeDialog = (income) => {
    setSelectedIncome(income);
    addGastoRef.current?.showModal();
  };

  const closeAddGastoDialog = () => {
    addGastoRef.current?.close();
    setSelectedIncome(null);
    setExpenseForm({
      categorie: "",
      mount: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
    });
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!selectedIncome) return;

    const newExpense = {
      id: Date.now().toString(),
      categorie: expenseForm.categorie,
      mount: Number(expenseForm.mount),
      date: expenseForm.date,
      description: expenseForm.description || undefined,
    };

    await addExpense(selectedIncome.id, newExpense);
    closeAddGastoDialog();
  };

  const handleDelete = (id, type, name, incomeId = null) => {
    setDeleteConfirm({ open: true, id, type, name, incomeId });
  };

  const confirmDelete = async () => {
    if (deleteConfirm.type === "income") {
      await deleteIncome(deleteConfirm.id);
    } else if (deleteConfirm.type === "expense" && deleteConfirm.incomeId) {
      await deleteExpense(deleteConfirm.incomeId, deleteConfirm.id);
    }
    setDeleteConfirm({ open: false, id: null, type: null, name: "", incomeId: null });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-6 overflow-x-hidden">
      <HeaderIncomes openDialog={open} />

      {incomes.length > 0 && <GraphsHistory incomes={incomes} />}

      <List
        incomes={incomes}
        openAddIncomeDialog={openAddIncomeDialog}
        handleDelete={handleDelete}
      />

      {incomes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl bg-bg-card border border-border animate-scale-in">
          <div className="relative mb-5">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
            <div className="relative p-4 rounded-full bg-bg-elevated">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-fg mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Sin ingresos registrados</h3>
          <p className="text-fg-muted text-center max-w-md text-sm mb-6">
            Registra tu primer ingreso mensual para comenzar el control de tus finanzas.
          </p>
          <button
            onClick={open}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 cursor-pointer"
          >
            <Calculator className="h-4 w-4" />
            Agregar ingreso
          </button>
        </div>
      )}

      {/* Dialog Nuevo mes */}
      <dialog
        ref={newMonthRef}
        onClick={(e) => {
          if (e.target === newMonthRef.current) {
            newMonthRef.current.close();
          }
        }}
        className="rounded-2xl p-0 bg-bg-card w-full max-w-md m-auto"
      >
        <div className="relative p-5 border-b border-border">
          <button
            onClick={close}
            className="absolute right-4 top-4 p-2 text-fg-muted hover:text-fg transition-colors rounded-lg hover:bg-bg-hover cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-semibold text-fg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Nuevo ingreso</h3>
          <p className="text-sm text-fg-muted mt-0.5">
            Crea un nuevo registro mensual
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-fg-muted mb-1.5 block font-medium">Modo</label>
              <select
                value={mode}
                className="w-full px-3.5 py-2.5 rounded-xl bg-bg-elevated border border-border text-fg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                onChange={(e) => setMode(e.target.value)}
              >
                <option value="mensual">Mensual</option>
                <option value="quincenal">Quincenal</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-fg-muted mb-1.5 block font-medium">Mes</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-bg-elevated border border-border text-fg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
              >
                {enabledMonths.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-fg-muted mb-1.5 block font-medium">Año</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-bg-elevated border border-border text-fg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-fg-muted mb-1.5 block font-medium">Ingreso total</label>
              <input
                type="number"
                placeholder="5000000"
                value={totalIncomes}
                onChange={(e) => setIngresoTotal(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-bg-elevated border border-border text-fg placeholder-fg-subtle focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                required
              />
            </div>
          </div>

          {totalIncomes && (
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Calculator className="h-4 w-4" />
                <span className="text-sm font-medium">Ingreso registrado</span>
              </div>
              <p className="text-xl font-bold text-fg stat-value">
                {Number(totalIncomes).toLocaleString("es-CO")}
              </p>
              <p className="text-xs text-fg-muted mt-0.5">{month} {year}</p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={close}
              className="flex-1 px-4 py-2.5 rounded-xl border border-border text-fg-muted flex items-center justify-center hover:text-fg hover:bg-bg-hover transition-colors font-medium text-sm cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white flex items-center justify-center font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all text-sm cursor-pointer"
            >
              Crear
            </button>
          </div>
        </form>
      </dialog>

      {/* Dialog Agregar gasto */}
      <dialog
        ref={addGastoRef}
        onClick={(e) => {
          if (e.target === addGastoRef.current) {
            closeAddGastoDialog();
          }
        }}
        className="rounded-2xl p-0 bg-bg-card w-full max-w-md m-auto"
      >
        <div className="relative p-5 border-b border-border">
          <button
            onClick={closeAddGastoDialog}
            className="absolute right-4 top-4 p-2 text-fg-muted hover:text-fg transition-colors rounded-lg hover:bg-bg-hover cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-semibold text-fg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Agregar gasto</h3>
          <p className="text-sm text-fg-muted mt-0.5">
            Para: <span className="text-primary font-medium">{selectedIncome?.month} {selectedIncome?.year}</span>
          </p>
        </div>

        <form onSubmit={handleAddExpense} className="p-5 space-y-4">
          <div>
            <label className="text-xs text-fg-muted mb-1.5 block font-medium">Categoría</label>
            <select
              value={expenseForm.categorie}
              onChange={(e) => setExpenseForm({ ...expenseForm, categorie: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-bg-elevated border border-border text-fg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
              required
            >
              <option value="">Selecciona una categoría</option>
              {CATEGORIES_INCOMES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-fg-muted mb-1.5 block font-medium">Monto</label>
            <input
              type="number"
              value={expenseForm.mount}
              onChange={(e) => setExpenseForm({ ...expenseForm, mount: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-bg-elevated border border-border text-fg placeholder-fg-subtle focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
              placeholder="150000"
              required
            />
          </div>

          <div>
            <label className="text-xs text-fg-muted mb-1.5 block font-medium">Fecha</label>
            <input
              type="date"
              value={expenseForm.date}
              onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-bg-elevated border border-border text-fg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs text-fg-muted mb-1.5 block font-medium">Descripción (opcional)</label>
            <textarea
              rows="3"
              value={expenseForm.description}
              onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-bg-elevated border border-border text-fg placeholder-fg-subtle focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none text-sm"
              placeholder="Detalles adicionales..."
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={closeAddGastoDialog}
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
          setDeleteConfirm({ open: false, id: null, type: null, name: "", incomeId: null })
        }
        onConfirm={confirmDelete}
        title={deleteConfirm.type === "expense" ? "Eliminar gasto" : "Eliminar ingreso"}
        message={
          deleteConfirm.type === "expense"
            ? `¿Eliminar el gasto "${deleteConfirm.name}"?`
            : `¿Eliminar el ingreso de "${deleteConfirm.name}"? Esta acción no se puede deshacer.`
        }
      />
    </section>
  );
}
