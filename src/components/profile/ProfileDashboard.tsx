import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, Edit, Save, TrendingUp, ArrowRight, 
  Sparkles, Palette, Eye, Calendar, Zap, Star,
  Plus, Folder, Clock, ChevronRight
} from "lucide-react";
import { userStorage, customizedTemplateStorage } from "@/lib/storage";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function ProfileDashboard() {
  const navigate = useNavigate();
  const user = userStorage.getCurrentUser();
  const customized = customizedTemplateStorage.getByUserId(user?.id || "");
  const drafts = customized.filter(t => t.isDraft);
  const completed = customized.filter(t => !t.isDraft);
  const thisMonth = customized.filter(t => {
    const date = new Date(t.createdAt);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });

  const stats = [
    {
      title: "Total Templates",
      value: customized.length,
      icon: FileText,
      description: "All your templates",
    },
    {
      title: "Completed",
      value: completed.length,
      icon: Edit,
      description: "Finished designs",
    },
    {
      title: "Drafts",
      value: drafts.length,
      icon: Save,
      description: "Work in progress",
    },
    {
      title: "This Month",
      value: thisMonth.length,
      icon: TrendingUp,
      description: "Created recently",
    },
  ];

  const quickActions = [
    {
      title: "Browse Templates",
      description: "Discover stunning designs for your next project",
      icon: Palette,
      action: () => navigate("/templates"),
    },
    {
      title: "Create Webie",
      description: "Share your creativity with the community",
      icon: Sparkles,
      action: () => navigate("/webie/create"),
    },
    {
      title: "Explore Webies",
      description: "Discover templates from other creators",
      icon: Eye,
      action: () => navigate("/webies"),
    },
  ];

  const recentTemplates = customized.slice(0, 3);

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return Math.floor(seconds / 60) + "m ago";
    if (seconds < 86400) return Math.floor(seconds / 3600) + "h ago";
    return Math.floor(seconds / 86400) + "d ago";
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-primary p-8 text-primary-foreground"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="secondary" className="bg-primary-foreground/15 text-primary-foreground border-0">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Pro Creator
            </Badge>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'Creator'}! 👋
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-xl">
            Ready to create something amazing today? Your creative journey continues here.
          </p>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
          <Sparkles className="w-32 h-32" />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={item}>
            <Card className="group relative overflow-hidden border border-border shadow-card hover:shadow-card-hover transition-all duration-300 card-interactive">
              <CardContent className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-muted-foreground">{stat.description}</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Quick Actions
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Card 
              key={index}
              className="group cursor-pointer border border-border shadow-card hover:shadow-card-hover hover:border-primary/40 transition-all duration-300 card-interactive overflow-hidden"
              onClick={action.action}
            >
              <CardContent className="p-6 relative">
                <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <action.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {action.description}
                </p>
                <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity & Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Templates */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="border-0 shadow-card h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                Recent Activity
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/profile/templates")}>
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {recentTemplates.length > 0 ? (
                <div className="space-y-3">
                  {recentTemplates.map((template, index) => (
                    <div 
                      key={template.id}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/editor/${template.id}`)}
                    >
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Folder className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate group-hover:text-primary transition-colors">
                          {`Template ${index + 1}`}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {getTimeAgo(template.createdAt)}
                        </p>
                      </div>
                      <Badge variant={template.isDraft ? "secondary" : "default"} className="shrink-0">
                        {template.isDraft ? "Draft" : "Complete"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <h4 className="font-medium mb-1">No templates yet</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start by browsing our template collection
                  </p>
                  <Button onClick={() => navigate("/templates")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Browse Templates
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Pro Tips */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border border-primary/20 shadow-card bg-primary/5 h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Use the Visual Editor</h4>
                    <p className="text-xs text-muted-foreground">
                      Double-click any element to edit it directly
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Copy & Paste Elements</h4>
                    <p className="text-xs text-muted-foreground">
                      Use Ctrl+C and Ctrl+V to duplicate elements
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Share Your Webies</h4>
                    <p className="text-xs text-muted-foreground">
                      Create and share templates with the community
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-primary/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Profile Completion</span>
                  <span className="text-sm text-muted-foreground">75%</span>
                </div>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Complete your profile to unlock all features
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
