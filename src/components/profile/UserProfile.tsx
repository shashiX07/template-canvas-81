import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Grid3X3, 
  UserPlus,
  UserCheck,
  ArrowLeft,
  Calendar
} from "lucide-react";
import { userStorage, type User } from "@/lib/storage";
import { webieStorage, type Webie } from "@/lib/webieStorage";
import { followStorage } from "@/lib/followStorage";
import { toast } from "sonner";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUser = userStorage.getCurrentUser();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userWebies, setUserWebies] = useState<Webie[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (userId) {
      const user = userStorage.getById(userId);
      setProfileUser(user);
      
      if (user) {
        const webies = webieStorage.getByUserId(user.id).filter(w => w.isPublic);
        setUserWebies(webies);
        
        if (currentUser) {
          setIsFollowing(followStorage.isFollowing(currentUser.id, user.id));
        }
      }
    }
  }, [userId, currentUser]);

  const handleFollow = () => {
    if (!currentUser) {
      toast.error("Please login to follow users");
      navigate("/auth");
      return;
    }
    
    if (!profileUser) return;
    
    if (isFollowing) {
      followStorage.unfollow(currentUser.id, profileUser.id);
      setIsFollowing(false);
      toast.success("Unfollowed");
    } else {
      followStorage.follow(currentUser.id, profileUser.id);
      setIsFollowing(true);
      toast.success("Following!");
    }
  };

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">User not found</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const followerCount = followStorage.getFollowerCount(profileUser.id);
  const followingCount = followStorage.getFollowingCount(profileUser.id);
  const isOwnProfile = currentUser?.id === profileUser.id;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
          {/* Avatar */}
          <div className="shrink-0">
            <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-background ring-2 ring-muted">
              <AvatarImage src={profileUser.avatar} />
              <AvatarFallback className="text-4xl bg-gradient-to-br from-primary/20 to-primary/40">
                {profileUser.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Profile Info */}
          <div className="flex-1 w-full">
            {/* Username and Actions */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <h1 className="text-xl font-semibold">{profileUser.name}</h1>
              
              {!isOwnProfile && currentUser && (
                <Button 
                  variant={isFollowing ? "outline" : "default"}
                  size="sm"
                  onClick={handleFollow}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4 mr-2" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Follow
                    </>
                  )}
                </Button>
              )}

              {isOwnProfile && (
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => navigate("/profile/details")}
                >
                  Edit Profile
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-6 mb-4 text-sm">
              <div>
                <span className="font-semibold">{userWebies.length}</span>
                <span className="text-muted-foreground ml-1">webies</span>
              </div>
              <div>
                <span className="font-semibold">{followerCount}</span>
                <span className="text-muted-foreground ml-1">followers</span>
              </div>
              <div>
                <span className="font-semibold">{followingCount}</span>
                <span className="text-muted-foreground ml-1">following</span>
              </div>
            </div>

            {/* Bio Section */}
            <div className="space-y-1">
              <p className="font-medium">{profileUser.name}</p>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="w-3 h-3" />
                Joined {new Date(profileUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="webies" className="w-full">
          <TabsList className="w-full justify-center border-t rounded-none h-12 bg-transparent p-0">
            <TabsTrigger 
              value="webies" 
              className="flex-1 max-w-[200px] rounded-none border-t-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent gap-2"
            >
              <Grid3X3 className="w-4 h-4" />
              Webies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="webies" className="mt-4">
            {userWebies.length === 0 ? (
              <div className="text-center py-16">
                <Grid3X3 className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Webies Yet</h3>
                <p className="text-muted-foreground">
                  This user hasn't shared any webies yet
                </p>
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
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
