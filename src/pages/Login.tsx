import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Mail,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

import heroPortrait from "@/assets/hero-portrait.jpg";
import letterStill from "@/assets/letter-still.jpg";
import handsPolaroid from "@/assets/hands-polaroid.jpg";

const STEPS = [
  {
    n: "01",
    kicker: "Returning",
    title: "Welcome back.",
    sub: "Your drafts are right where you left them. Sign in to keep going.",
    image: letterStill,
    quote: "Pick up the pen exactly where it fell.",
    by: "The studio",
  },
  {
    n: "02",
    kicker: "Lost the key?",
    title: "Reset your password.",
    sub: "Drop your email and we'll send a fresh link to your inbox.",
    image: handsPolaroid,
    quote: "Forgetting is human. Resetting is one tap.",
    by: "Support desk",
  },
];

const Login = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState("");

  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const destinationFor = (u: { role?: string; isAdmin?: boolean; isSuperAdmin?: boolean } | null | undefined) => {
    if (!u) return "/";
    if (u.isSuperAdmin || u.isAdmin || u.role === "admin") return "/admin";
    if (u.role === "freelancer") return "/freelancer/dashboard";
    return "/profile";
  };

  useEffect(() => {
    if (isAuthenticated) navigate(destinationFor(user));
  }, [isAuthenticated, user, navigate]);

  const meta = STEPS[step - 1];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    if (!login(email, password)) {
      setError("Invalid credentials. Try again.");
      return;
    }
    // useAuth.login sets state synchronously; read the freshest user from storage
    const stored = JSON.parse(localStorage.getItem("currentUser") || "null");
    navigate(destinationFor(stored));
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(resetEmail)) {
      setError("Please enter a valid email.");
      return;
    }
    setResetSent(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-20 container px-6 md:px-10 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="w-8 h-px bg-foreground transition-all group-hover:w-12" />
          <span className="font-mono-accent text-[11px] uppercase tracking-[0.25em] text-foreground/70 group-hover:text-foreground">
            Webilio · home
          </span>
        </Link>
        <Link to="/signup">
          <Button variant="ghost" className="text-xs font-mono-accent uppercase tracking-[0.2em]">
            New here? Start your first piece
            <ArrowUpRight className="ml-1 w-3.5 h-3.5" />
          </Button>
        </Link>
      </header>

      {/* Two-column layout — mirrored from Signup */}
      <div className="relative z-10 container px-6 md:px-10 pb-20">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* RIGHT-FEEL on desktop: editorial column, placed left */}
          <aside className="lg:col-span-5 lg:sticky lg:top-10 self-start">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-12 h-px bg-foreground" />
              <span className="font-mono-accent text-[11px] uppercase tracking-[0.25em] text-foreground/70">
                {meta.kicker} · No.{meta.n}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`title-${step}`}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1 className="font-display text-5xl md:text-6xl font-light leading-[1.02] tracking-tight">
                  {meta.title.split(" ").map((w, i, a) =>
                    i === a.length - 1 ? (
                      <span key={i} className="italic">{w}</span>
                    ) : (
                      <span key={i}>{w} </span>
                    ),
                  )}
                </h1>
                <p className="mt-6 text-foreground/70 text-lg leading-[1.7] max-w-md">
                  {meta.sub}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Polaroid stack — distinct from Signup's single tilted card */}
            <div className="mt-12 relative hidden lg:block h-72">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="stack-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    {[
                      { src: heroPortrait, rot: -8, left: 0, top: 0, label: "studio · 01" },
                      { src: letterStill, rot: 5, left: 130, top: 30, label: "letters · 03" },
                      { src: handsPolaroid, rot: -3, left: 260, top: 10, label: "hands · 07" },
                    ].map((p, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20, rotate: p.rot * 1.5 }}
                        animate={{ opacity: 1, y: 0, rotate: p.rot }}
                        transition={{ duration: 0.7, delay: 0.15 + i * 0.12 }}
                        className="absolute w-40 bg-background p-2 pb-5 shadow-2xl ring-1 ring-foreground/5"
                        style={{ left: p.left, top: p.top }}
                      >
                        <img src={p.src} alt="" className="w-full h-40 object-cover" />
                        <div className="font-mono-accent text-[10px] text-foreground/50 mt-1 px-1">
                          — {p.label}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="stack-2"
                    initial={{ opacity: 0, scale: 0.96, rotate: 2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 1.5 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-foreground/10 aspect-[4/5] max-w-[280px]"
                  >
                    <img src={meta.image} alt={meta.title} className="w-full h-full object-cover" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              key={`q-${step}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:block mt-10 max-w-sm border-l-2 border-foreground/20 pl-5"
            >
              <div className="font-display italic text-lg leading-snug text-foreground">
                "{meta.quote}"
              </div>
              <div className="mt-3 flex items-center gap-2 font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/50">
                <span className="w-6 h-px bg-foreground/30" />
                {meta.by}
              </div>
            </motion.div>
          </aside>

          {/* RIGHT — Form */}
          <main className="lg:col-span-7">
            {/* Chapter rail — single bar with subtle scan, distinct from Signup's segmented progress */}
            <div className="mb-10">
              <div className="relative h-[3px] rounded-full bg-foreground/10 overflow-hidden">
                <motion.div
                  initial={false}
                  animate={{ width: step === 1 ? "55%" : "100%" }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-y-0 left-0 bg-foreground"
                />
              </div>
              <div className="mt-3 flex justify-between font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/50">
                <span>Chapter 0{step} · {meta.kicker}</span>
                <span>{step === 1 ? "Sign in" : "Reset"}</span>
              </div>
            </div>

            <div className="bg-background border border-foreground/10 rounded-3xl p-7 md:p-10 shadow-xl">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.form
                    key="step-1"
                    onSubmit={handleLogin}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-6"
                  >
                    <LoginField
                      id="login-email"
                      label="Email"
                      icon={<Mail className="w-4 h-4" />}
                      type="email"
                      placeholder="hello@studio.com"
                      value={email}
                      onChange={setEmail}
                    />
                    <LoginField
                      id="login-password"
                      label="Password"
                      icon={<Lock className="w-4 h-4" />}
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={setPassword}
                      right={
                        <button
                          type="button"
                          onClick={() => { setStep(2); setError(""); setResetSent(false); }}
                          className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
                        >
                          Forgot?
                        </button>
                      }
                    />

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border-l-2 border-destructive bg-destructive/5 px-4 py-3 text-sm text-destructive"
                      >
                        <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] block mb-1">
                          Note
                        </span>
                        {error}
                      </motion.div>
                    )}

                    <Button type="submit" size="lg" className="w-full group">
                      Open the studio
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <div className="border-l-2 border-primary pl-4 py-2 bg-primary/5 rounded-r">
                      <div className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
                        Demo desk
                      </div>
                      <div className="text-sm font-mono-accent">
                        admin@example.com · admin123
                      </div>
                    </div>

                    <p className="text-center text-sm text-muted-foreground pt-2">
                      New to the studio?{" "}
                      <Link
                        to="/signup"
                        className="text-foreground underline underline-offset-4 decoration-primary decoration-2"
                      >
                        Start your first piece
                      </Link>
                    </p>
                  </motion.form>
                ) : (
                  <motion.form
                    key="step-2"
                    onSubmit={handleReset}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-6"
                  >
                    {!resetSent ? (
                      <>
                        <LoginField
                          id="reset-email"
                          label="Account email"
                          icon={<Mail className="w-4 h-4" />}
                          type="email"
                          placeholder="you@studio.com"
                          value={resetEmail}
                          onChange={setResetEmail}
                        />

                        {error && (
                          <div className="border-l-2 border-destructive bg-destructive/5 px-4 py-3 text-sm text-destructive">
                            <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] block mb-1">
                              Note
                            </span>
                            {error}
                          </div>
                        )}

                        <div className={cn("flex gap-3 pt-2")}>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => { setStep(1); setError(""); }}
                          >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                          </Button>
                          <Button type="submit" size="lg" className="flex-1 group">
                            Send reset link
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-6 space-y-4">
                        <div className="font-display text-3xl">
                          Check your <em className="italic font-light">inbox</em>.
                        </div>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                          If <span className="text-foreground">{resetEmail}</span> matches an account,
                          a fresh link is on its way.
                        </p>
                        <Button
                          type="button"
                          size="lg"
                          onClick={() => { setStep(1); setResetSent(false); setResetEmail(""); }}
                          className="group"
                        >
                          Back to sign in
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-6 flex items-center justify-between font-mono-accent text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              <span>© Webilio Studio</span>
              <Link
                to="/freelancer/auth"
                className="hover:text-foreground transition-colors flex items-center gap-1"
              >
                Apply as freelancer <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

/* Module-scoped Field — defined outside to preserve input focus */
const LoginField = ({
  id,
  label,
  icon,
  type,
  placeholder,
  value,
  onChange,
  right,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  right?: React.ReactNode;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <Label
        htmlFor={id}
        className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60"
      >
        {label}
      </Label>
      {right}
    </div>
    <div className="relative">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none z-10">
        {icon}
      </div>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-12"
      />
    </div>
  </div>
);

export default Login;
