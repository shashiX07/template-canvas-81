import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Download, Eye, ArrowLeft, Image as ImageIcon, Palette, Type, Video } from "lucide-react";
import { templateStorage, customizedTemplateStorage, userStorage, type Template, type CustomizedTemplate } from "@/lib/storage";
import { toast } from "sonner";

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);
  const [htmlContent, setHtmlContent] = useState("");
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [showTextDialog, setShowTextDialog] = useState(false);
  const [showColorDialog, setShowColorDialog] = useState(false);
  const [showFontDialog, setShowFontDialog] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [colorValue, setColorValue] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState("16");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [customData, setCustomData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (id) {
      const found = templateStorage.getById(id);
      if (found) {
        setTemplate(found);
        setHtmlContent(found.htmlContent);
      } else {
        toast.error("Template not found");
        navigate("/templates");
      }
    }
  }, [id, navigate]);

  useEffect(() => {
    if (htmlContent && iframeRef.current && template) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
        iframeDoc.open();
        
        // Build complete HTML with CSS and JS
        let completeHtml = htmlContent;
        
        // Inject CSS files
        if (template.cssFiles) {
          const cssInjects = Object.entries(template.cssFiles)
            .map(([_, content]) => `<style>${content}</style>`)
            .join('\n');
          completeHtml = completeHtml.replace('</head>', `${cssInjects}\n</head>`);
        }
        
        // Inject JS files
        if (template.jsFiles) {
          const jsInjects = Object.entries(template.jsFiles)
            .map(([_, content]) => `<script>${content}</script>`)
            .join('\n');
          completeHtml = completeHtml.replace('</body>', `${jsInjects}\n</body>`);
        }
        
        // Replace asset paths with base64 data
        if (template.assets) {
          Object.entries(template.assets).forEach(([filename, dataUrl]) => {
            const patterns = [
              new RegExp(`src=["'].*${filename}["']`, 'g'),
              new RegExp(`href=["'].*${filename}["']`, 'g'),
              new RegExp(`url\\(['"].*${filename}['"]\\)`, 'g'),
            ];
            patterns.forEach(pattern => {
              completeHtml = completeHtml.replace(pattern, (match) => {
                if (match.includes('src=')) return `src="${dataUrl}"`;
                if (match.includes('href=')) return `href="${dataUrl}"`;
                return `url('${dataUrl}')`;
              });
            });
          });
        }
        
        iframeDoc.write(completeHtml);
        iframeDoc.close();

        // Make elements clickable with better highlighting
        const allElements = iframeDoc.body.querySelectorAll('*');
        allElements.forEach((el) => {
          const element = el as HTMLElement;
          element.style.cursor = 'pointer';
          
          element.addEventListener('mouseenter', () => {
            if (element !== selectedElement) {
              element.style.outline = '2px dashed hsl(var(--primary) / 0.5)';
            }
          });
          
          element.addEventListener('mouseleave', () => {
            if (element !== selectedElement) {
              element.style.outline = 'none';
            }
          });
          
          element.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Remove highlight from previous selection
            if (selectedElement) {
              selectedElement.style.outline = 'none';
            }
            
            setSelectedElement(element);
            element.style.outline = '3px solid hsl(var(--primary))';
            element.style.outlineOffset = '2px';
          });
        });
      }
    }
  }, [htmlContent, template]);

  const handleEditText = () => {
    if (selectedElement) {
      setTextValue(selectedElement.innerText || "");
      setShowTextDialog(true);
    } else {
      toast.error("Please select an element first");
    }
  };

  const handleSaveText = () => {
    if (selectedElement) {
      selectedElement.innerText = textValue;
      const iframeDoc = iframeRef.current?.contentDocument;
      if (iframeDoc) {
        setHtmlContent(iframeDoc.documentElement.outerHTML);
      }
      setShowTextDialog(false);
      toast.success("Text updated");
    }
  };

  const handleChangeColor = () => {
    if (selectedElement) {
      const currentColor = window.getComputedStyle(selectedElement).color;
      setColorValue(currentColor);
      setShowColorDialog(true);
    } else {
      toast.error("Please select an element first");
    }
  };

  const handleSaveColor = () => {
    if (selectedElement) {
      selectedElement.style.color = colorValue;
      const iframeDoc = iframeRef.current?.contentDocument;
      if (iframeDoc) {
        setHtmlContent(iframeDoc.documentElement.outerHTML);
      }
      setShowColorDialog(false);
      toast.success("Color updated");
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedElement) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        
        // Store in localStorage (update template assets)
        if (template) {
          const updatedAssets = { ...(template.assets || {}), [file.name]: dataUrl };
          const updatedTemplate = { ...template, assets: updatedAssets };
          templateStorage.save(updatedTemplate);
          setTemplate(updatedTemplate);
        }
        
        if (selectedElement.tagName === 'IMG') {
          (selectedElement as HTMLImageElement).src = dataUrl;
        } else if (selectedElement.tagName === 'VIDEO' || selectedElement.tagName === 'SOURCE') {
          if (selectedElement.tagName === 'VIDEO') {
            (selectedElement as HTMLVideoElement).src = dataUrl;
          } else {
            (selectedElement as HTMLSourceElement).src = dataUrl;
            const video = selectedElement.parentElement as HTMLVideoElement;
            video?.load();
          }
        } else {
          selectedElement.style.backgroundImage = `url(${dataUrl})`;
        }
        
        const iframeDoc = iframeRef.current?.contentDocument;
        if (iframeDoc) {
          setHtmlContent(iframeDoc.documentElement.outerHTML);
        }
        toast.success(`${file.type.includes('video') ? 'Video' : 'Image'} updated`);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select an element first");
    }
  };

  const handleFontChange = () => {
    if (selectedElement) {
      const currentFont = window.getComputedStyle(selectedElement).fontFamily;
      const currentSize = window.getComputedStyle(selectedElement).fontSize;
      setFontFamily(currentFont.replace(/["']/g, '').split(',')[0]);
      setFontSize(parseInt(currentSize).toString());
      setShowFontDialog(true);
    } else {
      toast.error("Please select an element first");
    }
  };

  const handleSaveFont = () => {
    if (selectedElement) {
      selectedElement.style.fontFamily = fontFamily;
      selectedElement.style.fontSize = `${fontSize}px`;
      const iframeDoc = iframeRef.current?.contentDocument;
      if (iframeDoc) {
        setHtmlContent(iframeDoc.documentElement.outerHTML);
      }
      setShowFontDialog(false);
      toast.success("Font updated");
    }
  };

  const handleSave = (isDraft: boolean = false) => {
    const user = userStorage.getCurrentUser();
    if (!user) {
      toast.error("Please log in to save");
      return;
    }

    const customized: CustomizedTemplate = {
      id: `custom-${Date.now()}`,
      userId: user.id,
      templateId: template?.id || "",
      customizedHtml: htmlContent,
      customData: customData,
      isDraft,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    customizedTemplateStorage.save(customized);
    
    if (isDraft) {
      if (!user.draftTemplates.includes(customized.id)) {
        user.draftTemplates.push(customized.id);
      }
    } else {
      if (!user.customizedTemplates.includes(customized.id)) {
        user.customizedTemplates.push(customized.id);
      }
    }
    
    userStorage.save(user);
    toast.success(isDraft ? "Saved as draft" : "Template saved");
  };

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template?.title || 'template'}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Template downloaded");
  };

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Toolbar */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/templates")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <h2 className="text-lg font-semibold">{template.title}</h2>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={handleEditText}>
                <Type className="w-4 h-4 mr-2" />
                Edit Text
              </Button>
              <Button variant="outline" size="sm" onClick={handleFontChange}>
                <Type className="w-4 h-4 mr-2" />
                Font Style
              </Button>
              <Button variant="outline" size="sm" onClick={handleChangeColor}>
                <Palette className="w-4 h-4 mr-2" />
                Color
              </Button>
              <label>
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Image
                  </span>
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleMediaUpload}
                />
              </label>
              <label>
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Video className="w-4 h-4 mr-2" />
                    Video
                  </span>
                </Button>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleMediaUpload}
                />
              </label>
              <Separator orientation="vertical" className="h-6" />
              <Button variant="outline" size="sm" onClick={() => handleSave(true)}>
                Save Draft
              </Button>
              <Button variant="default" size="sm" onClick={() => handleSave(false)}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Canvas */}
      <div className="flex-1 p-4 min-h-0">
        <Card className="h-full overflow-hidden">
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            title="Template Editor"
            style={{ minHeight: '100%' }}
          />
        </Card>
      </div>

      {/* Text Edit Dialog */}
      <Dialog open={showTextDialog} onOpenChange={setShowTextDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Text</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Text Content</Label>
              <Input
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder="Enter text..."
              />
            </div>
            <Button onClick={handleSaveText} className="w-full">
              Save Text
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Color Edit Dialog */}
      <Dialog open={showColorDialog} onOpenChange={setShowColorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Color</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Color</Label>
              <Input
                type="color"
                value={colorValue}
                onChange={(e) => setColorValue(e.target.value)}
              />
            </div>
            <Button onClick={handleSaveColor} className="w-full">
              Save Color
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Font Edit Dialog */}
      <Dialog open={showFontDialog} onOpenChange={setShowFontDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Font Style</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Font Family</Label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Helvetica">Helvetica</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Verdana">Verdana</SelectItem>
                  <SelectItem value="Courier New">Courier New</SelectItem>
                  <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                  <SelectItem value="Impact">Impact</SelectItem>
                  <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Font Size (px)</Label>
              <Input
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                min="8"
                max="72"
              />
            </div>
            <Button onClick={handleSaveFont} className="w-full">
              Save Font Style
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Editor;
