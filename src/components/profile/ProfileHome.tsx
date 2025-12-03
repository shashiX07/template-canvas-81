import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Heart, 
  MessageCircle, 
  Share2, 
  Eye, 
  TrendingUp,
  Clock,
  Sparkles,
  Plus
} from "lucide-react";
import { webieStorage, type Webie } from "@/lib/webieStorage";
import { userStorage } from "@/lib/storage";
import { toast } from "sonner";

const ProfileHome = () => {
  const navigate = useNavigate();
  const [webies, setWebies] = useState<Webie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("trending");
  const currentUser = userStorage.getCurrentUser();

  useEffect(() => {
    loadWebies();
  }, [activeTab, searchQuery]);

  const loadWebies = () => {
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
  };

  const handleLike = (webieId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      toast.error("Please login to like");
      navigate("/auth");
      return;
    }
    webieStorage.toggleLike(webieId, currentUser.id);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-8 overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <Badge variant="secondary" className="mb-3">
              <Sparkles className="w-3 h-3 mr-1" />
              Community Feed
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Discover Webies
            </h1>
            <p className="text-muted-foreground mb-6">
              Explore templates created by our community
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search webies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-11 rounded-full border-2 focus:border-primary"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-muted/50">
                <TabsTrigger value="trending" className="gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Trending
                </TabsTrigger>
                <TabsTrigger value="recent" className="gap-2">
                  <Clock className="w-4 h-4" />
                  Recent
                </TabsTrigger>
                <TabsTrigger value="all" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  All
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {currentUser && (
              <Button onClick={() => navigate("/webie/create")} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Webie
              </Button>
            )}
          </div>

          {/* Webies Grid */}
          <AnimatePresence mode="wait">
            {webies.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Sparkles className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No webies found</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to share your creation
                </p>
                {currentUser && (
                  <Button onClick={() => navigate("/webie/create")}>
                    Create Your First Webie
                  </Button>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {webies.map((webie, index) => (
                  <motion.div
                    key={webie.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card 
                      className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 border hover:border-primary/20"
                      onClick={() => navigate(`/webie/${webie.id}`)}
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        <img
                          src={webie.thumbnail}
                          alt={webie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Quick Actions Overlay */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant={webie.likes.includes(currentUser?.id || "") ? "default" : "secondary"}
                              className="h-8 gap-1"
                              onClick={(e) => handleLike(webie.id, e)}
                            >
                              <Heart className={`w-4 h-4 ${webie.likes.includes(currentUser?.id || "") ? "fill-current" : ""}`} />
                              {formatNumber(webie.likes.length)}
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-8 gap-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/webie/${webie.id}#comments`);
                              }}
                            >
                              <MessageCircle className="w-4 h-4" />
                              {formatNumber(webie.comments.length)}
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8"
                            onClick={(e) => handleShare(webie, e)}
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        {/* Creator Info */}
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={webie.userAvatar} />
                            <AvatarFallback>{webie.userName.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{webie.userName}</p>
                            <p className="text-xs text-muted-foreground">{timeAgo(webie.createdAt)}</p>
                          </div>
                        </div>

                        {/* Title & Description */}
                        <h3 className="font-semibold text-base mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                          {webie.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {webie.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {webie.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {webie.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{webie.tags.length - 2}
                            </Badge>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {formatNumber(webie.likes.length)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {formatNumber(webie.comments.length)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
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
        </div>
      </section>
    </div>
  );
};

export default ProfileHome;