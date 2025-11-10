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
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: string;
    tags: string;
    isPublic: boolean;
    isPremium: boolean;
    cssFiles?: Record<string, string>;
    jsFiles?: Record<string, string>;
    assets?: Record<string, string>;
  }>({
    title: "",
    description: "",
    category: "",
    tags: "",
    isPublic: true,
    isPremium: false,
  });
  const [thumbnail, setThumbnail] = useState("");
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
      
      // Extract CSS files
      const cssFiles: Record<string, string> = {};
      const cssFolder = contents.folder("css");
      if (cssFolder) {
        const cssPromises: Promise<void>[] = [];
        cssFolder.forEach((relativePath, file) => {
          if (!file.dir && relativePath.endsWith('.css')) {
            cssPromises.push(
              file.async("string").then(content => {
                cssFiles[relativePath] = content;
              })
            );
          }
        });
        await Promise.all(cssPromises);
      }
      
      // Extract JS files
      const jsFiles: Record<string, string> = {};
      const jsFolder = contents.folder("js");
      if (jsFolder) {
        const jsPromises: Promise<void>[] = [];
        jsFolder.forEach((relativePath, file) => {
          if (!file.dir && relativePath.endsWith('.js')) {
            jsPromises.push(
              file.async("string").then(content => {
                jsFiles[relativePath] = content;
              })
            );
          }
        });
        await Promise.all(jsPromises);
      }
      
      // Extract assets
      const assets: Record<string, string> = {};
      const assetsFolder = contents.folder("assets");
      if (assetsFolder) {
        const assetPromises: Promise<void>[] = [];
        assetsFolder.forEach((relativePath, file) => {
          if (!file.dir) {
            assetPromises.push(
              file.async("base64").then(content => {
                const ext = relativePath.split('.').pop()?.toLowerCase();
                let mimeType = 'application/octet-stream';
                if (ext === 'png') mimeType = 'image/png';
                else if (ext === 'jpg' || ext === 'jpeg') mimeType = 'image/jpeg';
                else if (ext === 'gif') mimeType = 'image/gif';
                else if (ext === 'svg') mimeType = 'image/svg+xml';
                else if (ext === 'webp') mimeType = 'image/webp';
                else if (ext === 'mp4') mimeType = 'video/mp4';
                else if (ext === 'webm') mimeType = 'video/webm';
                assets[relativePath] = `data:${mimeType};base64,${content}`;
              })
            );
          }
        });
        await Promise.all(assetPromises);
      }
      
      setFormData(prev => ({ ...prev, cssFiles, jsFiles, assets }));
      toast.success("ZIP file processed successfully with all assets");
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
    if (!formData.title || !formData.description || !formData.category || !htmlContent || !thumbnail) {
      toast.error("Please fill all required fields and upload files");
      return;
    }

    const user = userStorage.getCurrentUser();
    if (!user) return;

    const template: Template = {
      id: `template-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      thumbnail,
      category: formData.category,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      htmlContent,
      cssFiles: formData.cssFiles,
      jsFiles: formData.jsFiles,
      assets: formData.assets,
      isPublic: formData.isPublic,
      isPremium: formData.isPremium,
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
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Birthday Celebration"
                />
              </div>

              <div>
                <Label>Description *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="A beautiful birthday invitation template..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Category *</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Birthday, Wedding, Condolence, etc."
                />
              </div>

              <div>
                <Label>Tags (comma-separated)</Label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
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
                <Switch checked={formData.isPublic} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Premium Template</Label>
                  <p className="text-sm text-muted-foreground">Require premium access</p>
                </div>
                <Switch checked={formData.isPremium} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPremium: checked }))} />
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
