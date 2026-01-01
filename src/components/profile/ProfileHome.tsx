import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Heart, 
  MessageCircle, 
  Share2, 
  Eye, 
  TrendingUp,
  Clock,
  Sparkles,
  Plus,
  Filter,
  Grid3X3,
  LayoutGrid,
  Flame,
  Bookmark
} from "lucide-react";
import { webieStorage, type Webie } from "@/lib/webieStorage";
import { userStorage } from "@/lib/storage";
import { notificationStorage } from "@/lib/notificationStorage";
import { toast } from "sonner";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 }
};

const ProfileHome = () => {
  const navigate = useNavigate();
  const [webies, setWebies] = useState<Webie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("trending");
  const [isLoading, setIsLoading] = useState(true);
  const [gridView, setGridView] = useState<"grid" | "compact">("grid");
  const currentUser = userStorage.getCurrentUser();

  useEffect(() => {
    loadWebies();
  }, [activeTab, searchQuery]);

  const loadWebies = () => {
    setIsLoading(true);
    setTimeout(() => {
      let result: Webie[];
      if (searchQuery) {
        result = webieStorage.search(searchQuery);
      } else if (activeTab === "trending") {
        result = webieStorage.getTrending();
      } else if (activeTab === "recent") {
        result = webieStorage.getRecent();
      } else {
        result = webieStorage.getPublic();
      }
      setWebies(result);
      setIsLoading(false);
    }, 300);
  };

  const handleLike = (webieId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      toast.error("Please login to like");
      navigate("/auth");
      return;
    }
    const webie = webies.find(w => w.id === webieId);
    const wasLiked = webie?.likes.includes(currentUser.id);
    webieStorage.toggleLike(webieId, currentUser.id);
    // Send notification if liking (not unliking)
    if (webie && !wasLiked && webie.userId !== currentUser.id) {
      notificationStorage.notifyLike(
        webie.userId,
        { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
        webie.id,
        webie.title
      );
    }
    loadWebies();
  };

  const handleShare = async (webie: Webie, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/webie/${webie.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: webie.title,
          text: webie.description,
          url: url,
        });
        webieStorage.incrementShares(webie.id);
        loadWebies();
      } catch (err) {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(url);
      webieStorage.incrementShares(webie.id);
      loadWebies();
      toast.success("Link copied to clipboard");
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const timeAgo = (date: string): string => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return Math.floor(seconds / 60) + "m ago";
    if (seconds < 86400) return Math.floor(seconds / 3600) + "h ago";
    if (seconds < 604800) return Math.floor(seconds / 86400) + "d ago";
    return new Date(date).toLocaleDateString();
  };

  const isLiked = (webie: Webie) => currentUser && webie.likes.includes(currentUser.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Mesh Background */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        
        {/* Animated Orbs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl animate-blob" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-pink-500/20 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium border-primary/30 bg-primary/5">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-primary" />
                Discover Amazing Creations
              </Badge>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              <span className="text-gradient">Explore Webies</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Discover stunning templates crafted by our creative community. Get inspired and create your own.
            </p>
            
            {/* Enhanced Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative max-w-xl mx-auto"
            >
              <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-xl opacity-20" />
              <div className="relative flex items-center gap-2 p-2 bg-card rounded-2xl shadow-card border">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search webies, tags, or creators..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 border-0 bg-transparent focus-visible:ring-0 text-base"
                  />
                </div>
                <Button className="h-12 px-6 rounded-xl">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Filters Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-4 rounded-2xl bg-card border shadow-sm"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-muted/50 p-1 rounded-xl">
                <TabsTrigger value="trending" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Flame className="w-4 h-4" />
                  Trending
                </TabsTrigger>
                <TabsTrigger value="recent" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Clock className="w-4 h-4" />
                  Recent
                </TabsTrigger>
                <TabsTrigger value="all" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Grid3X3 className="w-4 h-4" />
                  All
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-muted/50 rounded-lg p-1">
                <Button
                  variant={gridView === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setGridView("grid")}
                  className="h-8 w-8 p-0"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={gridView === "compact" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setGridView("compact")}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </div>
              
              {currentUser && (
                <Button onClick={() => navigate("/webie/create")} className="gap-2 rounded-xl shadow-elegant">
                  <Plus className="w-4 h-4" />
                  Create Webie
                </Button>
              )}
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading ? (
            <div className={`grid gap-6 ${gridView === "compact" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {webies.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 rounded-3xl bg-muted/50 flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">No webies found</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    {searchQuery 
                      ? "Try adjusting your search terms" 
                      : "Be the first to share your creation with the community"}
                  </p>
                  {currentUser && (
                    <Button onClick={() => navigate("/webie/create")} size="lg" className="gap-2 rounded-xl">
                      <Plus className="w-5 h-5" />
                      Create Your First Webie
                    </Button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className={`grid gap-6 ${gridView === "compact" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}
                >
                  {webies.map((webie, index) => (
                    <motion.div key={webie.id} variants={item}>
                      <Card 
                        className="group cursor-pointer overflow-hidden border shadow-card hover:shadow-card-hover transition-all duration-300 card-interactive bg-card"
                        onClick={() => navigate(`/webie/${webie.id}`)}
                      >
                        {/* Thumbnail */}
                        <div className="relative aspect-video overflow-hidden bg-muted">
                          <img
                            src={webie.thumbnail}
                            alt={webie.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* Trending Badge */}
                          {index < 3 && activeTab === "trending" && (
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg">
                                <Flame className="w-3 h-3 mr-1" />
                                Hot
                              </Badge>
                            </div>
                          )}
                          
                          {/* Quick Actions Overlay */}
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant={isLiked(webie) ? "default" : "secondary"}
                                className={`h-9 gap-1.5 rounded-full ${isLiked(webie) ? 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white border-0' : 'bg-white/90 hover:bg-white text-foreground'}`}
                                onClick={(e) => handleLike(webie.id, e)}
                              >
                                <Heart className={`w-4 h-4 ${isLiked(webie) ? "fill-current" : ""}`} />
                                {formatNumber(webie.likes.length)}
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-9 gap-1.5 rounded-full bg-white/90 hover:bg-white text-foreground"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/webie/${webie.id}#comments`);
                                }}
                              >
                                <MessageCircle className="w-4 h-4" />
                                {formatNumber(webie.comments.length)}
                              </Button>
                            </div>
                            <div className="flex gap-1.5">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-9 w-9 p-0 rounded-full bg-white/90 hover:bg-white text-foreground"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.success("Saved to bookmarks");
                                }}
                              >
                                <Bookmark className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-9 w-9 p-0 rounded-full bg-white/90 hover:bg-white text-foreground"
                                onClick={(e) => handleShare(webie, e)}
                              >
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          {/* Creator Info */}
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-9 w-9 ring-2 ring-background">
                              <AvatarImage src={webie.userAvatar} />
                              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm">
                                {webie.userName.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{webie.userName}</p>
                              <p className="text-xs text-muted-foreground">{timeAgo(webie.createdAt)}</p>
                            </div>
                          </div>

                          {/* Title & Description */}
                          <h3 className="font-semibold text-base mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
                            {webie.title}
                          </h3>
                          {gridView === "grid" && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {webie.description}
                            </p>
                          )}

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {webie.tags.slice(0, gridView === "compact" ? 1 : 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs rounded-full px-2 py-0.5">
                                {tag}
                              </Badge>
                            ))}
                            {webie.tags.length > (gridView === "compact" ? 1 : 2) && (
                              <Badge variant="outline" className="text-xs rounded-full px-2 py-0.5">
                                +{webie.tags.length - (gridView === "compact" ? 1 : 2)}
                              </Badge>
                            )}
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t">
                            <span className="flex items-center gap-1.5">
                              <Heart className="w-3.5 h-3.5" />
                              {formatNumber(webie.likes.length)}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MessageCircle className="w-3.5 h-3.5" />
                              {formatNumber(webie.comments.length)}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Eye className="w-3.5 h-3.5" />
                              {formatNumber(webie.views)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfileHome;
