import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, Palette, Zap, Shield, Download, Star,
  LogIn, ArrowRight, Check, Users, Clock,
  TrendingUp, Play, ChevronDown, MousePointer2,
  Layers, Eye, Wand2, Globe, ArrowUpRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { initializeMockData } from "@/lib/storage";
import { motion, useScroll, useTransform, useInView, useMotionValueEvent, AnimatePresence } from "framer-motion";

import heroMockup from "@/assets/hero-mockup.jpg";
import glassShapes from "@/assets/glass-shapes.jpg";
import showcaseWedding from "@/assets/showcase-wedding.jpg";
import showcaseBirthday from "@/assets/showcase-birthday.jpg";
import showcaseAnniversary from "@/assets/showcase-anniversary.jpg";
import showcaseBusiness from "@/assets/showcase-business.jpg";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [activeShowcase, setActiveShowcase] = useState(0);

  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(heroScrollProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(heroScrollProgress, [0, 0.7], [1, 0.9]);
  const mockupY = useTransform(heroScrollProgress, [0, 1], ["0%", "20%"]);
  const mockupRotate = useTransform(heroScrollProgress, [0, 1], [0, -5]);

  useEffect(() => {
    initializeMockData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveShowcase((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const showcaseItems = [
    { img: showcaseWedding, label: "Wedding Invitations", color: "from-pink-500/80 to-rose-400/80" },
    { img: showcaseBirthday, label: "Birthday Celebrations", color: "from-amber-500/80 to-orange-400/80" },
    { img: showcaseAnniversary, label: "Anniversary Cards", color: "from-yellow-600/80 to-amber-500/80" },
    { img: showcaseBusiness, label: "Business Events", color: "from-blue-600/80 to-indigo-500/80" },
  ];

  const features = [
    { icon: MousePointer2, title: "Click to Edit", desc: "Select any element and edit directly on the canvas. No code required." },
    { icon: Layers, title: "Layer Control", desc: "Organize elements with a visual layers panel. Drag to reorder." },
    { icon: Eye, title: "Live Preview", desc: "See every change instantly. What you see is what you get." },
    { icon: Wand2, title: "Smart Templates", desc: "Start with professionally designed templates and make them yours." },
    { icon: Globe, title: "One-Click Publish", desc: "Share your creation with the world in a single click." },
    { icon: Shield, title: "Privacy First", desc: "Your designs stay private. Everything runs in your browser." },
  ];

  const stats = [
    { value: "500+", label: "Templates", icon: Palette },
    { value: "10K+", label: "Happy Users", icon: Users },
    { value: "50K+", label: "Pages Created", icon: TrendingUp },
    { value: "< 5min", label: "Avg. Creation", icon: Clock },
  ];

  return (
    <div ref={containerRef} className="relative bg-background overflow-x-hidden">
      {/* ====== HERO SECTION ====== */}
      <section ref={heroRef} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Parallax background layers */}
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background z-10" />
          <img
            src={glassShapes}
            alt=""
            className="w-full h-[120%] object-cover opacity-30 dark:opacity-20"
            width={1920}
            height={1080}
          />
        </motion.div>

        {/* Animated orbs */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full bg-primary/15 blur-[120px]"
            animate={{ x: [0, 100, 0], y: [0, -60, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            style={{ top: "10%", left: "10%" }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full bg-info/10 blur-[100px]"
            animate={{ x: [0, -80, 0], y: [0, 80, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            style={{ bottom: "10%", right: "10%" }}
          />
          <motion.div
            className="absolute w-[300px] h-[300px] rounded-full bg-accent/10 blur-[80px]"
            animate={{ x: [0, 50, 0], y: [0, -40, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            style={{ top: "50%", right: "30%" }}
          />
        </div>

        {/* Hero content */}
        <motion.div
          className="relative z-10 container px-4 pt-24 pb-16"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center max-w-7xl mx-auto">
            {/* Left - Copy */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="mb-6 px-4 py-2 text-xs font-semibold tracking-wider uppercase glass border-primary/20 text-primary">
                  <Sparkles className="w-3 h-3 mr-2" />
                  Visual Web Builder
                </Badge>
              </motion.div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
                <span className="text-foreground">Design That</span>
                <br />
                <span className="text-gradient">Feels Alive</span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg">
                Create stunning web pages for every occasion with a powerful visual editor.
                No code. No limits. Just your creativity.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button
                  size="lg"
                  className="text-base px-8 h-13 rounded-xl shadow-elegant hover:shadow-glow transition-all duration-300 group"
                  onClick={() => navigate('/templates')}
                >
                  Start Creating
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                {!isAuthenticated && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base px-8 h-13 rounded-xl glass border-border/50 hover:bg-accent/50"
                    onClick={() => navigate('/auth')}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch Demo
                  </Button>
                )}
              </div>

              {/* Trust bar */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  Free forever
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  No sign-up needed
                </div>
                <div className="flex items-center gap-2 hidden sm:flex">
                  <Check className="w-4 h-4 text-primary" />
                  Export anytime
                </div>
              </div>
            </motion.div>

            {/* Right - Hero mockup with parallax */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 40, rotateY: -8 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ y: mockupY, perspective: "1200px" }}
            >
              <motion.div
                className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/20"
                style={{ rotateX: mockupRotate }}
                whileHover={{ scale: 1.02, rotateY: 2 }}
                transition={{ duration: 0.4 }}
              >
                <img
                  src={heroMockup}
                  alt="Webie visual editor interface"
                  className="w-full h-auto"
                  width={1920}
                  height={1080}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />

                {/* Floating glassmorphism badge */}
                <motion.div
                  className="absolute bottom-4 left-4 glass rounded-xl px-4 py-2.5 flex items-center gap-2"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs font-medium text-foreground">Live Preview Active</span>
                </motion.div>
              </motion.div>

              {/* Glassmorphism accent card */}
              <motion.div
                className="absolute -bottom-6 -right-4 sm:-right-8 glass-card rounded-2xl p-4 shadow-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Instant Export</div>
                    <div className="text-xs text-muted-foreground">HTML + CSS + JS</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs text-muted-foreground tracking-widest uppercase">Scroll</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </section>

      {/* ====== STATS RIBBON ====== */}
      <ParallaxSection speed={0.1}>
        <div className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />
          <div className="container px-4 relative z-10">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              {stats.map((stat, i) => (
                <motion.div key={i} variants={fadeUp} className="text-center group">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3 group-hover:scale-110 transition-transform">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </ParallaxSection>

      {/* ====== SHOWCASE GALLERY ====== */}
      <section className="relative py-24 sm:py-32">
        <div className="container px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-4 glass border-border/40">For Every Occasion</Badge>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
              Beautiful Templates,{" "}
              <span className="text-gradient">Infinite Possibilities</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From weddings to business events, find the perfect starting point for your next creation.
            </p>
          </motion.div>

          {/* Showcase grid with parallax cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {showcaseItems.map((item, i) => (
              <motion.div
                key={i}
                className="relative group cursor-pointer"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                onClick={() => navigate(`/templates?category=${item.label}`)}
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border/20 shadow-card group-hover:shadow-card-hover transition-shadow duration-300">
                  <img
                    src={item.img}
                    alt={item.label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    width={800}
                    height={1024}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${item.color} opacity-0 group-hover:opacity-70 transition-opacity duration-300`} />
                  <div className="absolute inset-0 flex items-end p-4">
                    <div className="w-full">
                      <motion.div
                        className="glass rounded-xl px-4 py-3 flex items-center justify-between"
                        initial={false}
                      >
                        <span className="text-sm font-semibold text-foreground">{item.label}</span>
                        <ArrowUpRight className="w-4 h-4 text-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl glass border-border/50"
              onClick={() => navigate('/templates')}
            >
              View All Templates
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ====== HOW IT WORKS - DEEP DIVE SECTION ====== */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-muted/30" />
        {/* Parallax background texture */}
        <ParallaxSection speed={0.15}>
          <div className="absolute inset-0 bg-mesh opacity-30" />
        </ParallaxSection>

        <div className="container px-4 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-4 glass border-border/40">How It Works</Badge>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
              Three Steps to{" "}
              <span className="text-gradient">Something Beautiful</span>
            </h2>
          </motion.div>

          <div className="max-w-5xl mx-auto space-y-24">
            {[
              {
                step: "01",
                title: "Pick Your Canvas",
                desc: "Browse 500+ professionally designed templates. Filter by occasion, style, or mood. Each template is fully customizable.",
                align: "left",
              },
              {
                step: "02",
                title: "Make It Yours",
                desc: "Click any element to edit. Change text, colors, images, and layout with our intuitive visual editor. See changes in real-time.",
                align: "right",
              },
              {
                step: "03",
                title: "Share With the World",
                desc: "Export your creation as clean HTML, CSS, and JavaScript. Share it as a link, download it, or embed it anywhere.",
                align: "left",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className={`flex flex-col ${item.align === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}
                initial={{ opacity: 0, x: item.align === 'left' ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex-1">
                  <div className="text-8xl sm:text-9xl font-black text-primary/10 leading-none mb-4">{item.step}</div>
                  <h3 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">{item.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-md">{item.desc}</p>
                </div>
                <div className="flex-1 w-full">
                  <motion.div
                    className="relative aspect-video rounded-2xl overflow-hidden glass-card border border-border/20 shadow-elegant"
                    whileHover={{ scale: 1.02, rotateY: item.align === 'left' ? 3 : -3 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                          {i === 0 && <Palette className="w-8 h-8 text-primary-foreground" />}
                          {i === 1 && <Wand2 className="w-8 h-8 text-primary-foreground" />}
                          {i === 2 && <Globe className="w-8 h-8 text-primary-foreground" />}
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">{item.title}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FEATURES GRID ====== */}
      <section className="relative py-24 sm:py-32">
        <div className="container px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-4 glass border-border/40">Powerful Features</Badge>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
              Built for{" "}
              <span className="text-gradient">Creators Like You</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional-grade tools, wrapped in an interface anyone can use.
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="group"
              >
                <div className="relative h-full p-8 rounded-2xl glass-card border border-border/20 hover:border-primary/30 transition-all duration-300 card-interactive overflow-hidden">
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-gradient-primary group-hover:shadow-glow transition-all duration-300">
                      <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-muted/20" />
        <ParallaxSection speed={0.08}>
          <div className="absolute inset-0 bg-mesh opacity-20" />
        </ParallaxSection>

        <div className="container px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 glass border-border/40">What People Say</Badge>
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight">
              Loved by <span className="text-gradient">Thousands</span>
            </h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {[
              { name: "Sarah Mitchell", role: "Event Planner", text: "This platform transformed how I create invitations. The visual editor is intuitive and the results are always stunning." },
              { name: "David Chen", role: "Small Business Owner", text: "I've created dozens of pages for different occasions. The quality is professional and saves me hours." },
              { name: "Emma Rodriguez", role: "Marketing Manager", text: "Our team uses this for all event pages. The customization is endless and the interface is incredibly user-friendly." },
            ].map((t, i) => (
              <motion.div key={i} variants={fadeUp}>
                <div className="relative h-full p-8 rounded-2xl glass-card border border-border/20 hover:border-primary/20 transition-all card-interactive">
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====== VIDEO / DEMO SECTION ====== */}
      <section className="relative py-24 sm:py-32">
        <div className="container px-4">
          <motion.div
            className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-border/20"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative aspect-video">
              <img
                src={heroMockup}
                alt="Webie editor demo"
                className="w-full h-full object-cover"
                loading="lazy"
                width={1920}
                height={1080}
              />
              <div className="absolute inset-0 bg-background/40 backdrop-blur-sm flex items-center justify-center">
                <motion.button
                  className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-glow cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/templates')}
                >
                  <Play className="w-8 h-8 text-primary-foreground ml-1" />
                </motion.button>
              </div>
            </div>
            {/* Glassmorphism overlay bar */}
            <div className="absolute bottom-0 inset-x-0 p-6 glass">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">See Webie in Action</h3>
                  <p className="text-sm text-muted-foreground">Watch how easy it is to create stunning pages</p>
                </div>
                <Button className="rounded-xl shadow-elegant" onClick={() => navigate('/templates')}>
                  Try It Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== FINAL CTA ====== */}
      <section className="relative py-32 sm:py-40 overflow-hidden">
        {/* Deep parallax background */}
        <div className="absolute inset-0">
          <ParallaxSection speed={0.2}>
            <div className="absolute inset-0">
              <img
                src={glassShapes}
                alt=""
                className="w-full h-[140%] object-cover opacity-20 dark:opacity-10"
                loading="lazy"
                width={1920}
                height={1080}
              />
            </div>
          </ParallaxSection>
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        </div>

        <div className="container px-4 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-8 tracking-tight leading-[1.1]">
              Ready to Create
              <br />
              <span className="text-gradient">Something Amazing?</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join thousands of creators who bring their visions to life every day. No design experience required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="text-base px-10 h-14 rounded-xl shadow-elegant hover:shadow-glow transition-all duration-300 group"
                onClick={() => navigate('/templates')}
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              {!isAuthenticated && (
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-10 h-14 rounded-xl glass border-border/50"
                  onClick={() => navigate('/auth')}
                >
                  Create Account
                </Button>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              {["No credit card required", "Free forever plan", "Cancel anytime"].map((text, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="border-t border-border/30 py-12">
        <div className="container px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-bold text-lg">Webie</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <button onClick={() => navigate('/templates')} className="hover:text-foreground transition-colors">Templates</button>
              <button onClick={() => navigate('/webies')} className="hover:text-foreground transition-colors">Webies</button>
              <button onClick={() => navigate('/auth')} className="hover:text-foreground transition-colors">Get Started</button>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Webie. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ====== ANIMATION VARIANTS ======
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

// ====== PARALLAX WRAPPER ======
const ParallaxSection = ({ children, speed = 0.1 }: { children: React.ReactNode; speed?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`${-speed * 100}%`, `${speed * 100}%`]);

  return (
    <div ref={ref} className="relative overflow-hidden">
      <motion.div style={{ y }} className="relative">
        {children}
      </motion.div>
    </div>
  );
};

export default Index;
