import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Palette, Zap, Shield, Download, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { initializeMockData } from "@/lib/storage";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    initializeMockData();
  }, []);

  const occasions = [
    {
      title: "Birthdays",
      description: "Celebrate special moments with vibrant, joyful designs",
      icon: "🎂",
      color: "from-pink-500 to-rose-500",
    },
    {
      title: "Weddings",
      description: "Elegant invitations for your perfect day",
      icon: "💍",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Condolences",
      description: "Express sympathy with respectful, peaceful designs",
      icon: "🕊️",
      color: "from-slate-400 to-slate-600",
    },
    {
      title: "Anniversaries",
      description: "Romantic templates for milestone celebrations",
      icon: "❤️",
      color: "from-red-500 to-pink-500",
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

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Build Beautiful Pages Visually</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Create Stunning Pages
            <br />
            For Every Occasion
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            No coding required. Choose from our beautiful templates, customize with clicks, 
            and create memorable pages for birthdays, weddings, and more.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 shadow-elegant hover:shadow-glow transition-all"
              onClick={() => navigate('/templates')}
            >
              Browse Templates
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8"
              onClick={() => navigate('/profile')}
            >
              View My Projects
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 mt-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-primary text-primary" />
              <span>500+ Templates</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-primary" />
              <span>10K+ Downloads</span>
            </div>
          </div>
        </div>
      </section>

      {/* Occasions Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Perfect for Every Occasion</h2>
          <p className="text-xl text-muted-foreground">
            Choose from professionally designed templates
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {occasions.map((occasion, index) => (
            <Card 
              key={index}
              className="p-6 hover:shadow-elegant transition-all cursor-pointer group"
              onClick={() => navigate(`/templates?category=${occasion.title}`)}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${occasion.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                {occasion.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{occasion.title}</h3>
              <p className="text-muted-foreground">{occasion.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose Our Platform?</h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to create amazing pages
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="p-12 bg-gradient-primary text-primary-foreground shadow-glow">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users creating beautiful pages every day
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-8"
            onClick={() => navigate('/templates')}
          >
            Start Creating Now
          </Button>
        </Card>
      </section>
    </div>
  );
};

export default Index;
