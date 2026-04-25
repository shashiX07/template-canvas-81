import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Mail, Lock, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

import heroPortrait from "@/assets/hero-portrait.jpg";
import letterStill from "@/assets/letter-still.jpg";
import handsPolaroid from "@/assets/hands-polaroid.jpg";
import logo from "@/assets/webilio-logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return;
    if (!login(email, password)) {
      setError("Invalid credentials. Try again.");
      return;
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <div className="grid lg:grid-cols-[1.1fr_1fr] min-h-screen">
        {/* LEFT — Editorial canvas */}
        <aside className="relative hidden lg:flex flex-col justify-between bg-primary text-primary-foreground p-10 xl:p-14 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.08] mix-blend-multiply pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(hsl(0 0% 0% / 0.6) 1px, transparent 1px)",
              backgroundSize: "4px 4px",
            }}
          />
          <div className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-primary-foreground/5 blur-3xl" />
          <div className="absolute -bottom-32 -right-24 w-[480px] h-[480px] rounded-full bg-primary-foreground/10 blur-3xl" />

          <div className="relative z-10 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-foreground flex items-center justify-center overflow-hidden">
                <img src={logo} alt="Webilio" className="w-7 h-7 object-contain" />
              </div>
              <span className="font-display text-2xl tracking-tight">Webilio</span>
            </Link>
            <span className="font-mono-accent text-[11px] uppercase tracking-[0.3em] opacity-70">
              Issue №24 · Spring
            </span>
          </div>

          <div className="relative z-10 max-w-xl">
            <div className="font-mono-accent text-[11px] uppercase tracking-[0.3em] opacity-70 mb-6">
              ◆ The studio · sign in
            </div>
            <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] tracking-tight">
              Welcome <em className="italic font-light">back</em>.
              <br />
              Pick up the pen.
            </h1>
            <p className="mt-6 text-base lg:text-lg text-primary-foreground/80 leading-relaxed max-w-md">
              Your drafts are right where you left them. Sign in to keep building.
            </p>

            <div className="relative mt-12 h-56 hidden xl:block">
              {[
                { src: heroPortrait, rot: -6, left: 0, top: 0, label: "studio, no.01" },
                { src: letterStill, rot: 4, left: 160, top: 24, label: "letters · 03" },
                { src: handsPolaroid, rot: -2, left: 320, top: 8, label: "hands at work" },
              ].map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20, rotate: p.rot * 1.4 }}
                  animate={{ opacity: 1, y: 0, rotate: p.rot }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.2 }}
                  className="absolute w-44 bg-background p-2 pb-6 shadow-2xl"
                  style={{ left: p.left, top: p.top }}
                >
                  <img src={p.src} alt="" className="w-full h-44 object-cover" />
                  <div className="font-mono-accent text-[10px] text-foreground/60 mt-1 px-1">
                    — {p.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex gap-3 max-w-md">
              <Quote className="w-5 h-5 mt-1 shrink-0 opacity-60" />
              <p className="font-display italic text-lg leading-snug">
                "It feels less like software and more like a paper notebook
                that happens to publish."
              </p>
            </div>
            <div className="flex items-center justify-between font-mono-accent text-[11px] uppercase tracking-[0.25em] opacity-70 border-t border-primary-foreground/20 pt-4">
              <span>est. 2024</span>
              <span>made with care</span>
              <span>vol. iv</span>
            </div>
          </div>
        </aside>

        {/* RIGHT — Form */}
        <main className="relative flex flex-col min-h-screen bg-background">
          <div className="lg:hidden flex items-center justify-between p-6 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center overflow-hidden">
                <img src={logo} alt="Webilio" className="w-6 h-6 object-contain" />
              </div>
              <span className="font-display text-xl">Webilio</span>
            </Link>
            <Link
              to="/signup"
              className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
            >
              Join us →
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="w-full max-w-md"
            >
              <div className="font-mono-accent text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
                Chapter 01 · Welcome back
              </div>
              <h2 className="font-display text-5xl leading-[0.95] tracking-tight">
                Good to see <em className="italic font-light">you</em> again.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Pick up exactly where your last draft left off.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5 mt-8">
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

                <div className="border-l-2 border-primary pl-4 py-2 bg-primary/5">
                  <div className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
                    Demo desk
                  </div>
                  <div className="text-sm font-mono-accent">
                    admin@example.com · admin123
                  </div>
                </div>

                <p className="text-center text-sm text-muted-foreground pt-2">
                  New here?{" "}
                  <Link
                    to="/signup"
                    className="text-foreground underline underline-offset-4 decoration-primary decoration-2 hover:decoration-foreground"
                  >
                    Start your first piece
                  </Link>
                </p>
              </form>
            </motion.div>
          </div>

          <div className="border-t border-border px-6 lg:px-16 py-4 flex items-center justify-between font-mono-accent text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
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
        className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
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
        required
        className={cn("pl-12")}
      />
    </div>
  </div>
);

export default Login;
