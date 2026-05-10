import type {
  Product,
  ProductInsert,
  ProductUpdate,
  DummyProductsResponse,
  AuthUser,
} from "@/types";

const BASE_URL = "https://dummyjson.com";

// ── helpers ───────────────────────────────────────────────

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── Auth ──────────────────────────────────────────────────

export async function loginApi(
  username: string,
  password: string,
): Promise<AuthUser> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, expiresInMins: 60 }),
  });
  return handleResponse<AuthUser>(res);
}

// ── Products ──────────────────────────────────────────────

/** Ambil semua produk (limit 100 agar dapat semua data) */
export async function fetchAllProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/products?limit=100&select=id,title,price,category,stock,thumbnail`);
  const data = await handleResponse<DummyProductsResponse>(res);
  return data.products;
}

/** Ambil satu produk by id */
export async function fetchProductById(id: number): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  return handleResponse<Product>(res);
}

/** Tambah produk baru */
export async function createProductApi(product: ProductInsert): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return handleResponse<Product>(res);
}

/** Update produk */
export async function updateProductApi(
  id: number,
  updates: ProductUpdate,
): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return handleResponse<Product>(res);
}

/** Hapus produk */
export async function deleteProductApi(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "DELETE",
  });
  await handleResponse<unknown>(res);
}

/** Ambil semua kategori */
export async function fetchCategories(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/products/category-list`);
  return handleResponse<string[]>(res);
}
