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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-6">
      <HeaderIncomes openDialog={open} />

      {incomes.length > 0 && <GraphsHistory incomes={incomes} />}

      <List
        incomes={incomes}
        openAddIncomeDialog={openAddIncomeDialog}
        handleDelete={handleDelete}
      />

      {incomes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl bg-white/5 border border-white/5">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
            <div className="relative p-4 rounded-full bg-white/10">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Sin ingresos registrados</h3>
          <p className="text-zinc-500 text-center max-w-md mb-6">
            Registra tu primer ingreso mensual para comenzar el control de tus finanzas.
          </p>
          <button
            onClick={open}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-emerald-400 text-black font-medium rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 cursor-pointer"
          >
            <Calculator className="h-4 w-4" />
            Agregar Ingreso
          </button>
        </div>
      )}

      {/* Dialog Nuevo Mes */}
      <dialog
        ref={newMonthRef}
        onClick={(e) => {
          if (e.target === newMonthRef.current) {
            newMonthRef.current.close();
          }
        }}
        className="rounded-2xl p-0 bg-zinc-900 w-full max-w-md backdrop:bg-black/80 m-auto"
      >
        <div className="relative p-6 border-b border-white/10">
          <button
            onClick={close}
            className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
          <h3 className="text-xl font-semibold text-white">Nuevo Ingreso</h3>
          <p className="text-sm text-zinc-500 mt-1">
            Crea un nuevo registro mensual
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Modo</label>
              <select
                value={mode}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                onChange={(e) => setMode(e.target.value)}
              >
                <option value="mensual">Mensual</option>
                <option value="quincenal">Quincenal</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Mes</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              >
                {enabledMonths.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Año</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Ingreso total</label>
              <input
                type="number"
                placeholder="5000000"
                value={totalIncomes}
                onChange={(e) => setIngresoTotal(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
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
              <p className="text-2xl font-bold text-white">
                {Number(totalIncomes).toLocaleString("es-CO")}
              </p>
              <p className="text-xs text-zinc-500 mt-1">{month} {year}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={close}
              className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors font-medium cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-emerald-400 text-black font-medium hover:shadow-lg hover:shadow-primary/25 transition-all cursor-pointer"
            >
              Crear
            </button>
          </div>
        </form>
      </dialog>

      {/* Dialog Agregar Gasto */}
      <dialog
        ref={addGastoRef}
        onClick={(e) => {
          if (e.target === addGastoRef.current) {
            closeAddGastoDialog();
          }
        }}
        className="rounded-2xl p-0 bg-zinc-900 w-full max-w-md backdrop:bg-black/80 m-auto"
      >
        <div className="relative p-6 border-b border-white/10">
          <button
            onClick={closeAddGastoDialog}
            className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
          <h3 className="text-xl font-semibold text-white">Agregar Gasto</h3>
          <p className="text-sm text-zinc-500 mt-1">
            Para: <span className="text-primary">{selectedIncome?.month} {selectedIncome?.year}</span>
          </p>
        </div>

        <form onSubmit={handleAddExpense} className="p-6 space-y-5">
          <div>
            <label className="text-sm text-zinc-400 mb-2 block">Categoría</label>
            <select
              value={expenseForm.categorie}
              onChange={(e) => setExpenseForm({ ...expenseForm, categorie: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
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
            <label className="text-sm text-zinc-400 mb-2 block">Monto</label>
            <input
              type="number"
              value={expenseForm.mount}
              onChange={(e) => setExpenseForm({ ...expenseForm, mount: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="150000"
              required
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400 mb-2 block">Fecha</label>
            <input
              type="date"
              value={expenseForm.date}
              onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              required
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400 mb-2 block">Descripción (opcional)</label>
            <textarea
              rows="3"
              value={expenseForm.description}
              onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
              placeholder="Detalles adicionales..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeAddGastoDialog}
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