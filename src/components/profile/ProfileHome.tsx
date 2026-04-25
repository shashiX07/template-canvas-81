import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Sparkles,
  Plus,
  Flame,
  Clock,
  X,
  MoreHorizontal,
  Send,
  Hash,
  UserPlus,
  Rocket,
  TrendingUp,
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
        webie.title,
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
      const e = map.get(w.userId) || {
        id: w.userId,
        name: w.userName,
        avatar: w.userAvatar,
        count: 0,
        likes: 0,
      };
      e.count += 1;
      e.likes += w.likes.length;
      map.set(w.userId, e);
    });
    return Array.from(map.values())
      .filter((c) => c.id !== currentUser?.id)
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 4);
  }, [allPublic, currentUser?.id]);

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

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

  const sortMeta: Record<SortKey, { label: string; icon: typeof Flame }> = {
    trending: { label: "Trending", icon: Flame },
    recent: { label: "Recent", icon: Clock },
    all: { label: "All", icon: Sparkles },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* SUBTLE HEADER */}
      <header className="border-b border-foreground/10 bg-background/95 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center gap-3 shrink-0">
            <span className="w-8 h-px bg-foreground" />
            <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60">
              The feed · Today
            </span>
            {currentUser && (
              <span className="hidden md:inline text-sm text-foreground/55">
                · <span className="italic font-display">welcome,</span>{" "}
                {currentUser.name?.split(" ")[0]}
              </span>
            )}
          </div>

          <div className="flex-1 flex items-center gap-2 md:justify-end">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <Input
                placeholder="Search webies, tags, creators…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-foreground/5"
                >
                  <X className="w-4 h-4 text-foreground/50" />
                </button>
              )}
            </div>
            <Button
              onClick={() => (currentUser ? navigate("/webie/create") : navigate("/auth"))}
              className="hidden sm:inline-flex"
            >
              <Plus className="w-4 h-4" />
              New
            </Button>
          </div>
        </div>

        {/* Sort + tag rail */}
        <div className="max-w-[1200px] mx-auto px-6 pb-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {(Object.keys(sortMeta) as SortKey[]).map((key) => {
            const Icon = sortMeta[key].icon;
            const active = sort === key;
            return (
              <Button
                key={key}
                size="sm"
                variant={active ? "default" : "outline"}
                onClick={() => setSort(key)}
                className="shrink-0"
              >
                <Icon className="w-3.5 h-3.5" />
                {sortMeta[key].label}
              </Button>
            );
          })}
          {allTags.length > 0 && (
            <>
              <span className="w-px h-5 bg-foreground/10 shrink-0 mx-1" />
              {allTags.slice(0, 10).map(([tag, count]) => {
                const active = selectedTags.includes(tag);
                return (
                  <Button
                    key={tag}
                    size="sm"
                    variant={active ? "default" : "outline"}
                    onClick={() => toggleTag(tag)}
                    className="shrink-0"
                  >
                    #{tag}
                    <span className={active ? "text-background/70" : "text-foreground/40"}>
                      {count}
                    </span>
                  </Button>
                );
              })}
            </>
          )}
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
          {/* ============ CENTER FEED ============ */}
          <main className="space-y-6 min-w-0">
            {/* Composer */}
            <section className="border border-foreground/10 rounded-2xl p-5 bg-muted/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/55">
                  Compose · No.01
                </span>
                <span className="flex-1 h-px bg-foreground/10" />
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 shrink-0 ring-1 ring-foreground/10">
                  <AvatarImage src={currentUser?.avatar} />
                  <AvatarFallback className="bg-background text-foreground font-display italic">
                    {currentUser?.name?.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => (currentUser ? navigate("/webie/create") : navigate("/auth"))}
                  className="flex-1 h-12 px-5 text-left rounded-full border border-foreground/15 bg-background text-foreground/45 text-sm hover:border-foreground/40 transition-colors"
                >
                  {currentUser
                    ? `Share something quietly beautiful, ${currentUser.name?.split(" ")[0]}…`
                    : "Sign in to share a webie"}
                </button>
                <Button
                  onClick={() => (currentUser ? navigate("/webie/create") : navigate("/auth"))}
                  className="hidden sm:inline-flex"
                  size="lg"
                >
                  <Plus className="w-4 h-4" />
                  Create
                </Button>
              </div>

              {/* Active filters */}
              {(selectedTags.length > 0 || searchQuery) && (
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-foreground/10">
                  <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/50">
                    Filters ·
                  </span>
                  {searchQuery && (
                    <Button size="sm" variant="default" onClick={() => setSearchQuery("")}>
                      "{searchQuery}"
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                  {selectedTags.map((tag) => (
                    <Button
                      key={tag}
                      size="sm"
                      variant="default"
                      onClick={() => toggleTag(tag)}
                    >
                      #{tag}
                      <X className="w-3 h-3" />
                    </Button>
                  ))}
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedTags([]);
                    }}
                    className="ml-auto font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/50 hover:text-foreground"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </section>

            {/* Section title */}
            <div className="flex items-end justify-between pt-2">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="w-6 h-px bg-foreground" />
                  <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60">
                    {sortMeta[sort].label} · This week
                  </span>
                </div>
                <h2 className="font-display text-3xl font-light tracking-tight">
                  {sort === "trending" ? (
                    <>
                      What's <span className="italic">moving</span>.
                    </>
                  ) : sort === "recent" ? (
                    <>
                      Just <span className="italic">posted</span>.
                    </>
                  ) : (
                    <>
                      Everything <span className="italic">made</span>.
                    </>
                  )}
                </h2>
              </div>
              <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/40 hidden md:inline">
                {webies.length} entries
              </span>
            </div>

            {/* Posts */}
            {webies.length === 0 ? (
              <div className="border border-dashed border-foreground/15 rounded-2xl py-20 text-center bg-muted/30">
                <Sparkles className="w-10 h-10 mx-auto text-foreground/30 mb-3" />
                <h3 className="font-display text-2xl text-foreground mb-1">
                  Nothing <span className="italic">here yet</span>
                </h3>
                <p className="text-sm text-foreground/55 mb-5">
                  Try a different search or filter
                </p>
                {currentUser && (
                  <Button onClick={() => navigate("/webie/create")}>
                    <Plus className="w-4 h-4" />
                    Make the first one
                  </Button>
                )}
              </div>
            ) : (
              webies.map((webie, idx) => {
                const liked = webie.likes.includes(currentUser?.id || "");
                return (
                  <article
                    key={webie.id}
                    className="group border border-foreground/10 rounded-2xl overflow-hidden bg-background hover:shadow-2xl transition-all duration-500"
                  >
                    {/* Editorial number band */}
                    <div className="flex items-center justify-between px-5 pt-4 pb-2">
                      <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/50">
                        №{String(idx + 1).padStart(2, "0")} · {timeAgo(webie.createdAt)}
                      </span>
                      <button className="p-1.5 rounded-full hover:bg-foreground/5 transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-foreground/50" />
                      </button>
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-3 px-5 pb-3">
                      <button
                        onClick={() => navigate(`/profile/user/${webie.userId}`)}
                        className="flex items-center gap-3 group/author"
                      >
                        <Avatar className="w-11 h-11 ring-1 ring-foreground/10">
                          <AvatarImage src={webie.userAvatar} />
                          <AvatarFallback className="bg-muted text-foreground font-display italic">
                            {webie.userName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="font-medium text-sm text-foreground group-hover/author:underline">
                            {webie.userName}
                          </p>
                          <p className="font-mono-accent text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                            Webie creator
                          </p>
                        </div>
                      </button>
                    </div>

                    {/* Body */}
                    <div className="px-5 pb-4">
                      <h3
                        onClick={() => navigate(`/webie/${webie.id}`)}
                        className="font-display text-2xl md:text-3xl font-light leading-[1.1] tracking-tight mb-2 cursor-pointer hover:italic transition-all"
                      >
                        {webie.title}
                      </h3>
                      <p className="text-foreground/70 text-[15px] leading-[1.65] whitespace-pre-wrap">
                        {webie.description}
                      </p>
                      {webie.tags.length > 0 && (
                        <div className="flex flex-wrap gap-x-1 gap-y-0.5 mt-3">
                          {webie.tags.map((tag) => (
                            <button
                              key={tag}
                              onClick={() => toggleTag(tag)}
                              className="font-mono-accent text-xs uppercase tracking-[0.15em] text-foreground/55 hover:text-foreground transition-colors"
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Image */}
                    <button
                      onClick={() => navigate(`/webie/${webie.id}`)}
                      className="block w-full bg-muted overflow-hidden"
                    >
                      <img
                        src={webie.thumbnail}
                        alt={webie.title}
                        className="w-full max-h-[560px] object-cover group-hover:scale-[1.02] transition-transform duration-700"
                      />
                    </button>

                    {/* Stats line */}
                    <div className="flex items-center justify-between px-5 py-3 border-t border-foreground/10 font-mono-accent text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                      <span>{formatNumber(webie.likes.length)} likes</span>
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

                    {/* Actions */}
                    <div className="grid grid-cols-4 border-t border-foreground/10">
                      <button
                        onClick={(e) => handleLike(webie.id, e)}
                        className={`flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors hover:bg-foreground/[0.04] ${
                          liked ? "text-foreground" : "text-foreground/55"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                        <span className="hidden sm:inline">Like</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/webie/${webie.id}#comments`);
                        }}
                        className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-foreground/55 transition-colors hover:bg-foreground/[0.04]"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Reply</span>
                      </button>
                      <button
                        onClick={(e) => handleShare(webie, e)}
                        className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-foreground/55 transition-colors hover:bg-foreground/[0.04]"
                      >
                        <Share2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Repost</span>
                      </button>
                      <button
                        onClick={(e) => handleShare(webie, e)}
                        className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-foreground/55 transition-colors hover:bg-foreground/[0.04]"
                      >
                        <Send className="w-4 h-4" />
                        <span className="hidden sm:inline">Send</span>
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </main>

          {/* ============ RIGHT — Suggestions ============ */}
          <aside className="hidden lg:block self-start sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto scrollbar-hide">
            <div className="space-y-5">
              {!currentUser ? (
                <div className="rounded-2xl border border-foreground/10 p-6 text-center bg-muted/30">
                  <div className="w-12 h-12 mx-auto rounded-full bg-foreground/5 flex items-center justify-center mb-4">
                    <Rocket className="w-5 h-5 text-foreground/70" />
                  </div>
                  <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/50">
                    Invitation
                  </span>
                  <h3 className="font-display text-2xl mt-2 mb-2 leading-tight">
                    Join the <span className="italic">circle</span>.
                  </h3>
                  <p className="text-xs text-foreground/55 mb-4 leading-relaxed">
                    Follow makers, save what moves you, post the things you make.
                  </p>
                  <Button onClick={() => navigate("/auth")} className="w-full">
                    Sign up — it's free
                  </Button>
                </div>
              ) : (
                <div className="rounded-2xl border border-foreground/10 p-5 bg-background">
                  <div className="flex items-center gap-3 mb-4">
                    <UserPlus className="w-3.5 h-3.5 text-foreground/60" />
                    <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/55">
                      People to follow
                    </span>
                  </div>
                  {topCreators.length === 0 ? (
                    <p className="text-xs text-foreground/55">No suggestions yet</p>
                  ) : (
                    <div className="space-y-3">
                      {topCreators.map((c) => (
                        <div key={c.id} className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 shrink-0 ring-1 ring-foreground/10">
                            <AvatarImage src={c.avatar} />
                            <AvatarFallback className="bg-muted text-foreground text-xs font-display italic">
                              {c.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <button
                              onClick={() => navigate(`/profile/user/${c.id}`)}
                              className="text-sm font-medium text-foreground hover:underline truncate block text-left"
                            >
                              {c.name}
                            </button>
                            <p className="font-mono-accent text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                              {c.count} webies · {formatNumber(c.likes)} likes
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFollow(c.id, c.name)}
                          >
                            <Plus className="w-3 h-3" />
                            Follow
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Trending tags */}
              <div className="rounded-2xl border border-foreground/10 p-5 bg-background">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-3.5 h-3.5 text-foreground/60" />
                  <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/55">
                    Trending tags
                  </span>
                </div>
                {allTags.length === 0 ? (
                  <p className="text-xs text-foreground/55">No tags yet</p>
                ) : (
                  <div className="space-y-1">
                    {allTags.slice(0, 6).map(([tag, count]) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className="w-full flex items-center justify-between text-left hover:bg-foreground/[0.04] rounded-lg px-2 py-2 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            #{tag}
                          </p>
                          <p className="font-mono-accent text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                            {count} webies
                          </p>
                        </div>
                        <Hash className="w-4 h-4 text-foreground/40 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <p className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/40 px-2">
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
