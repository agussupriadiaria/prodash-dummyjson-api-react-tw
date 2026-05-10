# PRODEX Dashboard

Product dashboard built with React + TypeScript + Tailwind CSS v4, using **DummyJSON** as the API backend.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router v7
- Recharts
- DummyJSON API

## Features

- 🔐 Login dengan DummyJSON Auth (`POST /auth/login`) => dummy account [emilys / emilyspass]
- 📦 CRUD Produk dengan optimistic update
- 🔍 Search, filter by category, filter by price range
- ↕️ Sort by name, category, price, stock
- 📊 Dashboard dengan bar chart, pie chart, dan category breakdown
- 📱 Responsive (mobile-first)

## API Endpoints Used

| Method   | Endpoint                  | Keterangan            |
| -------- | ------------------------- | --------------------- |
| `POST`   | `/auth/login`             | Login user            |
| `GET`    | `/products?limit=100`     | Ambil semua produk    |
| `POST`   | `/products/add`           | Tambah produk         |
| `PUT`    | `/products/:id`           | Update produk         |
| `DELETE` | `/products/:id`           | Hapus produk          |
| `GET`    | `/products/category-list` | Ambil daftar kategori |

## Demo Credentials

<!-- Tambahkan credential demo di sini -->

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

## Notes

DummyJSON adalah fake REST API. Operasi tambah/edit/hapus akan mengembalikan response sukses, namun data tidak benar-benar tersimpan di server. Setelah refresh halaman, data akan kembali ke kondisi semula.
