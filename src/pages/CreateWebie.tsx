import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, X, Upload, Sparkles } from "lucide-react";
import { webieStorage, type Webie } from "@/lib/webieStorage";
import { templateStorage, customizedTemplateStorage, userStorage } from "@/lib/storage";
import { toast } from "sonner";

const CreateWebie = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [thumbnail, setThumbnail] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [cssFiles, setCssFiles] = useState<Record<string, string>>({});
  const [jsFiles, setJsFiles] = useState<Record<string, string>>({});
  const [assets, setAssets] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = userStorage.getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      toast.error("Please login to create a webie");
      navigate("/auth");
      return;
    }

    if (templateId) {
      // Check customized templates first
      const customized = customizedTemplateStorage.getById(templateId);
      if (customized) {
        setHtmlContent(customized.customizedHtml);
        const original = templateStorage.getById(customized.templateId);
        if (original) {
          setTitle(original.title + " - My Version");
          setDescription("Customized version of " + original.title);
          setThumbnail(original.thumbnail);
          setCssFiles(original.cssFiles || {});
          setJsFiles(original.jsFiles || {});
          setAssets(original.assets || {});
          setTags(original.tags);
        }
        return;
      }

      // Check original templates
      const template = templateStorage.getById(templateId);
      if (template) {
        setTitle(template.title);
        setDescription(template.description);
        setThumbnail(template.thumbnail);
        setHtmlContent(template.htmlContent);
        setCssFiles(template.cssFiles || {});
        setJsFiles(template.jsFiles || {});
        setAssets(template.assets || {});
        setTags(template.tags);
      }
    }
  }, [templateId, currentUser, navigate]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setThumbnail(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!currentUser) {
      toast.error("Please login");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!htmlContent) {
      toast.error("Please select a template to publish");
      return;
    }

    setIsLoading(true);

    const webie: Webie = {
      id: `webie-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      templateId: templateId || "",
      title: title.trim(),
      description: description.trim(),
      thumbnail: thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
      htmlContent,
      cssFiles,
      jsFiles,
      assets,
      likes: [],
      comments: [],
      shares: 0,
      views: 0,
      tags,
      isPublic,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    webieStorage.save(webie);
    toast.success("Webie published successfully!");
    navigate(`/webie/${webie.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Create Your Webie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Give your webie a catchy title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your webie..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Thumbnail */}
            <div className="space-y-2">
              <Label>Thumbnail</Label>
              {thumbnail ? (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <img
                    src={thumbnail}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setThumbnail("")}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 cursor-pointer transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload thumbnail
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleThumbnailUpload}
                  />
                </label>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Visibility */}
            <div className="flex items-center justify-between py-4 px-4 bg-muted rounded-lg">
              <div>
                <Label className="text-base">Make Public</Label>
                <p className="text-sm text-muted-foreground">
                  Allow others to see, like, and comment on your webie
                </p>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>

            {/* Template Status */}
            {htmlContent ? (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400">
                  Template content loaded and ready to publish
                </p>
              </div>
            ) : (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  No template selected. Go to Templates, customize one, and come back to publish.
                </p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => navigate("/templates")}
                >
                  Browse Templates
                </Button>
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmit}
                disabled={isLoading || !htmlContent}
              >
                {isLoading ? "Publishing..." : "Publish Webie"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateWebie;
