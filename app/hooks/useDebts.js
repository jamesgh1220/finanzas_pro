"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { useAuth } from "@/app/context/AuthContext";

export function useDebts() {
  const { user } = useAuth();
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchDebts();
    }
  }, [user]);

  const fetchDebts = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("debts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formatted = data.map((d) => ({
        id: d.id,
        date: d.date,
        name: d.name,
        totalMount: d.total_mount,
        estimateMonths: d.estimate_months,
        minimumFee: d.minimum_fee,
        partialPayments: d.partial_payments || [],
      }));

      setDebts(formatted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addDebt = async (debt) => {
    if (!user) return { success: false, error: "No hay usuario autenticado" };
    try {
      const newDebt = {
        id: debt.id,
        user_id: user.id,
        date: debt.date,
        name: debt.name,
        total_mount: debt.totalMount,
        estimate_months: debt.estimateMonths,
        minimum_fee: debt.minimumFee,
        partial_payments: [],
      };

      const { error } = await supabase.from("debts").insert(newDebt);

      if (error) throw error;

      setDebts((prev) => [...prev, debt]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteDebt = async (id) => {
    try {
      const { error } = await supabase.from("debts").delete().eq("id", id);

      if (error) throw error;

      setDebts((prev) => prev.filter((d) => d.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const addPartialPayment = async (debtId, payment) => {
    try {
      const debt = debts.find((d) => d.id === debtId);
      if (!debt) throw new Error("Deuda no encontrada");

      const updatedPayments = [...(debt.partialPayments || []), payment];

      const { error } = await supabase
        .from("debts")
        .update({ partial_payments: updatedPayments, updated_at: new Date().toISOString() })
        .eq("id", debtId);

      if (error) throw error;

      setDebts((prev) =>
        prev.map((d) =>
          d.id === debtId ? { ...d, partialPayments: updatedPayments } : d
        )
      );

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deletePartialPayment = async (debtId, paymentId) => {
    try {
      const debt = debts.find((d) => d.id === debtId);
      if (!debt) throw new Error("Deuda no encontrada");

      const updatedPayments = debt.partialPayments.filter(p => p.id !== paymentId);

      const { error } = await supabase
        .from("debts")
        .update({ partial_payments: updatedPayments, updated_at: new Date().toISOString() })
        .eq("id", debtId);

      if (error) throw error;

      setDebts((prev) =>
        prev.map((d) =>
          d.id === debtId ? { ...d, partialPayments: updatedPayments } : d
        )
      );

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return { debts, loading, error, addDebt, deleteDebt, addPartialPayment, deletePartialPayment, refresh: fetchDebts };
}