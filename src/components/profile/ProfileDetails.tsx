import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Grid3X3, 
  Bookmark, 
  Settings, 
  Link as LinkIcon,
  MapPin,
  Calendar
} from "lucide-react";
import { userStorage } from "@/lib/storage";
import { webieStorage, type Webie } from "@/lib/webieStorage";
import { followStorage, savedWebieStorage } from "@/lib/followStorage";
import { toast } from "sonner";

export function ProfileDetails() {
  const navigate = useNavigate();
  const [user, setUser] = useState(userStorage.getCurrentUser());
  const [activeTab, setActiveTab] = useState("webies");
  const [userWebies, setUserWebies] = useState<Webie[]>([]);
  const [savedWebies, setSavedWebies] = useState<Webie[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    bio: "",
    website: "",
    location: ""
  });

  useEffect(() => {
    if (user) {
      loadUserWebies();
      loadSavedWebies();
    }
  }, [user]);

  const loadUserWebies = () => {
    if (user) {
      const webies = webieStorage.getByUserId(user.id);
      setUserWebies(webies);
    }
  };

  const loadSavedWebies = () => {
    if (user) {
      const savedIds = savedWebieStorage.getSavedByUser(user.id);
      const webies = savedIds
        .map(id => webieStorage.getById(id))
        .filter((w): w is Webie => w !== null);
      setSavedWebies(webies);
    }
  };

  const handleUpdateProfile = () => {
    if (user) {
      const updated = { ...user, name: editForm.name };
      userStorage.save(updated);
      userStorage.setCurrentUser(updated);
      setUser(updated);
      setEditDialogOpen(false);
      toast.success("Profile updated");
    }
  };

  if (!user) return null;

  const followerCount = followStorage.getFollowerCount(user.id);
  const followingCount = followStorage.getFollowingCount(user.id);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header - Instagram Style */}
        <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
          {/* Avatar */}
          <div className="shrink-0">
            <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-background ring-2 ring-muted">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-4xl bg-gradient-to-br from-primary/20 to-primary/40">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Profile Info */}
          <div className="flex-1 w-full">
            {/* Username and Actions */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <h1 className="text-xl font-semibold">{user.name}</h1>
              
              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm">
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Bio</Label>
                      <Textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Website</Label>
                      <Input
                        value={editForm.website}
                        onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={editForm.location}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        placeholder="City, Country"
                      />
                    </div>
                    <Button onClick={handleUpdateProfile} className="w-full">
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate("/profile/settings")}
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-6 mb-4 text-sm">
              <div>
                <span className="font-semibold">{userWebies.length}</span>
                <span className="text-muted-foreground ml-1">webies</span>
              </div>
              <div className="cursor-pointer hover:opacity-80">
                <span className="font-semibold">{followerCount}</span>
                <span className="text-muted-foreground ml-1">followers</span>
              </div>
              <div className="cursor-pointer hover:opacity-80">
                <span className="font-semibold">{followingCount}</span>
                <span className="text-muted-foreground ml-1">following</span>
              </div>
            </div>

            {/* Bio Section */}
            <div className="space-y-1">
              <p className="font-medium">{user.name}</p>
              {editForm.bio && (
                <p className="text-sm">{editForm.bio}</p>
              )}
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                {editForm.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {editForm.location}
                  </span>
                )}
                {editForm.website && (
                  <a 
                    href={editForm.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <LinkIcon className="w-3 h-3" />
                    {editForm.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-center border-t rounded-none h-12 bg-transparent p-0">
            <TabsTrigger 
              value="webies" 
              className="flex-1 max-w-[200px] rounded-none border-t-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent gap-2"
            >
              <Grid3X3 className="w-4 h-4" />
              Webies
            </TabsTrigger>
            <TabsTrigger 
              value="saved" 
              className="flex-1 max-w-[200px] rounded-none border-t-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent gap-2"
            >
              <Bookmark className="w-4 h-4" />
              Saved
            </TabsTrigger>
          </TabsList>

          <TabsContent value="webies" className="mt-4">
            {userWebies.length === 0 ? (
              <div className="text-center py-16">
                <Grid3X3 className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Webies Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Share your first webie with the community
                </p>
                <Button onClick={() => navigate("/webie/create")}>
                  Create Webie
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {userWebies.map((webie) => (
                  <div 
                    key={webie.id}
                    className="aspect-square bg-muted overflow-hidden cursor-pointer group relative"
                    onClick={() => navigate(`/webie/${webie.id}`)}
                  >
                    <img
                      src={webie.thumbnail}
                      alt={webie.title}
                      className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-white text-center text-sm">
                        <p className="font-semibold">{webie.likes.length} likes</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-4">
            {savedWebies.length === 0 ? (
              <div className="text-center py-16">
                <Bookmark className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Saved Webies</h3>
                <p className="text-muted-foreground">
                  Save webies you like to see them here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {savedWebies.map((webie) => (
                  <div 
                    key={webie.id}
                    className="aspect-square bg-muted overflow-hidden cursor-pointer group relative"
                    onClick={() => navigate(`/webie/${webie.id}`)}
                  >
                    <img
                      src={webie.thumbnail}
                      alt={webie.title}
                      className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-white text-center text-sm">
                        <p className="font-semibold">{webie.likes.length} likes</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
