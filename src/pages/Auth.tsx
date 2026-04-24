import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft, Mail, Lock, User, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import heroPortrait from '@/assets/hero-portrait.jpg';
import letterStill from '@/assets/letter-still.jpg';
import handsPolaroid from '@/assets/hands-polaroid.jpg';
import logo from '@/assets/webilio-logo.png';

const Auth = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupStep, setSignupStep] = useState(1);
  const [error, setError] = useState('');

  const { login, signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const switchMode = (next: 'login' | 'signup') => {
    setMode(next);
    setSignupStep(1);
    setError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginEmail || !loginPassword) return;
    if (!login(loginEmail, loginPassword)) {
      setError('Invalid credentials. Try again.');
      return;
    }
    navigate('/');
  };

  const handleSignupNext = () => {
    setError('');
    if (!signupName || !signupEmail) {
      setError('Please add your name and email to continue.');
      return;
    }
    setSignupStep(2);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!signupPassword || !signupConfirmPassword) return;
    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!signup(signupName, signupEmail, signupPassword)) {
      setError('Could not create account. That email may already be in use.');
      return;
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <div className="grid lg:grid-cols-[1.1fr_1fr] min-h-screen">
        {/* ============ LEFT — Editorial canvas ============ */}
        <aside className="relative hidden lg:flex flex-col justify-between bg-primary text-primary-foreground p-10 xl:p-14 overflow-hidden">
          {/* Texture grain */}
          <div className="absolute inset-0 opacity-[0.08] mix-blend-multiply pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(hsl(0 0% 0% / 0.6) 1px, transparent 1px)',
              backgroundSize: '4px 4px',
            }}
          />
          {/* Soft ambient blob */}
          <div className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-primary-foreground/5 blur-3xl" />
          <div className="absolute -bottom-32 -right-24 w-[480px] h-[480px] rounded-full bg-primary-foreground/10 blur-3xl" />

          {/* Top — brand row */}
          <div className="relative z-10 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-md bg-foreground flex items-center justify-center overflow-hidden">
                <img src={logo} alt="Webilio" className="w-7 h-7 object-contain" />
              </div>
              <span className="font-display text-2xl tracking-tight">Webilio</span>
            </Link>
            <span className="font-mono-accent text-[11px] uppercase tracking-[0.3em] opacity-70">
              Issue №24 · Spring
            </span>
          </div>

          {/* Middle — editorial type */}
          <div className="relative z-10 max-w-xl">
            <div className="font-mono-accent text-[11px] uppercase tracking-[0.3em] opacity-70 mb-6">
              ◆ The studio · login
            </div>
            <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] tracking-tight">
              Beautiful sites,
              <br />
              <em className="italic font-light">handcrafted</em> by you.
            </h1>
            <p className="mt-6 text-base lg:text-lg text-primary-foreground/80 leading-relaxed max-w-md">
              A quiet little studio in your browser. Sign in to keep editing,
              or join us to start your first piece.
            </p>

            {/* Floating polaroids */}
            <div className="relative mt-12 h-56 hidden xl:block">
              <motion.div
                initial={{ opacity: 0, y: 20, rotate: -8 }}
                animate={{ opacity: 1, y: 0, rotate: -6 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute left-0 top-0 w-44 bg-background p-2 pb-6 shadow-2xl rotate-[-6deg]"
              >
                <img src={heroPortrait} alt="" className="w-full h-44 object-cover" />
                <div className="font-mono-accent text-[10px] text-foreground/60 mt-1 px-1">— studio, no.01</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20, rotate: 6 }}
                animate={{ opacity: 1, y: 0, rotate: 4 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute left-40 top-6 w-44 bg-background p-2 pb-6 shadow-2xl rotate-[4deg]"
              >
                <img src={letterStill} alt="" className="w-full h-44 object-cover" />
                <div className="font-mono-accent text-[10px] text-foreground/60 mt-1 px-1">— letters · 03</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: -2 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute left-80 top-2 w-44 bg-background p-2 pb-6 shadow-2xl rotate-[-2deg]"
              >
                <img src={handsPolaroid} alt="" className="w-full h-44 object-cover" />
                <div className="font-mono-accent text-[10px] text-foreground/60 mt-1 px-1">— hands at work</div>
              </motion.div>
            </div>
          </div>

          {/* Bottom — quote + footer */}
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

        {/* ============ RIGHT — Auth form ============ */}
        <main className="relative flex flex-col min-h-screen bg-background">
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center justify-between p-6 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center overflow-hidden">
                <img src={logo} alt="Webilio" className="w-6 h-6 object-contain" />
              </div>
              <span className="font-display text-xl">Webilio</span>
            </Link>
            <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              vol. iv
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
            <div className="w-full max-w-md">
              {/* Mode toggle — editorial pill */}
              <div className="inline-flex items-center gap-1 p-1 border border-border bg-card mb-10">
                {(['login', 'signup'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => switchMode(m)}
                    className={cn(
                      "font-mono-accent text-[11px] uppercase tracking-[0.25em] px-4 py-2 transition-colors",
                      mode === m
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {m === 'login' ? '◆ Sign in' : '✦ Join us'}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {mode === 'login' ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="mb-8">
                      <div className="font-mono-accent text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
                        Chapter 01 · Welcome back
                      </div>
                      <h2 className="font-display text-5xl leading-[0.95] tracking-tight">
                        Good to see <em className="italic font-light">you</em>{' '}
                        again.
                      </h2>
                      <p className="mt-4 text-muted-foreground">
                        Pick up exactly where your last draft left off.
                      </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                      <Field
                        id="login-email"
                        label="Email"
                        icon={<Mail className="w-4 h-4" />}
                        type="email"
                        placeholder="hello@studio.com"
                        value={loginEmail}
                        onChange={setLoginEmail}
                      />
                      <Field
                        id="login-password"
                        label="Password"
                        icon={<Lock className="w-4 h-4" />}
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={setLoginPassword}
                        right={
                          <button
                            type="button"
                            className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
                          >
                            Forgot?
                          </button>
                        }
                      />

                      {error && <ErrorNote message={error} />}

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full h-12 rounded-none font-mono-accent text-xs uppercase tracking-[0.25em] group"
                      >
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
                        New here?{' '}
                        <button
                          type="button"
                          onClick={() => switchMode('signup')}
                          className="text-foreground underline underline-offset-4 decoration-primary decoration-2 hover:decoration-foreground"
                        >
                          Start your first piece
                        </button>
                      </p>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="mb-8">
                      <div className="flex items-center gap-3 font-mono-accent text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
                        <span>Chapter 02 · Join the studio</span>
                        <span className="flex gap-1 ml-auto">
                          <span className={cn("h-[2px] w-8", signupStep >= 1 ? "bg-foreground" : "bg-border")} />
                          <span className={cn("h-[2px] w-8", signupStep >= 2 ? "bg-foreground" : "bg-border")} />
                        </span>
                      </div>
                      <h2 className="font-display text-5xl leading-[0.95] tracking-tight">
                        {signupStep === 1 ? (
                          <>Let's start with <em className="italic font-light">you</em>.</>
                        ) : (
                          <>One last <em className="italic font-light">key</em>.</>
                        )}
                      </h2>
                      <p className="mt-4 text-muted-foreground">
                        {signupStep === 1
                          ? 'A name and an email — that is all we need to begin.'
                          : 'Choose a password to keep your drafts yours alone.'}
                      </p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-5">
                      {signupStep === 1 ? (
                        <>
                          <Field
                            id="signup-name"
                            label="Your name"
                            icon={<User className="w-4 h-4" />}
                            type="text"
                            placeholder="Ada Lovelace"
                            value={signupName}
                            onChange={setSignupName}
                          />
                          <Field
                            id="signup-email"
                            label="Email"
                            icon={<Mail className="w-4 h-4" />}
                            type="email"
                            placeholder="hello@studio.com"
                            value={signupEmail}
                            onChange={setSignupEmail}
                          />

                          {error && <ErrorNote message={error} />}

                          <Button
                            type="button"
                            onClick={handleSignupNext}
                            size="lg"
                            className="w-full h-12 rounded-none font-mono-accent text-xs uppercase tracking-[0.25em] group"
                          >
                            Continue
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Field
                            id="signup-password"
                            label="Password"
                            icon={<Lock className="w-4 h-4" />}
                            type="password"
                            placeholder="At least 6 characters"
                            value={signupPassword}
                            onChange={setSignupPassword}
                          />
                          <Field
                            id="signup-confirm"
                            label="Confirm password"
                            icon={<Lock className="w-4 h-4" />}
                            type="password"
                            placeholder="One more time"
                            value={signupConfirmPassword}
                            onChange={setSignupConfirmPassword}
                          />

                          {error && <ErrorNote message={error} />}

                          <div className="flex gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => { setSignupStep(1); setError(''); }}
                              className="h-12 rounded-none font-mono-accent text-xs uppercase tracking-[0.25em]"
                            >
                              <ArrowLeft className="mr-2 h-4 w-4" />
                              Back
                            </Button>
                            <Button
                              type="submit"
                              className="flex-1 h-12 rounded-none font-mono-accent text-xs uppercase tracking-[0.25em] group"
                            >
                              Create account
                              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </>
                      )}

                      <p className="text-center text-sm text-muted-foreground pt-2">
                        Already part of the studio?{' '}
                        <button
                          type="button"
                          onClick={() => switchMode('login')}
                          className="text-foreground underline underline-offset-4 decoration-primary decoration-2 hover:decoration-foreground"
                        >
                          Sign in
                        </button>
                      </p>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer strip */}
          <div className="border-t border-border px-6 lg:px-16 py-4 flex items-center justify-between font-mono-accent text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span>© Webilio Studio</span>
            <Link to="/freelancer/auth" className="hover:text-foreground transition-colors">
              Apply as freelancer →
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

/* ============ Editorial Field ============ */
const Field = ({
  id, label, icon, type, placeholder, value, onChange, right,
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
      <Label htmlFor={id} className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </Label>
      {right}
    </div>
    <div className="relative group">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors">
        {icon}
      </div>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="h-12 pl-7 pr-3 rounded-none border-0 border-b-2 border-border bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-foreground text-base placeholder:text-muted-foreground/50"
      />
    </div>
  </div>
);

const ErrorNote = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0, y: -4 }}
    animate={{ opacity: 1, y: 0 }}
    className="border-l-2 border-destructive bg-destructive/5 px-4 py-3 text-sm text-destructive"
  >
    <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] block mb-1">Note</span>
    {message}
  </motion.div>
);

export default Auth;
