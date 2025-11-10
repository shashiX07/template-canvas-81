import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Save, Download, Eye, ArrowLeft, Image as ImageIcon, Palette, Type } from "lucide-react";
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
  const [textValue, setTextValue] = useState("");
  const [colorValue, setColorValue] = useState("#000000");
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
    if (htmlContent && iframeRef.current) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();

        // Make elements clickable
        const allElements = iframeDoc.body.querySelectorAll('*');
        allElements.forEach((el) => {
          (el as HTMLElement).style.cursor = 'pointer';
          el.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            setSelectedElement(el as HTMLElement);
            (el as HTMLElement).style.outline = '2px solid hsl(var(--primary))';
          });
        });
      }
    }
  }, [htmlContent]);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedElement) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (selectedElement.tagName === 'IMG') {
          (selectedElement as HTMLImageElement).src = dataUrl;
        } else {
          selectedElement.style.backgroundImage = `url(${dataUrl})`;
        }
        const iframeDoc = iframeRef.current?.contentDocument;
        if (iframeDoc) {
          setHtmlContent(iframeDoc.documentElement.outerHTML);
        }
        toast.success("Image updated");
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select an element first");
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

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleEditText}>
                <Type className="w-4 h-4 mr-2" />
                Edit Text
              </Button>
              <Button variant="outline" size="sm" onClick={handleChangeColor}>
                <Palette className="w-4 h-4 mr-2" />
                Change Color
              </Button>
              <label>
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Upload Image
                  </span>
                </Button>
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleImageUpload}
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
      <div className="flex-1 p-4">
        <Card className="h-full overflow-hidden">
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            title="Template Editor"
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
    </div>
  );
};

export default Editor;
