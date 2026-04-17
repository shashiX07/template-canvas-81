import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, Palette, Zap, Shield, ArrowRight, Check, Users, Clock,
  TrendingUp, Play, ChevronDown, MousePointer2, Layers, Eye, Wand2,
  Globe, ArrowUpRight, Code2, Grip, Heart, Star, Rocket, Target
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { initializeMockData } from "@/lib/storage";
import {
  motion, useScroll, useTransform, useInView,
  useSpring, useMotionValue, useMotionValueEvent
} from "framer-motion";

import { Header } from "@/components/Header";
import heroEditor from "@/assets/hero-editor-3d.jpg";
import abstractFlow from "@/assets/abstract-flow.jpg";
import showcaseWedding from "@/assets/showcase-wedding.jpg";
import showcaseBirthday from "@/assets/showcase-birthday.jpg";
import showcaseAnniversary from "@/assets/showcase-anniversary.jpg";
import showcaseBusiness from "@/assets/showcase-business.jpg";

/* ═══════════════════════════════════════════
   REUSABLE MOTION COMPONENTS
   ═══════════════════════════════════════════ */

const AnimatedCounter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 125;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const RevealText = ({ children, className = "", delay = 0 }: { children: string; className?: string; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "110%", rotateX: 40 }}
        animate={inView ? { y: 0, rotateX: 0 } : {}}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "bottom" }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const FadeUp = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

const MagneticButton = ({ children, onClick, className = "" }: {
  children: React.ReactNode; onClick?: () => void; className?: string;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });
  return (
    <motion.button
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((e.clientX - rect.left - rect.width / 2) * 0.12);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.12);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
};

/* Infinite scroll marquee */
const Marquee = ({ children, speed = 30, className = "" }: { children: React.ReactNode; speed?: number; className?: string }) => (
  <div className={`overflow-hidden whitespace-nowrap ${className}`}>
    <motion.div
      className="flex gap-12 w-max"
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
    >
      {children}
      {children}
    </motion.div>
  </div>
);

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 0.5], [1, 0.9]);
  const mockupY = useTransform(heroProgress, [0, 1], ["0px", "60px"]);
  const mockupRotateX = useTransform(heroProgress, [0, 1], [6, -3]);

  useEffect(() => { initializeMockData(); }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  const showcaseItems = [
    { img: showcaseWedding, label: "Wedding", tag: "Popular", color: "from-pink-500/20 to-rose-400/20" },
    { img: showcaseBirthday, label: "Birthday", tag: "Trending", color: "from-amber-500/20 to-orange-400/20" },
    { img: showcaseAnniversary, label: "Anniversary", tag: "Classic", color: "from-yellow-600/20 to-amber-500/20" },
    { img: showcaseBusiness, label: "Business", tag: "New", color: "from-blue-600/20 to-indigo-500/20" },
  ];

  const features = [
    { icon: MousePointer2, title: "Click to Edit", desc: "Select any element and edit directly on the canvas with zero friction." },
    { icon: Layers, title: "Layer Control", desc: "Visual layer panel with intuitive drag-to-reorder functionality." },
    { icon: Eye, title: "Live Preview", desc: "See every change instantly — true WYSIWYG with no page reloads." },
    { icon: Wand2, title: "Smart Templates", desc: "Start with professionally designed templates, customize everything." },
    { icon: Globe, title: "One-Click Publish", desc: "Share your creation with the world in a single click." },
    { icon: Code2, title: "Clean Export", desc: "Export pure HTML, CSS & JavaScript — zero vendor lock-in." },
  ];

  const steps = [
    { num: "01", title: "Choose a Template", desc: "Browse hundreds of professionally crafted designs for weddings, birthdays, business events and more.", icon: Palette },
    { num: "02", title: "Customize Everything", desc: "Our visual editor lets you click and change anything — text, colors, images, layout — all in real-time.", icon: Grip },
    { num: "03", title: "Share & Celebrate", desc: "Publish with one click. Export clean code or share a live link with anyone, anywhere in the world.", icon: Zap },
  ];

  const brandNames = [
    "Google", "Figma", "Vercel", "Stripe", "Notion", "Linear", "Discord", "Spotify",
    "Slack", "Dropbox", "Airbnb", "Pinterest"
  ];

  return (
    <div className="relative bg-background overflow-x-hidden">
      <Header />

      {/* ══════ CURSOR GLOW ══════ */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-20 transition-opacity duration-700"
        style={{ background: `radial-gradient(600px circle at ${cursorPos.x}px ${cursorPos.y}px, hsl(var(--primary) / 0.15), transparent 50%)` }}
      />

      {/* ══════════════════════════════════════════
          HERO SECTION
          ══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Ambient orbs */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full blur-[140px]"
            style={{ background: 'hsl(var(--primary) / 0.1)', top: '5%', left: '5%' }}
            animate={{ x: [0, 100, 0], y: [0, -60, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full blur-[120px]"
            style={{ background: 'hsl(var(--info) / 0.08)', bottom: '10%', right: '10%' }}
            animate={{ x: [0, -80, 0], y: [0, 50, 0], scale: [1, 0.9, 1] }}
            transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-[300px] h-[300px] rounded-full blur-[100px]"
            style={{ background: 'hsl(var(--accent) / 0.06)', top: '50%', left: '50%' }}
            animate={{ x: [0, 50, -40, 0], y: [0, -40, 30, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Hero content */}
        <motion.div className="relative z-10 container px-4 pt-28 pb-20" style={{ opacity: heroOpacity, scale: heroScale }}>
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center max-w-7xl mx-auto">

            {/* Left — Copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Badge className="mb-8 px-4 py-2 text-[11px] font-bold tracking-[0.2em] uppercase glass border-primary/20 text-primary">
                  <Sparkles className="w-3.5 h-3.5 mr-2" />
                  Visual Web Builder
                </Badge>
              </motion.div>

              <div className="space-y-1 mb-8">
                <RevealText className="text-5xl sm:text-6xl lg:text-[4.5rem] font-black leading-[1.05] tracking-tight text-foreground">
                  Design That
                </RevealText>
                <RevealText className="text-5xl sm:text-6xl lg:text-[4.5rem] font-black leading-[1.05] tracking-tight text-gradient" delay={0.15}>
                  Feels Alive.
                </RevealText>
              </div>

              <motion.p
                className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                Create stunning, emotional web pages for every occasion.
                No code. No limits. Just pure creativity.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.65 }}
              >
                <MagneticButton
                  className="inline-flex items-center justify-center gap-2 text-base px-8 h-14 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-elegant hover:shadow-glow transition-all duration-300 group"
                  onClick={() => navigate('/templates')}
                >
                  Start Creating
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </MagneticButton>
                {!isAuthenticated && (
                  <MagneticButton
                    className="inline-flex items-center justify-center gap-2 text-base px-8 h-14 rounded-2xl glass border border-border/40 font-medium text-foreground hover:bg-accent/50 transition-all duration-300"
                    onClick={() => navigate('/auth')}
                  >
                    <Play className="w-4 h-4" /> Watch Demo
                  </MagneticButton>
                )}
              </motion.div>

              <motion.div
                className="flex items-center gap-6 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85 }}
              >
                {["Free forever", "No sign-up needed", "Export anytime"].map((text, i) => (
                  <div key={i} className={`flex items-center gap-2 ${i === 2 ? 'hidden sm:flex' : ''}`}>
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    {text}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — 3D Mockup */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ y: mockupY, perspective: 1200 }}
            >
              <motion.div
                className="relative rounded-3xl overflow-hidden border border-border/20"
                style={{
                  rotateX: mockupRotateX,
                  transformStyle: "preserve-3d",
                  boxShadow: "0 30px 60px -15px hsl(var(--primary) / 0.2), 0 0 0 1px hsl(var(--border) / 0.1)",
                }}
                whileHover={{ rotateX: 0, scale: 1.02 }}
                transition={{ duration: 0.5 }}
              >
                <img src={heroEditor} alt="Webie visual editor" className="w-full h-auto" width={1920} height={1080} />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

                <motion.div
                  className="absolute bottom-5 left-5 glass rounded-2xl px-5 py-3 flex items-center gap-3"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
                  <span className="text-xs font-semibold text-foreground tracking-wide">Live Preview Active</span>
                </motion.div>
              </motion.div>

              {/* Floating card */}
              <motion.div
                className="absolute -bottom-6 -right-3 sm:-right-8 glass-card rounded-2xl p-4 shadow-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.05, y: -4 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
                    <Zap className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">Instant Export</div>
                    <div className="text-xs text-muted-foreground">HTML + CSS + JS</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll CTA */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <span className="text-[10px] text-muted-foreground tracking-[0.3em] uppercase font-medium">Scroll to Explore</span>
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-primary"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          BRAND MARQUEE — Social Proof
          ══════════════════════════════════════════ */}
      <section className="relative py-10 border-y border-border/10 overflow-hidden">
        <div className="absolute inset-0 bg-muted/20" />
        <FadeUp className="relative z-10">
          <p className="text-center text-xs text-muted-foreground tracking-[0.2em] uppercase font-medium mb-6">
            Trusted by creators worldwide
          </p>
          <Marquee speed={40}>
            {brandNames.map((name) => (
              <div key={name} className="flex items-center gap-3 px-6 py-2 opacity-40 hover:opacity-80 transition-opacity duration-300">
                <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center">
                  <span className="text-xs font-bold text-foreground/50">{name.charAt(0)}</span>
                </div>
                <span className="text-sm font-semibold text-foreground/50 tracking-wide">{name}</span>
              </div>
            ))}
          </Marquee>
        </FadeUp>
      </section>

      {/* ══════════════════════════════════════════
          STATS RIBBON
          ══════════════════════════════════════════ */}
      <section className="relative py-20">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { val: 500, suffix: "+", label: "Templates", icon: Palette },
              { val: 10000, suffix: "+", label: "Happy Users", icon: Users },
              { val: 50000, suffix: "+", label: "Pages Created", icon: TrendingUp },
              { val: 5, suffix: "min", label: "Avg. Build Time", icon: Clock },
            ].map((stat, i) => (
              <FadeUp key={i} delay={i * 0.1} className="text-center group">
                <motion.div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/5 group-hover:bg-primary/10 mb-4 transition-colors duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <stat.icon className="w-6 h-6 text-primary" />
                </motion.div>
                <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                  {stat.suffix === "min" ? (
                    <>{"<"}<AnimatedCounter target={stat.val} />{" min"}</>
                  ) : (
                    <AnimatedCounter target={stat.val} suffix={stat.suffix} />
                  )}
                </div>
                <div className="text-xs font-medium text-muted-foreground mt-1.5 tracking-wide uppercase">{stat.label}</div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SHOWCASE GALLERY
          ══════════════════════════════════════════ */}
      <section id="showcase" className="relative py-28 sm:py-36 scroll-mt-20">
        <div className="container px-4">
          <div className="text-center mb-20">
            <FadeUp>
              <Badge variant="outline" className="mb-5 glass border-border/40 text-[11px] tracking-[0.15em] uppercase font-semibold">
                For Every Occasion
              </Badge>
            </FadeUp>
            <RevealText className="text-4xl sm:text-5xl lg:text-6xl font-black mb-3 tracking-tight leading-[1.1] text-foreground">
              Beautiful Templates,
            </RevealText>
            <RevealText className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-[1.1] text-gradient" delay={0.1}>
              Infinite Possibilities
            </RevealText>
            <FadeUp delay={0.2}>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                From intimate weddings to grand business events — find the perfect starting point.
              </p>
            </FadeUp>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7 max-w-6xl mx-auto">
            {showcaseItems.map((item, i) => (
              <motion.div
                key={i}
                className="relative group cursor-pointer"
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -12 }}
                onClick={() => navigate('/templates')}
              >
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-border/20 shadow-card group-hover:shadow-card-hover transition-shadow duration-500">
                  <img src={item.img} alt={item.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" width={800} height={1024} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full glass text-foreground">{item.tag}</span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-foreground">{item.label}</span>
                      <motion.div
                        className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.15 }}
                      >
                        <ArrowUpRight className="w-4 h-4 text-primary" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <FadeUp delay={0.3} className="text-center mt-14">
            <MagneticButton
              className="inline-flex items-center gap-2 px-8 h-12 rounded-2xl glass border border-border/40 text-sm font-medium text-foreground hover:bg-accent/50 transition-all"
              onClick={() => navigate('/templates')}
            >
              View All Templates <ArrowRight className="w-4 h-4" />
            </MagneticButton>
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS — Cinematic Steps
          ══════════════════════════════════════════ */}
      <section id="how-it-works" className="relative py-28 sm:py-40 overflow-hidden scroll-mt-20">
        <div className="absolute inset-0 bg-muted/10" />

        <div className="container px-4 relative z-10">
          <div className="text-center mb-24">
            <FadeUp>
              <Badge variant="outline" className="mb-5 glass border-border/40 text-[11px] tracking-[0.15em] uppercase font-semibold">
                How It Works
              </Badge>
            </FadeUp>
            <RevealText className="text-4xl sm:text-5xl lg:text-6xl font-black mb-3 tracking-tight leading-[1.1] text-foreground">
              Three Steps to
            </RevealText>
            <RevealText className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-gradient" delay={0.1}>
              Something Beautiful
            </RevealText>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Connecting line */}
            <div className="hidden md:block absolute left-1/2 top-[320px] bottom-[200px] w-px bg-gradient-to-b from-primary/20 via-primary/10 to-transparent" />

            <div className="space-y-24 md:space-y-32">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-16`}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex-1 max-w-md">
                    <motion.div
                      className="text-[7rem] sm:text-[9rem] font-black leading-none text-primary/[0.06] select-none"
                      style={{ lineHeight: 0.8 }}
                    >
                      {step.num}
                    </motion.div>
                    <h3 className="text-3xl sm:text-4xl font-bold mt-2 mb-5 text-foreground">{step.title}</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>

                  <div className="flex-1 w-full">
                    <motion.div
                      className="relative aspect-video rounded-3xl glass-card border border-border/20 overflow-hidden shadow-elegant"
                      whileHover={{ scale: 1.03, rotateY: i % 2 === 0 ? 3 : -3 }}
                      transition={{ duration: 0.5 }}
                      style={{ perspective: 1000 }}
                    >
                      <div className="absolute inset-0 bg-mesh opacity-30" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          className="w-20 h-20 rounded-3xl bg-gradient-primary flex items-center justify-center shadow-glow"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <step.icon className="w-10 h-10 text-primary-foreground" />
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES GRID
          ══════════════════════════════════════════ */}
      <section id="features" className="relative py-28 sm:py-36 scroll-mt-20">
        <div className="container px-4">
          <div className="text-center mb-20">
            <FadeUp>
              <Badge variant="outline" className="mb-5 glass border-border/40 text-[11px] tracking-[0.15em] uppercase font-semibold">
                Powerful Features
              </Badge>
            </FadeUp>
            <RevealText className="text-4xl sm:text-5xl lg:text-6xl font-black mb-3 tracking-tight leading-[1.1] text-foreground">
              Built for
            </RevealText>
            <RevealText className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-[1.1] text-gradient" delay={0.1}>
              Creators Like You
            </RevealText>
            <FadeUp delay={0.2}>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Professional-grade tools, wrapped in an interface anyone can master.
              </p>
            </FadeUp>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="relative h-full p-8 rounded-3xl glass-card border border-border/20 hover:border-primary/30 transition-all duration-500 card-interactive overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative z-10">
                    <motion.div
                      className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-gradient-primary group-hover:shadow-glow transition-all duration-500"
                      whileHover={{ rotate: 5, scale: 1.05 }}
                    >
                      <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-[15px]">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIALS
          ══════════════════════════════════════════ */}
      <section className="relative py-28 sm:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-muted/15" />
        <div className="container px-4 relative z-10">
          <div className="text-center mb-20">
            <FadeUp>
              <Badge variant="outline" className="mb-5 glass border-border/40 text-[11px] tracking-[0.15em] uppercase font-semibold">
                What People Say
              </Badge>
            </FadeUp>
            <RevealText className="text-4xl sm:text-5xl font-black mb-3 tracking-tight leading-[1.1] text-foreground">
              Loved by
            </RevealText>
            <RevealText className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.1] text-gradient" delay={0.1}>
              Thousands
            </RevealText>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { name: "Sarah Mitchell", role: "Event Planner", text: "This platform transformed how I create invitations. The visual editor is intuitive and the results are always stunning.", avatar: "S" },
              { name: "David Chen", role: "Small Business Owner", text: "I've created dozens of pages for different events. The quality is truly professional and saves me hours every time.", avatar: "D" },
              { name: "Emma Rodriguez", role: "Marketing Manager", text: "Our entire team uses Webie for event pages. The customization is endless and the interface just makes sense.", avatar: "E" },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
              >
                <div className="relative h-full p-8 rounded-3xl glass-card border border-border/20 hover:border-primary/20 transition-all duration-500 card-interactive group">
                  <div className="absolute top-6 right-6 text-5xl font-serif text-primary/10 leading-none select-none">"</div>
                  <div className="flex items-center gap-1.5 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.12 + j * 0.05 }}
                      >
                        <Heart className="w-4 h-4 fill-primary text-primary" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-8 leading-relaxed text-[15px]">{t.text}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-elegant">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          DEMO / VIDEO SECTION
          ══════════════════════════════════════════ */}
      <section className="relative py-28 sm:py-36">
        <div className="container px-4">
          <motion.div
            className="relative max-w-5xl mx-auto rounded-[2rem] overflow-hidden border border-border/20"
            initial={{ opacity: 0, y: 60, scale: 0.92 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ boxShadow: "0 40px 80px -20px hsl(var(--primary) / 0.2)" }}
          >
            <div className="relative aspect-video">
              <img src={heroEditor} alt="Webie editor demo" className="w-full h-full object-cover" loading="lazy" width={1920} height={1080} />
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                <motion.button
                  className="relative w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-glow cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/templates')}
                >
                  <Play className="w-10 h-10 text-primary-foreground ml-1" />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.button>
              </div>
            </div>
            <div className="absolute bottom-0 inset-x-0 p-8 glass">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">See Webie in Action</h3>
                  <p className="text-sm text-muted-foreground">From template to published page in under 5 minutes</p>
                </div>
                <MagneticButton
                  className="inline-flex items-center gap-2 px-6 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-elegant hover:shadow-glow transition-all"
                  onClick={() => navigate('/templates')}
                >
                  Try It Now <ArrowRight className="w-4 h-4" />
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FINAL CTA
          ══════════════════════════════════════════ */}
      <section className="relative py-36 sm:py-48 overflow-hidden">
        {/* Ambient bg */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full blur-[160px]"
            style={{ background: 'hsl(var(--primary) / 0.12)', top: '20%', left: '10%' }}
            animate={{ x: [0, 80, 0], y: [0, -60, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full blur-[140px]"
            style={{ background: 'hsl(var(--info) / 0.08)', bottom: '10%', right: '15%' }}
            animate={{ x: [0, -60, 0], y: [0, 40, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="container px-4 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="space-y-2 mb-10">
              <RevealText className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground">
                Ready to Create
              </RevealText>
              <RevealText className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-gradient" delay={0.15}>
                Something Amazing?
              </RevealText>
            </div>

            <FadeUp delay={0.3}>
              <p className="text-lg sm:text-xl text-muted-foreground mb-14 max-w-2xl mx-auto leading-relaxed">
                Join thousands of creators who bring their visions to life every day.
                No design experience required. Start for free.
              </p>
            </FadeUp>

            <FadeUp delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-5 justify-center mb-14">
                <MagneticButton
                  className="inline-flex items-center justify-center gap-2 text-base px-10 h-14 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-elegant hover:shadow-glow transition-all duration-300 group"
                  onClick={() => navigate('/templates')}
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </MagneticButton>
                {!isAuthenticated && (
                  <MagneticButton
                    className="inline-flex items-center justify-center gap-2 text-base px-10 h-14 rounded-2xl glass border border-border/40 font-medium text-foreground hover:bg-accent/50 transition-all duration-300"
                    onClick={() => navigate('/auth')}
                  >
                    Create Account
                  </MagneticButton>
                )}
              </div>
            </FadeUp>

            <FadeUp delay={0.5}>
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
                {["No credit card required", "Free forever plan", "Cancel anytime"].map((text, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </FadeUp>
          </motion.div>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="border-t border-border/20 py-14">
        <div className="container px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <motion.div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              whileHover={{ scale: 1.03 }}
            >
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-bold text-lg tracking-tight">Webie</span>
            </motion.div>
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              {['Templates', 'Webies', 'Get Started'].map((label, i) => (
                <button
                  key={label}
                  onClick={() => navigate(i === 2 ? '/auth' : `/${label.toLowerCase()}`)}
                  className="hover:text-foreground transition-colors duration-200 relative group"
                >
                  {label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Webie. Crafted with <Heart className="w-3 h-3 inline text-primary fill-primary mx-0.5" /> for creators.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
