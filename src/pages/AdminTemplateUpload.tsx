import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Upload, FileText } from "lucide-react";
import { templateStorage, userStorage, type Template } from "@/lib/storage";
import { toast } from "sonner";
import JSZip from "jszip";

const AdminTemplateUpload = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [zipFile, setZipFile] = useState<File | null>(null);

  useEffect(() => {
    const user = userStorage.getCurrentUser();
    if (!user || (!user.isAdmin && !user.isSuperAdmin)) {
      toast.error("Access denied");
      navigate("/");
    }
  }, [navigate]);

  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      toast.error("Please upload a ZIP file");
      return;
    }

    setZipFile(file);

    try {
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);
      
      // Look for index.html
      const indexFile = contents.file("index.html");
      if (!indexFile) {
        toast.error("ZIP must contain an index.html file");
        return;
      }

      const html = await indexFile.async("string");
      setHtmlContent(html);
      toast.success("ZIP file processed successfully");
    } catch (error) {
      toast.error("Error processing ZIP file");
      console.error(error);
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setThumbnail(event.target?.result as string);
        toast.success("Thumbnail uploaded");
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    if (!title || !description || !category || !htmlContent || !thumbnail) {
      toast.error("Please fill all required fields and upload files");
      return;
    }

    const user = userStorage.getCurrentUser();
    if (!user) return;

    const template: Template = {
      id: `template-${Date.now()}`,
      title,
      description,
      thumbnail,
      category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      htmlContent,
      isPublic,
      isPremium,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user.name,
      downloads: 0,
      rating: 0,
    };

    templateStorage.save(template);
    toast.success("Template published successfully");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
          <h1 className="text-3xl font-bold">Upload Template</h1>
          <p className="text-muted-foreground mt-2">Upload and configure a new template</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Template Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>ZIP File (must contain index.html)</Label>
                <div className="mt-2">
                  <label className="block">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary cursor-pointer transition-colors">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {zipFile ? zipFile.name : "Click to upload ZIP file"}
                      </p>
                    </div>
                    <input
                      type="file"
                      accept=".zip"
                      className="hidden"
                      onChange={handleZipUpload}
                    />
                  </label>
                </div>
              </div>

              <div>
                <Label>Thumbnail Image</Label>
                <div className="mt-2">
                  <label className="block">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary cursor-pointer transition-colors">
                      {thumbnail ? (
                        <img src={thumbnail} alt="Thumbnail" className="max-h-32 mx-auto rounded" />
                      ) : (
                        <>
                          <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Click to upload thumbnail</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbnailUpload}
                    />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template Details */}
          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title *</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Birthday Celebration"
                />
              </div>

              <div>
                <Label>Description *</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A beautiful birthday invitation template..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Category *</Label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Birthday, Wedding, Condolence, etc."
                />
              </div>

              <div>
                <Label>Tags (comma-separated)</Label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="party, celebration, colorful"
                />
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Template Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Public Template</Label>
                  <p className="text-sm text-muted-foreground">Make template visible to all users</p>
                </div>
                <Switch checked={isPublic} onCheckedChange={setIsPublic} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Premium Template</Label>
                  <p className="text-sm text-muted-foreground">Require premium access</p>
                </div>
                <Switch checked={isPremium} onCheckedChange={setIsPremium} />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handlePublish} size="lg" className="flex-1">
              Publish Template
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/admin")}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTemplateUpload;
