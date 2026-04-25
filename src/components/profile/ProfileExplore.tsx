import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Eye,
  Pencil,
  Star,
  Download,
  Users,
  FileText,
  UserPlus,
  UserCheck,
  Crown,
  Cake,
  Heart,
  Flower2,
  Briefcase,
  PartyPopper,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { templateStorage, userStorage, type Template, type User } from "@/lib/storage";
import { followStorage } from "@/lib/followStorage";
import { toast } from "sonner";

type SortKey = "popular" | "rating" | "newest";

const CATEGORIES = [
  { key: "all", label: "All", icon: Sparkles },
  { key: "Birthday", label: "Birthday", icon: Cake },
  { key: "Wedding", label: "Wedding", icon: Heart },
  { key: "Condolence", label: "Condolence", icon: Flower2 },
  { key: "Anniversary", label: "Anniversary", icon: PartyPopper },
  { key: "Corporate", label: "Corporate", icon: Briefcase },
];

const ProfileExplore = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"templates" | "users">("templates");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("popular");
  const [users, setUsers] = useState<User[]>([]);
  const currentUser = userStorage.getCurrentUser();

  useEffect(() => {
    if (activeTab === "templates") loadTemplates();
    else loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchQuery, sortBy, activeTab]);

  const loadTemplates = () => {
    let filtered = templateStorage.getPublic();
    if (selectedCategory !== "all") {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }
    if (searchQuery) filtered = templateStorage.search(searchQuery);
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.downloads - a.downloads;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
    setTemplates(filtered);
  };

  const loadUsers = () => {
    let allUsers = userStorage.getAll().filter((u) => u.id !== currentUser?.id);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      allUsers = allUsers.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    setUsers(allUsers);
  };

  const handleFollow = (userId: string) => {
    if (!currentUser) {
      toast.error("Please login to follow users");
      navigate("/auth");
      return;
    }
    const isFollowing = followStorage.isFollowing(currentUser.id, userId);
    if (isFollowing) {
      followStorage.unfollow(currentUser.id, userId);
      toast.success("Unfollowed");
    } else {
      followStorage.follow(currentUser.id, userId);
      toast.success("Following!");
    }
    loadUsers();
  };

  const featured = useMemo(() => templates.slice(0, 3), [templates]);

  return (
    <div className="min-h-screen bg-background">
      {/* HERO HEADER — editorial */}
      <section className="relative bg-background border-b border-foreground/10 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-[1200px] mx-auto px-6 py-14">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-12 h-px bg-foreground" />
            <span className="font-mono-accent text-xs uppercase tracking-[0.25em] text-foreground/70">
              The library · Vol. 01
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-light leading-[1.02] tracking-tight">
            Explore <span className="italic">the work</span>
            <span className="relative inline-block ml-3">
              <span className="absolute -inset-x-3 inset-y-2 bg-primary/85 -z-10 rounded-full" />
              <span className="font-medium text-primary-foreground px-2 relative">others</span>
            </span>
            <span className="italic"> made.</span>
          </h1>
          <p className="mt-6 text-foreground/70 text-lg leading-[1.7] max-w-xl">
            Browse beautifully crafted templates and meet the creators behind them.
            Pick something close to your heart, then make it your own.
          </p>

          {/* Search + tabs */}
          <div className="mt-10 flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <Input
                placeholder={
                  activeTab === "templates"
                    ? "Search templates by name, tag, or category..."
                    : "Search creators by name..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 rounded-full bg-background border-foreground/15 text-foreground focus-visible:ring-primary"
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

            {/* Tab pill */}
            <div className="inline-flex items-center bg-muted border border-foreground/10 rounded-full p-1 self-start md:self-auto">
              <button
                onClick={() => setActiveTab("templates")}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                  activeTab === "templates"
                    ? "bg-foreground text-background shadow-sm"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                <FileText className="w-4 h-4" />
                Templates
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                  activeTab === "users"
                    ? "bg-foreground text-background shadow-sm"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                <Users className="w-4 h-4" />
                Creators
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TEMPLATES VIEW */}
      {activeTab === "templates" ? (
        <>
          {/* Category strip */}
          <section className="border-b border-foreground/10 bg-background/95 backdrop-blur-md sticky top-0 z-10">
            <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {CATEGORIES.map(({ key, label, icon: Icon }) => {
                const active = selectedCategory === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all shrink-0 ${
                      active
                        ? "bg-foreground text-background border-foreground"
                        : "bg-background text-foreground border-foreground/15 hover:border-foreground/40"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                );
              })}

              <div className="ml-auto inline-flex items-center bg-muted border border-foreground/10 rounded-full p-0.5 shrink-0">
                {[
                  { key: "popular" as SortKey, label: "Popular", icon: TrendingUp },
                  { key: "rating" as SortKey, label: "Top rated", icon: Star },
                  { key: "newest" as SortKey, label: "Newest", icon: Sparkles },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setSortBy(key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                      sortBy === key
                        ? "bg-foreground text-background shadow-sm"
                        : "text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Featured row */}
          {featured.length > 0 && selectedCategory === "all" && !searchQuery && (
            <section className="max-w-[1200px] mx-auto px-6 pt-10">
              <div className="flex items-end justify-between mb-5">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-px bg-foreground" />
                    <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60">
                      Trending · This week
                    </span>
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-light tracking-tight">
                    Picks <span className="italic">we love</span>
                  </h2>
                </div>
                <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/40 hidden md:inline">
                  {featured.length} selected
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {featured.map((template, idx) => (
                  <Card
                    key={template.id}
                    className="group overflow-hidden border border-foreground/10 bg-background rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer"
                    onClick={() => navigate(`/template/${template.id}`)}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      <ThumbImage src={template.thumbnail} alt={template.title} category={template.category} />
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full font-mono-accent uppercase tracking-wider">
                        №{idx + 1}
                      </span>
                      {template.isPremium && (
                        <Badge className="absolute top-3 right-3 bg-foreground text-background border-0 gap-1 rounded-full">
                          <Crown className="w-3 h-3" />
                          Premium
                        </Badge>
                      )}
                      {/* gradient veil for legibility */}
                      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <h3 className="font-display italic text-xl text-background line-clamp-1">
                          {template.title}
                        </h3>
                        <div className="flex items-center gap-3 text-[11px] text-background/80 mt-1 font-mono-accent uppercase tracking-wider">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-primary text-primary" />
                            {template.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {template.downloads}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Templates grid */}
          <section className="max-w-[1200px] mx-auto px-6 py-12">
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 h-px bg-foreground" />
                  <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60">
                    {selectedCategory === "all" ? "The Library" : "Category"}
                  </span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-light tracking-tight">
                  {selectedCategory === "all" ? (
                    <>All <span className="italic">templates</span></>
                  ) : (
                    <>{selectedCategory} <span className="italic">stories</span></>
                  )}
                </h2>
              </div>
              <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/40">
                {templates.length} templates
              </span>
            </div>

            {templates.length === 0 ? (
              <div className="bg-muted/40 border border-dashed border-foreground/15 rounded-2xl py-20 text-center">
                <FileText className="w-12 h-12 mx-auto text-foreground/30 mb-3" />
                <h3 className="font-display text-2xl text-foreground mb-1">Nothing here yet</h3>
                <p className="text-sm text-foreground/60">Try a different filter or search term</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className="group overflow-hidden border border-foreground/10 bg-background rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <ThumbImage src={template.thumbnail} alt={template.title} category={template.category} />
                      {template.isPremium && (
                        <Badge className="absolute top-3 right-3 bg-foreground text-background border-0 gap-1 text-[10px] rounded-full">
                          <Crown className="w-3 h-3" />
                          Premium
                        </Badge>
                      )}
                      <Badge
                        variant="secondary"
                        className="absolute top-3 left-3 bg-background/95 text-foreground border-0 text-[10px] font-mono-accent uppercase tracking-wider rounded-full"
                      >
                        {template.category}
                      </Badge>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-foreground/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-background hover:bg-background/90 text-foreground rounded-full h-9"
                          onClick={() => navigate(`/template/${template.id}/preview`)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-9 font-semibold"
                          onClick={() => navigate(`/editor/${template.id}`)}
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-display text-lg text-foreground mb-1 line-clamp-1 leading-tight">
                        {template.title}
                      </h3>
                      <p className="text-xs text-foreground/60 line-clamp-2 mb-4 min-h-[2rem] leading-relaxed">
                        {template.description}
                      </p>
                      <div className="flex items-center justify-between text-xs pt-3 border-t border-foreground/10">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                          <span className="font-semibold text-foreground">{template.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-foreground/60 font-mono-accent uppercase tracking-wider text-[10px]">
                          <Download className="w-3.5 h-3.5" />
                          <span>{template.downloads.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </>
      ) : (
        // ==================== CREATORS VIEW ====================
        <section className="max-w-[1200px] mx-auto px-6 py-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-px bg-foreground" />
                <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60">
                  Voices
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-light tracking-tight">
                {searchQuery ? <>Search <span className="italic">results</span></> : <>Discover <span className="italic">creators</span></>}
              </h2>
            </div>
            <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/40">
              {users.length} creators
            </span>
          </div>

          {users.length === 0 ? (
            <div className="bg-muted/40 border border-dashed border-foreground/15 rounded-2xl py-20 text-center">
              <Users className="w-12 h-12 mx-auto text-foreground/30 mb-3" />
              <h3 className="font-display text-2xl text-foreground mb-1">No creators found</h3>
              <p className="text-sm text-foreground/60">Try a different search</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {users.map((user) => {
                const isFollowing = currentUser
                  ? followStorage.isFollowing(currentUser.id, user.id)
                  : false;
                const followerCount = followStorage.getFollowerCount(user.id);
                const followingCount = followStorage.getFollowingCount(user.id);

                return (
                  <Card
                    key={user.id}
                    className="overflow-hidden border border-foreground/10 bg-background rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-500"
                  >
                    {/* Banner */}
                    <div className="h-20 bg-gradient-to-br from-primary/40 via-primary/20 to-muted relative overflow-hidden">
                      <div className="absolute inset-0 opacity-30 mix-blend-overlay [background:radial-gradient(circle_at_30%_50%,hsl(var(--primary))_0%,transparent_60%)]" />
                    </div>
                    <CardContent className="p-4 -mt-10">
                      <Avatar
                        className="h-20 w-20 border-4 border-background cursor-pointer mb-3 shadow-md"
                        onClick={() => navigate(`/profile/user/${user.id}`)}
                      >
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-primary/20 text-foreground text-lg font-display">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3
                            className="font-display text-lg text-foreground truncate cursor-pointer hover:italic"
                            onClick={() => navigate(`/profile/user/${user.id}`)}
                          >
                            {user.name}
                          </h3>
                          <p className="text-xs text-foreground/50 truncate font-mono-accent">{user.email}</p>
                        </div>
                        {currentUser && currentUser.id !== user.id && (
                          <Button
                            variant={isFollowing ? "outline" : "default"}
                            size="sm"
                            onClick={() => handleFollow(user.id)}
                            className={`shrink-0 h-8 rounded-full text-xs font-semibold ${
                              isFollowing
                                ? "border-foreground/20 text-foreground/60 hover:bg-muted"
                                : "bg-foreground hover:bg-foreground/90 text-background"
                            }`}
                          >
                            {isFollowing ? (
                              <>
                                <UserCheck className="w-3.5 h-3.5 mr-1" />
                                Following
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-3.5 h-3.5 mr-1" />
                                Follow
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      <div className="flex items-center gap-5 mt-4 pt-4 border-t border-foreground/10 text-xs">
                        <div>
                          <p className="font-display text-xl text-foreground leading-none">{followerCount}</p>
                          <p className="text-foreground/50 font-mono-accent uppercase tracking-wider text-[10px] mt-1">Followers</p>
                        </div>
                        <div>
                          <p className="font-display text-xl text-foreground leading-none">{followingCount}</p>
                          <p className="text-foreground/50 font-mono-accent uppercase tracking-wider text-[10px] mt-1">Following</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/profile/user/${user.id}`)}
                          className="ml-auto h-7 text-xs text-foreground/60 hover:text-foreground hover:bg-muted"
                        >
                          View profile →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default ProfileExplore;
