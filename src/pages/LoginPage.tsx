import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Zap, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const inputCls =
  "w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-3 text-sm text-[var(--color-text-primary)] outline-none transition-all duration-150 focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_rgba(108,99,255,0.15)]";

const labelCls =
  "mb-[7px] block text-xs font-medium tracking-[0.03em] text-[var(--color-text-secondary)]";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname ?? "/dashboard";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const err = await login(username, password);
    if (err) {
      setError(err);
      setLoading(false);
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[var(--color-bg)] md:flex-row">
      {/* Background decorative blobs */}
      <div className="pointer-events-none absolute -left-[120px] -top-[120px] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(108,99,255,0.12)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-[100px] -right-[100px] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(255,101,132,0.08)_0%,transparent_70%)]" />

      {/* Left panel - branding (hidden on mobile) */}
      <div className="relative hidden flex-1 flex-col justify-center border-r border-[var(--color-border)] px-20 py-[60px] md:flex">
        {/* Logo */}
        <div className="mb-12 flex items-center gap-3">
          <div className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] shadow-[0_0_24px_rgba(108,99,255,0.4)]">
            <Zap size={22} color="white" />
          </div>
          <span
            className="text-[22px] font-extrabold tracking-[-0.02em] text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            PRODASH
          </span>
        </div>

        <h1
          className="mb-4 text-[42px] font-extrabold leading-[1.1] text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Product
          <br />
          <span className="bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] bg-clip-text text-transparent">
            Dashboard
          </span>
        </h1>
        <p className="m-0 max-w-[360px] text-[15px] leading-relaxed text-[var(--color-text-muted)]">
          Kelola produk, pantau statistik, dan analisa inventori — semua dalam
          satu tempat.
        </p>

        {/* Feature list */}
        <div className="mt-10 flex flex-col gap-3">
          {[
            "Data produk dari DummyJSON API",
            "Filter, search & sort produk",
            "Statistik & chart interaktif",
          ].map((f) => (
            <div key={f} className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[rgba(67,233,123,0.3)] bg-[rgba(67,233,123,0.15)]">
                <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-3)]" />
              </div>
              <span className="text-[13px] text-[var(--color-text-secondary)]">
                {f}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="relative z-10 flex w-full flex-col justify-center px-6 py-10 sm:px-12 sm:py-[60px] md:w-[480px] md:shrink-0">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-3 md:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)]">
            <Zap size={18} color="white" />
          </div>
          <span
            className="text-lg font-extrabold text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            PRODASH
          </span>
        </div>

        <div className="mb-9">
          <h2
            className="mb-2 text-[26px] font-bold text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Selamat datang
          </h2>
          <p className="m-0 text-sm text-[var(--color-text-muted)]">
            Masuk untuk mengakses dashboard
          </p>
        </div>

        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="flex flex-col gap-4"
        >
          <div>
            <label className={labelCls}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username..."
              autoComplete="username"
              required
              className={inputCls}
              style={{ fontFamily: "var(--font-body)" }}
            />
          </div>

          <div>
            <label className={labelCls}>Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className={`${inputCls} pr-11`}
                style={{ fontFamily: "var(--font-body)" }}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center border-none bg-transparent p-0.5 text-[var(--color-text-muted)]"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="animate-fade-in flex items-center gap-2 rounded-[10px] border border-[rgba(255,101,132,0.3)] bg-[rgba(255,101,132,0.1)] px-4 py-3 text-[13px] text-[var(--color-accent-2)]">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-none py-[13px] text-[15px] font-bold text-white transition-all duration-200 disabled:cursor-not-allowed hover:-translate-y-px"
            style={{
              background: loading
                ? "var(--color-surface-2)"
                : "linear-gradient(135deg, var(--color-accent), #8b5cf6)",
              color: loading ? "var(--color-text-muted)" : "white",
              boxShadow: loading ? "none" : "0 4px 20px rgba(108,99,255,0.35)",
              fontFamily: "var(--font-display)",
            }}
          >
            {loading && <Loader2 size={16} className="animate-spin-custom" />}
            {loading ? "Memverifikasi..." : "Masuk"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs leading-relaxed text-[var(--color-text-muted)]">
          Akun dikelola oleh admin.
          <br />
          Hubungi admin jika butuh akses.
        </p>
      </div>
    </div>
  );
}
