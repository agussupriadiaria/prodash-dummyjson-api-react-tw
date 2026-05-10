// ── Auth ──────────────────────────────────────────────────
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
}

// ── Products ──────────────────────────────────────────────
export type Product = {
  id: number;
  title: string;       // mapped ke "name" di tampilan
  price: number;       // USD → dikonversi ke IDR saat display
  category: string;
  stock: number;
  thumbnail?: string;
  description?: string;
};

// Untuk form add/edit — field yang diisi user
export type ProductInsert = {
  title: string;
  price: number;
  category: string;
  stock: number;
};

export type ProductUpdate = Partial<ProductInsert>;

export interface CategoryStat {
  category: string;
  count: number;
  totalValue: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalValue: number;
  lowStock: number;
  categories: CategoryStat[];
}

export type SortField = "title" | "price" | "stock" | "category";
export type SortOrder = "asc" | "desc";

export interface FilterState {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  sortField: SortField;
  sortOrder: SortOrder;
}

// ── DummyJSON API response shapes ─────────────────────────
export interface DummyProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
