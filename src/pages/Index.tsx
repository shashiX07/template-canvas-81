import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Palette, Zap, Shield, Download, Star, LogIn,
  ArrowRight, Check, Heart, Gift, Users, Clock,
  TrendingUp, Award, Rocket, ChevronRight, Play,
  Layers, MousePointer, Eye, Code2, Wand2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { initializeMockData } from "@/lib/storage";
import { motion, useScroll, useTransform, useInView, useMotionValueEvent } from "framer-motion";
import { FloatingNavbar } from "@/components/FloatingNavbar";
import webilioLogo from "@/assets/webilio_logo.png";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(heroScrollProgress, [0, 1], ["0%", "40%"]);
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 0.85]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.8], [1, 0]);
  const heroRotateX = useTransform(heroScrollProgress, [0, 1], [0, 15]);
  const textY = useTransform(heroScrollProgress, [0, 1], ["0%", "-30%"]);

  useEffect(() => {
    initializeMockData();
  }, []);

  const occasions = [
    { title: "Birthdays", description: "Celebrate life's precious moments with designs that capture joy", icon: Gift, gradient: "from-pink-500 to-rose-400" },
    { title: "Weddings", description: "Create timeless invitations that reflect your unique love story", icon: Heart, gradient: "from-violet-500 to-purple-400" },
    { title: "Condolences", description: "Honor memories with respectful and comforting designs", icon: Heart, gradient: "from-slate-500 to-slate-400" },
    { title: "Anniversaries", description: "Mark milestones with elegant designs that celebrate your journey", icon: Award, gradient: "from-amber-500 to-orange-400" },
  ];

  const steps = [
    { number: "01", title: "Choose Template", description: "Browse curated, professionally designed templates", icon: Layers },
    { number: "02", title: "Customize Visually", description: "Click to edit—no technical skills required", icon: MousePointer },
    { number: "03", title: "Preview & Perfect", description: "See changes instantly in real-time", icon: Eye },
    { number: "04", title: "Share & Celebrate", description: "Download and share in seconds", icon: Rocket },
  ];

  const features = [
    { icon: Palette, title: "Visual Editing", description: "Click, edit, and customize without writing code" },
    { icon: Zap, title: "Instant Preview", description: "See your changes in real-time as you edit" },
    { icon: Download, title: "Easy Export", description: "Download your finished page instantly" },
    { icon: Code2, title: "Full Code Access", description: "Export clean HTML/CSS/JS anytime" },
    { icon: Wand2, title: "AI Powered", description: "Smart suggestions and auto-layouts" },
    { icon: Shield, title: "Secure & Private", description: "Your data stays safe in your browser" },
  ];

  const testimonials = [
    { name: "Sarah Mitchell", role: "Event Planner", content: "This platform transformed how I create invitations. The visual editor is intuitive and results are always stunning.", rating: 5 },
    { name: "David Chen", role: "Small Business Owner", content: "I've created dozens of pages for different occasions. The quality is professional and saves me hours.", rating: 5 },
    { name: "Emma Rodriguez", role: "Marketing Manager", content: "Our team uses this for all event pages. Customization options are endless and the interface is incredibly user-friendly.", rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <FloatingNavbar />

      {/* ===== HERO SECTION ===== */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated mesh background */}
        <div className="absolute inset-0 bg-mesh opacity-60" />
        <div className="absolute inset-0">
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]"
            animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            style={{ top: "10%", left: "15%" }}
          />
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full bg-accent/20 blur-[100px]"
            animate={{ x: [0, -60, 50, 0], y: [0, 50, -30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            style={{ bottom: "10%", right: "10%" }}
          />
        </div>

        <motion.div
          className="relative container mx-auto px-4 pt-32 pb-20"
          style={{ y: textY, opacity: heroOpacity }}
        >
          <div className="text-center max-w-5xl mx-auto">
            {/* Logo float */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotateY: 180 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, type: "spring", stiffness: 100 }}
              className="mb-8 inline-block"
            >
              <motion.img
                src={webilioLogo}
                alt="Webilio"
                className="w-24 h-24 md:w-32 md:h-32 mx-auto drop-shadow-[0_0_40px_hsl(var(--primary)/0.4)]"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <Badge variant="secondary" className="mb-6 px-5 py-2.5 text-sm font-medium rounded-full border border-primary/20 bg-primary/5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2 inline-block" />
                Trusted by 10,000+ creators worldwide
              </Badge>
            </motion.div>

            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-[1.05] tracking-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.9, type: "spring" }}
            >
              <span className="text-gradient">Build Beautiful</span>
              <br />
              <motion.span
                className="text-foreground inline-block"
                initial={{ opacity: 0, rotateX: -90 }}
                animate={{ opacity: 1, rotateX: 0 }}
                transition={{ delay: 0.8, duration: 0.8, type: "spring" }}
                style={{ perspective: "1000px" }}
              >
                Web Experiences
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Create stunning, personalized pages for every occasion with our powerful visual editor. No code needed — just your creativity.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <Button
                size="lg"
                className="text-lg px-10 h-14 rounded-2xl shadow-[0_0_30px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_50px_hsl(var(--primary)/0.6)] transition-all group"
                onClick={() => navigate("/templates")}
              >
                Start Creating Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 h-14 rounded-2xl border-2"
                onClick={() => navigate(isAuthenticated ? "/profile" : "/auth")}
              >
                {isAuthenticated ? "My Projects" : (
                  <><LogIn className="w-5 h-5 mr-2" /> Sign In</>
                )}
              </Button>
            </motion.div>
          </div>

          {/* 3D Video Card */}
          <motion.div
            className="max-w-4xl mx-auto perspective-[1200px]"
            style={{ scale: heroScale, rotateX: heroRotateX }}
            initial={{ opacity: 0, y: 100, rotateX: 25 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 1.1, duration: 1.2, type: "spring", stiffness: 50 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-[0_25px_80px_-12px_hsl(var(--primary)/0.4)] border border-border/30 bg-card/50 backdrop-blur-sm">
              <video
                ref={videoRef}
                className="w-full aspect-video object-cover"
                src="/hero-video.mp4"
                autoPlay
                muted
                loop
                playsInline
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              {/* Glowing ring around video */}
              <div className="absolute -inset-[1px] rounded-2xl border border-primary/20 pointer-events-none" />
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            {[
              { value: "500+", label: "Templates" },
              { value: "10K+", label: "Happy Users" },
              { value: "50K+", label: "Pages Created" },
              { value: "4.9/5", label: "User Rating" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center p-4 rounded-2xl glass-card"
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ opacity: heroOpacity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <ScrollSection>
        <div className="container mx-auto px-4">
          <SectionHeader badge="Simple Process" title="From Idea to Reality" highlight="in Four Steps" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="relative group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <Card className="p-7 h-full card-interactive border-2 hover:border-primary/20 rounded-2xl overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/60 to-primary/0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                  <div className="text-5xl font-black text-primary/10 mb-4">{step.number}</div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </Card>
                {i < steps.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 text-muted-foreground/20 w-6 h-6" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* ===== OCCASIONS ===== */}
      <ScrollSection className="bg-muted/20">
        <div className="container mx-auto px-4">
          <SectionHeader badge="For Every Moment" title="Perfect for" highlight="Every Occasion" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {occasions.map((occ, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card
                  className="p-7 cursor-pointer group card-interactive border-2 hover:border-primary/20 rounded-2xl relative overflow-hidden"
                  onClick={() => navigate(`/templates?category=${occ.title}`)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${occ.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${occ.gradient} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <occ.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{occ.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{occ.description}</p>
                    <div className="flex items-center text-primary text-sm font-medium group-hover:translate-x-2 transition-transform">
                      Explore <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* ===== FEATURES ===== */}
      <ScrollSection>
        <div className="container mx-auto px-4">
          <SectionHeader badge="Powerful Features" title="Everything You Need to" highlight="Create Beautiful Pages" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="text-center group p-8 rounded-2xl border border-transparent hover:border-border/50 hover:bg-card/50 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -6 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)]">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* ===== TESTIMONIALS ===== */}
      <ScrollSection className="bg-muted/20">
        <div className="container mx-auto px-4">
          <SectionHeader badge="Success Stories" title="Loved by" highlight="Thousands" />
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, rotateY: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <Card className="p-7 card-interactive rounded-2xl h-full">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="flex gap-1 mb-4">
                      {[...Array(t.rating)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed flex-1 italic">"{t.content}"</p>
                    <div>
                      <div className="font-bold text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* ===== STATS BANNER ===== */}
      <ScrollSection>
        <div className="container mx-auto px-4">
          <motion.div
            className="rounded-3xl bg-gradient-to-r from-primary via-primary/90 to-primary p-10 md:p-14 shadow-[0_20px_60px_hsl(var(--primary)/0.3)]"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid md:grid-cols-3 gap-10 text-center text-primary-foreground">
              {[
                { icon: TrendingUp, value: "150%", label: "Growth This Year" },
                { icon: Users, value: "10,000+", label: "Active Users" },
                { icon: Clock, value: "5 Min", label: "Avg Creation Time" },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                >
                  <s.icon className="w-10 h-10 mx-auto mb-3 opacity-80" />
                  <div className="text-4xl font-bold mb-1">{s.value}</div>
                  <div className="text-sm opacity-80">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </ScrollSection>

      {/* ===== FINAL CTA ===== */}
      <ScrollSection>
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.img
              src={webilioLogo}
              alt=""
              className="w-16 h-16 mx-auto mb-6 opacity-60"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
              Start Creating{" "}
              <span className="text-gradient">Unforgettable</span>
              <br />Moments Today
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Join thousands of creators who bring their visions to life every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-10 h-14 rounded-2xl shadow-[0_0_30px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_50px_hsl(var(--primary)/0.6)] transition-all group"
                onClick={() => navigate("/templates")}
              >
                Browse Templates
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              {!isAuthenticated && (
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 h-14 rounded-2xl border-2"
                  onClick={() => navigate("/auth")}
                >
                  Create Free Account
                </Button>
              )}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              {["No credit card required", "Free forever plan", "Cancel anytime"].map((text, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </ScrollSection>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={webilioLogo} alt="Webilio" className="w-6 h-6" />
            <span className="text-sm text-muted-foreground">Webilio. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* ===== HELPER COMPONENTS ===== */

const ScrollSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <motion.section
      ref={ref}
      className={`py-20 md:py-28 ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.section>
  );
};

const SectionHeader = ({ badge, title, highlight }: { badge: string; title: string; highlight: string }) => (
  <motion.div
    className="text-center mb-14"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <Badge variant="outline" className="mb-4 rounded-full px-4 py-1.5">{badge}</Badge>
    <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
      {title} <span className="text-gradient">{highlight}</span>
    </h2>
  </motion.div>
);

export default Index;
