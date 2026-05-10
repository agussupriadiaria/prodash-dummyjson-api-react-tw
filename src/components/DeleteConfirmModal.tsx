import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import type { Product } from "@/types";

interface DeleteConfirmModalProps {
  product: Product;
  onClose: () => void;
  onDelete: (id: number) => Promise<void>;
}

export default function DeleteConfirmModal({
  product,
  onClose,
  onDelete,
}: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(product.id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="animate-fade-in w-full max-w-[400px] rounded-[20px] border border-[rgba(255,101,132,0.3)] bg-[var(--color-surface)] p-8 text-center shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(255,101,132,0.3)] bg-[rgba(255,101,132,0.1)] text-[var(--color-accent-2)]">
          <Trash2 size={24} />
        </div>
        <h3
          className="mb-2 text-lg font-bold text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Delete Product
        </h3>
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
          Are you sure you want to delete{" "}
          <strong className="text-[var(--color-text-primary)]">{product.title}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 cursor-pointer rounded-[10px] border border-[var(--color-border)] bg-transparent py-[11px] text-sm font-medium text-[var(--color-text-secondary)] transition-all duration-150 hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Cancel
          </button>
          <button
            onClick={() => void handleDelete()}
            disabled={loading}
            className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border-none py-[11px] text-sm font-semibold text-white transition-all duration-150 disabled:cursor-not-allowed"
            style={{
              background: loading
                ? "var(--color-surface-2)"
                : "linear-gradient(135deg, #ff6584, #ff4757)",
              color: loading ? "var(--color-text-muted)" : "white",
              boxShadow: loading ? "none" : "0 4px 16px rgba(255,101,132,0.3)",
              fontFamily: "var(--font-display)",
            }}
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin-slow" />
            ) : (
              <Trash2 size={14} />
            )}
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
