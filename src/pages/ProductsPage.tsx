import { useState } from "react";
import {
  Search, Plus, ArrowUpDown, ArrowUp, ArrowDown,
  Pencil, Trash2, ChevronLeft, ChevronRight,
  SlidersHorizontal, X, Package,
} from "lucide-react";
import { useProducts, useCategories, USD_TO_IDR } from "@/hooks/useProducts";
import ProductModal from "@/components/ProductModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import type { Product, FilterState, SortField } from "@/types";

const PAGE_SIZE = 10;

const DEFAULT_FILTERS: FilterState = {
  search: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  sortField: "title",
  sortOrder: "asc",
};

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

const inputBaseCls =
  "rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-primary)] outline-none transition-all duration-150 focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_rgba(108,99,255,0.12)]";

export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [modalProduct, setModalProduct] = useState<Product | null | undefined>(undefined);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  const {
    products,
    loading,
    error,
    optimisticCreate,
    optimisticUpdate,
    optimisticDelete,
  } = useProducts(filters);
  const categories = useCategories();

  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const paginated = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const setSearch = (v: string) => { setFilters((f) => ({ ...f, search: v })); setPage(1); };
  const setCategory = (v: string) => { setFilters((f) => ({ ...f, category: v })); setPage(1); };

  const toggleSort = (field: SortField) => {
    setFilters((f) => ({
      ...f,
      sortField: field,
      sortOrder: f.sortField === field && f.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (filters.sortField !== field) return <ArrowUpDown size={13} className="opacity-30" />;
    return filters.sortOrder === "asc"
      ? <ArrowUp size={13} className="text-[var(--color-accent)]" />
      : <ArrowDown size={13} className="text-[var(--color-accent)]" />;
  };

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice;

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3 md:mb-7">
        <div>
          <h1
            className="mb-1 text-2xl font-extrabold text-[var(--color-text-primary)] lg:text-[28px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Products
          </h1>
          <p className="m-0 text-sm text-[var(--color-text-muted)]">
            {loading ? "Loading..." : `${products.length} products found`}
          </p>
        </div>
        <button
          onClick={() => setModalProduct(null)}
          className="flex cursor-pointer items-center gap-2 rounded-[10px] border-none px-4 py-[10px] text-sm font-semibold text-white transition-all duration-150 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(108,99,255,0.4)] sm:px-5 sm:py-[11px]"
          style={{
            background: "linear-gradient(135deg, var(--color-accent), #8b5cf6)",
            boxShadow: "0 4px 16px rgba(108,99,255,0.3)",
            fontFamily: "var(--font-display)",
          }}
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Search + Filter bar */}
      <div className="mb-4 flex flex-col gap-2.5 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={15}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
          />
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputBaseCls} w-full py-[11px] pl-10 pr-3.5`}
            style={{ fontFamily: "var(--font-body)" }}
          />
        </div>

        <div className="flex gap-2.5">
          <select
            value={filters.category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${inputBaseCls} flex-1 cursor-pointer px-3.5 py-[11px] sm:flex-none sm:min-w-[160px]`}
            style={{
              color: filters.category ? "var(--color-text-primary)" : "var(--color-text-muted)",
              fontFamily: "var(--font-body)",
            }}
          >
            <option value="" style={{ background: "#111118", color: "#8888aa" }}>
              All Categories
            </option>
            {categories.map((c) => (
              <option key={c} value={c} style={{ background: "#111118", color: "#f0f0ff" }}>
                {c}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowFilters((v) => !v)}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-[10px] px-4 py-[11px] text-sm font-medium transition-all duration-150"
            style={{
              border: `1px solid ${hasActiveFilters ? "var(--color-accent)" : "var(--color-border)"}`,
              background: hasActiveFilters ? "rgba(108,99,255,0.1)" : "var(--color-surface)",
              color: hasActiveFilters ? "var(--color-accent)" : "var(--color-text-secondary)",
              fontFamily: "var(--font-display)",
            }}
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-bold text-white">
                {[filters.category, filters.minPrice, filters.maxPrice].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Advanced filter panel */}
      {showFilters && (
        <div className="animate-fade-in mb-4 flex flex-wrap items-end gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5">
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.05em] text-[var(--color-text-muted)]">
              Min Price (Rp)
            </label>
            <input
              type="number"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => { setFilters((f) => ({ ...f, minPrice: e.target.value })); setPage(1); }}
              className="w-[130px] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-[13px] text-[var(--color-text-primary)] outline-none"
              style={{ fontFamily: "var(--font-body)" }}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.05em] text-[var(--color-text-muted)]">
              Max Price (Rp)
            </label>
            <input
              type="number"
              placeholder="∞"
              value={filters.maxPrice}
              onChange={(e) => { setFilters((f) => ({ ...f, maxPrice: e.target.value })); setPage(1); }}
              className="w-[130px] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-[13px] text-[var(--color-text-primary)] outline-none"
              style={{ fontFamily: "var(--font-body)" }}
            />
          </div>
          <button
            onClick={() => { setFilters(DEFAULT_FILTERS); setPage(1); setShowFilters(false); }}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-transparent px-3.5 py-2 text-[13px] text-[var(--color-text-muted)] transition-all duration-150 hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <X size={13} />
            Reset
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-[10px] border border-[rgba(255,101,132,0.3)] bg-[rgba(255,101,132,0.1)] px-4 py-3 text-sm text-[var(--color-accent-2)]">
          ⚠️ {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {(
                  [
                    { label: "Name", field: "title" as SortField },
                    { label: "Category", field: "category" as SortField },
                    { label: "Price", field: "price" as SortField },
                    { label: "Stock", field: "stock" as SortField },
                    { label: "Actions", field: null },
                  ] as { label: string; field: SortField | null }[]
                ).map(({ label, field }) => (
                  <th
                    key={label}
                    onClick={() => field && toggleSort(field)}
                    className="select-none whitespace-nowrap px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] transition-colors duration-150 sm:px-5"
                    style={{
                      color: field && filters.sortField === field ? "var(--color-accent)" : "var(--color-text-muted)",
                      cursor: field ? "pointer" : "default",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      {label}
                      {field && <SortIcon field={field} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b border-[var(--color-border)]">
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-4 py-4 sm:px-5">
                        <div
                          className="skeleton h-3.5"
                          style={{ width: j === 4 ? "60px" : "80%" }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-[60px] text-center text-[var(--color-text-muted)]">
                    <Package size={32} className="mx-auto mb-3 opacity-30" />
                    No products found
                  </td>
                </tr>
              ) : (
                paginated.map((product, i) => (
                  <tr
                    key={product.id}
                    className="animate-fade-in border-b border-[var(--color-border)] transition-colors duration-[120ms] last:border-none hover:bg-[var(--color-surface-2)]"
                    style={{
                      animationDelay: `${i * 30}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    <td className="px-4 py-3.5 sm:px-5">
                      <span className="font-medium text-[var(--color-text-primary)]">
                        {product.title}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 sm:px-5">
                      <span className="inline-flex rounded-full border border-[rgba(108,99,255,0.2)] bg-[rgba(108,99,255,0.1)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-accent)]">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 sm:px-5">
                      <span
                        className="font-semibold text-[var(--color-accent-3)]"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {formatRupiah(product.price * USD_TO_IDR)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 sm:px-5">
                      <span
                        style={{
                          color: product.stock < 10
                            ? "var(--color-accent-2)"
                            : product.stock < 30
                            ? "#f093fb"
                            : "var(--color-text-secondary)",
                          fontWeight: product.stock < 10 ? 600 : 400,
                        }}
                      >
                        {product.stock}
                        {product.stock < 10 && (
                          <span className="ml-1 text-[10px] opacity-80">⚠️</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 sm:px-5">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setModalProduct(product)}
                          className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[7px] border border-[rgba(108,99,255,0.2)] bg-[rgba(108,99,255,0.08)] text-[#6c63ff] transition-all duration-150 hover:border-[rgba(108,99,255,0.5)] hover:bg-[rgba(108,99,255,0.2)]"
                          title="Edit"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteProduct(product)}
                          className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[7px] border border-[rgba(255,101,132,0.2)] bg-[rgba(255,101,132,0.08)] text-[#ff6584] transition-all duration-150 hover:border-[rgba(255,101,132,0.5)] hover:bg-[rgba(255,101,132,0.2)]"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] px-4 py-3.5 sm:px-5">
            <span className="text-xs text-[var(--color-text-muted)]">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, products.length)} of {products.length}
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[7px] border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={14} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className="flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-[7px] border px-1 text-[13px] transition-all duration-150"
                  style={{
                    background: page === i + 1 ? "var(--color-accent)" : "var(--color-surface-2)",
                    color: page === i + 1 ? "white" : "var(--color-text-secondary)",
                    borderColor: page === i + 1 ? "var(--color-accent)" : "var(--color-border)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[7px] border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {modalProduct !== undefined && (
        <ProductModal
          product={modalProduct}
          categories={categories}
          onClose={() => setModalProduct(undefined)}
          onCreate={optimisticCreate}
          onUpdate={optimisticUpdate}
        />
      )}
      {deleteProduct && (
        <DeleteConfirmModal
          product={deleteProduct}
          onClose={() => setDeleteProduct(null)}
          onDelete={optimisticDelete}
        />
      )}
    </div>
  );
}
