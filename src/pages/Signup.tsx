import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Mail,
  Lock,
  User as UserIcon,
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
    kicker: "Let's begin",
    title: "Who are you?",
    sub: "Just a name and an email — that's enough to get started.",
    image: heroPortrait,
    quote: "Every great site starts with a first sketch.",
    by: "Webilio",
  },
  {
    n: "02",
    kicker: "The key",
    title: "One last thing.",
    sub: "Pick a password to keep your drafts yours alone.",
    image: letterStill,
    quote: "A password you'll remember beats one you won't.",
    by: "The team",
  },
  {
    n: "03",
    kicker: "Welcome",
    title: "You're in.",
    sub: "Take one breath, then let's open the studio together.",
    image: handsPolaroid,
    quote: "Welcome to the studio.",
    by: "Webilio",
  },
];

const Signup = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  // Track when the user has completed signup so we can let them see the
  // "You're in" confirmation step instead of redirecting immediately.
  const [signupComplete, setSignupComplete] = useState(false);

  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect away if the user is already authenticated when
    // landing on this page (e.g. opened /signup in a new tab while
    // logged in). Don't redirect during the in-flow signup completion.
    if (isAuthenticated && !signupComplete) navigate("/");
  }, [isAuthenticated, navigate, signupComplete]);

  const meta = STEPS[step - 1];

  const handleNext = () => {
    setError("");
    if (step === 1) {
      if (!name || !email) {
        setError("Please add your name and email to continue.");
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        setError("That doesn't look like a valid email.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!password || !confirmPassword) {
        setError("Please fill in both password fields.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (!signup(name, email, password)) {
        setError("Could not create account. That email may already be in use.");
        return;
      }
      setStep(3);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-20 container px-6 md:px-10 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="w-8 h-px bg-foreground transition-all group-hover:w-12" />
          <span className="font-mono-accent text-[11px] uppercase tracking-[0.25em] text-foreground/70 group-hover:text-foreground">
            Webilio · home
          </span>
        </Link>
        <Link to="/login">
          <Button variant="ghost" className="text-xs font-mono-accent uppercase tracking-[0.2em]">
            Already a member? Sign in
            <ArrowUpRight className="ml-1 w-3.5 h-3.5" />
          </Button>
        </Link>
      </header>

      {/* Two-column layout */}
      <div className="relative z-10 container px-6 md:px-10 pb-20">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* LEFT — sticky editorial */}
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

            <div className="mt-10 relative hidden lg:block">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`img-${step}`}
                  initial={{ opacity: 0, scale: 0.96, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-foreground/10 aspect-[4/5]"
                >
                  <img src={meta.image} alt={meta.title} className="w-full h-full object-cover" />
                </motion.div>
              </AnimatePresence>

              <motion.div
                key={`q-${step}`}
                initial={{ opacity: 0, y: 20, rotate: 6 }}
                animate={{ opacity: 1, y: 0, rotate: 4 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="absolute -bottom-6 -right-4 bg-background border border-foreground/10 rounded-2xl p-5 shadow-2xl max-w-[220px]"
              >
                <div className="font-display italic text-base leading-tight text-foreground">
                  "{meta.quote}"
                </div>
                <div className="mt-3 flex items-center gap-2 font-mono-accent text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                  <span className="w-6 h-px bg-foreground/30" />
                  {meta.by}
                </div>
              </motion.div>
            </div>

            <div className="mt-16 hidden lg:flex items-center gap-3 font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/50">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Step {step} / {totalSteps}
            </div>
          </aside>

          {/* RIGHT — Form */}
          <main className="lg:col-span-7">
            {/* Progress rail */}
            <div className="mb-10">
              <div className="flex items-center gap-1.5">
                {STEPS.map((s, i) => {
                  const idx = i + 1;
                  const done = idx < step;
                  const active = idx === step;
                  return (
                    <div
                      key={s.n}
                      className="flex-1 h-[3px] rounded-full bg-foreground/10 overflow-hidden"
                    >
                      <motion.div
                        initial={false}
                        animate={{ width: done ? "100%" : active ? "50%" : "0%" }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full bg-foreground"
                      />
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex justify-between font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/50">
                <span>{meta.kicker}</span>
                <span>{step} of {totalSteps}</span>
              </div>
            </div>

            <div className="bg-background border border-foreground/10 rounded-3xl p-7 md:p-10 shadow-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`step-${step}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-6"
                >
                  {step === 1 && (
                    <>
                      <SignupField
                        id="name"
                        label="Your name"
                        icon={<UserIcon className="w-4 h-4" />}
                        type="text"
                        placeholder="Ada Lovelace"
                        value={name}
                        onChange={setName}
                      />
                      <SignupField
                        id="email"
                        label="Email"
                        icon={<Mail className="w-4 h-4" />}
                        type="email"
                        placeholder="hello@studio.com"
                        value={email}
                        onChange={setEmail}
                      />
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <SignupField
                        id="password"
                        label="Password"
                        icon={<Lock className="w-4 h-4" />}
                        type="password"
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={setPassword}
                      />
                      <SignupField
                        id="confirm"
                        label="Confirm password"
                        icon={<Lock className="w-4 h-4" />}
                        type="password"
                        placeholder="One more time"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                      />
                    </>
                  )}

                  {step === 3 && (
                    <div className="text-center py-6">
                      <div className="font-display text-3xl mb-3">
                        Hello, <em className="italic font-light">{name.split(" ")[0] || "friend"}</em>.
                      </div>
                      <p className="text-muted-foreground">
                        Your account is ready. Let's open the studio.
                      </p>
                    </div>
                  )}

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

                  <div className={cn("flex gap-3 pt-2", step === 1 && "justify-end")}>
                    {step === 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => { setStep(1); setError(""); }}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                    )}
                    <Button
                      type="button"
                      onClick={handleNext}
                      size="lg"
                      className="flex-1 group"
                    >
                      {step === 1 && "Continue"}
                      {step === 2 && "Create account"}
                      {step === 3 && "Open the studio"}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>

                  {step < 3 && (
                    <p className="text-center text-sm text-muted-foreground pt-2">
                      Already part of the studio?{" "}
                      <Link
                        to="/login"
                        className="text-foreground underline underline-offset-4 decoration-primary decoration-2"
                      >
                        Sign in
                      </Link>
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

/* Module-scoped Field — defined outside to preserve input focus */
const SignupField = ({
  id,
  label,
  icon,
  type,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="space-y-2">
    <Label
      htmlFor={id}
      className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60"
    >
      {label}
    </Label>
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

export default Signup;
