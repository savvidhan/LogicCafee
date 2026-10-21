import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { sendOTP, verifyOTP } from "../../services/auth.service";
import { useApp } from "../../app/providers/AppProvider";

const STEPS = { FORM: "form", OTP: "otp", DONE: "done" };

const Register = () => {
  const navigate = useNavigate();
  const { login } = useApp();

  const [step, setStep] = useState(STEPS.FORM);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* ── Step 1: Send OTP ── */
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await sendOTP(form);
      setStep(STEPS.OTP);
      startResendCooldown();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 2: Verify OTP ── */
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const authData = await verifyOTP({ email: form.email, otp });
      login(authData);
      navigate("/patterns");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ── Resend OTP ── */
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError("");
    setLoading(true);
    try {
      await sendOTP(form);
      startResendCooldown();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const startResendCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((v) => {
        if (v <= 1) { clearInterval(interval); return 0; }
        return v - 1;
      });
    }, 1000);
  };

  /* ── OTP digit input UX ── */
  const handleOtpChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(val);
  };

  return (
    <section className="flex min-h-[88vh] items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* ── Logo mark ── */}
        <div className="mb-8 text-center">
          <span className="text-2xl font-semibold text-white">
            Logic<span className="text-indigo-400">Cafe</span>
          </span>
        </div>

        {/* ── Card ── */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-xl backdrop-blur">

          {/* ── Step indicator ── */}
          <div className="mb-8 flex items-center gap-3">
            {[STEPS.FORM, STEPS.OTP].map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold
                  transition-colors ${step === s || (step === STEPS.DONE && i < 2)
                    ? "bg-indigo-500 text-white"
                    : step === STEPS.OTP && i === 0
                      ? "bg-green-500/20 text-green-400"
                      : "bg-zinc-800 text-zinc-500"}`}>
                  {step === STEPS.OTP && i === 0 ? "✓" : i + 1}
                </div>
                <span className={`text-xs font-medium ${step === s ? "text-zinc-200" : "text-zinc-500"}`}>
                  {i === 0 ? "Your details" : "Verify email"}
                </span>
                {i === 0 && <div className="h-px w-8 bg-zinc-700" />}
              </div>
            ))}
          </div>

          {/* ── Error ── */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* ════ STEP 1: Registration Form ════ */}
          {step === STEPS.FORM && (
            <>
              {/* Google OAuth button */}
              <a
                href={`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/auth/google`}
                className="mb-6 flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-800"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </a>

              <div className="mb-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-zinc-800" />
                <span className="text-xs text-zinc-600">or register with email</span>
                <div className="h-px flex-1 bg-zinc-800" />
              </div>

              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                    Full name
                  </label>
                  <input
                    type="text" name="name" value={form.name}
                    onChange={handleChange} placeholder="Rahul Sharma"
                    required autoFocus
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800/60 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                    Email
                  </label>
                  <input
                    type="email" name="email" value={form.email}
                    onChange={handleChange} placeholder="you@example.com"
                    required
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800/60 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                    Password
                  </label>
                  <input
                    type="password" name="password" value={form.password}
                    onChange={handleChange} placeholder="Min. 6 characters"
                    required minLength={6}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800/60 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition"
                  />
                </div>

                <button
                  type="submit" disabled={loading}
                  className="mt-2 w-full rounded-lg bg-indigo-500 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Sending OTP…" : "Send verification code"}
                </button>
              </form>
            </>
          )}

          {/* ════ STEP 2: OTP Verification ════ */}
          {step === STEPS.OTP && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10">
                  <span className="text-2xl">📬</span>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  We sent a 6-digit code to{" "}
                  <span className="font-medium text-zinc-200">{form.email}</span>
                </p>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-zinc-400 text-center">
                  Enter your code
                </label>
                <input
                  type="text" inputMode="numeric" value={otp}
                  onChange={handleOtpChange}
                  placeholder="000000"
                  autoFocus maxLength={6}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-3 text-center text-2xl font-mono font-bold tracking-[0.4em] text-white placeholder-zinc-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition"
                />
              </div>

              <button
                type="submit" disabled={loading || otp.length < 6}
                className="w-full rounded-lg bg-indigo-500 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Verifying…" : "Create account"}
              </button>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => { setStep(STEPS.FORM); setOtp(""); setError(""); }}
                  className="text-zinc-500 hover:text-zinc-300 transition"
                >
                  ← Back
                </button>
                <button
                  type="button" onClick={handleResend}
                  disabled={resendCooldown > 0 || loading}
                  className="text-indigo-400 hover:text-indigo-300 disabled:text-zinc-600 disabled:cursor-not-allowed transition"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
