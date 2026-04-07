"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { useAuth } from "@/app/context/AuthContext";

export function useIncomes() {
  const { user } = useAuth();
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchIncomes();
    }
  }, [user]);

  const fetchIncomes = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("incomes")
        .select("*")
        .eq("user_id", user.id)
        .order("year", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formatted = data.map((i) => ({
        id: i.id,
        month: i.month,
        year: i.year,
        totalIncomes: i.total_incomes,
        date: i.date,
        expenses: i.expenses || [],
      }));

      setIncomes(formatted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addIncome = async (income) => {
    if (!user) return { success: false, error: "No hay usuario autenticado" };
    try {
      const newIncome = {
        id: income.id,
        user_id: user.id,
        month: income.month,
        year: income.year,
        total_incomes: income.totalIncomes,
        date: income.date,
        expenses: [],
      };

      const { error } = await supabase.from("incomes").insert(newIncome);

      if (error) throw error;

      setIncomes((prev) => [...prev, income]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteIncome = async (id) => {
    try {
      const { error } = await supabase.from("incomes").delete().eq("id", id);

      if (error) throw error;

      setIncomes((prev) => prev.filter((i) => i.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const addExpense = async (incomeId, expense) => {
    try {
      const income = incomes.find((i) => i.id === incomeId);
      if (!income) throw new Error("Ingreso no encontrado");

      const updatedExpenses = [...(income.expenses || []), expense];

      const { error } = await supabase
        .from("incomes")
        .update({ expenses: updatedExpenses, updated_at: new Date().toISOString() })
        .eq("id", incomeId);

      if (error) throw error;

      setIncomes((prev) =>
        prev.map((i) =>
          i.id === incomeId ? { ...i, expenses: updatedExpenses } : i
        )
      );

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteExpense = async (incomeId, expenseId) => {
    try {
      const income = incomes.find((i) => i.id === incomeId);
      if (!income) throw new Error("Ingreso no encontrado");

      const updatedExpenses = income.expenses.filter(e => e.id !== expenseId);

      const { error } = await supabase
        .from("incomes")
        .update({ expenses: updatedExpenses, updated_at: new Date().toISOString() })
        .eq("id", incomeId);

      if (error) throw error;

      setIncomes((prev) =>
        prev.map((i) =>
          i.id === incomeId ? { ...i, expenses: updatedExpenses } : i
        )
      );

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return { incomes, loading, error, addIncome, deleteIncome, addExpense, deleteExpense, refresh: fetchIncomes };
}