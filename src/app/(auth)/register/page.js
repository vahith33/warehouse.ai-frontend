"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, User, Loader2, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const inputBase =
    "w-full rounded-xl px-4 py-3 bg-white/95 border border-slate-300 text-slate-900 placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400";

  const inputWithIcon = `${inputBase} pl-10`;
  const inputWithIconAndButton = `${inputBase} pl-10 pr-12`;

  function validate() {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!email.includes("@")) newErrors.email = "Enter a valid email";

    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: "admin", // Default role for testing
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      // Automatically redirect to login after success
      router.push("/login?registered=true");

    } catch (err) {
      setErrors({ submit: err.message || "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

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
          <div className="space-y-3 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg mx-auto">
              <User className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>

            <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>

            <p className="text-slate-600 text-sm">
              Register your warehouse management account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ahamed Vahith"
                  className={`${inputWithIcon} ${errors.name ? "border-red-400" : ""}`}
                />
              </div>
              {errors.name && <p className="text-red-400 text-xs ml-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@warehouse.com"
                  className={`${inputWithIcon} ${errors.email ? "border-red-400" : ""}`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs ml-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  className={`${inputWithIconAndButton} ${errors.password ? "border-red-400" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs ml-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-slate-700 ml-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={`${inputWithIconAndButton} ${errors.confirmPassword ? "border-red-400" : ""}`}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs ml-1">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 text-red-600 rounded-xl p-3 text-sm border border-red-100">
                {errors.submit}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
