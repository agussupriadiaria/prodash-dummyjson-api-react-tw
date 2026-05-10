import { useState, useEffect, useCallback, useMemo } from "react";
import {
  fetchAllProducts,
  fetchCategories,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from "@/lib/api";
import type {
  Product,
  ProductInsert,
  ProductUpdate,
  FilterState,
  DashboardStats,
  CategoryStat,
} from "@/types";

// Kurs konversi USD → IDR (tetap / hardcoded)
export const USD_TO_IDR = 16_000;

// ── useProducts ───────────────────────────────────────────
// Fetch semua produk sekali, lalu filter/sort di client.
// Optimistic update: state lokal langsung diubah tanpa refetch.

export function useProducts(filters: FilterState) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllProducts();
      setAllProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  // Filter + sort di client
  const products = useMemo(() => {
    let result = [...allProducts];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q));
    }
    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters.minPrice) {
      const min = parseFloat(filters.minPrice) / USD_TO_IDR;
      result = result.filter((p) => p.price >= min);
    }
    if (filters.maxPrice) {
      const max = parseFloat(filters.maxPrice) / USD_TO_IDR;
      result = result.filter((p) => p.price <= max);
    }

    result.sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      if (filters.sortField === "title") {
        aVal = a.title.toLowerCase();
        bVal = b.title.toLowerCase();
      } else {
        aVal = a[filters.sortField] as number;
        bVal = b[filters.sortField] as number;
      }

      if (aVal < bVal) return filters.sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return filters.sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [allProducts, filters]);

  // ── Optimistic CRUD ────────────────────────────────────

  const optimisticCreate = useCallback(
    async (product: ProductInsert): Promise<Product> => {
      const created = await createProductApi(product);
      // DummyJSON returns id yang baru tapi fake — tambahkan ke state lokal
      setAllProducts((prev) => [created, ...prev]);
      return created;
    },
    [],
  );

  const optimisticUpdate = useCallback(
    async (id: number, updates: ProductUpdate): Promise<Product> => {
      const updated = await updateProductApi(id, updates);
      setAllProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates, ...updated } : p)),
      );
      return updated;
    },
    [],
  );

  const optimisticDelete = useCallback(async (id: number): Promise<void> => {
    await deleteProductApi(id);
    setAllProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    optimisticCreate,
    optimisticUpdate,
    optimisticDelete,
  };
}

// ── useCategories ─────────────────────────────────────────

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    void fetchCategories().then(setCategories).catch(() => {});
  }, []);

  return categories;
}

// ── useDashboardStats ─────────────────────────────────────

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllProducts();

      const totalProducts = data.length;
      const totalValue = data.reduce(
        (sum, p) => sum + p.price * USD_TO_IDR * p.stock,
        0,
      );
      const lowStock = data.filter((p) => p.stock < 10).length;

      const categoryMap = new Map<string, CategoryStat>();
      data.forEach((p) => {
        const existing = categoryMap.get(p.category);
        if (existing) {
          existing.count++;
          existing.totalValue += p.price * USD_TO_IDR * p.stock;
        } else {
          categoryMap.set(p.category, {
            category: p.category,
            count: 1,
            totalValue: p.price * USD_TO_IDR * p.stock,
          });
        }
      });

      setStats({
        totalProducts,
        totalValue,
        lowStock,
        categories: Array.from(categoryMap.values()),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  return { stats, loading, refetch: fetchStats };
}
