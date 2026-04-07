"use client";

import { useRef, useEffect } from "react";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar eliminación",
  message = "¿Estás seguro de que deseas eliminar este elemento?",
  confirmText = "Eliminar",
  cancelText = "Cancelar",
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          onClose();
        }
      }}
      className="rounded-xl p-6 bg-zinc-900 text-white w-full max-w-sm backdrop:bg-black/60 m-auto"
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 mb-6">{message}</p>
      <div className="flex flex-col gap-2">
        <button
          onClick={handleConfirm}
          className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
        >
          {confirmText}
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl border border-zinc-600 bg-black hover:bg-zinc-800"
        >
          {cancelText}
        </button>
      </div>
    </dialog>
  );
}