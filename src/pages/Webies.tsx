import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
  Bookmark,
  MoreHorizontal,
  Send,
  Hash,
  Users,
} from "lucide-react";
import { webieStorage, type Webie } from "@/lib/webieStorage";
import { userStorage } from "@/lib/storage";
import { notificationStorage } from "@/lib/notificationStorage";
import { toast } from "sonner";

const Webies = () => {
  const navigate = useNavigate();
  const [webies, setWebies] = useState<Webie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"trending" | "recent" | "all">("trending");
  const currentUser = userStorage.getCurrentUser();

  useEffect(() => {
    loadWebies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const webie = webies.find((w) => w.id === webieId);
    const wasLiked = webie?.likes.includes(currentUser.id);
    webieStorage.toggleLike(webieId, currentUser.id);
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
        await navigator.share({ title: webie.title, text: webie.description, url });
        webieStorage.incrementShares(webie.id);
        loadWebies();
      } catch {
        /* cancelled */
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
    if (seconds < 3600) return Math.floor(seconds / 60) + "m";
    if (seconds < 86400) return Math.floor(seconds / 3600) + "h";
    if (seconds < 604800) return Math.floor(seconds / 86400) + "d";
    return new Date(date).toLocaleDateString();
  };

  const trendingTags = Array.from(
    new Set(webies.flatMap((w) => w.tags))
  ).slice(0, 6);

  return (
    <div className="min-h-screen bg-feed">
      <Header />

      <div className="max-w-[1128px] mx-auto px-4 py-6">
        {/* Search bar (mobile) */}
        <div className="md:hidden mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-feed-muted" />
            <Input
              placeholder="Search webies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-feed-surface border-feed-border text-feed-text"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[225px_1fr] lg:grid-cols-[225px_1fr_300px] gap-6">
          {/* LEFT SIDEBAR — profile card */}
          <aside className="hidden md:block space-y-2">
            <div className="bg-feed-surface border border-feed-border rounded-lg overflow-hidden">
              <div className="h-14 bg-feed-hover" />
              <div className="px-4 pb-4 -mt-8">
                <Avatar className="w-16 h-16 border-2 border-feed-surface">
                  <AvatarImage src={currentUser?.avatar} />
                  <AvatarFallback className="bg-feed-hover text-feed-text">
                    {currentUser?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <h3 className="mt-3 font-semibold text-feed-text text-base leading-tight">
                  {currentUser?.name || "Welcome"}
                </h3>
                <p className="text-xs text-feed-muted mt-1">
                  {currentUser ? "Webie Creator" : "Sign in to share your webies"}
                </p>
              </div>
              <Separator className="bg-feed-border" />
              <div className="px-4 py-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-feed-muted">Profile views</span>
                  <span className="text-feed-accent font-semibold">—</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-feed-muted">Webies</span>
                  <span className="text-feed-accent font-semibold">
                    {currentUser ? webieStorage.getByUserId(currentUser.id).length : 0}
                  </span>
                </div>
              </div>
              <Separator className="bg-feed-border" />
              <button
                onClick={() => currentUser ? navigate("/profile") : navigate("/auth")}
                className="w-full px-4 py-2 text-xs font-semibold text-feed-text hover:bg-feed-hover transition-colors text-left flex items-center gap-2"
              >
                <Bookmark className="w-3.5 h-3.5" />
                My items
              </button>
            </div>

            <div className="bg-feed-surface border border-feed-border rounded-lg p-4">
              <p className="text-xs text-feed-muted mb-2">Recent</p>
              <div className="space-y-2">
                {trendingTags.slice(0, 4).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="flex items-center gap-2 text-xs text-feed-text hover:text-feed-accent transition-colors w-full text-left"
                  >
                    <Hash className="w-3 h-3 text-feed-muted" />
                    <span className="truncate">{tag}</span>
                  </button>
                ))}
                {trendingTags.length === 0 && (
                  <p className="text-xs text-feed-muted">No tags yet</p>
                )}
              </div>
            </div>
          </aside>

          {/* MAIN FEED */}
          <main className="space-y-2">
            {/* Composer */}
            <div className="bg-feed-surface border border-feed-border rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Avatar className="w-12 h-12 shrink-0">
                  <AvatarImage src={currentUser?.avatar} />
                  <AvatarFallback className="bg-feed-hover text-feed-text">
                    {currentUser?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => (currentUser ? navigate("/webie/create") : navigate("/auth"))}
                  className="flex-1 h-12 px-4 text-left rounded-full border border-feed-border text-feed-muted text-sm font-medium hover:bg-feed-hover transition-colors"
                >
                  Share a new webie...
                </button>
              </div>
              <div className="flex items-center justify-around mt-2 pt-2">
                <button
                  onClick={() => (currentUser ? navigate("/webie/create") : navigate("/auth"))}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-feed-muted hover:bg-feed-hover transition-colors"
                >
                  <Plus className="w-5 h-5 text-feed-accent" />
                  Create
                </button>
                <button
                  onClick={() => setActiveTab("trending")}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-feed-muted hover:bg-feed-hover transition-colors"
                >
                  <TrendingUp className="w-5 h-5 text-feed-accent" />
                  Trending
                </button>
                <button
                  onClick={() => setActiveTab("recent")}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-feed-muted hover:bg-feed-hover transition-colors"
                >
                  <Clock className="w-5 h-5 text-feed-accent" />
                  Recent
                </button>
              </div>
            </div>

            {/* Sort row */}
            <div className="flex items-center gap-3 px-1">
              <Separator className="flex-1 bg-feed-border" />
              <div className="flex items-center gap-2 text-xs text-feed-muted">
                <span>Sort by:</span>
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value as typeof activeTab)}
                  className="bg-transparent text-feed-text font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="trending">Trending</option>
                  <option value="recent">Most recent</option>
                  <option value="all">All</option>
                </select>
              </div>
            </div>

            {/* Posts */}
            {webies.length === 0 ? (
              <div className="bg-feed-surface border border-feed-border rounded-lg py-16 text-center">
                <Sparkles className="w-12 h-12 mx-auto text-feed-muted mb-3" />
                <h3 className="text-base font-semibold text-feed-text mb-1">No webies found</h3>
                <p className="text-sm text-feed-muted mb-5">
                  Be the first to share your creation
                </p>
                {currentUser && (
                  <Button
                    onClick={() => navigate("/webie/create")}
                    className="bg-feed-accent hover:bg-feed-accent-hover text-white rounded-full"
                  >
                    Create your first webie
                  </Button>
                )}
              </div>
            ) : (
              webies.map((webie) => {
                const liked = webie.likes.includes(currentUser?.id || "");
                return (
                  <article
                    key={webie.id}
                    className="bg-feed-surface border border-feed-border rounded-lg overflow-hidden"
                  >
                    {/* Author */}
                    <div className="flex items-start justify-between p-3">
                      <button
                        onClick={() => navigate(`/profile/${webie.userId}`)}
                        className="flex items-start gap-2 group"
                      >
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={webie.userAvatar} />
                          <AvatarFallback className="bg-feed-hover text-feed-text">
                            {webie.userName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="font-semibold text-sm text-feed-text group-hover:text-feed-accent group-hover:underline">
                            {webie.userName}
                          </p>
                          <p className="text-xs text-feed-muted">Webie creator</p>
                          <p className="text-xs text-feed-muted">
                            {timeAgo(webie.createdAt)} • 🌐
                          </p>
                        </div>
                      </button>
                      <button className="p-1.5 rounded-full hover:bg-feed-hover transition-colors">
                        <MoreHorizontal className="w-5 h-5 text-feed-muted" />
                      </button>
                    </div>

                    {/* Text content */}
                    <div className="px-4 pb-3">
                      <h3
                        onClick={() => navigate(`/webie/${webie.id}`)}
                        className="font-semibold text-feed-text text-[15px] mb-1 cursor-pointer hover:text-feed-accent"
                      >
                        {webie.title}
                      </h3>
                      <p className="text-sm text-feed-text leading-relaxed whitespace-pre-wrap">
                        {webie.description}
                      </p>
                      {webie.tags.length > 0 && (
                        <div className="flex flex-wrap gap-x-1 gap-y-0.5 mt-2">
                          {webie.tags.map((tag) => (
                            <button
                              key={tag}
                              onClick={() => setSearchQuery(tag)}
                              className="text-sm text-feed-accent hover:underline font-medium"
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Media */}
                    <button
                      onClick={() => navigate(`/webie/${webie.id}`)}
                      className="block w-full bg-feed-bg border-y border-feed-border"
                    >
                      <img
                        src={webie.thumbnail}
                        alt={webie.title}
                        className="w-full max-h-[520px] object-cover"
                      />
                    </button>

                    {/* Reactions counter */}
                    <div className="flex items-center justify-between px-4 py-2 text-xs text-feed-muted">
                      <div className="flex items-center gap-1">
                        <span className="inline-flex w-4 h-4 rounded-full bg-feed-accent items-center justify-center">
                          <Heart className="w-2.5 h-2.5 text-white fill-white" />
                        </span>
                        <span className="hover:text-feed-accent hover:underline cursor-pointer">
                          {formatNumber(webie.likes.length)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="hover:text-feed-accent hover:underline cursor-pointer">
                          {formatNumber(webie.comments.length)} comments
                        </span>
                        <span>•</span>
                        <span className="hover:text-feed-accent hover:underline cursor-pointer">
                          {formatNumber(webie.shares)} shares
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {formatNumber(webie.views)}
                        </span>
                      </div>
                    </div>

                    <Separator className="bg-feed-border" />

                    {/* Action bar */}
                    <div className="grid grid-cols-4">
                      <button
                        onClick={(e) => handleLike(webie.id, e)}
                        className={`flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors hover:bg-feed-hover ${
                          liked ? "text-feed-accent" : "text-feed-muted"
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
                        <span className="hidden sm:inline">Like</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/webie/${webie.id}#comments`);
                        }}
                        className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-feed-muted transition-colors hover:bg-feed-hover"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="hidden sm:inline">Comment</span>
                      </button>
                      <button
                        onClick={(e) => handleShare(webie, e)}
                        className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-feed-muted transition-colors hover:bg-feed-hover"
                      >
                        <Share2 className="w-5 h-5" />
                        <span className="hidden sm:inline">Repost</span>
                      </button>
                      <button
                        onClick={(e) => handleShare(webie, e)}
                        className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-feed-muted transition-colors hover:bg-feed-hover"
                      >
                        <Send className="w-5 h-5" />
                        <span className="hidden sm:inline">Send</span>
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="hidden lg:block space-y-2">
            <div className="bg-feed-surface border border-feed-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-feed-text">Webies you might like</h3>
                <Sparkles className="w-4 h-4 text-feed-muted" />
              </div>
              <div className="space-y-3">
                {trendingTags.length === 0 && (
                  <p className="text-xs text-feed-muted">Nothing here yet.</p>
                )}
                {trendingTags.map((tag) => (
                  <div key={tag} className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-feed-text truncate">#{tag}</p>
                      <p className="text-xs text-feed-muted">
                        {webies.filter((w) => w.tags.includes(tag)).length} webies
                      </p>
                    </div>
                    <button
                      onClick={() => setSearchQuery(tag)}
                      className="shrink-0 text-xs font-semibold text-feed-muted border border-feed-muted/60 rounded-full px-3 py-1 hover:bg-feed-hover hover:text-feed-text transition-colors"
                    >
                      Follow
                    </button>
                  </div>
                ))}
              </div>
              <Separator className="bg-feed-border my-3" />
              <button className="text-xs font-semibold text-feed-muted hover:text-feed-text">
                Show more
              </button>
            </div>

            <div className="bg-feed-surface border border-feed-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-feed-text mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Today's top creators
              </h3>
              <p className="text-xs text-feed-muted">
                Discover and follow the most active members of the community.
              </p>
              <Button
                variant="ghost"
                className="mt-3 h-8 px-3 text-xs text-feed-muted hover:bg-feed-hover hover:text-feed-text rounded-full"
                onClick={() => navigate("/templates")}
              >
                Explore templates →
              </Button>
            </div>

            <p className="text-[11px] text-feed-muted px-2">
              About · Accessibility · Help · Privacy · Ads
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Webies;
