import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  Clock,
  Sparkles,
  Plus,
  Flame,
  X,
  MoreHorizontal,
  Send,
  Hash,
  UserPlus,
  Rocket,
  TrendingUp,
  Filter,
} from "lucide-react";
import { webieStorage, type Webie } from "@/lib/webieStorage";
import { userStorage } from "@/lib/storage";
import { notificationStorage } from "@/lib/notificationStorage";
import { followStorage } from "@/lib/followStorage";
import { toast } from "sonner";

type SortKey = "trending" | "recent" | "all";

const ProfileHome = () => {
  const navigate = useNavigate();
  const [webies, setWebies] = useState<Webie[]>([]);
  const [allPublic, setAllPublic] = useState<Webie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("trending");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const currentUser = userStorage.getCurrentUser();

  useEffect(() => {
    setAllPublic(webieStorage.getPublic());
  }, []);

  useEffect(() => {
    let result: Webie[];
    if (searchQuery.trim()) result = webieStorage.search(searchQuery);
    else if (sort === "trending") result = webieStorage.getTrending();
    else if (sort === "recent") result = webieStorage.getRecent();
    else result = webieStorage.getPublic();
    if (selectedTags.length > 0) {
      result = result.filter((w) => selectedTags.every((t) => w.tags.includes(t)));
    }
    setWebies(result);
  }, [sort, searchQuery, selectedTags]);

  const patch = (id: string, p: Partial<Webie>) =>
    setWebies((prev) => prev.map((w) => (w.id === id ? { ...w, ...p } : w)));

  const handleLike = (webieId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      toast.error("Sign in to like webies");
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
    patch(webieId, {
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
      patch(webie.id, { shares: webie.shares + 1 });
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
    if (seconds < 3600) return Math.floor(seconds / 60) + "m";
    if (seconds < 86400) return Math.floor(seconds / 3600) + "h";
    if (seconds < 604800) return Math.floor(seconds / 86400) + "d";
    return new Date(date).toLocaleDateString();
  };

  const allTags = useMemo(() => {
    const map = new Map<string, number>();
    allPublic.forEach((w) => w.tags.forEach((t) => map.set(t, (map.get(t) || 0) + 1)));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [allPublic]);

  const topCreators = useMemo(() => {
    const map = new Map<string, { id: string; name: string; avatar?: string; count: number; likes: number }>();
    allPublic.forEach((w) => {
      const e = map.get(w.userId) || { id: w.userId, name: w.userName, avatar: w.userAvatar, count: 0, likes: 0 };
      e.count += 1;
      e.likes += w.likes.length;
      map.set(w.userId, e);
    });
    return Array.from(map.values())
      .filter((c) => c.id !== currentUser?.id)
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 4);
  }, [allPublic, currentUser?.id]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleFollow = (userId: string, name: string) => {
    if (!currentUser) {
      navigate("/auth");
      return;
    }
    if (followStorage.isFollowing(currentUser.id, userId)) {
      followStorage.unfollow(currentUser.id, userId);
      toast.success(`Unfollowed ${name}`);
    } else {
      followStorage.follow(currentUser.id, userId);
      toast.success(`Now following ${name}`);
    }
  };

  return (
    <div className="min-h-screen bg-feed">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Mobile search */}
        <div className="lg:hidden mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-feed-muted" />
            <Input
              placeholder="Search webies, tags, creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-feed-surface border-feed-border text-feed-text"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,600px)_320px] gap-6 items-start lg:justify-center">
          {/* ============ CENTER FEED ============ */}
          <main className="space-y-3 min-w-0">
            {/* Composer + filters */}
            <div className="bg-feed-surface border border-feed-border rounded-lg p-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-11 h-11 shrink-0">
                  <AvatarImage src={currentUser?.avatar} />
                  <AvatarFallback className="bg-feed-hover text-feed-text">
                    {currentUser?.name?.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => (currentUser ? navigate("/webie/create") : navigate("/auth"))}
                  className="flex-1 h-11 px-4 text-left rounded-full border border-feed-border text-feed-muted text-sm font-medium hover:bg-feed-hover transition-colors"
                >
                  {currentUser ? `Share something new, ${currentUser.name?.split(" ")[0]}...` : "Sign in to share a webie"}
                </button>
                <Button
                  onClick={() => (currentUser ? navigate("/webie/create") : navigate("/auth"))}
                  className="bg-feed-accent hover:bg-feed-accent-hover text-feed-text rounded-full h-10 px-4 hidden sm:inline-flex"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Create
                </Button>
              </div>

              {/* Inline desktop search + sort */}
              <div className="hidden md:flex items-center gap-2 mt-3 pt-3 border-t border-feed-border">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-feed-muted" />
                  <Input
                    placeholder="Search webies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 bg-feed-bg border-feed-border text-feed-text text-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-feed-hover"
                    >
                      <X className="w-3.5 h-3.5 text-feed-muted" />
                    </button>
                  )}
                </div>
                <div className="inline-flex items-center bg-feed-bg border border-feed-border rounded-md p-0.5">
                  {[
                    { key: "trending" as SortKey, label: "Trending", icon: Flame },
                    { key: "recent" as SortKey, label: "Recent", icon: Clock },
                    { key: "all" as SortKey, label: "All", icon: Sparkles },
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setSort(key)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded transition-colors ${
                        sort === key
                          ? "bg-feed-surface text-feed-accent shadow-sm"
                          : "text-feed-muted hover:text-feed-text"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden lg:inline">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tag chips row */}
              {allTags.length > 0 && (
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-feed-border overflow-x-auto pb-0.5 scrollbar-hide">
                  <Filter className="w-3.5 h-3.5 text-feed-muted shrink-0" />
                  {allTags.slice(0, 12).map(([tag, count]) => {
                    const active = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-colors shrink-0 ${
                          active
                            ? "bg-feed-accent text-feed-text border-feed-accent"
                            : "bg-feed-bg text-feed-text border-feed-border hover:border-feed-accent hover:text-feed-accent"
                        }`}
                      >
                        #{tag}
                        <span className={`ml-1 ${active ? "text-feed-text/70" : "text-feed-muted"}`}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Active filter strip */}
            {(selectedTags.length > 0 || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2 px-1">
                <span className="text-xs text-feed-muted">Filters:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="bg-feed-accent/10 text-feed-accent border-0 gap-1">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery("")}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-feed-accent/10 text-feed-accent border-0 gap-1">
                    #{tag}
                    <button onClick={() => toggleTag(tag)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTags([]);
                  }}
                  className="text-xs text-feed-muted hover:text-feed-accent font-medium ml-auto"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Posts */}
            {webies.length === 0 ? (
              <div className="bg-feed-surface border border-feed-border rounded-lg py-16 text-center">
                <Sparkles className="w-12 h-12 mx-auto text-feed-muted mb-3" />
                <h3 className="text-base font-semibold text-feed-text mb-1">No webies found</h3>
                <p className="text-sm text-feed-muted mb-5">Try a different search or filter</p>
                {currentUser && (
                  <Button
                    onClick={() => navigate("/webie/create")}
                    className="bg-feed-accent hover:bg-feed-accent-hover text-feed-text rounded-full"
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
                        onClick={() => navigate(`/profile/user/${webie.userId}`)}
                        className="flex items-start gap-2 group"
                      >
                        <Avatar className="w-11 h-11">
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
                          <p className="text-xs text-feed-muted">{timeAgo(webie.createdAt)} · 🌐</p>
                        </div>
                      </button>
                      <button className="p-1.5 rounded-full hover:bg-feed-hover transition-colors">
                        <MoreHorizontal className="w-5 h-5 text-feed-muted" />
                      </button>
                    </div>

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
                              onClick={() => toggleTag(tag)}
                              className="text-sm text-feed-accent hover:underline font-medium"
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

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

                    <div className="flex items-center justify-between px-4 py-2 text-xs text-feed-muted">
                      <div className="flex items-center gap-1">
                        <span className="inline-flex w-4 h-4 rounded-full bg-feed-accent items-center justify-center">
                          <Heart className="w-2.5 h-2.5 text-feed-text fill-current" />
                        </span>
                        <span>{formatNumber(webie.likes.length)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span>{formatNumber(webie.comments.length)} comments</span>
                        <span>·</span>
                        <span>{formatNumber(webie.shares)} shares</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {formatNumber(webie.views)}
                        </span>
                      </div>
                    </div>

                    <Separator className="bg-feed-border" />

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

          {/* ============ RIGHT — Suggestions ============ */}
          <aside className="hidden lg:block self-start">
            <div className="space-y-3">
                {!currentUser ? (
                  <>
                    <div className="sticky top-6 bg-feed-surface border border-feed-border rounded-lg p-5 text-center">
                      <div className="w-12 h-12 mx-auto rounded-full bg-feed-accent/10 flex items-center justify-center mb-3">
                        <Rocket className="w-6 h-6 text-feed-accent" />
                      </div>
                      <h3 className="text-base font-semibold text-feed-text mb-1">
                        Join the Webie community
                      </h3>
                      <p className="text-xs text-feed-muted mb-4 leading-relaxed">
                        Follow creators, like posts, and share your own webies.
                      </p>
                      <Button
                        onClick={() => navigate("/auth")}
                        className="w-full bg-feed-accent hover:bg-feed-accent-hover text-feed-text rounded-full font-semibold"
                      >
                        Sign up — it's free
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="sticky top-6 bg-feed-surface border border-feed-border rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-feed-text mb-3 flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-feed-accent" />
                      People to follow
                    </h3>
                    {topCreators.length === 0 ? (
                      <p className="text-xs text-feed-muted">No suggestions yet</p>
                    ) : (
                      <div className="space-y-3">
                        {topCreators.map((c) => (
                          <div key={c.id} className="flex items-center gap-2.5">
                            <Avatar className="w-10 h-10 shrink-0">
                              <AvatarImage src={c.avatar} />
                              <AvatarFallback className="bg-feed-hover text-feed-text text-xs">
                                {c.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <button
                                onClick={() => navigate(`/profile/user/${c.id}`)}
                                className="text-sm font-semibold text-feed-text hover:text-feed-accent hover:underline truncate block text-left"
                              >
                                {c.name}
                              </button>
                              <p className="text-[11px] text-feed-muted">
                                {c.count} webies · {formatNumber(c.likes)} likes
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleFollow(c.id, c.name)}
                              className="h-7 px-3 text-xs rounded-full border-feed-accent text-feed-accent hover:bg-feed-accent hover:text-feed-text"
                            >
                              <Plus className="w-3 h-3 mr-0.5" />
                              Follow
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Trending tags */}
                <div className="sticky top-[calc(1.5rem+var(--follow-card-h,360px))] bg-feed-surface border border-feed-border rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-feed-text mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-feed-accent" />
                    Trending tags
                  </h3>
                  {allTags.length === 0 ? (
                    <p className="text-xs text-feed-muted">No tags yet</p>
                  ) : (
                    <div className="space-y-1">
                      {allTags.slice(0, 6).map(([tag, count]) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className="w-full flex items-center justify-between text-left hover:bg-feed-hover rounded-md px-2 py-1.5 transition-colors"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-feed-text truncate">#{tag}</p>
                            <p className="text-[11px] text-feed-muted">{count} webies</p>
                          </div>
                          <Hash className="w-4 h-4 text-feed-muted shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-feed-muted px-2 leading-relaxed">
                  Webie · About · Help · Privacy · Terms
                </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProfileHome;
