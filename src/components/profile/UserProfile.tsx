import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Grid3X3,
  UserPlus,
  UserCheck,
  ArrowLeft,
  Calendar,
  Heart,
} from "lucide-react";
import { userStorage, type User } from "@/lib/storage";
import { webieStorage, type Webie } from "@/lib/webieStorage";
import { followStorage } from "@/lib/followStorage";
import { notificationStorage } from "@/lib/notificationStorage";
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
        const webies = webieStorage.getByUserId(user.id).filter((w) => w.isPublic);
        setUserWebies(webies);
        if (currentUser) setIsFollowing(followStorage.isFollowing(currentUser.id, user.id));
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
      notificationStorage.notifyFollow(profileUser.id, {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
      });
      toast.success("Following!");
    }
  };

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="font-display italic text-2xl text-foreground/60 mb-4">User not found</p>
          <Button onClick={() => navigate(-1)}>Go back</Button>
        </div>
      </div>
    );
  }

  const followerCount = followStorage.getFollowerCount(profileUser.id);
  const followingCount = followStorage.getFollowingCount(profileUser.id);
  const isOwnProfile = currentUser?.id === profileUser.id;

  const stats = [
    { label: "Webies", value: userWebies.length },
    { label: "Followers", value: followerCount },
    { label: "Following", value: followingCount },
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="relative border-b border-foreground/10 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="max-w-[1100px] mx-auto px-6 py-10 relative">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 text-foreground/60"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-px bg-foreground" />
            <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60">
              A creator
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-10">
            <div className="shrink-0">
              <div className="relative bg-background border border-foreground/10 p-3 pb-5 rounded-sm shadow-2xl rotate-[2deg]">
                <Avatar className="w-36 h-36 md:w-44 md:h-44 rounded-sm">
                  <AvatarImage src={profileUser.avatar} className="object-cover" />
                  <AvatarFallback className="text-5xl bg-muted text-foreground rounded-sm font-display italic">
                    {profileUser.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="font-display italic text-sm text-foreground/70 text-center mt-3">
                  {profileUser.name.split(" ")[0]}
                </p>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="font-display text-5xl md:text-6xl font-light leading-[1.02] tracking-tight">
                {profileUser.name.split(" ")[0]}{" "}
                <span className="italic">
                  {profileUser.name.split(" ").slice(1).join(" ") || "."}
                </span>
              </h1>
              <div className="flex items-center gap-2 mt-4 font-mono-accent text-[11px] uppercase tracking-[0.2em] text-foreground/55">
                <Calendar className="w-3 h-3" />
                Joined{" "}
                {new Date(profileUser.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-6">
                {!isOwnProfile && currentUser && (
                  <Button
                    variant={isFollowing ? "outline" : "default"}
                    onClick={handleFollow}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Follow
                      </>
                    )}
                  </Button>
                )}
                {isOwnProfile && (
                  <Button onClick={() => navigate("/profile/details")}>Edit profile</Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-px mt-12 border-t border-foreground/10 pt-8">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-4xl md:text-5xl font-light tracking-tight">
                  {s.value}
                </div>
                <div className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/55 mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1100px] mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-6 h-px bg-foreground" />
              <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60">
                The collection
              </span>
            </div>
            <h2 className="font-display text-3xl font-light tracking-tight">
              Things <span className="italic">they made</span>
            </h2>
          </div>
          <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/40">
            {userWebies.length} entries
          </span>
        </div>

        {userWebies.length === 0 ? (
          <div className="border border-dashed border-foreground/15 rounded-2xl py-20 text-center bg-muted/20">
            <Grid3X3 className="w-10 h-10 mx-auto text-foreground/30 mb-3" />
            <h3 className="font-display text-2xl font-light mb-1">
              Nothing <span className="italic">shared yet</span>
            </h3>
            <p className="text-sm text-foreground/55">
              This creator hasn't published a webie.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {userWebies.map((webie, idx) => (
              <button
                key={webie.id}
                onClick={() => navigate(`/webie/${webie.id}`)}
                className={`group relative overflow-hidden rounded-xl bg-muted border border-foreground/10 ${
                  idx % 7 === 0 ? "md:col-span-2 md:row-span-2 aspect-square" : "aspect-square"
                }`}
              >
                <img
                  src={webie.thumbnail}
                  alt={webie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-background/80">
                    №{String(idx + 1).padStart(2, "0")}
                  </span>
                  <p className="font-display italic text-background text-lg line-clamp-2">
                    {webie.title}
                  </p>
                  <p className="font-mono-accent text-[10px] uppercase tracking-[0.2em] text-background/70 mt-1 flex items-center gap-1.5">
                    <Heart className="w-3 h-3" />
                    {webie.likes.length} likes
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
