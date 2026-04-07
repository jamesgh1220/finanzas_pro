"use client";

import { useState, useRef, useEffect } from "react";
import HeaderIncomes from '@/app/components/income/HeaderIncomes';
import List from '@/app/components/income/List';
import GraphsHistory from '@/app/components/income/GraphsHistory';
import { Calculator } from "lucide-react";
import { MONTHS, QUINCENAL, CATEGORIES_INCOMES } from '@/app/resources/constants';
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
    type: null, // 'income' or 'expense'
    name: "",
    incomeId: null
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
    e.preventDefault()

    if (!month || !year || !totalIncomes) return

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
    setSelectedIncome(income)
    addGastoRef.current?.showModal()
  }

  const closeAddGastoDialog = () => {
    addGastoRef.current?.close()
    setSelectedIncome(null)
    setExpenseForm({
      categorie: "",
      mount: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
    })
  }

  const handleAddExpense = async (e) => {
    e.preventDefault()
    if (!selectedIncome) return

    const newExpense = {
      id: Date.now().toString(),
      categorie: expenseForm.categorie,
      mount: Number(expenseForm.mount),
      date: expenseForm.date,
      description: expenseForm.description || undefined,
    }

    await addExpense(selectedIncome.id, newExpense);
    closeAddGastoDialog();
  }

  const handleDelete = (id, type, name, incomeId = null) => {
    setDeleteConfirm({ open: true, id, type, name, incomeId });
  }

  const confirmDelete = async () => {
    if (deleteConfirm.type === 'income') {
      await deleteIncome(deleteConfirm.id);
    } else if (deleteConfirm.type === 'expense' && deleteConfirm.incomeId) {
      await deleteExpense(deleteConfirm.incomeId, deleteConfirm.id);
    }
    setDeleteConfirm({ open: false, id: null, type: null, name: "", incomeId: null });
  }

  useEffect(() => {}, []);

  return (
    <>
      <section className="space-y-6 bounceIn container mx-auto px-4 lg:px-8">
        {/* Header */}
        <HeaderIncomes openDialog={open} />
        {/* GRAFICAS */}
        {incomes.length > 0 && <GraphsHistory incomes={incomes} />}
        {/* Lista de ingresos */}
        <List incomes={incomes} openAddIncomeDialog={openAddIncomeDialog} handleDelete={handleDelete} />
        {/* NEW MONTH */}
        <dialog
          ref={newMonthRef}
          onClick={(e) => {
            if (e.target === newMonthRef.current) {
              newMonthRef.current.close()
            }
          }}
          className="bounceIn rounded-xl p-6 bg-zinc-900 text-white w-full max-w-md backdrop:bg-black/60 m-auto"
        >
          <h3 className="text-center text-lg font-semibold mb-1">
            Nuevo ingreso
          </h3>
          <p className="text-center text-sm text-gray-400 mb-4">
            Crea un nuevo registro para gestionar los ingresos
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* MES / AÑO */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Modo</label>
                <select
                  value={mode}
                  className="w-full mt-1 px-3 py-2 rounded bg-black border border-zinc-700"
                  onChange={e => setMode(e.target.value)}
                >
                  <option value="mensual">Mensual</option>
                  <option value="quincenal">Quincenal</option>
                </select>
              </div>
              <div>
                <label className="text-sm">Mes</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded bg-black border border-zinc-700"
                >
                  {enabledMonths.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm">Año</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded bg-black border border-zinc-700"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              {/* INGRESO */}
              <div>
                <label className="text-sm">Ingreso total del mes</label>
                <input
                  type="number"
                  placeholder="5000000"
                  value={totalIncomes}
                  onChange={(e) => setIngresoTotal(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded bg-black border border-zinc-700"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Total de ingresos que recibirás este mes
                </p>
              </div>
            </div>

            {/* RESUMEN */}
            {totalIncomes && (
              <div className="p-3 rounded bg-primary/10">
                <div className="flex items-center gap-2 text-primary">
                  <Calculator className="h-4 w-4" />
                  Ingreso registrado
                </div>
                <p className="text-xl font-bold">
                  ${Number(totalIncomes).toLocaleString("es-CO")}
                </p>
              </div>
            )}

            {/* BOTONES */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary text-white"
              >
                Crear ingreso
              </button>
              <button
                type="button"
                onClick={close}
                className="px-4 py-2 rounded-xl border border-zinc-600 bg-black"
              >
                Cancelar
              </button>
            </div>
          </form>
        </dialog>
        {/* NEW INCOME */}
        <dialog
          ref={addGastoRef}
          onClick={(e) => {
            if (e.target === addGastoRef.current) {
              closeAddGastoDialog();
            }
          }}
          className="bounceIn rounded-xl p-6 bg-zinc-900 text-white w-full max-w-md backdrop:bg-black/60 m-auto"
        >
          <h3 className="text-lg font-semibold mb-1 text-center">Agregar Gasto</h3>
          <p className="text-gray-400 mb-4 text-center">
            Registra un gasto para: {selectedIncome?.month} {selectedIncome?.year}
          </p>

          <form onSubmit={handleAddExpense} className="space-y-4">
            {/* CATEGORIA */}
            <div>
              <label className="text-sm">Categoría</label>
              <select
                value={expenseForm.categorie}
                onChange={(e) =>
                  setExpenseForm({ ...expenseForm, categorie: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 rounded bg-black border border-zinc-700"
                required
              >
                <option value="">Selecciona una categoría</option>
                {CATEGORIES_INCOMES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* MONTO */}
            <div>
              <label className="text-sm">Monto</label>
              <input
                type="number"
                value={expenseForm.mount}
                onChange={(e) =>
                  setExpenseForm({ ...expenseForm, mount: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 rounded bg-black border border-zinc-700"
                required
              />
            </div>

            {/* FECHA */}
            <div>
              <label className="text-sm">Fecha</label>
              <input
                type="date"
                value={expenseForm.date}
                onChange={(e) =>
                  setExpenseForm({ ...expenseForm, date: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 rounded bg-black border border-zinc-700"
                required
              />
            </div>

            {/* DESCRIPCIÓN */}
            <div>
              <label className="text-sm">Descripción (opcional)</label>
              <textarea
                rows="3"
                value={expenseForm.description}
                onChange={(e) =>
                  setExpenseForm({ ...expenseForm, description: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 rounded bg-black border border-zinc-700 resize-none"
              />
            </div>

            {/* BOTONES */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary text-white"
              >
                Agregar gasto
              </button>
              <button
                type="button"
                onClick={closeAddGastoDialog}
                className="px-4 py-2 rounded-xl border border-zinc-600 bg-black"
              >
                Cancelar
              </button>
            </div>
          </form>
        </dialog>

        <ConfirmDialog
          isOpen={deleteConfirm.open}
          onClose={() => setDeleteConfirm({ open: false, id: null, type: null, name: "", incomeId: null })}
          onConfirm={confirmDelete}
          title={deleteConfirm.type === 'expense' ? "Eliminar gasto" : "Eliminar ingreso"}
          message={deleteConfirm.type === 'expense' 
            ? `¿Estás seguro de que deseas eliminar el gasto "${deleteConfirm.name}"?` 
            : `¿Estás seguro de que deseas eliminar el ingreso de "${deleteConfirm.name}"? Esta acción no se puede deshacer.`
          }
        />
      </section>
    </>
  );
}