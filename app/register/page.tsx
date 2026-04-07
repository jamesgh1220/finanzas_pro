"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Eye, EyeOff, Wallet, ArrowLeft, CheckCircle2 } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">¡Cuenta creada!</h2>
            <p className="text-zinc-400 mb-6">
              Ahora puedes iniciar sesión con tus credenciales
            </p>
            <button
              onClick={() => router.push("/login")}
              className="w-full py-3 px-4 bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-primary/25"
            >
              Ir a iniciar sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-emerald-400 rounded-2xl mb-4 shadow-lg shadow-primary/25">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Crear cuenta</h1>
          <p className="text-zinc-400">Regístrate para comenzar a gestionar tus finanzas</p>
        </div>

        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950/80 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-950/80 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Confirmar contraseña
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950/80 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-400 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25 hover:shadow-primary/40"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Crear cuenta"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-zinc-400 text-sm">
              ¿Ya tienes una cuenta?{" "}
              <a href="/login" className="text-primary hover:text-emerald-400 font-medium transition-colors">
                Inicia sesión
              </a>
            </p>
          </div>

          <button
            onClick={() => router.push("/login")}
            className="mt-4 w-full flex items-center justify-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al login
          </button>
        </div>
      </div>
    </div>
  );
}