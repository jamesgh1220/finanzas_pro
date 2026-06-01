"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Eye, EyeOff, Wallet, ArrowLeft, CheckCircle2, TrendingUp, LayoutDashboard } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    const result = await signUp(email, password);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || "Error al registrarse");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-bg">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 w-full max-w-sm">
          <div className="p-6 rounded-2xl bg-bg-card border border-border shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-success/15 rounded-full mb-5">
              <CheckCircle2 className="w-7 h-7 text-success" />
            </div>
            <h2 className="text-xl font-semibold text-fg mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>¡Cuenta creada!</h2>
            <p className="text-fg-muted text-sm mb-6">
              Ahora puedes iniciar sesión con tus credenciales
            </p>
            <button
              onClick={() => router.push("/login")}
              className="w-full py-2.5 px-4 bg-primary text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 flex items-center justify-center text-sm cursor-pointer"
            >
              Ir a iniciar sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-bg">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-primary/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="relative inline-flex mb-6">
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl" />
            <div className="relative flex items-center justify-center w-14 h-14 bg-primary rounded-2xl shadow-lg shadow-primary/20">
              <Wallet className="w-7 h-7 text-black" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-fg mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Crear cuenta</h1>
          <p className="text-fg-muted text-sm">Regístrate para comenzar a gestionar tus finanzas</p>
        </div>

        <div className="p-6 rounded-2xl bg-bg-card border border-border shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-fg-muted mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-bg-elevated border border-border text-fg placeholder-fg-subtle focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-fg-muted mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-bg-elevated border border-border text-fg placeholder-fg-subtle focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-fg-muted mb-1.5">
                Confirmar contraseña
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-bg-elevated border border-border text-fg placeholder-fg-subtle focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-danger/10 border border-danger/20">
                <p className="text-danger text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-primary text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                "Crear cuenta"
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-fg-muted text-sm">
              ¿Ya tienes una cuenta?{" "}
              <a href="/login" className="text-primary hover:text-primary-light font-medium transition-colors">
                Inicia sesión
              </a>
            </p>
          </div>

          <button
            onClick={() => router.push("/login")}
            className="mt-3 w-full flex items-center justify-center gap-1.5 text-fg-muted hover:text-fg transition-colors text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al login
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-5 text-fg-subtle">
          <div className="flex items-center gap-1.5">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="text-xs">Dashboard</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-xs">Deudas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5" />
            <span className="text-xs">Ingresos</span>
          </div>
        </div>
      </div>
    </div>
  );
}
