import { useNavigate } from "react-router-dom";
import { MoveLeft, Home } from "lucide-react";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute right-[100px] top-[120px] h-[400px] w-[400px] rounded-full bg-[var(--color-accent)] opacity-10 blur-[100px]" />
        <div className="absolute bottom-[80px] left-[80px] h-[300px] w-[300px] rounded-full bg-[#a78bfa] opacity-10 blur-[80px]" />
      </div>

      <div className="relative z-10 flex max-w-[420px] flex-col items-center text-center">
        <span
          className="text-[22px] font-extrabold tracking-[-0.02em] text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          PRODASH
        </span>

        <p className="mb-2 select-none bg-gradient-to-b from-white to-gray-500 bg-clip-text font-mono text-[120px] font-bold leading-none text-transparent">
          404
        </p>

        <h1 className="mb-3 text-xl font-semibold text-[var(--color-text-primary)]">
          Halaman tidak ditemukan
        </h1>
        <p className="mb-10 text-sm leading-relaxed text-[var(--color-text-muted)]">
          URL yang kamu masukkan tidak tersedia. Mungkin salah ketik atau halaman sudah dipindahkan.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border)] bg-transparent px-4 py-2.5 text-sm font-medium text-[var(--color-text-muted)] transition-all duration-[180ms] hover:border-[var(--color-border-light)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <MoveLeft size={15} /> Kembali
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex cursor-pointer items-center gap-2 rounded-lg border-none bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-[180ms] hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(108,99,255,0.4)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <Home size={15} /> Ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}
