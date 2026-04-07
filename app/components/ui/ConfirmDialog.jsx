"use client";

import { useRef, useEffect } from "react";
import { AlertTriangle } from "lucide-react";

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
      className="rounded-2xl p-0 bg-zinc-900 w-full max-w-sm backdrop:bg-black/80 m-auto"
    >
      <div className="p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-danger/10">
          <AlertTriangle className="w-6 h-6 text-danger" />
        </div>
        <h3 className="text-lg font-semibold text-white text-center mb-2">{title}</h3>
        <p className="text-zinc-400 text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors font-medium cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-3 rounded-xl bg-danger text-white hover:bg-danger/90 transition-colors font-medium cursor-pointer"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </dialog>
  );
}