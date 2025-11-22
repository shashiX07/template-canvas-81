import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, Palette, Zap, Shield, Download, Star, LogIn, 
  ArrowRight, Check, Heart, Gift, Users, Clock, 
  TrendingUp, Award, Rocket, ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { initializeMockData } from "@/lib/storage";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    initializeMockData();
  }, []);

  const occasions = [
    {
      title: "Birthdays",
      description: "Celebrate life's precious moments with designs that capture joy and excitement",
      color: "from-pink-500 to-rose-500",
      gradient: "bg-gradient-to-br from-pink-500/10 to-rose-500/10",
    },
    {
      title: "Weddings",
      description: "Create timeless invitations that reflect your unique love story",
      color: "from-purple-500 to-pink-500",
      gradient: "bg-gradient-to-br from-purple-500/10 to-pink-500/10",
    },
    {
      title: "Condolences",
      description: "Honor memories with respectful and comforting designs",
      color: "from-slate-400 to-slate-600",
      gradient: "bg-gradient-to-br from-slate-400/10 to-slate-600/10",
    },
    {
      title: "Anniversaries",
      description: "Mark milestones with elegant designs that celebrate your journey",
      color: "from-red-500 to-pink-500",
      gradient: "bg-gradient-to-br from-red-500/10 to-pink-500/10",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Choose Your Template",
      description: "Browse our curated collection of professionally designed templates for every occasion",
    },
    {
      number: "02",
      title: "Customize Visually",
      description: "Click to edit text, upload images, and adjust colors—no technical skills required",
    },
    {
      number: "03",
      title: "Preview & Perfect",
      description: "See changes instantly and refine every detail until it's exactly right",
    },
    {
      number: "04",
      title: "Share & Celebrate",
      description: "Download your creation and share it with the world in seconds",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Event Planner",
      content: "This platform transformed how I create invitations for my clients. The visual editor is intuitive and the results are always stunning.",
      rating: 5,
    },
    {
      name: "David Chen",
      role: "Small Business Owner",
      content: "I've created dozens of pages for different occasions. The quality is professional and it saves me hours compared to traditional design tools.",
      rating: 5,
    },
    {
      name: "Emma Rodriguez",
      role: "Marketing Manager",
      content: "Our team uses this for all our event pages. The customization options are endless and the interface is incredibly user-friendly.",
      rating: 5,
    },
  ];

  const features = [
    {
      icon: Palette,
      title: "Visual Editing",
      description: "Click, edit, and customize without writing code",
    },
    {
      icon: Zap,
      title: "Instant Preview",
      description: "See your changes in real-time as you edit",
    },
    {
      icon: Download,
      title: "Easy Export",
      description: "Download your finished page instantly",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data stays safe in your browser",
    },
  ];

  const occasionIcons = [Gift, Heart, Heart, Award];
  const stepIcons = [Palette, Zap, Star, Rocket];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 pt-24 pb-32 relative">
          <div className="text-center max-w-5xl mx-auto animate-fade-in">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              Trusted by 10,000+ users worldwide
            </Badge>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Turn Moments Into
              </span>
              <br />
              <span className="text-foreground">Memories That Last</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Create stunning, personalized pages for life's most important occasions. 
              No design experience needed—just your vision and our powerful visual editor.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                size="lg" 
                className="text-lg px-10 h-14 shadow-elegant hover:shadow-glow transition-all group"
                onClick={() => navigate('/templates')}
              >
                Start Creating Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              {isAuthenticated ? (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-10 h-14"
                  onClick={() => navigate('/profile')}
                >
                  My Projects
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-10 h-14"
                  onClick={() => navigate('/auth')}
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </Button>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto pt-8 border-t border-border/40">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-1">500+</div>
                <div className="text-sm text-muted-foreground">Templates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-1">10K+</div>
                <div className="text-sm text-muted-foreground">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-1">50K+</div>
                <div className="text-sm text-muted-foreground">Pages Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-1">4.9/5</div>
                <div className="text-sm text-muted-foreground">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Simple Process</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            From Idea to Reality in <span className="bg-gradient-primary bg-clip-text text-transparent">Four Steps</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Creating beautiful pages has never been easier. Follow our simple process and bring your vision to life.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => {
            const StepIcon = stepIcons[index];
            return (
              <div key={index} className="relative group">
                <Card className="p-8 h-full hover:shadow-elegant transition-all border-2 hover:border-primary/20">
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold shadow-glow">
                    {step.number}
                  </div>
                  <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary">
                    <StepIcon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </Card>
                {index < steps.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-muted-foreground/30 w-8 h-8" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Occasions Section */}
      <section className="container mx-auto px-4 py-24 bg-muted/30">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">For Every Moment</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Perfect for <span className="bg-gradient-primary bg-clip-text text-transparent">Every Occasion</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From joyous celebrations to meaningful tributes, we have templates designed with care for life's important moments.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {occasions.map((occasion, index) => {
            const OccasionIcon = occasionIcons[index];
            return (
              <Card 
                key={index}
                className="p-8 hover:shadow-elegant transition-all cursor-pointer group border-2 hover:border-primary/20 relative overflow-hidden"
                onClick={() => navigate(`/templates?category=${occasion.title}`)}
              >
                <div className={`absolute inset-0 ${occasion.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${occasion.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <OccasionIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{occasion.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">{occasion.description}</p>
                  <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                    Explore Templates
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Powerful Features</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything You Need to <span className="bg-gradient-primary bg-clip-text text-transparent">Create Beautiful Pages</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional-grade tools made simple. No technical knowledge required.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-primary text-primary-foreground mb-6 group-hover:scale-110 transition-transform shadow-elegant">
                <feature.icon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-24 bg-muted/30">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Success Stories</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Loved by <span className="bg-gradient-primary bg-clip-text text-transparent">Thousands</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join our community of creators who bring their visions to life every day.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-8 hover:shadow-elegant transition-all">
              <CardContent className="p-0">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-bold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-24">
        <Card className="p-12 bg-gradient-primary text-primary-foreground shadow-glow">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <div className="text-4xl font-bold mb-2">150%</div>
              <div className="text-lg opacity-90">Growth This Year</div>
            </div>
            <div>
              <Users className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-lg opacity-90">Active Users</div>
            </div>
            <div>
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <div className="text-4xl font-bold mb-2">5 Min</div>
              <div className="text-lg opacity-90">Average Creation Time</div>
            </div>
          </div>
        </Card>
      </section>

      {/* Final CTA Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-6">Ready to Begin?</Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Start Creating <span className="bg-gradient-primary bg-clip-text text-transparent">Unforgettable Moments</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of users who trust us to help them celebrate, connect, and commemorate life's special occasions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-10 h-14 shadow-elegant hover:shadow-glow transition-all group"
              onClick={() => navigate('/templates')}
            >
              Browse Templates
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            {!isAuthenticated && (
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-10 h-14"
                onClick={() => navigate('/auth')}
              >
                Create Free Account
              </Button>
            )}
          </div>
          
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-primary" />
              <span>Free forever plan</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-primary" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
