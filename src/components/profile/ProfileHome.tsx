import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Clock,
  Sparkles,
  Plus,
  Grid3X3,
  LayoutGrid,
  Flame,
  Bookmark,
  X,
  Compass,
  TrendingUp,
} from "lucide-react";
import { webieStorage, type Webie } from "@/lib/webieStorage";
import { userStorage } from "@/lib/storage";
import { notificationStorage } from "@/lib/notificationStorage";
import { toast } from "sonner";

type SortKey = "trending" | "recent" | "all";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const ProfileHome = () => {
  const navigate = useNavigate();
  const [webies, setWebies] = useState<Webie[]>([]);
  const [allPublic, setAllPublic] = useState<Webie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("trending");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gridView, setGridView] = useState<"grid" | "compact">("grid");
  const currentUser = userStorage.getCurrentUser();

  useEffect(() => {
    setAllPublic(webieStorage.getPublic());
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => {
      let result: Webie[];
      if (searchQuery) result = webieStorage.search(searchQuery);
      else if (sort === "trending") result = webieStorage.getTrending();
      else if (sort === "recent") result = webieStorage.getRecent();
      else result = webieStorage.getPublic();
      if (selectedTag) result = result.filter((w) => w.tags.includes(selectedTag));
      setWebies(result);
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(t);
  }, [sort, searchQuery, selectedTag]);

  const refreshOne = (id: string, patch: Partial<Webie>) => {
    setWebies((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)));
  };

  const handleLike = (webieId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      toast.error("Please login to like");
      navigate("/auth");
      return;
    }
    const webie = webies.find((w) => w.id === webieId);
    if (!webie) return;
    const wasLiked = webie.likes.includes(currentUser.id);
    webieStorage.toggleLike(webieId, currentUser.id);
    if (!wasLiked && webie.userId !== currentUser.id) {
      notificationStorage.notifyLike(
        webie.userId,
        { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
        webie.id,
        webie.title
      );
    }
    refreshOne(webieId, {
      likes: wasLiked
        ? webie.likes.filter((id) => id !== currentUser.id)
        : [...webie.likes, currentUser.id],
    });
  };

  const handleShare = async (webie: Webie, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/webie/${webie.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: webie.title, text: webie.description, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }
      webieStorage.incrementShares(webie.id);
      refreshOne(webie.id, { shares: webie.shares + 1 });
    } catch {
      /* cancelled */
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

  const popularTags = useMemo(() => {
    const map = new Map<string, number>();
    allPublic.forEach((w) => w.tags.forEach((t) => map.set(t, (map.get(t) || 0) + 1)));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [allPublic]);

  const stats = useMemo(
    () => ({
      total: allPublic.length,
      creators: new Set(allPublic.map((w) => w.userId)).size,
      likes: allPublic.reduce((s, w) => s + w.likes.length, 0),
    }),
    [allPublic]
  );

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER — clean, no gradients */}
      <section className="border-b bg-card">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Compass className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Webie Feed
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Explore Webies
              </h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-lg">
                Discover templates crafted by our community. Get inspired and create your own.
              </p>
            </div>

            {/* Stats strip */}
            <div className="flex items-center gap-6">
              <div>
                <p className="text-2xl font-bold text-foreground">{formatNumber(stats.total)}</p>
                <p className="text-xs text-muted-foreground">Webies</p>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div>
                <p className="text-2xl font-bold text-foreground">{formatNumber(stats.creators)}</p>
                <p className="text-xs text-muted-foreground">Creators</p>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div>
                <p className="text-2xl font-bold text-foreground">{formatNumber(stats.likes)}</p>
                <p className="text-xs text-muted-foreground">Likes</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search webies, tags, or creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-background border-border"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
            {currentUser && (
              <Button
                onClick={() => navigate("/webie/create")}
                className="h-11 px-5 gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Webie
              </Button>
            )}
          </div>

          {/* Popular tag pills */}
          {popularTags.length > 0 && (
            <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-medium text-muted-foreground shrink-0">Popular:</span>
              <button
                onClick={() => setSelectedTag(null)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors shrink-0 ${
                  !selectedTag
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-primary/40"
                }`}
              >
                All
              </button>
              {popularTags.map(([tag, count]) => {
                const active = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(active ? null : tag)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors shrink-0 ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:border-primary/40"
                    }`}
                  >
                    #{tag}
                    <span className={`ml-1.5 ${active ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* TOOLBAR */}
      <section className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between gap-3">
          {/* Sort tabs */}
          <div className="inline-flex items-center bg-muted/50 rounded-lg p-1">
            {[
              { key: "trending" as SortKey, label: "Trending", icon: Flame },
              { key: "recent" as SortKey, label: "Recent", icon: Clock },
              { key: "all" as SortKey, label: "All", icon: Sparkles },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  sort === key
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {webies.length} {webies.length === 1 ? "result" : "results"}
            </span>
            <div className="flex items-center bg-muted/50 rounded-lg p-1">
              <Button
                variant={gridView === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setGridView("grid")}
                className="h-7 w-7 p-0"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={gridView === "compact" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setGridView("compact")}
                className="h-7 w-7 p-0"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-6">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div
              className={`grid gap-5 ${
                gridView === "compact"
                  ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {webies.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-5">
                    <Sparkles className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">No webies found</h3>
                  <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
                    {searchQuery || selectedTag
                      ? "Try adjusting your filters or search terms"
                      : "Be the first to share your creation with the community"}
                  </p>
                  {(searchQuery || selectedTag) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedTag(null);
                      }}
                      className="mr-2"
                    >
                      Clear filters
                    </Button>
                  )}
                  {currentUser && (
                    <Button onClick={() => navigate("/webie/create")} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Create webie
                    </Button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className={`grid gap-5 ${
                    gridView === "compact"
                      ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  }`}
                >
                  {webies.map((webie, index) => (
                    <motion.div key={webie.id} variants={item}>
                      <Card
                        className="group cursor-pointer overflow-hidden border bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200"
                        onClick={() => navigate(`/webie/${webie.id}`)}
                      >
                        {/* Thumbnail */}
                        <div className="relative aspect-video overflow-hidden bg-muted">
                          <img
                            src={webie.thumbnail}
                            alt={webie.title}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                          {index < 3 && sort === "trending" && !searchQuery && !selectedTag && (
                            <div className="absolute top-2.5 left-2.5">
                              <Badge className="bg-primary text-primary-foreground border-0 shadow-sm gap-1 font-semibold">
                                <TrendingUp className="w-3 h-3" />
                                Trending
                              </Badge>
                            </div>
                          )}

                          {/* Quick actions */}
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                            <div className="flex items-center gap-1.5">
                              <Button
                                size="sm"
                                variant="secondary"
                                className={`h-8 gap-1 rounded-full text-xs ${
                                  isLiked(webie)
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                    : "bg-background/95 hover:bg-background text-foreground"
                                }`}
                                onClick={(e) => handleLike(webie.id, e)}
                              >
                                <Heart className={`w-3.5 h-3.5 ${isLiked(webie) ? "fill-current" : ""}`} />
                                {formatNumber(webie.likes.length)}
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-8 gap-1 rounded-full text-xs bg-background/95 hover:bg-background text-foreground"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/webie/${webie.id}#comments`);
                                }}
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                {formatNumber(webie.comments.length)}
                              </Button>
                            </div>
                            <div className="flex gap-1.5">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-8 w-8 p-0 rounded-full bg-background/95 hover:bg-background text-foreground"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.success("Saved to bookmarks");
                                }}
                              >
                                <Bookmark className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-8 w-8 p-0 rounded-full bg-background/95 hover:bg-background text-foreground"
                                onClick={(e) => handleShare(webie, e)}
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          {/* Creator */}
                          <div className="flex items-center gap-2.5 mb-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={webie.userAvatar} />
                              <AvatarFallback className="bg-muted text-foreground text-xs">
                                {webie.userName.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate text-foreground">
                                {webie.userName}
                              </p>
                              <p className="text-xs text-muted-foreground">{timeAgo(webie.createdAt)}</p>
                            </div>
                          </div>

                          <h3 className="font-semibold text-base mb-1 line-clamp-1 text-foreground group-hover:text-primary transition-colors">
                            {webie.title}
                          </h3>
                          {gridView === "grid" && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {webie.description}
                            </p>
                          )}

                          {webie.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {webie.tags.slice(0, gridView === "compact" ? 1 : 3).map((tag) => (
                                <button
                                  key={tag}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTag(tag);
                                  }}
                                  className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                                >
                                  #{tag}
                                </button>
                              ))}
                              {webie.tags.length > (gridView === "compact" ? 1 : 3) && (
                                <span className="text-xs px-2 py-0.5 rounded-full text-muted-foreground">
                                  +{webie.tags.length - (gridView === "compact" ? 1 : 3)}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t">
                            <span className="flex items-center gap-1.5">
                              <Heart className="w-3.5 h-3.5" />
                              {formatNumber(webie.likes.length)}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MessageCircle className="w-3.5 h-3.5" />
                              {formatNumber(webie.comments.length)}
                            </span>
                            <span className="flex items-center gap-1.5 ml-auto">
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
