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
    <div className="min-h-screen bg-feed">
      {/* HERO HEADER */}
      <section className="bg-feed-surface border-b border-feed-border">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-feed-accent/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-feed-accent" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-feed-muted">
              Discover
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-feed-text">
            Explore the Webie universe
          </h1>
          <p className="text-sm text-feed-muted mt-2 max-w-xl">
            Browse beautifully crafted templates and meet the creators behind them.
          </p>

          {/* Search + tabs */}
          <div className="mt-6 flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-feed-muted" />
              <Input
                placeholder={
                  activeTab === "templates"
                    ? "Search templates by name, tag, or category..."
                    : "Search creators by name..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-feed-bg border-feed-border text-feed-text"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-feed-hover"
                >
                  <X className="w-4 h-4 text-feed-muted" />
                </button>
              )}
            </div>

            {/* Tab pill */}
            <div className="inline-flex items-center bg-feed-bg border border-feed-border rounded-lg p-1 self-start md:self-auto">
              <button
                onClick={() => setActiveTab("templates")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                  activeTab === "templates"
                    ? "bg-feed-accent text-feed-text shadow-sm"
                    : "text-feed-muted hover:text-feed-text"
                }`}
              >
                <FileText className="w-4 h-4" />
                Templates
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                  activeTab === "users"
                    ? "bg-feed-accent text-feed-text shadow-sm"
                    : "text-feed-muted hover:text-feed-text"
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
          <section className="border-b border-feed-border bg-feed-surface sticky top-0 z-10">
            <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center gap-2 overflow-x-auto">
              {CATEGORIES.map(({ key, label, icon: Icon }) => {
                const active = selectedCategory === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors shrink-0 ${
                      active
                        ? "bg-feed-accent text-feed-text border-feed-accent"
                        : "bg-feed-bg text-feed-text border-feed-border hover:border-feed-accent"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                );
              })}

              <div className="ml-auto inline-flex items-center bg-feed-bg border border-feed-border rounded-md p-0.5 shrink-0">
                {[
                  { key: "popular" as SortKey, label: "Popular", icon: TrendingUp },
                  { key: "rating" as SortKey, label: "Top rated", icon: Star },
                  { key: "newest" as SortKey, label: "Newest", icon: Sparkles },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setSortBy(key)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded transition-colors ${
                      sortBy === key
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
          </section>

          {/* Featured row */}
          {featured.length > 0 && selectedCategory === "all" && !searchQuery && (
            <section className="max-w-[1200px] mx-auto px-6 pt-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-feed-text flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-feed-accent" />
                  Trending now
                </h2>
                <span className="text-xs text-feed-muted">Top picks this week</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featured.map((template, idx) => (
                  <Card
                    key={template.id}
                    className="group overflow-hidden border border-feed-border bg-feed-surface hover:border-feed-accent transition-all cursor-pointer"
                    onClick={() => navigate(`/template/${template.id}`)}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-feed-bg">
                      <img
                        src={template.thumbnail}
                        alt={template.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 inline-flex items-center gap-1 bg-feed-accent text-feed-text text-[11px] font-bold px-2 py-0.5 rounded-full">
                        #{idx + 1}
                      </div>
                      {template.isPremium && (
                        <Badge className="absolute top-2 right-2 bg-feed-text text-feed-surface border-0 gap-1">
                          <Crown className="w-3 h-3" />
                          Premium
                        </Badge>
                      )}
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                        <h3 className="font-semibold text-white text-sm line-clamp-1">
                          {template.title}
                        </h3>
                        <div className="flex items-center gap-3 text-[11px] text-white/80 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-feed-accent text-feed-accent" />
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
          <section className="max-w-[1200px] mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-feed-text">
                {selectedCategory === "all" ? "All templates" : selectedCategory}
              </h2>
              <span className="text-xs text-feed-muted">{templates.length} templates</span>
            </div>

            {templates.length === 0 ? (
              <div className="bg-feed-surface border border-feed-border rounded-lg py-16 text-center">
                <FileText className="w-12 h-12 mx-auto text-feed-muted mb-3" />
                <h3 className="text-base font-semibold text-feed-text mb-1">No templates found</h3>
                <p className="text-sm text-feed-muted">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className="group overflow-hidden border border-feed-border bg-feed-surface hover:border-feed-accent hover:shadow-md transition-all"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-feed-bg">
                      <img
                        src={template.thumbnail}
                        alt={template.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {template.isPremium && (
                        <Badge className="absolute top-2 right-2 bg-feed-text text-feed-surface border-0 gap-1 text-[10px]">
                          <Crown className="w-3 h-3" />
                          Premium
                        </Badge>
                      )}
                      <Badge
                        variant="secondary"
                        className="absolute top-2 left-2 bg-feed-surface/90 text-feed-text border-0 text-[10px] font-medium"
                      >
                        {template.category}
                      </Badge>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-white/95 hover:bg-white text-foreground rounded-full h-9"
                          onClick={() => navigate(`/template/${template.id}/preview`)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          className="bg-feed-accent hover:bg-feed-accent-hover text-feed-text rounded-full h-9 font-semibold"
                          onClick={() => navigate(`/editor/${template.id}`)}
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-3">
                      <h3 className="font-semibold text-sm text-feed-text mb-1 line-clamp-1">
                        {template.title}
                      </h3>
                      <p className="text-xs text-feed-muted line-clamp-2 mb-3 min-h-[2rem]">
                        {template.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-feed-muted">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-feed-accent text-feed-accent" />
                          <span className="font-semibold text-feed-text">{template.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
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
        <section className="max-w-[1200px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-feed-text">
              {searchQuery ? "Search results" : "Discover creators"}
            </h2>
            <span className="text-xs text-feed-muted">{users.length} creators</span>
          </div>

          {users.length === 0 ? (
            <div className="bg-feed-surface border border-feed-border rounded-lg py-16 text-center">
              <Users className="w-12 h-12 mx-auto text-feed-muted mb-3" />
              <h3 className="text-base font-semibold text-feed-text mb-1">No creators found</h3>
              <p className="text-sm text-feed-muted">Try a different search</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user) => {
                const isFollowing = currentUser
                  ? followStorage.isFollowing(currentUser.id, user.id)
                  : false;
                const followerCount = followStorage.getFollowerCount(user.id);
                const followingCount = followStorage.getFollowingCount(user.id);

                return (
                  <Card
                    key={user.id}
                    className="overflow-hidden border border-feed-border bg-feed-surface hover:border-feed-accent transition-all"
                  >
                    {/* Banner */}
                    <div className="h-16 bg-gradient-to-r from-feed-accent/40 via-feed-accent/20 to-feed-hover" />
                    <CardContent className="p-4 -mt-8">
                      <Avatar
                        className="h-16 w-16 border-4 border-feed-surface cursor-pointer mb-2"
                        onClick={() => navigate(`/profile/user/${user.id}`)}
                      >
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-feed-accent/20 text-feed-text text-lg font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3
                            className="font-semibold text-base text-feed-text truncate cursor-pointer hover:text-feed-accent"
                            onClick={() => navigate(`/profile/user/${user.id}`)}
                          >
                            {user.name}
                          </h3>
                          <p className="text-xs text-feed-muted truncate">{user.email}</p>
                        </div>
                        {currentUser && currentUser.id !== user.id && (
                          <Button
                            variant={isFollowing ? "outline" : "default"}
                            size="sm"
                            onClick={() => handleFollow(user.id)}
                            className={`shrink-0 h-8 rounded-full text-xs font-semibold ${
                              isFollowing
                                ? "border-feed-border text-feed-muted hover:bg-feed-hover"
                                : "bg-feed-accent hover:bg-feed-accent-hover text-feed-text"
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

                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-feed-border text-xs">
                        <div>
                          <p className="font-bold text-feed-text">{followerCount}</p>
                          <p className="text-feed-muted">Followers</p>
                        </div>
                        <div>
                          <p className="font-bold text-feed-text">{followingCount}</p>
                          <p className="text-feed-muted">Following</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/profile/user/${user.id}`)}
                          className="ml-auto h-7 text-xs text-feed-muted hover:text-feed-accent hover:bg-feed-hover"
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
