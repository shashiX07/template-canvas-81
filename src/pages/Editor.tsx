import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, Download, ArrowLeft, Upload } from "lucide-react";
import { templateStorage, customizedTemplateStorage, userStorage, type Template, type CustomizedTemplate } from "@/lib/storage";
import { toast } from "sonner";

type ElementType = 'text' | 'image' | 'video' | 'container' | 'none';

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);
  const [htmlContent, setHtmlContent] = useState("");
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [elementType, setElementType] = useState<ElementType>('none');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Text properties
  const [textContent, setTextContent] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState("16");
  const [fontWeight, setFontWeight] = useState("400");
  const [textAlign, setTextAlign] = useState("left");
  const [textDecoration, setTextDecoration] = useState("none");
  
  // Image properties
  const [imageWidth, setImageWidth] = useState("100");
  const [imageHeight, setImageHeight] = useState("auto");
  const [imageFit, setImageFit] = useState("cover");
  
  // Video properties
  const [videoAutoplay, setVideoAutoplay] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [videoLoop, setVideoLoop] = useState(false);
  const [videoControls, setVideoControls] = useState(true);

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
          element.style.transition = 'outline 0.2s ease';
          
          element.addEventListener('mouseenter', () => {
            if (element !== selectedElement) {
              element.style.outline = '2px dashed hsl(var(--primary) / 0.5)';
              element.style.outlineOffset = '2px';
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
            element.style.outlineOffset = '4px';
            element.style.boxShadow = '0 0 0 1px hsl(var(--primary) / 0.2)';
            
            // Detect element type and load properties
            detectElementType(element);
          });
        });
      }
    }
  }, [htmlContent, template]);
  
  const detectElementType = (element: HTMLElement) => {
    const tagName = element.tagName.toLowerCase();
    
    if (tagName === 'img') {
      setElementType('image');
      loadImageProperties(element as HTMLImageElement);
    } else if (tagName === 'video') {
      setElementType('video');
      loadVideoProperties(element as HTMLVideoElement);
    } else if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
      setElementType('text');
      loadTextProperties(element);
    } else {
      setElementType('container');
      loadTextProperties(element);
    }
  };
  
  const loadTextProperties = (element: HTMLElement) => {
    const computedStyle = window.getComputedStyle(element);
    setTextContent(element.innerText || "");
    setTextColor(rgbToHex(computedStyle.color));
    setBackgroundColor(rgbToHex(computedStyle.backgroundColor));
    setFontFamily(computedStyle.fontFamily.replace(/["']/g, '').split(',')[0]);
    setFontSize(parseInt(computedStyle.fontSize).toString());
    setFontWeight(computedStyle.fontWeight);
    setTextAlign(computedStyle.textAlign);
    setTextDecoration(computedStyle.textDecoration.split(' ')[0]);
  };
  
  const loadImageProperties = (element: HTMLImageElement) => {
    const computedStyle = window.getComputedStyle(element);
    setImageWidth(element.style.width || computedStyle.width);
    setImageHeight(element.style.height || computedStyle.height);
    setImageFit(computedStyle.objectFit || 'cover');
  };
  
  const loadVideoProperties = (element: HTMLVideoElement) => {
    setVideoAutoplay(element.autoplay);
    setVideoMuted(element.muted);
    setVideoLoop(element.loop);
    setVideoControls(element.controls);
  };
  
  const rgbToHex = (rgb: string): string => {
    if (rgb.startsWith('#')) return rgb;
    const result = rgb.match(/\d+/g);
    if (!result) return '#000000';
    const r = parseInt(result[0]);
    const g = parseInt(result[1]);
    const b = parseInt(result[2]);
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  };

  // Real-time update handlers - Changes are applied directly to DOM without reloading
  const updateTextContent = (value: string) => {
    setTextContent(value);
    if (selectedElement) {
      selectedElement.innerText = value;
    }
  };
  
  const updateTextColor = (value: string) => {
    setTextColor(value);
    if (selectedElement) {
      selectedElement.style.color = value;
    }
  };
  
  const updateBackgroundColor = (value: string) => {
    setBackgroundColor(value);
    if (selectedElement) {
      selectedElement.style.backgroundColor = value;
    }
  };
  
  const updateFontFamily = (value: string) => {
    setFontFamily(value);
    if (selectedElement) {
      selectedElement.style.fontFamily = value;
    }
  };
  
  const updateFontSize = (value: string) => {
    setFontSize(value);
    if (selectedElement) {
      selectedElement.style.fontSize = `${value}px`;
    }
  };
  
  const updateFontWeight = (value: string) => {
    setFontWeight(value);
    if (selectedElement) {
      selectedElement.style.fontWeight = value;
    }
  };
  
  const updateTextAlign = (value: string) => {
    setTextAlign(value);
    if (selectedElement) {
      selectedElement.style.textAlign = value;
    }
  };
  
  const updateTextDecoration = (value: string) => {
    setTextDecoration(value);
    if (selectedElement) {
      selectedElement.style.textDecoration = value;
    }
  };
  
  const updateImageWidth = (value: string) => {
    setImageWidth(value);
    if (selectedElement && selectedElement.tagName === 'IMG') {
      selectedElement.style.width = value.includes('%') || value.includes('px') ? value : `${value}px`;
    }
  };
  
  const updateImageHeight = (value: string) => {
    setImageHeight(value);
    if (selectedElement && selectedElement.tagName === 'IMG') {
      selectedElement.style.height = value === 'auto' ? 'auto' : value.includes('%') || value.includes('px') ? value : `${value}px`;
    }
  };
  
  const updateImageFit = (value: string) => {
    setImageFit(value);
    if (selectedElement && selectedElement.tagName === 'IMG') {
      (selectedElement as HTMLImageElement).style.objectFit = value as any;
    }
  };
  
  const updateVideoAutoplay = (value: boolean) => {
    setVideoAutoplay(value);
    if (selectedElement && selectedElement.tagName === 'VIDEO') {
      (selectedElement as HTMLVideoElement).autoplay = value;
    }
  };
  
  const updateVideoMuted = (value: boolean) => {
    setVideoMuted(value);
    if (selectedElement && selectedElement.tagName === 'VIDEO') {
      (selectedElement as HTMLVideoElement).muted = value;
    }
  };
  
  const updateVideoLoop = (value: boolean) => {
    setVideoLoop(value);
    if (selectedElement && selectedElement.tagName === 'VIDEO') {
      (selectedElement as HTMLVideoElement).loop = value;
    }
  };
  
  const updateVideoControls = (value: boolean) => {
    setVideoControls(value);
    if (selectedElement && selectedElement.tagName === 'VIDEO') {
      (selectedElement as HTMLVideoElement).controls = value;
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
        } else if (selectedElement.tagName === 'VIDEO') {
          (selectedElement as HTMLVideoElement).src = dataUrl;
          (selectedElement as HTMLVideoElement).load();
        }
        
        toast.success(`${file.type.includes('video') ? 'Video' : 'Image'} updated`);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const updateHtmlContent = () => {
    const iframeDoc = iframeRef.current?.contentDocument;
    if (iframeDoc) {
      setHtmlContent(iframeDoc.documentElement.outerHTML);
    }
  };

  const handleSave = (isDraft: boolean = false) => {
    const user = userStorage.getCurrentUser();
    if (!user) {
      toast.error("Please log in to save");
      return;
    }

    // Capture current state from iframe before saving
    updateHtmlContent();
    
    // Use a timeout to ensure htmlContent state is updated
    setTimeout(() => {
      const customized: CustomizedTemplate = {
        id: `custom-${Date.now()}`,
        userId: user.id,
        templateId: template?.id || "",
        customizedHtml: iframeRef.current?.contentDocument?.documentElement.outerHTML || htmlContent,
        customData: {},
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
    }, 100);
  };

  const handleDownload = () => {
    // Get current HTML from iframe
    const currentHtml = iframeRef.current?.contentDocument?.documentElement.outerHTML || htmlContent;
    const blob = new Blob([currentHtml], { type: 'text/html' });
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
        <div className="container mx-auto px-4 py-3">
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

            <div className="flex items-center gap-2">
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

      {/* Editor Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 p-4">
          <Card className="h-full overflow-hidden">
            <iframe
              ref={iframeRef}
              className="w-full h-full border-0"
              title="Template Editor"
            />
          </Card>
        </div>

        {/* Properties Sidebar */}
        <div className="w-80 border-l bg-card overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg">Properties</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {elementType === 'none' ? 'Click an element to edit' : `Editing ${elementType}`}
            </p>
          </div>

          {elementType === 'none' && (
            <div className="p-4 text-center text-muted-foreground">
              <p>Select an element in the canvas to see its properties</p>
            </div>
          )}

          {(elementType === 'text' || elementType === 'container') && (
            <div className="p-4 space-y-4">
              <div>
                <Label>Text Content</Label>
                <Textarea
                  value={textContent}
                  onChange={(e) => updateTextContent(e.target.value)}
                  placeholder="Enter text..."
                  rows={4}
                  className="mt-1.5"
                />
              </div>

              <Separator />

              <div>
                <Label>Text Color</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    type="color"
                    value={textColor}
                    onChange={(e) => updateTextColor(e.target.value)}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={textColor}
                    onChange={(e) => updateTextColor(e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label>Background Color</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => updateBackgroundColor(e.target.value)}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => updateBackgroundColor(e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <Label>Font Family</Label>
                <Select value={fontFamily} onValueChange={updateFontFamily}>
                  <SelectTrigger className="mt-1.5">
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
                  onChange={(e) => updateFontSize(e.target.value)}
                  min="8"
                  max="200"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label>Font Weight</Label>
                <Select value={fontWeight} onValueChange={updateFontWeight}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="300">Light (300)</SelectItem>
                    <SelectItem value="400">Normal (400)</SelectItem>
                    <SelectItem value="500">Medium (500)</SelectItem>
                    <SelectItem value="600">Semi Bold (600)</SelectItem>
                    <SelectItem value="700">Bold (700)</SelectItem>
                    <SelectItem value="800">Extra Bold (800)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Text Align</Label>
                <Select value={textAlign} onValueChange={updateTextAlign}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="justify">Justify</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Text Decoration</Label>
                <Select value={textDecoration} onValueChange={updateTextDecoration}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="underline">Underline</SelectItem>
                    <SelectItem value="overline">Overline</SelectItem>
                    <SelectItem value="line-through">Line Through</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {elementType === 'image' && (
            <div className="p-4 space-y-4">
              <div>
                <Label>Upload New Image</Label>
                <Button
                  variant="outline"
                  className="w-full mt-1.5"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleMediaUpload}
                />
              </div>

              <Separator />

              <div>
                <Label>Width</Label>
                <Input
                  type="text"
                  value={imageWidth}
                  onChange={(e) => updateImageWidth(e.target.value)}
                  placeholder="100% or 300px"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label>Height</Label>
                <Input
                  type="text"
                  value={imageHeight}
                  onChange={(e) => updateImageHeight(e.target.value)}
                  placeholder="auto or 200px"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label>Object Fit</Label>
                <Select value={imageFit} onValueChange={updateImageFit}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cover">Cover</SelectItem>
                    <SelectItem value="contain">Contain</SelectItem>
                    <SelectItem value="fill">Fill</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="scale-down">Scale Down</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {elementType === 'video' && (
            <div className="p-4 space-y-4">
              <div>
                <Label>Upload New Video</Label>
                <Button
                  variant="outline"
                  className="w-full mt-1.5"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Video
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleMediaUpload}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <Label>Autoplay</Label>
                <Switch
                  checked={videoAutoplay}
                  onCheckedChange={updateVideoAutoplay}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Muted</Label>
                <Switch
                  checked={videoMuted}
                  onCheckedChange={updateVideoMuted}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Loop</Label>
                <Switch
                  checked={videoLoop}
                  onCheckedChange={updateVideoLoop}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Show Controls</Label>
                <Switch
                  checked={videoControls}
                  onCheckedChange={updateVideoControls}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;
