import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Grid3X3,
  Bookmark,
  Settings,
  Link as LinkIcon,
  MapPin,
  Calendar,
  Pencil,
  Heart,
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
    location: "",
  });

  useEffect(() => {
    if (user) {
      setUserWebies(webieStorage.getByUserId(user.id));
      const savedIds = savedWebieStorage.getSavedByUser(user.id);
      const webies = savedIds
        .map((id) => webieStorage.getById(id))
        .filter((w): w is Webie => w !== null);
      setSavedWebies(webies);
    }
  }, [user]);

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

  const stats = [
    { label: "Webies", value: userWebies.length },
    { label: "Followers", value: followerCount },
    { label: "Following", value: followingCount },
    { label: "Saved", value: savedWebies.length },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative border-b border-foreground/10 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="max-w-[1100px] mx-auto px-6 py-14 relative">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-px bg-foreground" />
            <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60">
              Profile · No.05
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-10">
            {/* Polaroid avatar */}
            <div className="shrink-0">
              <div className="relative bg-background border border-foreground/10 p-3 pb-5 rounded-sm shadow-2xl rotate-[-2deg]">
                <Avatar className="w-40 h-40 md:w-48 md:h-48 rounded-sm">
                  <AvatarImage src={user.avatar} className="object-cover" />
                  <AvatarFallback className="text-5xl bg-muted text-foreground rounded-sm font-display italic">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="font-display italic text-sm text-foreground/70 text-center mt-3">
                  {user.name.split(" ")[0]}, today
                </p>
              </div>
            </div>

            <div className="flex-1 min-w-0 pt-2">
              <h1 className="font-display text-5xl md:text-6xl font-light leading-[1.02] tracking-tight">
                {user.name.split(" ")[0]}{" "}
                <span className="italic">{user.name.split(" ").slice(1).join(" ") || "."}</span>
              </h1>
              {editForm.bio && (
                <p className="mt-4 text-foreground/70 text-lg leading-[1.7] max-w-xl">
                  {editForm.bio}
                </p>
              )}

              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5 font-mono-accent text-[11px] uppercase tracking-[0.2em] text-foreground/55">
                {editForm.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" />
                    {editForm.location}
                  </span>
                )}
                {editForm.website && (
                  <a
                    href={editForm.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-foreground"
                  >
                    <LinkIcon className="w-3 h-3" />
                    {editForm.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  Joined{" "}
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-6">
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Pencil className="w-4 h-4" />
                      Edit profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-display text-3xl font-light">
                        Edit <span className="italic">profile</span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label className="font-mono-accent text-[10px] uppercase tracking-[0.25em]">
                          Name
                        </Label>
                        <Input
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-mono-accent text-[10px] uppercase tracking-[0.25em]">
                          Bio
                        </Label>
                        <Textarea
                          value={editForm.bio}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          placeholder="A line or two about you…"
                          className="rounded-2xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-mono-accent text-[10px] uppercase tracking-[0.25em]">
                          Website
                        </Label>
                        <Input
                          value={editForm.website}
                          onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-mono-accent text-[10px] uppercase tracking-[0.25em]">
                          Location
                        </Label>
                        <Input
                          value={editForm.location}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          placeholder="City, Country"
                        />
                      </div>
                      <Button onClick={handleUpdateProfile} className="w-full" size="lg">
                        Save changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" onClick={() => navigate("/profile/settings")}>
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px mt-12 border-t border-foreground/10 pt-8">
            {stats.map((s) => (
              <div key={s.label} className="px-2">
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

      {/* Tabs + grids */}
      <div className="max-w-[1100px] mx-auto px-6 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent p-0 h-auto gap-2">
            <TabsTrigger
              value="webies"
              className="rounded-full border border-foreground/15 px-5 py-2 data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:border-foreground gap-2"
            >
              <Grid3X3 className="w-4 h-4" />
              Webies
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className="rounded-full border border-foreground/15 px-5 py-2 data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:border-foreground gap-2"
            >
              <Bookmark className="w-4 h-4" />
              Saved
            </TabsTrigger>
          </TabsList>

          <TabsContent value="webies" className="mt-8">
            {userWebies.length === 0 ? (
              <EmptyState
                icon={<Grid3X3 className="w-10 h-10" />}
                title="No webies yet"
                copy="Share your first quietly beautiful thing."
                cta={
                  <Button onClick={() => navigate("/webie/create")}>Create a webie</Button>
                }
              />
            ) : (
              <Mosaic items={userWebies} onClick={(id) => navigate(`/webie/${id}`)} />
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-8">
            {savedWebies.length === 0 ? (
              <EmptyState
                icon={<Bookmark className="w-10 h-10" />}
                title="Nothing saved"
                copy="Tap the bookmark on any webie to keep it here."
              />
            ) : (
              <Mosaic items={savedWebies} onClick={(id) => navigate(`/webie/${id}`)} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  copy,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  copy: string;
  cta?: React.ReactNode;
}) {
  return (
    <div className="border border-dashed border-foreground/15 rounded-2xl py-20 text-center bg-muted/20">
      <div className="text-foreground/30 mx-auto mb-3 flex justify-center">{icon}</div>
      <h3 className="font-display text-2xl font-light mb-1">
        {title.split(" ")[0]} <span className="italic">{title.split(" ").slice(1).join(" ")}</span>
      </h3>
      <p className="text-sm text-foreground/55 mb-5">{copy}</p>
      {cta}
    </div>
  );
}

function Mosaic({
  items,
  onClick,
}: {
  items: Webie[];
  onClick: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {items.map((webie, idx) => (
        <button
          key={webie.id}
          onClick={() => onClick(webie.id)}
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
  );
}
