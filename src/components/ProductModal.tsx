import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import type { Product, ProductInsert, ProductUpdate } from "@/types";
import { USD_TO_IDR } from "@/hooks/useProducts";

interface ProductModalProps {
  product?: Product | null;
  categories: string[];
  onClose: () => void;
  onCreate: (product: ProductInsert) => Promise<Product>;
  onUpdate: (id: number, updates: ProductUpdate) => Promise<Product>;
}

const inputCls =
  "w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3.5 py-2.5 text-sm text-[var(--color-text-primary)] outline-none transition-all duration-150 focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_rgba(108,99,255,0.15)]";

const labelCls =
  "mb-1.5 block text-xs font-medium tracking-[0.03em] text-[var(--color-text-secondary)]";

export default function ProductModal({
  product,
  categories,
  onClose,
  onCreate,
  onUpdate,
}: ProductModalProps) {
  const isEdit = !!product;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Harga di form dalam IDR supaya user tidak bingung
  const [form, setForm] = useState({
    title: "",
    priceIdr: 0,
    category: categories[0] ?? "",
    stock: 0,
  });

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title,
        priceIdr: Math.round(product.price * USD_TO_IDR),
        category: product.category,
        stock: product.stock,
      });
    } else if (categories.length > 0) {
      setForm((f) => ({ ...f, category: categories[0]! }));
    }
  }, [product, categories]);

  const handleSubmit = async () => {
    if (!form.title.trim()) { setError("Product name is required"); return; }
    if (form.priceIdr < 0) { setError("Price must be non-negative"); return; }

    setLoading(true);
    setError(null);

    const payload: ProductInsert = {
      title: form.title.trim(),
      price: form.priceIdr / USD_TO_IDR, // simpan dalam USD ke API
      category: form.category,
      stock: form.stock,
    };

    try {
      if (isEdit && product) {
        await onUpdate(product.id, payload);
      } else {
        await onCreate(payload);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="animate-fade-in w-full max-w-[480px] rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="mb-7 flex items-center justify-between">
          <h2
            className="text-xl font-bold text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {isEdit ? "Edit Product" : "Add Product"}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] transition-all duration-150 hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <div>
            <label className={labelCls}>Product Name</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter product name..."
              className={inputCls}
              style={{ fontFamily: "var(--font-body)" }}
            />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={`${inputCls} cursor-pointer`}
              style={{ fontFamily: "var(--font-body)" }}
            >
              {categories.map((c) => (
                <option key={c} value={c} style={{ background: "#111118" }}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Price (Rp)</label>
              <input
                type="number"
                value={form.priceIdr}
                onChange={(e) =>
                  setForm({ ...form, priceIdr: parseFloat(e.target.value) || 0 })
                }
                min={0}
                step={1000}
                className={inputCls}
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>
            <div>
              <label className={labelCls}>Stock</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: parseInt(e.target.value) || 0 })
                }
                min={0}
                className={inputCls}
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-[rgba(255,101,132,0.3)] bg-[rgba(255,101,132,0.1)] px-4 py-3 text-[13px] text-[var(--color-accent-2)]">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 cursor-pointer rounded-[10px] border border-[var(--color-border)] bg-transparent py-3 text-sm font-medium text-[var(--color-text-secondary)] transition-all duration-150 hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Cancel
          </button>
          <button
            onClick={() => void handleSubmit()}
            disabled={loading}
            className="flex flex-[2] cursor-pointer items-center justify-center gap-2 rounded-[10px] border-none py-3 text-sm font-semibold text-white transition-all duration-150 disabled:cursor-not-allowed"
            style={{
              background: loading
                ? "var(--color-surface-2)"
                : "linear-gradient(135deg, var(--color-accent), #8b5cf6)",
              color: loading ? "var(--color-text-muted)" : "white",
              boxShadow: loading ? "none" : "0 4px 16px rgba(108,99,255,0.3)",
              fontFamily: "var(--font-display)",
            }}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin-slow" />
            ) : (
              <Save size={16} />
            )}
            {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
