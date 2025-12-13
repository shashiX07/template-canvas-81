import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Download, ArrowLeft, Upload, Settings, Plus, Copy, Clipboard, Trash2, Monitor, Tablet, Smartphone } from "lucide-react";
import { templateStorage, customizedTemplateStorage, userStorage, type Template, type CustomizedTemplate } from "@/lib/storage";
import { toast } from "sonner";
import { DraggableElements } from "@/components/editor/DraggableElements";
import { FloatingToolbar } from "@/components/editor/FloatingToolbar";
import { SelectionOverlay } from "@/components/editor/SelectionOverlay";

type ElementType = 'text' | 'image' | 'video' | 'container' | 'none';

// Text animation keyframes to inject
const animationStyles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes typewriter {
  from { width: 0; }
  to { width: 100%; }
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
@keyframes wave {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}
@keyframes glow {
  from { text-shadow: 0 0 5px currentColor, 0 0 10px currentColor; }
  to { text-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
}
`;

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);
  const [htmlContent, setHtmlContent] = useState("");
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [elementType, setElementType] = useState<ElementType>('none');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Clipboard for copy/paste
  const [clipboard, setClipboard] = useState<string | null>(null);
  
  // Floating toolbar
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [showToolbar, setShowToolbar] = useState(false);
  
  // Inline editing
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  
  // Viewport preview
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  // Text properties
  const [textContent, setTextContent] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState("16");
  const [fontWeight, setFontWeight] = useState("400");
  const [textAlign, setTextAlign] = useState("left");
  const [textDecoration, setTextDecoration] = useState("none");
  const [fontStyle, setFontStyle] = useState("normal");
  
  // Image properties
  const [imageWidth, setImageWidth] = useState("100");
  const [imageHeight, setImageHeight] = useState("auto");
  const [imageFit, setImageFit] = useState("cover");
  
  // Video properties
  const [videoAutoplay, setVideoAutoplay] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [videoLoop, setVideoLoop] = useState(false);
  const [videoControls, setVideoControls] = useState(true);
  const [videoWidth, setVideoWidth] = useState("100%");
  const [videoHeight, setVideoHeight] = useState("auto");
  const [videoPoster, setVideoPoster] = useState("");
  const [videoFilter, setVideoFilter] = useState("none");

  const viewportWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

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
        
        // Build complete HTML with CSS, JS, and animations
        let completeHtml = htmlContent;
        
        // Inject animation styles
        completeHtml = completeHtml.replace('</head>', `<style>${animationStyles}</style>\n</head>`);
        
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
        
        // Replace asset paths with base64 data (robust matching)
        if (template.assets) {
          Object.entries(template.assets).forEach(([filename, dataUrl]) => {
            // Escape special regex characters in filename
            const escapedFilename = filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            
            // Match various path formats: ./assets/img.png, assets/img.png, ../img.png, img.png
            const patterns = [
              new RegExp(`src=["'][^"']*${escapedFilename}["']`, 'gi'),
              new RegExp(`href=["'][^"']*${escapedFilename}["']`, 'gi'),
              new RegExp(`url\\(["']?[^)]*${escapedFilename}["']?\\)`, 'gi'),
              new RegExp(`poster=["'][^"']*${escapedFilename}["']`, 'gi'),
            ];
            
            patterns.forEach(pattern => {
              completeHtml = completeHtml.replace(pattern, (match) => {
                if (match.toLowerCase().startsWith('src=')) return `src="${dataUrl}"`;
                if (match.toLowerCase().startsWith('href=')) return `href="${dataUrl}"`;
                if (match.toLowerCase().startsWith('poster=')) return `poster="${dataUrl}"`;
                return `url('${dataUrl}')`;
              });
            });
          });
        }
        
        iframeDoc.write(completeHtml);
        iframeDoc.close();

        // Add drag-drop support
        iframeDoc.body.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer!.dropEffect = 'copy';
        });

        iframeDoc.body.addEventListener('drop', (e) => {
          e.preventDefault();
          const html = e.dataTransfer?.getData('text/html');
          if (html) {
            const wrapper = iframeDoc.createElement('div');
            wrapper.innerHTML = html;
            const element = wrapper.firstElementChild;
            if (element) {
              // Find target element under cursor
              const target = iframeDoc.elementFromPoint(e.clientX, e.clientY);
              if (target && target !== iframeDoc.body) {
                target.parentElement?.insertBefore(element, target.nextSibling);
              } else {
                iframeDoc.body.appendChild(element);
              }
              toast.success("Element added to template");
            }
          }
        });

        // Keyboard shortcuts for copy/paste
        iframeDoc.addEventListener('keydown', (e) => {
          if ((e.ctrlKey || e.metaKey) && selectedElement) {
            if (e.key === 'c') {
              handleCopyElement();
            } else if (e.key === 'v') {
              handlePasteElement();
            } else if (e.key === 'Delete' || e.key === 'Backspace') {
              handleDeleteElement();
            }
          }
        });

        // Make elements clickable with better highlighting
        const allElements = iframeDoc.body.querySelectorAll('*');
        allElements.forEach((el) => {
          const element = el as HTMLElement;
          element.style.cursor = 'pointer';
          element.style.transition = 'outline 0.2s ease';
          
          element.addEventListener('mouseenter', () => {
            if (element !== selectedElement && !isInlineEditing) {
              element.style.outline = '2px dashed hsl(var(--primary) / 0.5)';
              element.style.outlineOffset = '2px';
            }
          });
          
          element.addEventListener('mouseleave', () => {
            if (element !== selectedElement) {
              element.style.outline = 'none';
            }
          });
          
          // Double-click for inline editing
          element.addEventListener('dblclick', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const tagName = element.tagName.toLowerCase();
            if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'a', 'button', 'li', 'td', 'th', 'label'].includes(tagName) || 
                (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE)) {
              setIsInlineEditing(true);
              element.contentEditable = 'true';
              element.focus();
              
              // Select all text
              const range = iframeDoc.createRange();
              range.selectNodeContents(element);
              const selection = iframeDoc.getSelection();
              selection?.removeAllRanges();
              selection?.addRange(range);
              
              // Exit inline editing on blur
              const handleBlur = () => {
                element.contentEditable = 'false';
                setIsInlineEditing(false);
                setTextContent(element.innerText || "");
                element.removeEventListener('blur', handleBlur);
              };
              element.addEventListener('blur', handleBlur);
            }
          });
          
          element.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (isInlineEditing) return;
            
            // Remove highlight from previous selection
            if (selectedElement) {
              selectedElement.style.outline = 'none';
              selectedElement.style.boxShadow = 'none';
            }
            
            setSelectedElement(element);
            element.style.outline = '3px solid hsl(var(--primary))';
            element.style.outlineOffset = '4px';
            
            // Calculate toolbar position
            const rect = element.getBoundingClientRect();
            const iframeRect = iframe.getBoundingClientRect();
            setToolbarPosition({
              x: iframeRect.left + rect.left + rect.width / 2,
              y: iframeRect.top + rect.top,
            });
            setShowToolbar(true);
            
            // Detect element type and load properties
            detectElementType(element);
          });
        });
        
        // Click outside to deselect
        iframeDoc.addEventListener('click', (e) => {
          if (e.target === iframeDoc.body) {
            if (selectedElement) {
              selectedElement.style.outline = 'none';
            }
            setSelectedElement(null);
            setElementType('none');
            setShowToolbar(false);
          }
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
    setFontStyle(computedStyle.fontStyle);
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
    setVideoWidth(element.style.width || "100%");
    setVideoHeight(element.style.height || "auto");
    setVideoPoster(element.poster || "");
    setVideoFilter(element.style.filter || "none");
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

  // Copy/Paste/Delete handlers
  const handleCopyElement = useCallback(() => {
    if (selectedElement) {
      setClipboard(selectedElement.outerHTML);
      toast.success("Element copied");
    }
  }, [selectedElement]);

  const handlePasteElement = useCallback(() => {
    if (clipboard && iframeRef.current?.contentDocument) {
      const doc = iframeRef.current.contentDocument;
      const wrapper = doc.createElement('div');
      wrapper.innerHTML = clipboard;
      const element = wrapper.firstElementChild;
      if (element && selectedElement) {
        selectedElement.parentElement?.insertBefore(element, selectedElement.nextSibling);
        toast.success("Element pasted");
      }
    }
  }, [clipboard, selectedElement]);

  const handleDeleteElement = useCallback(() => {
    if (selectedElement && selectedElement.parentElement) {
      selectedElement.remove();
      setSelectedElement(null);
      setElementType('none');
      setShowToolbar(false);
      toast.success("Element deleted");
    }
  }, [selectedElement]);

  // Memoized real-time update handlers
  const updateTextContent = useCallback((value: string) => {
    setTextContent(value);
    if (selectedElement) {
      selectedElement.innerText = value;
    }
  }, [selectedElement]);
  
  const updateTextColor = useCallback((value: string) => {
    setTextColor(value);
    if (selectedElement) {
      selectedElement.style.color = value;
    }
  }, [selectedElement]);
  
  const updateBackgroundColor = useCallback((value: string) => {
    setBackgroundColor(value);
    if (selectedElement) {
      selectedElement.style.backgroundColor = value;
    }
  }, [selectedElement]);
  
  const updateFontFamily = useCallback((value: string) => {
    setFontFamily(value);
    if (selectedElement) {
      selectedElement.style.fontFamily = value;
    }
  }, [selectedElement]);
  
  const updateFontSize = useCallback((value: string) => {
    setFontSize(value);
    if (selectedElement) {
      selectedElement.style.fontSize = `${value}px`;
    }
  }, [selectedElement]);
  
  const updateFontWeight = useCallback((value: string) => {
    setFontWeight(value);
    if (selectedElement) {
      selectedElement.style.fontWeight = value;
    }
  }, [selectedElement]);

  const updateFontStyle = useCallback((value: string) => {
    setFontStyle(value);
    if (selectedElement) {
      selectedElement.style.fontStyle = value;
    }
  }, [selectedElement]);
  
  const updateTextAlign = useCallback((value: string) => {
    setTextAlign(value);
    if (selectedElement) {
      selectedElement.style.textAlign = value;
    }
  }, [selectedElement]);
  
  const updateTextDecoration = useCallback((value: string) => {
    setTextDecoration(value);
    if (selectedElement) {
      selectedElement.style.textDecoration = value;
    }
  }, [selectedElement]);

  const addAnimation = useCallback((animationCss: string) => {
    if (selectedElement) {
      selectedElement.style.cssText += animationCss;
      toast.success("Animation applied");
    }
  }, [selectedElement]);
  
  const updateImageWidth = useCallback((value: string) => {
    setImageWidth(value);
    if (selectedElement && selectedElement.tagName === 'IMG') {
      selectedElement.style.width = value.includes('%') || value.includes('px') ? value : `${value}px`;
    }
  }, [selectedElement]);
  
  const updateImageHeight = useCallback((value: string) => {
    setImageHeight(value);
    if (selectedElement && selectedElement.tagName === 'IMG') {
      selectedElement.style.height = value === 'auto' ? 'auto' : value.includes('%') || value.includes('px') ? value : `${value}px`;
    }
  }, [selectedElement]);
  
  const updateImageFit = useCallback((value: string) => {
    setImageFit(value);
    if (selectedElement && selectedElement.tagName === 'IMG') {
      (selectedElement as HTMLImageElement).style.objectFit = value as any;
    }
  }, [selectedElement]);
  
  const updateVideoAutoplay = useCallback((value: boolean) => {
    setVideoAutoplay(value);
    if (selectedElement && selectedElement.tagName === 'VIDEO') {
      (selectedElement as HTMLVideoElement).autoplay = value;
    }
  }, [selectedElement]);
  
  const updateVideoMuted = useCallback((value: boolean) => {
    setVideoMuted(value);
    if (selectedElement && selectedElement.tagName === 'VIDEO') {
      (selectedElement as HTMLVideoElement).muted = value;
    }
  }, [selectedElement]);
  
  const updateVideoLoop = useCallback((value: boolean) => {
    setVideoLoop(value);
    if (selectedElement && selectedElement.tagName === 'VIDEO') {
      (selectedElement as HTMLVideoElement).loop = value;
    }
  }, [selectedElement]);
  
  const updateVideoControls = useCallback((value: boolean) => {
    setVideoControls(value);
    if (selectedElement && selectedElement.tagName === 'VIDEO') {
      (selectedElement as HTMLVideoElement).controls = value;
    }
  }, [selectedElement]);

  const updateVideoWidth = useCallback((value: string) => {
    setVideoWidth(value);
    if (selectedElement && selectedElement.tagName === 'VIDEO') {
      selectedElement.style.width = value;
    }
  }, [selectedElement]);

  const updateVideoHeight = useCallback((value: string) => {
    setVideoHeight(value);
    if (selectedElement && selectedElement.tagName === 'VIDEO') {
      selectedElement.style.height = value;
    }
  }, [selectedElement]);

  const updateVideoPoster = useCallback((value: string) => {
    setVideoPoster(value);
    if (selectedElement && selectedElement.tagName === 'VIDEO') {
      (selectedElement as HTMLVideoElement).poster = value;
    }
  }, [selectedElement]);

  const updateVideoFilter = useCallback((value: string) => {
    setVideoFilter(value);
    if (selectedElement && selectedElement.tagName === 'VIDEO') {
      selectedElement.style.filter = value;
    }
  }, [selectedElement]);
  
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedElement) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        
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

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        updateVideoPoster(dataUrl);
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

    updateHtmlContent();
    
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
      {/* Floating Toolbar */}
      <FloatingToolbar
        position={toolbarPosition}
        visible={showToolbar && (elementType === 'text' || elementType === 'container')}
        onBold={() => updateFontWeight(fontWeight === '700' ? '400' : '700')}
        onItalic={() => updateFontStyle(fontStyle === 'italic' ? 'normal' : 'italic')}
        onUnderline={() => updateTextDecoration(textDecoration === 'underline' ? 'none' : 'underline')}
        onStrikethrough={() => updateTextDecoration(textDecoration === 'line-through' ? 'none' : 'line-through')}
        onAlignLeft={() => updateTextAlign('left')}
        onAlignCenter={() => updateTextAlign('center')}
        onAlignRight={() => updateTextAlign('right')}
        onColorChange={updateTextColor}
        onFontSizeChange={updateFontSize}
        onCopy={handleCopyElement}
        onDelete={handleDeleteElement}
        onAddAnimation={addAnimation}
        currentColor={textColor}
        currentFontSize={fontSize}
        isBold={fontWeight === '700'}
        isItalic={fontStyle === 'italic'}
        isUnderline={textDecoration === 'underline'}
      />
      
      {/* Selection Overlay */}
      <SelectionOverlay element={selectedElement} iframeRef={iframeRef} />

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
              {/* Viewport Controls */}
              <div className="flex items-center gap-1 border rounded-lg p-1">
                <Button
                  variant={viewport === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setViewport('desktop')}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewport === 'tablet' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setViewport('tablet')}
                >
                  <Tablet className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewport === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setViewport('mobile')}
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
              
              <Separator orientation="vertical" className="h-6" />
              
              {/* Copy/Paste buttons */}
              <Button variant="ghost" size="sm" onClick={handleCopyElement} disabled={!selectedElement}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handlePasteElement} disabled={!clipboard}>
                <Clipboard className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDeleteElement} disabled={!selectedElement}>
                <Trash2 className="w-4 h-4" />
              </Button>
              
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

      {/* Editor Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 p-4 flex justify-center">
          <Card 
            className="h-full overflow-hidden transition-all duration-300"
            style={{ width: viewportWidths[viewport], maxWidth: '100%' }}
          >
            <iframe
              ref={iframeRef}
              className="w-full h-full border-0"
              title="Template Editor"
            />
          </Card>
        </div>

        {/* Properties Sidebar */}
        <div className="w-80 border-l bg-card flex flex-col">
          <Tabs defaultValue="properties" className="flex-1 flex flex-col">
            <div className="p-3 border-b flex-shrink-0">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="properties" className="gap-1.5 text-xs">
                  <Settings className="w-3.5 h-3.5" />
                  Properties
                </TabsTrigger>
                <TabsTrigger value="elements" className="gap-1.5 text-xs">
                  <Plus className="w-3.5 h-3.5" />
                  Elements
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="elements" className="flex-1 m-0 p-4 overflow-auto">
              <DraggableElements 
                onElementDrop={(html) => {
                  if (iframeRef.current?.contentDocument) {
                    const doc = iframeRef.current.contentDocument;
                    const wrapper = doc.createElement('div');
                    wrapper.innerHTML = html;
                    const element = wrapper.firstElementChild;
                    if (element) {
                      doc.body.appendChild(element);
                      toast.success("Element added to template");
                    }
                  }
                }}
              />
            </TabsContent>

            <TabsContent value="properties" className="flex-1 m-0 overflow-hidden">
              <div className="p-3 border-b">
                <p className="text-sm text-muted-foreground">
                  {elementType === 'none' ? 'Click an element to edit' : `Editing ${elementType}`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Double-click text to edit inline • Ctrl+C/V to copy/paste
                </p>
              </div>
              
              <ScrollArea className="h-[calc(100vh-12rem)]" onWheel={(e) => e.stopPropagation()}>
                <div className="p-4" onWheel={(e) => e.stopPropagation()}>

                  {elementType === 'none' && (
                    <div className="text-center text-muted-foreground py-8">
                      <p>Select an element in the canvas to see its properties</p>
                    </div>
                  )}

              {(elementType === 'text' || elementType === 'container') && (
                <div className="space-y-4">
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
                <div className="space-y-4">
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
                <div className="space-y-4">
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

              {/* Poster Image */}
              <div>
                <Label>Poster Image</Label>
                <p className="text-xs text-muted-foreground mt-1">Thumbnail before video plays</p>
                <Button
                  variant="outline"
                  className="w-full mt-1.5"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => handlePosterUpload(e as any);
                    input.click();
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Poster
                </Button>
                {videoPoster && (
                  <div className="mt-2 relative">
                    <img src={videoPoster} alt="Poster" className="w-full h-24 object-cover rounded" />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 text-xs"
                      onClick={() => updateVideoPoster("")}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>

              <Separator />

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Width</Label>
                  <Input
                    type="text"
                    value={videoWidth}
                    onChange={(e) => updateVideoWidth(e.target.value)}
                    placeholder="100%"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Height</Label>
                  <Input
                    type="text"
                    value={videoHeight}
                    onChange={(e) => updateVideoHeight(e.target.value)}
                    placeholder="auto"
                    className="mt-1"
                  />
                </div>
              </div>

              <Separator />

              {/* Playback Controls */}
              <div className="space-y-3">
                <Label className="text-xs font-medium text-muted-foreground uppercase">Playback</Label>
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

              <Separator />

              {/* Video Filters */}
              <div>
                <Label>Video Filter</Label>
                <Select value={videoFilter} onValueChange={updateVideoFilter}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="grayscale(100%)">Grayscale</SelectItem>
                    <SelectItem value="sepia(100%)">Sepia</SelectItem>
                    <SelectItem value="blur(2px)">Blur</SelectItem>
                    <SelectItem value="brightness(1.2)">Brightness</SelectItem>
                    <SelectItem value="contrast(1.2)">Contrast</SelectItem>
                    <SelectItem value="saturate(1.5)">Saturate</SelectItem>
                    <SelectItem value="sepia(50%) contrast(90%)">Vintage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
                </div>
              )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Editor;
