"use client";

import {signIn} from "next-auth/react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const inputBase =
    "w-full rounded-xl px-4 py-3 bg-white/95 border border-slate-300 text-slate-900 placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400";

  const inputWithIcon = `${inputBase} pl-10`;
  const inputWithIconAndButton = `${inputBase} pl-10 pr-12`;

  function validate() {
    const newErrors = {};

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!email.includes("@")) newErrors.email = "Enter a valid email";

    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    return newErrors;
  }

async function handleSubmit(e) {
  e.preventDefault();

  const validationErrors = validate();
  setErrors(validationErrors);

  if (Object.keys(validationErrors).length > 0) return;

  try {
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    if (result?.error) {
      throw new Error("Invalid email or password");
    }

    router.push("/dashboard");

  } catch (err) {
    setErrors({ submit: err.message || "Login failed. Please try again." });
  } finally {
    setLoading(false);
  }
}

  const emailError = errors.email;
  const passwordError = errors.password;

  return (
    <div className="relative min-h-screen bg-linear-to-br from-sky-100 via-white to-indigo-100 flex items-center justify-center px-4 py-8">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 p-8 space-y-8">
          {/* Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
              <Lock className="w-6 h-6 text-slate-800" strokeWidth={2.5} />
            </div>

            <h1 className="text-3xl font-bold text-slate-800">Warehouse AI</h1>

            <p className="text-slate-600 text-sm">
              Sign in to manage products, stock, and inventory.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700" />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@warehouse.com"
                  className={`${inputWithIcon} ${emailError
                    ? "border-red-500/60 focus:ring-red-500/20"
                    : "border-slate-600/50 focus:ring-blue-500/20 focus:border-blue-500/50"
                    }`}
                />
              </div>

              {emailError && (
                <p className="text-red-400 text-xs">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <Link
                  href="#"
                  className="text-xs text-blue-500 hover:text-blue-600 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700" />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`${inputWithIconAndButton} ${passwordError
                    ? "border-red-500/60 focus:ring-red-500/20"
                    : "border-slate-600/50 focus:ring-blue-500/20 focus:border-blue-500/50"
                    }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-800 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {passwordError && (
                <p className="text-red-400 text-xs">{passwordError}</p>
              )}
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-700/50 text-blue-500 focus:ring-blue-500/20"
              />
              <span className="text-sm text-slate-800">Remember me</span>
            </label>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                <p className="text-red-300 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-slate-800">
            Don&apos;t have an account?{" "}
            <Link
              href="#"
              className="text-blue-500 hover:text-blue-600 font-semibold transition-colors"
            >
              Request Access
            </Link>
          </p>
        </div>

        {/* Security note */}
        <p className="text-center text-xs text-slate-400 mt-6">
          🔒 Your warehouse data is secure and encrypted
        </p>
      </div>
    </div>
  );
}
