"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Eye, EyeOff, Wallet, ArrowLeft, CheckCircle2, TrendingUp } from "lucide-react";

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
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900" />
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-20 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl text-center">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl" />
            
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success/20 rounded-full mb-4">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">¡Cuenta creada!</h2>
              <p className="text-zinc-500 mb-6">
                Ahora puedes iniciar sesión con tus credenciales
              </p>
              <button
                onClick={() => router.push("/login")}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-primary to-emerald-400 hover:from-primary/90 hover:to-emerald-400 text-black font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-primary/30 cursor-pointer"
              >
                Ir a iniciar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900" />
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-20 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="relative inline-flex mb-6">
            <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl animate-pulse" />
            <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-emerald-400 rounded-2xl shadow-lg shadow-primary/30">
              <Wallet className="w-8 h-8 text-black" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Crear cuenta</h1>
          <p className="text-zinc-500">Regístrate para comenzar a gestionar tus finanzas</p>
        </div>

        <div className="relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl" />
          
          <form onSubmit={handleSubmit} className="relative space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Confirmar contraseña
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
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
              className="w-full py-3.5 px-4 bg-gradient-to-r from-primary to-emerald-400 hover:from-primary/90 hover:to-emerald-400 text-black font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30 hover:shadow-primary/50"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                "Crear cuenta"
              )}
            </button>
          </form>

          <div className="relative mt-6 text-center">
            <p className="text-zinc-500 text-sm">
              ¿Ya tienes una cuenta?{" "}
              <a href="/login" className="text-primary hover:text-emerald-400 font-medium transition-colors">
                Inicia sesión
              </a>
            </p>
          </div>

          <button
            onClick={() => router.push("/login")}
            className="mt-4 w-full flex items-center justify-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al login
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-zinc-600">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">Deudas</span>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            <span className="text-xs">Ingresos</span>
          </div>
        </div>
      </div>
    </div>
  );
}