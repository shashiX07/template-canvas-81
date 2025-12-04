import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Info, Pencil, Star, Download, Users, FileText, UserPlus, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { templateStorage, userStorage, type Template, type User } from "@/lib/storage";
import { followStorage } from "@/lib/followStorage";
import { toast } from "sonner";

const ProfileExplore = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("templates");
  
  // Templates state
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  
  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const currentUser = userStorage.getCurrentUser();

  const categories = ["all", "Birthday", "Wedding", "Condolence", "Anniversary", "Corporate"];

  useEffect(() => {
    if (activeTab === "templates") {
      loadTemplates();
    } else {
      loadUsers();
    }
  }, [selectedCategory, searchQuery, sortBy, activeTab]);

  const loadTemplates = () => {
    let filtered = templateStorage.getPublic();

    if (selectedCategory !== "all") {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = templateStorage.search(searchQuery);
    }

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
    let allUsers = userStorage.getAll().filter(u => u.id !== currentUser?.id);
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      allUsers = allUsers.filter(u => 
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
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
      toast.success("Unfollowed successfully");
    } else {
      followStorage.follow(currentUser.id, userId);
      toast.success("Following!");
    }
    loadUsers();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold mb-4">Explore</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="templates" className="gap-2">
                <FileText className="w-4 h-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users className="w-4 h-4" />
                Users
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {activeTab === "templates" ? (
          <>
            {/* Search and Filters for Templates */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search templates..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat === "all" ? "All Categories" : cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <Badge
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat === "all" ? "All" : cat}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Templates Grid */}
            {templates.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No templates found. Try adjusting your filters.</p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {templates.map((template) => (
                  <Card key={template.id} className="group overflow-hidden hover:shadow-lg transition-all">
                    <CardHeader className="p-0">
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        <img
                          src={template.thumbnail}
                          alt={template.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {template.isPremium && (
                          <Badge className="absolute top-2 right-2 bg-primary">
                            Premium
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="p-4">
                      <h3 className="font-bold text-base mb-2 line-clamp-1">{template.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {template.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-primary text-primary" />
                          <span>{template.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          <span>{template.downloads}</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/template/${template.id}/preview`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/template/${template.id}`)}
                      >
                        <Info className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/editor/${template.id}`)}
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Search for Users */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Users Grid */}
            {users.length === 0 ? (
              <Card className="p-12 text-center">
                <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No users found.</p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => {
                  const isFollowing = currentUser ? followStorage.isFollowing(currentUser.id, user.id) : false;
                  const followerCount = followStorage.getFollowerCount(user.id);
                  
                  return (
                    <Card key={user.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <Avatar 
                          className="h-14 w-14 cursor-pointer" 
                          onClick={() => navigate(`/profile/user/${user.id}`)}
                        >
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="text-lg">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <h3 
                            className="font-semibold truncate cursor-pointer hover:text-primary"
                            onClick={() => navigate(`/profile/user/${user.id}`)}
                          >
                            {user.name}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {followerCount} followers
                          </p>
                        </div>
                        
                        {currentUser && currentUser.id !== user.id && (
                          <Button
                            variant={isFollowing ? "outline" : "default"}
                            size="sm"
                            onClick={() => handleFollow(user.id)}
                            className="shrink-0"
                          >
                            {isFollowing ? (
                              <>
                                <UserCheck className="w-4 h-4 mr-1" />
                                Following
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-4 h-4 mr-1" />
                                Follow
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileExplore;
