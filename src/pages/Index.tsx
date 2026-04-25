import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight, Check, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { initializeMockData } from "@/lib/storage";
import { motion, useScroll, useTransform, useInView, useSpring } from "framer-motion";
import { Header } from "@/components/Header";

import showcaseWedding from "@/assets/showcase-wedding.jpg";
import showcaseBirthday from "@/assets/showcase-birthday.jpg";
import showcaseAnniversary from "@/assets/showcase-anniversary.jpg";
import showcaseBusiness from "@/assets/showcase-business.jpg";
import heroCollage1 from "@/assets/hero-collage-1.jpg";
import heroCollage2 from "@/assets/hero-collage-2.jpg";
import heroCollage3 from "@/assets/hero-collage-3.jpg";
import heroCollage4 from "@/assets/hero-collage-4.jpg";
import sectionTexture from "@/assets/section-texture.jpg";
import heroPortrait from "@/assets/hero-portrait.jpg";
import letterStill from "@/assets/letter-still.jpg";
import handsPolaroid from "@/assets/hands-polaroid.jpg";
import windowLight from "@/assets/window-light.jpg";
import freelancerPortrait from "@/assets/freelancer-portrait.jpg";

/* ─── Motion primitives ───────────────────────────── */

const Reveal = ({ children, delay = 0, className = "" }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const Counter = ({ to, suffix = "" }: { to: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let s = 0;
    const t = setInterval(() => {
      s += to / 80;
      if (s >= to) { setVal(to); clearInterval(t); }
      else setVal(Math.floor(s));
    }, 18);
    return () => clearInterval(t);
  }, [inView, to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
};

/* ─── Page ───────────────────────────── */

export default function Index() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.85, 0.4]);

  const marqueeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: galleryProgress } = useScroll({
    target: marqueeRef, offset: ["start end", "end start"]
  });
  const galleryX = useTransform(galleryProgress, [0, 1], ["5%", "-45%"]);

  useEffect(() => { initializeMockData(); }, []);

  const cursorX = useSpring(0, { stiffness: 100, damping: 20 });
  const cursorY = useSpring(0, { stiffness: 100, damping: 20 });
  useEffect(() => {
    const m = (e: MouseEvent) => { cursorX.set(e.clientX); cursorY.set(e.clientY); };
    window.addEventListener('mousemove', m);
    return () => window.removeEventListener('mousemove', m);
  }, [cursorX, cursorY]);

  const showcase = [
    { img: showcaseWedding, label: "Eden & Marcus", category: "Wedding" },
    { img: showcaseBirthday, label: "Mia turns five", category: "Birthday" },
    { img: showcaseAnniversary, label: "Twenty-five years", category: "Anniversary" },
    { img: showcaseBusiness, label: "North Studio", category: "Business" },
  ];

  const features = [
    { n: "01", t: "Drag, drop, done", d: "Build any layout in minutes with a canvas that feels like paper." },
    { n: "02", t: "Hand-picked type", d: "A curated library of editorial typography — never another generic stack." },
    { n: "03", t: "Real performance", d: "Static-first output. Pages load in under a second on any connection." },
    { n: "04", t: "Own your domain", d: "Connect a custom URL in two clicks. SSL handled, always." },
  ];

  const faqs = [
    { q: "Do I need to know how to code?", a: "Not at all. Everything is visual — drag elements, type words, drop images. If you can use Notion, you can use this." },
    { q: "Can I use my own domain?", a: "Yes. Connect any domain you own in two clicks. We handle SSL, redirects, and DNS automatically." },
    { q: "What about hosting?", a: "Hosting is included on every plan. Sites are served from a global edge network with 99.99% uptime." },
    { q: "Is there a free plan?", a: "Yes. Build and publish unlimited drafts for free. Upgrade only when you connect a custom domain." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* cursor halo */}
      <motion.div
        className="fixed pointer-events-none z-0 w-[500px] h-[500px] rounded-full opacity-40 mix-blend-multiply hidden md:block"
        style={{
          x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%",
          background: "radial-gradient(circle, hsl(var(--primary) / 0.35), transparent 70%)",
        }}
      />

      <Header />

      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center pt-32 md:pt-36 pb-24 md:pb-32 bg-background overflow-hidden">
        {/* soft ambient blob */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container px-6 md:px-10 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* LEFT — copy column */}
            <div className="lg:col-span-7">
              <Reveal>
                <div className="flex items-center gap-3 mb-10">
                  <span className="w-12 h-px bg-foreground" />
                  <span className="font-mono-accent text-xs uppercase tracking-[0.25em] text-foreground/70">
                    Webilio · A quieter web
                  </span>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <h1 className="font-display text-[clamp(2.75rem,8vw,7.5rem)] font-light leading-[1.02] tracking-tight">
                  Make a website
                  <br />
                  <span className="italic font-normal">worth</span>{" "}
                  <span className="relative inline-block">
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.9, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                      style={{ originX: 0 }}
                      className="absolute -inset-x-3 inset-y-2 bg-primary/85 -z-10 rounded-full"
                    />
                    <span className="font-medium text-primary-foreground px-2 relative">looking</span>
                  </span>
                  <br />
                  <span className="inline-flex items-baseline gap-4">
                    at.
                    <motion.span
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="inline-block w-3 h-12 md:w-4 md:h-20 bg-foreground translate-y-1"
                    />
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={0.35}>
                <p className="mt-10 md:mt-14 text-lg md:text-xl text-foreground/70 leading-[1.8] max-w-lg">
                  A builder for the people who actually <em className="italic">care</em> how things look. No templates that scream "made online." No gradients pretending to be design. Just thoughtful tools and beautiful type.
                </p>
              </Reveal>

              <Reveal delay={0.5}>
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => navigate('/templates')}
                    className="rounded-full bg-ink text-smoke hover:bg-ink/90 px-8 h-14 text-base font-medium group"
                  >
                    Start building
                    <ArrowUpRight className="ml-2 w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
                    className="rounded-full px-8 h-14 text-base font-medium border border-foreground/20 hover:bg-foreground/5"
                  >
                    See the work
                  </Button>
                </div>
              </Reveal>

              {/* mini ticker of feelings */}
              <Reveal delay={0.7}>
                <div className="mt-14 flex items-center gap-6 font-mono-accent text-[11px] uppercase tracking-[0.25em] text-foreground/50">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span>Built today by</span>
                  <span className="font-display italic text-base text-foreground normal-case tracking-normal">
                    a florist · a poet · a wedding planner · a baker
                  </span>
                </div>
              </Reveal>
            </div>

            {/* RIGHT — image composition */}
            <div className="lg:col-span-5 relative h-[460px] md:h-[560px] lg:h-[640px]">
              {/* primary portrait */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ y: useTransform(scrollYProgress, [0, 1], [0, -60]) }}
                className="absolute top-0 right-0 w-[78%] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-foreground/10"
              >
                <img src={heroPortrait} alt="A maker at work" className="w-full h-full object-cover" />
                {/* tiny tag */}
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur px-3 py-1.5 rounded-full font-mono-accent text-[10px] uppercase tracking-[0.2em]">
                  · Live · she's editing
                </div>
              </motion.div>

              {/* secondary card — bottom left */}
              <motion.div
                initial={{ opacity: 0, y: 40, rotate: -8 }}
                animate={{ opacity: 1, y: 0, rotate: -6 }}
                transition={{ duration: 1.1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{ y: useTransform(scrollYProgress, [0, 1], [0, -140]) }}
                className="absolute bottom-0 left-0 w-[55%] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-foreground/10 hidden md:block"
              >
                <img src={heroCollage1} alt="" className="w-full h-full object-cover" />
              </motion.div>

              {/* small note card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, rotate: 8 }}
                animate={{ opacity: 1, scale: 1, rotate: 6 }}
                transition={{ duration: 0.9, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
                style={{ y: useTransform(scrollYProgress, [0, 1], [0, 60]) }}
                className="absolute bottom-[18%] right-[-2%] md:right-[-6%] bg-background border border-foreground/10 rounded-2xl p-5 shadow-2xl max-w-[200px] hidden sm:block"
              >
                <div className="font-display italic text-base leading-tight text-foreground">
                  "It looked like ours from the very first edit."
                </div>
                <div className="mt-3 flex items-center gap-2 font-mono-accent text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                  <span className="w-6 h-px bg-foreground/30" />
                  Eden, florist
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* bottom marker */}
        <div className="absolute bottom-6 left-0 right-0 container px-6 md:px-10 flex justify-between items-end font-mono-accent text-xs uppercase tracking-[0.25em] text-foreground/50">
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            ↓ Scroll, slowly
          </motion.span>
          <span>No.001 / Index</span>
        </div>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <section className="border-y border-foreground/10 py-8 overflow-hidden bg-smoke text-ink">
        <motion.div
          className="flex gap-16 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-16 items-center shrink-0">
              {["Vogue", "Pentagram", "Bloomberg", "Aesop", "Apartamento", "Kinfolk", "Monocle", "Cereal"].map((b) => (
                <div key={b} className="flex items-center gap-16">
                  <span className="font-display text-3xl md:text-4xl font-light italic">{b}</span>
                  <span className="w-2 h-2 rounded-full bg-primary" />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="py-32 container px-6 md:px-10">
        <div className="grid md:grid-cols-3 gap-12 md:gap-6">
          {[
            { n: 18420, s: "+", l: "Sites in the wild" },
            { n: 96, s: "%", l: "Would recommend" },
            { n: 4, s: ".9★", l: "Average rating" },
          ].map((stat, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="border-t border-foreground pt-6">
                <div className="font-display text-7xl md:text-8xl font-light leading-none">
                  <Counter to={stat.n} suffix={stat.s} />
                </div>
                <div className="mt-4 font-mono-accent text-xs uppercase tracking-[0.25em] text-foreground/60">
                  {stat.l}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ WORK / SHOWCASE ═══ */}
      <section id="work" ref={marqueeRef} className="py-32 bg-smoke text-ink overflow-hidden">
        <div className="container px-6 md:px-10 mb-20">
          <Reveal>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-px bg-ink" />
              <span className="font-mono-accent text-xs uppercase tracking-[0.25em]">Selected work</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-5xl md:text-7xl font-light leading-[1.05] max-w-3xl">
              Real sites by <span className="italic">real people</span> who didn't want a template.
            </h2>
          </Reveal>
        </div>

        <motion.div style={{ x: galleryX }} className="flex gap-8 px-10">
          {[...showcase, ...showcase].map((item, i) => (
            <div key={i} className="shrink-0 w-[420px] md:w-[520px] group cursor-pointer">
              <div className="overflow-hidden rounded-3xl bg-ink/5 aspect-[4/5]">
                <motion.img
                  src={item.img}
                  alt={item.label}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.7 }}
                />
              </div>
              <div className="flex justify-between items-end mt-5">
                <div>
                  <div className="font-display text-2xl">{item.label}</div>
                  <div className="font-mono-accent text-xs uppercase tracking-[0.25em] text-ink-soft mt-1">
                    {item.category}
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="py-32 container px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5 md:sticky md:top-32 self-start">
            <Reveal>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 h-px bg-foreground" />
                <span className="font-mono-accent text-xs uppercase tracking-[0.25em] text-foreground/70">
                  What you get
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-5xl md:text-6xl font-light leading-[1.05]">
                Tools that get out of the <span className="italic">way</span>.
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 text-foreground/70 text-lg leading-[1.8] max-w-md">
                Everything is built to feel quiet. The interface fades into the background so what you make can step forward.
              </p>
            </Reveal>
          </div>

          <div className="md:col-span-7 space-y-2">
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="border-t border-foreground/15 py-10 group">
                  <div className="flex items-baseline gap-8">
                    <span className="font-mono-accent text-sm text-foreground/40">{f.n}</span>
                    <div className="flex-1">
                      <h3 className="font-display text-3xl md:text-4xl font-normal mb-3 group-hover:italic transition-all duration-300">
                        {f.t}
                      </h3>
                      <p className="text-foreground/70 leading-[1.8] max-w-lg">{f.d}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BIG QUOTE ═══ */}
      <section className="py-40 container px-6 md:px-10">
        <Reveal>
          <div className="max-w-5xl">
            <div className="font-display text-6xl text-primary mb-4 leading-none">"</div>
            <blockquote className="font-display text-4xl md:text-6xl font-light leading-[1.15] tracking-tight">
              The web got loud. We made something <span className="italic">quiet</span> on purpose — a tool that respects taste, time, and the person on the other side of the screen.
            </blockquote>
            <div className="mt-12 flex items-center gap-4 font-mono-accent text-xs uppercase tracking-[0.25em] text-foreground/60">
              <span className="w-12 h-px bg-foreground" />
              The Webilio team
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ LETTER / EMOTIONAL MOMENT ═══ */}
      <section className="py-32 md:py-40 border-t border-foreground/10 relative overflow-hidden">
        <div className="container px-6 md:px-10">
          <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-center">
            <Reveal className="md:col-span-6 md:col-start-1">
              <div className="relative">
                <motion.div
                  initial={{ rotate: -3 }}
                  whileInView={{ rotate: -2 }}
                  whileHover={{ rotate: 0, scale: 1.02 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-foreground/10"
                >
                  <img src={letterStill} alt="A handwritten letter" loading="lazy" className="w-full h-auto" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20, rotate: 4 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 6 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.3 }}
                  className="absolute -bottom-6 -right-4 md:-right-8 bg-background border border-foreground/10 rounded-2xl p-4 shadow-xl max-w-[180px]"
                >
                  <div className="font-mono-accent text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                    Postmarked
                  </div>
                  <div className="font-display italic text-lg mt-1">
                    For the people you love.
                  </div>
                </motion.div>
              </div>
            </Reveal>

            <div className="md:col-span-5 md:col-start-8">
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-12 h-px bg-foreground" />
                  <span className="font-mono-accent text-xs uppercase tracking-[0.25em] text-foreground/70">
                    A small note
                  </span>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="font-display text-4xl md:text-6xl font-light leading-[1.05]">
                  We're not building <span className="italic">software</span>.
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-8 text-foreground/70 text-lg leading-[1.9]">
                  We're building the place where you'll announce your wedding. Where you'll show your grandmother the cake you made. Where strangers will find your studio, your shop, your name — and feel something before they read a single word.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="mt-6 font-display italic text-2xl text-foreground/80 leading-snug">
                  So we made it slow. We made it quiet. We made it <span className="text-primary not-italic font-medium">yours</span>.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ IN MOTION / DRIFTING GALLERY ═══ */}
      <section className="py-24 md:py-32 bg-smoke text-ink overflow-hidden border-y border-foreground/20">
        <div className="container px-6 md:px-10 mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-12 h-px bg-ink" />
              <span className="font-mono-accent text-xs uppercase tracking-[0.25em]">In motion</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-light leading-[1.05] max-w-2xl">
              A few <span className="italic">small things</span> that move us.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-mono-accent text-xs uppercase tracking-[0.25em] text-ink-soft max-w-xs">
              Hover to slow time
            </p>
          </Reveal>
        </div>

        {/* drifting row */}
        <div className="group relative">
          <motion.div
            className="flex gap-6 md:gap-8 px-6 md:px-10"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            style={{ width: "max-content" }}
          >
            {[
              { img: handsPolaroid, t: "Polaroid in soft light", n: "I." },
              { img: windowLight, t: "Linen at the window", n: "II." },
              { img: heroCollage2, t: "A still morning", n: "III." },
              { img: heroCollage3, t: "Where the day begins", n: "IV." },
              { img: letterStill, t: "Ink, slowly", n: "V." },
              { img: heroCollage4, t: "Hands at work", n: "VI." },
              { img: handsPolaroid, t: "Polaroid in soft light", n: "I." },
              { img: windowLight, t: "Linen at the window", n: "II." },
              { img: heroCollage2, t: "A still morning", n: "III." },
              { img: heroCollage3, t: "Where the day begins", n: "IV." },
              { img: letterStill, t: "Ink, slowly", n: "V." },
              { img: heroCollage4, t: "Hands at work", n: "VI." },
            ].map((it, i) => (
              <div key={i} className="shrink-0 w-[260px] md:w-[320px]">
                <div className="overflow-hidden rounded-2xl aspect-[3/4] bg-ink/5">
                  <motion.img
                    src={it.img}
                    alt={it.t}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-3 font-mono-accent text-[10px] uppercase tracking-[0.25em] text-ink-soft">
                  <span>{it.n}</span>
                  <span className="font-display italic text-base text-ink normal-case tracking-normal">{it.t}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ PROCESS / KINETIC LIST ═══ */}
      <section className="py-32 border-t border-foreground/10">
        <div className="container px-6 md:px-10 mb-20">
          <Reveal>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-px bg-foreground" />
              <span className="font-mono-accent text-xs uppercase tracking-[0.25em] text-foreground/70">
                How it works
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-5xl md:text-7xl font-light leading-[1.05] max-w-3xl">
              Four small <span className="italic">moments</span> between a blank page and a site you love.
            </h2>
          </Reveal>
        </div>

        <div className="container px-6 md:px-10">
          {[
            { n: "01", t: "Pick a feeling", d: "Browse hand-made templates organized by mood, not category. Trust your gut.", img: heroCollage1 },
            { n: "02", t: "Make it yours", d: "Click anything to change it. Replace photos by double-clicking. No menus to memorize.", img: heroCollage2 },
            { n: "03", t: "Let it breathe", d: "Generous spacing, real typography, soft motion. The defaults already look intentional.", img: heroCollage3 },
            { n: "04", t: "Send it out", d: "Publish in one click. Share a link. Watch the people you care about react.", img: heroCollage4 },
          ].map((step, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="group border-t border-foreground/15 py-10 md:py-12 grid grid-cols-12 gap-6 items-center cursor-default">
                <div className="col-span-2 md:col-span-1 font-mono-accent text-sm text-foreground/40">{step.n}</div>
                <div className="col-span-10 md:col-span-6">
                  <h3 className="font-display text-3xl md:text-5xl font-normal leading-[1.05] group-hover:italic transition-all duration-500">
                    {step.t}
                  </h3>
                  <p className="mt-3 text-foreground/70 leading-[1.8] max-w-md md:hidden">{step.d}</p>
                </div>
                <div className="hidden md:block col-span-3 text-foreground/70 leading-[1.8] text-sm">
                  {step.d}
                </div>
                <div className="hidden md:block col-span-2 overflow-hidden rounded-2xl aspect-[4/5] bg-muted">
                  <motion.img
                    src={step.img}
                    alt={step.t}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1, filter: "grayscale(60%)" }}
                    whileHover={{ scale: 1.04, filter: "grayscale(0%)" }}
                    whileInView={{ scale: 1, filter: "grayscale(20%)" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ EDITORIAL IMAGE GRID ═══ */}
      <section
        className="py-32 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.08), hsl(var(--primary) / 0.04)), url(${sectionTexture})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container px-6 md:px-10">
          <Reveal>
            <div className="flex items-center gap-3 mb-12">
              <span className="w-12 h-px bg-foreground" />
              <span className="font-mono-accent text-xs uppercase tracking-[0.25em] text-foreground/70">
                A closer look
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-5xl md:text-7xl font-light leading-[1.05] max-w-3xl mb-20">
              Made for the <span className="italic">moments</span> that matter.
            </h2>
          </Reveal>

          <div className="grid grid-cols-12 gap-4 md:gap-6">
            <Reveal className="col-span-7 md:col-span-5" delay={0.05}>
              <div className="overflow-hidden rounded-2xl aspect-[3/4]">
                <motion.img
                  src={heroCollage1}
                  alt="Editorial bouquet"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </Reveal>
            <Reveal className="col-span-5 md:col-span-4 mt-12" delay={0.15}>
              <div className="overflow-hidden rounded-2xl aspect-square">
                <motion.img
                  src={heroCollage2}
                  alt="Minimal still life"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <div className="mt-6 font-mono-accent text-xs uppercase tracking-[0.25em] text-foreground/60">
                No.02 — Stillness in form
              </div>
            </Reveal>
            <Reveal className="col-span-12 md:col-span-3 md:mt-32" delay={0.25}>
              <p className="font-display text-2xl md:text-3xl leading-[1.3] italic text-foreground/80">
                "Design is a conversation between what you say and what you leave out."
              </p>
            </Reveal>

            <Reveal className="col-span-12 md:col-span-7 md:col-start-2 mt-8" delay={0.1}>
              <div className="overflow-hidden rounded-2xl aspect-[16/10]">
                <motion.img
                  src={heroCollage3}
                  alt="Architectural light"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </Reveal>
            <Reveal className="col-span-12 md:col-span-4 mt-8 md:mt-20" delay={0.2}>
              <div className="overflow-hidden rounded-2xl aspect-[3/4]">
                <motion.img
                  src={heroCollage4}
                  alt="Hands writing"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <div className="mt-6 font-mono-accent text-xs uppercase tracking-[0.25em] text-foreground/60">
                No.04 — Made by hand
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-32 container px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <Reveal>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 h-px bg-foreground" />
                <span className="font-mono-accent text-xs uppercase tracking-[0.25em] text-foreground/70">
                  Questions
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-5xl md:text-6xl font-light leading-[1.05]">
                Things people <span className="italic">ask</span>.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-8">
            {faqs.map((f, i) => (
              <FaqItem key={i} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-40 bg-smoke text-ink overflow-hidden relative">
        <div className="container px-6 md:px-10 text-center relative z-10">
          <Reveal>
            <span className="font-mono-accent text-xs uppercase tracking-[0.25em] text-ink-soft">
              Now or later
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-6xl md:text-9xl font-light leading-[0.95] mt-8 max-w-5xl mx-auto">
              Make something
              <br />
              <span className="italic">people remember</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.3}>
            <Button
              onClick={() => navigate('/templates')}
              className="mt-16 rounded-full bg-primary text-primary-foreground hover:bg-primary-glow px-10 h-16 text-base font-medium"
            >
              Start your site — it's free
              <ArrowRight className="ml-3 w-5 h-5" />
            </Button>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="mt-8 font-mono-accent text-xs uppercase tracking-[0.25em] text-ink-soft flex items-center gap-2 justify-center">
              <Check className="w-3 h-3" /> No credit card · Free forever plan
            </div>
          </Reveal>
        </div>

        {/* big watermark */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none opacity-[0.06] leading-none">
          <div className="font-display text-[18vw] font-medium translate-y-[20%]">webilio</div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-foreground/10 py-12">
        <div className="container px-6 md:px-10 flex flex-col md:flex-row justify-between gap-6 font-mono-accent text-xs uppercase tracking-[0.2em] text-foreground/60">
          <div>© Webilio 2024 — Made with care</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-foreground">Twitter</a>
            <a href="#" className="hover:text-foreground">Instagram</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <Reveal>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left border-t border-foreground/15 py-8 group"
      >
        <div className="flex justify-between items-start gap-6">
          <h3 className="font-display text-2xl md:text-3xl font-normal group-hover:italic transition-all duration-300">
            {q}
          </h3>
          <div className="shrink-0 mt-2">
            {open ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </div>
        </div>
        <motion.div
          initial={false}
          animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <p className="pt-6 text-foreground/70 leading-[1.8] max-w-2xl">{a}</p>
        </motion.div>
      </button>
    </Reveal>
  );
};
