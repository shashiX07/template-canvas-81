import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Mail,
  Lock,
  User,
  Globe,
  Github,
  Linkedin,
  Upload,
  Check,
  FileText,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { userStorage, freelancerStorage } from "@/lib/storage";
import type {
  FreelancerProfile as FreelancerProfileType,
  User as UserType,
} from "@/lib/storage";
import { fileToBase64 } from "@/lib/freelancerUtils";
import { cn } from "@/lib/utils";

import freelancerPortrait from "@/assets/freelancer-portrait.jpg";
import freelancerDesk from "@/assets/freelancer-desk.jpg";
import handsPolaroid from "@/assets/hands-polaroid.jpg";
import letterStill from "@/assets/letter-still.jpg";
import windowLight from "@/assets/window-light.jpg";
import heroPortrait from "@/assets/hero-portrait.jpg";

const EXPERTISE_OPTIONS = [
  "HTML/CSS",
  "JavaScript",
  "React",
  "Vue",
  "Angular",
  "Node.js",
  "WordPress",
  "Shopify",
  "UI/UX Design",
  "Graphic Design",
  "Animation",
  "Responsive Design",
  "E-commerce",
  "Landing Pages",
];

/* ─── Step meta — drives left column copy + image ─── */
const STEPS = [
  {
    n: "01",
    kicker: "Let's begin",
    title: "Who are you?",
    sub: "The basics — name, email, a password you'll remember.",
    image: freelancerPortrait,
    quote: "It started with a portfolio nobody asked to see.",
    by: "Eva, designer",
  },
  {
    n: "02",
    kicker: "The work",
    title: "What you do.",
    sub: "Tell us about your craft. Be specific. Be a little proud.",
    image: freelancerDesk,
    quote: "I make things that feel quiet on purpose.",
    by: "Marcus, art director",
  },
  {
    n: "03",
    kicker: "Show us",
    title: "The proof.",
    sub: "Links, profiles, a few images — enough to feel your taste.",
    image: handsPolaroid,
    quote: "Good portfolios don't shout. They invite you in.",
    by: "Mira, illustrator",
  },
  {
    n: "04",
    kicker: "On paper",
    title: "Your résumé.",
    sub: "PDF or Word, under 10MB. We read every one.",
    image: letterStill,
    quote: "A page of your story, plainly told.",
    by: "The team",
  },
  {
    n: "05",
    kicker: "Getting paid",
    title: "How we send the cheque.",
    sub: "Optional for now. You can add details later.",
    image: windowLight,
    quote: "Money should feel like an afterthought, not a hurdle.",
    by: "Operations",
  },
  {
    n: "06",
    kicker: "Almost there",
    title: "One last look.",
    sub: "Review what you've shared, then send it our way.",
    image: heroPortrait,
    quote: "Welcome to the studio.",
    by: "Webilio",
  },
];

export default function FreelancerAuth() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Step 1
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Step 2
  const [professionalTitle, setProfessionalTitle] = useState("");
  const [bio, setBio] = useState("");
  const [experienceYears, setExperienceYears] = useState([3]);
  const [expertise, setExpertise] = useState<string[]>([]);

  // Step 3
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);

  // Step 4
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");

  // Step 5
  const [paymentMethod, setPaymentMethod] = useState<
    "paypal" | "bank_transfer" | "stripe"
  >("paypal");
  const [paymentEmail, setPaymentEmail] = useState("");

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "resume" | "portfolio",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "resume") {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Resume file must be less than 10MB");
        return;
      }
      const base64 = await fileToBase64(file);
      setResumeUrl(base64);
      setResumeFileName(file.name);
      toast.success("Resume uploaded");
    } else if (type === "portfolio") {
      if (portfolioImages.length >= 5) {
        toast.error("Maximum 5 portfolio images allowed");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      const base64 = await fileToBase64(file);
      setPortfolioImages((prev) => [...prev, base64]);
      toast.success("Portfolio image added");
    }
  };

  const validateStep = (): boolean => {
    switch (step) {
      case 1:
        if (!name || !email || !password || !confirmPassword) {
          toast.error("Please fill in all fields");
          return false;
        }
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          return false;
        }
        if (password.length < 8) {
          toast.error("Password must be at least 8 characters");
          return false;
        }
        if (!termsAccepted) {
          toast.error("Please accept the terms and conditions");
          return false;
        }
        const existingUser = userStorage.getAll().find((u) => u.email === email);
        if (existingUser) {
          toast.error("Email already registered");
          return false;
        }
        return true;
      case 2:
        if (!professionalTitle || !bio || expertise.length === 0) {
          toast.error("Please complete all required fields");
          return false;
        }
        return true;
      case 3:
        return true;
      case 4:
        if (!resumeUrl) {
          toast.error("Please upload your résumé");
          return false;
        }
        return true;
      case 5:
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) setStep(step + 1);
  };

  const handleSubmit = () => {
    const userId = `freelancer-${Date.now()}`;
    const newUser: UserType = {
      id: userId,
      name,
      email,
      password,
      role: "freelancer",
      isVerified: false,
      isAdmin: false,
      isSuperAdmin: false,
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
      customizedTemplates: [],
      draftTemplates: [],
      freelancerProfileId: userId,
    };

    const profile: FreelancerProfileType = {
      userId,
      professionalTitle,
      bio,
      expertise,
      experienceYears: experienceYears[0],
      portfolioUrl,
      websiteUrl,
      linkedinUrl,
      githubUrl,
      resumeUrl,
      resumeFileName,
      portfolioImages,
      verificationStatus: "pending",
      totalTemplates: 0,
      approvedTemplates: 0,
      totalDownloads: 0,
      totalEarnings: 0,
      rating: 0,
      reviewCount: 0,
      isActive: true,
      acceptingWork: true,
      minProjectBudget: 500,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    userStorage.save(newUser);
    freelancerStorage.save(profile);
    userStorage.setCurrentUser(newUser);

    toast.success("Application submitted — pending review.");
    navigate("/freelancer/dashboard");
  };

  const meta = STEPS[step - 1];
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ambient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* ─── Top header ─── */}
      <header className="relative z-20 container px-6 md:px-10 py-6 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 group"
        >
          <span className="w-8 h-px bg-foreground transition-all group-hover:w-12" />
          <span className="font-mono-accent text-[11px] uppercase tracking-[0.25em] text-foreground/70 group-hover:text-foreground">
            Webilio · home
          </span>
        </Link>
        <Link to="/auth">
          <Button
            variant="ghost"
            className="rounded-full px-5 h-10 text-xs font-mono-accent uppercase tracking-[0.2em]"
          >
            Not a freelancer? Sign in
            <ArrowUpRight className="ml-1 w-3.5 h-3.5" />
          </Button>
        </Link>
      </header>

      {/* ─── Two-column layout ─── */}
      <div className="relative z-10 container px-6 md:px-10 pb-20">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* LEFT — sticky editorial column */}
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

            {/* Image card */}
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
                  <img
                    src={meta.image}
                    alt={meta.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* floating quote */}
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

            {/* Step ticker — desktop bottom */}
            <div className="mt-16 hidden lg:flex items-center gap-3 font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/50">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Step {step} / {totalSteps} · {Math.round(progress)}% complete
            </div>
          </aside>

          {/* RIGHT — form column */}
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
                        animate={{
                          width: done ? "100%" : active ? "50%" : "0%",
                        }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full bg-foreground"
                      />
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex justify-between font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/50">
                <span>{meta.kicker}</span>
                <span>
                  {step} of {totalSteps}
                </span>
              </div>
            </div>

            {/* Form card */}
            <div className="bg-background border border-foreground/10 rounded-3xl p-7 md:p-10 shadow-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`step-${step}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* ═══ STEP 1 ═══ */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60"
                        >
                          Full name
                        </Label>
                        <Field icon={User}>
                          <Input
                            id="name"
                            placeholder="Eva Lin"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </Field>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60"
                        >
                          Email
                        </Label>
                        <Field icon={Mail}>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@studio.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </Field>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label
                            htmlFor="password"
                            className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60"
                          >
                            Password
                          </Label>
                          <Field icon={Lock}>
                            <Input
                              id="password"
                              type="password"
                              placeholder="••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </Field>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="confirmPassword"
                            className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60"
                          >
                            Confirm
                          </Label>
                          <Field icon={Lock}>
                            <Input
                              id="confirmPassword"
                              type="password"
                              placeholder="••••••••"
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                            />
                          </Field>
                        </div>
                      </div>

                      <label className="flex items-start gap-3 pt-3 cursor-pointer group">
                        <Checkbox
                          id="terms"
                          checked={termsAccepted}
                          onCheckedChange={(c) =>
                            setTermsAccepted(c as boolean)
                          }
                          className="mt-0.5"
                        />
                        <span className="text-sm text-foreground/70 group-hover:text-foreground leading-relaxed">
                          I agree to the{" "}
                          <span className="text-foreground underline underline-offset-4">
                            Freelancer Terms
                          </span>{" "}
                          and{" "}
                          <span className="text-foreground underline underline-offset-4">
                            Privacy Policy
                          </span>
                          .
                        </span>
                      </label>
                    </div>
                  )}

                  {/* ═══ STEP 2 ═══ */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60">
                          Professional title
                        </Label>
                        <Input
                          placeholder="Senior brand designer · Art director · Front-end engineer"
                          value={professionalTitle}
                          onChange={(e) =>
                            setProfessionalTitle(e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60">
                          A short bio
                        </Label>
                        <Textarea
                          placeholder="What do you make? Who do you make it for? What do you care about?"
                          value={bio}
                          onChange={(e) => setBio(e.target.value.slice(0, 500))}
                          rows={5}
                          className="rounded-2xl border-foreground/15 px-5 py-4 text-base resize-none focus-visible:ring-primary"
                        />
                        <p className="text-xs text-foreground/40 font-mono-accent uppercase tracking-[0.2em]">
                          {bio.length} / 500
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-baseline justify-between">
                          <Label className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60">
                            Years of experience
                          </Label>
                          <span className="font-display italic text-2xl">
                            {experienceYears[0]}
                            <span className="text-foreground/40 text-base ml-1">
                              yrs
                            </span>
                          </span>
                        </div>
                        <Slider
                          value={experienceYears}
                          onValueChange={setExperienceYears}
                          max={20}
                          step={1}
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60">
                          What you're good at · {expertise.length} selected
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {EXPERTISE_OPTIONS.map((option) => {
                            const active = expertise.includes(option);
                            return (
                              <button
                                key={option}
                                type="button"
                                onClick={() =>
                                  setExpertise(
                                    active
                                      ? expertise.filter((e) => e !== option)
                                      : [...expertise, option],
                                  )
                                }
                                className={cn(
                                  "px-4 py-2 rounded-full text-sm border transition-all",
                                  active
                                    ? "bg-foreground text-background border-foreground"
                                    : "bg-background text-foreground border-foreground/15 hover:border-foreground/40",
                                )}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ═══ STEP 3 ═══ */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60">
                          Portfolio
                        </Label>
                        <Field icon={Globe}>
                          <Input
                            type="url"
                            placeholder="https://your-portfolio.com"
                            value={portfolioUrl}
                            onChange={(e) => setPortfolioUrl(e.target.value)}
                          />
                        </Field>
                      </div>

                      <div className="space-y-2">
                        <Label className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60">
                          Personal website
                        </Label>
                        <Field icon={Globe}>
                          <Input
                            type="url"
                            placeholder="https://you.com"
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                          />
                        </Field>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60">
                            LinkedIn
                          </Label>
                          <Field icon={Linkedin}>
                            <Input
                              type="url"
                              placeholder="linkedin.com/in/you"
                              value={linkedinUrl}
                              onChange={(e) => setLinkedinUrl(e.target.value)}
                            />
                          </Field>
                        </div>
                        <div className="space-y-2">
                          <Label className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60">
                            GitHub
                          </Label>
                          <Field icon={Github}>
                            <Input
                              type="url"
                              placeholder="github.com/you"
                              value={githubUrl}
                              onChange={(e) => setGithubUrl(e.target.value)}
                            />
                          </Field>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60">
                            Selected work · max 5 images
                          </Label>
                          <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/40">
                            {portfolioImages.length} / 5
                          </span>
                        </div>

                        {portfolioImages.length > 0 && (
                          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                            {portfolioImages.map((img, idx) => (
                              <div
                                key={idx}
                                className="relative group aspect-square rounded-2xl overflow-hidden ring-1 ring-foreground/10"
                              >
                                <img
                                  src={img}
                                  alt={`Work ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPortfolioImages(
                                      portfolioImages.filter(
                                        (_, i) => i !== idx,
                                      ),
                                    )
                                  }
                                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-background/95 text-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-md"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {portfolioImages.length < 5 && (
                          <label className="flex items-center justify-center gap-3 border border-dashed border-foreground/25 rounded-2xl py-10 cursor-pointer hover:border-foreground/50 hover:bg-foreground/[0.02] transition-all">
                            <ImageIcon className="w-5 h-5 text-foreground/40" />
                            <span className="font-mono-accent text-xs uppercase tracking-[0.2em] text-foreground/60">
                              Add an image
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleFileUpload(e, "portfolio")
                              }
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ═══ STEP 4 ═══ */}
                  {step === 4 && (
                    <div className="space-y-6">
                      <Label className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60">
                        Résumé · PDF, DOC, DOCX · max 10MB
                      </Label>

                      {!resumeUrl ? (
                        <label className="flex flex-col items-center justify-center gap-4 border border-dashed border-foreground/25 rounded-3xl p-16 cursor-pointer hover:border-foreground/50 hover:bg-foreground/[0.02] transition-all">
                          <div className="w-14 h-14 rounded-full bg-foreground/5 flex items-center justify-center">
                            <Upload className="w-6 h-6 text-foreground/60" />
                          </div>
                          <div className="text-center">
                            <div className="font-display text-2xl mb-1">
                              Drop your <span className="italic">story</span>{" "}
                              here
                            </div>
                            <div className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/50">
                              Or click to browse · PDF / DOC / DOCX
                            </div>
                          </div>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, "resume")}
                          />
                        </label>
                      ) : (
                        <div className="flex items-center justify-between p-5 border border-foreground/15 rounded-3xl bg-foreground/[0.02]">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-12 h-12 shrink-0 rounded-2xl bg-foreground text-background flex items-center justify-center">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate">
                                {resumeFileName}
                              </p>
                              <p className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/50 mt-0.5">
                                Uploaded · ready to send
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setResumeUrl("");
                              setResumeFileName("");
                            }}
                            className="shrink-0"
                          >
                            Replace
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ═══ STEP 5 ═══ */}
                  {step === 5 && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60">
                          Preferred payout method
                        </Label>
                        <div className="grid sm:grid-cols-3 gap-3">
                          {(
                            ["paypal", "bank_transfer", "stripe"] as const
                          ).map((method) => {
                            const active = paymentMethod === method;
                            return (
                              <button
                                key={method}
                                type="button"
                                onClick={() => setPaymentMethod(method)}
                                className={cn(
                                  "px-5 py-4 rounded-2xl border text-left transition-all capitalize",
                                  active
                                    ? "bg-foreground text-background border-foreground"
                                    : "bg-background text-foreground border-foreground/15 hover:border-foreground/40",
                                )}
                              >
                                <div className="font-display text-lg">
                                  {method.replace("_", " ")}
                                </div>
                                <div
                                  className={cn(
                                    "font-mono-accent text-[10px] uppercase tracking-[0.2em] mt-1",
                                    active
                                      ? "text-background/60"
                                      : "text-foreground/40",
                                  )}
                                >
                                  {method === "paypal" && "Fastest"}
                                  {method === "bank_transfer" && "Lowest fee"}
                                  {method === "stripe" && "Cards & wallets"}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {paymentMethod === "paypal" && (
                        <div className="space-y-2">
                          <Label className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60">
                            PayPal email
                          </Label>
                          <Field icon={Mail}>
                            <Input
                              type="email"
                              placeholder="paypal@you.com"
                              value={paymentEmail}
                              onChange={(e) =>
                                setPaymentEmail(e.target.value)
                              }
                            />
                          </Field>
                        </div>
                      )}

                      <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5">
                        <div className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60 mb-3">
                          Good to know
                        </div>
                        <ul className="text-sm text-foreground/70 space-y-2 leading-relaxed">
                          <li className="flex gap-3">
                            <span className="text-foreground/30">·</span>
                            Minimum payout threshold: $50
                          </li>
                          <li className="flex gap-3">
                            <span className="text-foreground/30">·</span>
                            Payouts processed within 5–7 business days
                          </li>
                          <li className="flex gap-3">
                            <span className="text-foreground/30">·</span>
                            Update your payment details anytime from settings
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* ═══ STEP 6 ═══ */}
                  {step === 6 && (
                    <div className="space-y-6">
                      {[
                        {
                          label: "Account",
                          rows: [
                            ["Name", name],
                            ["Email", email],
                          ],
                        },
                        {
                          label: "Profession",
                          rows: [
                            ["Title", professionalTitle],
                            ["Experience", `${experienceYears[0]} years`],
                            [
                              "Expertise",
                              expertise.join(", ") || "—",
                            ],
                          ],
                        },
                        {
                          label: "Documents",
                          rows: [
                            ["Résumé", resumeFileName || "—"],
                            [
                              "Portfolio images",
                              `${portfolioImages.length} uploaded`,
                            ],
                          ],
                        },
                      ].map((group) => (
                        <div
                          key={group.label}
                          className="border-t border-foreground/15 pt-5"
                        >
                          <div className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/50 mb-3">
                            {group.label}
                          </div>
                          <dl className="space-y-2">
                            {group.rows.map(([k, v]) => (
                              <div
                                key={k}
                                className="flex items-baseline justify-between gap-6 text-sm"
                              >
                                <dt className="text-foreground/50 shrink-0">
                                  {k}
                                </dt>
                                <dd className="text-foreground text-right truncate font-medium">
                                  {v || "—"}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      ))}

                      <div className="rounded-2xl bg-primary/10 border border-primary/20 p-5">
                        <div className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60 mb-2">
                          What happens next
                        </div>
                        <p className="font-display italic text-xl leading-snug text-foreground">
                          We'll read your application this week. If it's a fit,
                          you'll get a welcome note and access to the studio.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* ─── Nav buttons ─── */}
              <div className="mt-10 pt-6 border-t border-foreground/10 flex items-center justify-between gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setStep(step - 1)}
                  disabled={step === 1}
                  className="rounded-full px-5 h-11"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>

                {step < totalSteps ? (
                  <Button
                    onClick={handleNext}
                    className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-8 h-12 text-sm font-medium group"
                  >
                    Continue
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-sm font-medium group"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Send application
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile step ticker */}
            <div className="mt-8 lg:hidden flex items-center gap-3 font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/50">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Step {step} / {totalSteps} · {Math.round(progress)}%
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
