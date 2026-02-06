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
import { Save, Download, ArrowLeft, Upload, Settings, Plus, Copy, Clipboard, Trash2, Undo2, Redo2, Layers } from "lucide-react";
import { templateStorage, customizedTemplateStorage, userStorage, type Template, type CustomizedTemplate } from "@/lib/storage";
import { toast } from "sonner";
import { DraggableElements } from "@/components/editor/DraggableElements";
import { FloatingToolbar } from "@/components/editor/FloatingToolbar";
import { SelectionOverlay } from "@/components/editor/SelectionOverlay";
import { LayersPanel } from "@/components/editor/LayersPanel";
import { CanvasControls } from "@/components/editor/CanvasControls";
import { GridOverlay } from "@/components/editor/GridOverlay";
import { ResizeHandles } from "@/components/editor/ResizeHandles";
import { useEditorHistory } from "@/hooks/useEditorHistory";
import { useCanvasZoom } from "@/hooks/useCanvasZoom";

type ElementType = 'text' | 'image' | 'video' | 'container' | 'none';

const animationStyles = `
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes typewriter { from { width: 0; } to { width: 100%; } }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes wave { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
@keyframes glow { from { text-shadow: 0 0 5px currentColor, 0 0 10px currentColor; } to { text-shadow: 0 0 20px currentColor, 0 0 30px currentColor; } }
`;

const viewportWidths = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);
  const [htmlContent, setHtmlContent] = useState("");
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [elementType, setElementType] = useState<ElementType>('none');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [clipboard, setClipboard] = useState<string | null>(null);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [showToolbar, setShowToolbar] = useState(false);
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showGrid, setShowGrid] = useState(false);
  const [showGuides, setShowGuides] = useState(false);
  
  // Canvas zoom
  const { zoom, zoomIn, zoomOut, zoomReset, zoomFit, handleWheel, containerRef } = useCanvasZoom();
  
  // Undo/Redo
  const { pushState, undo, redo, canUndo, canRedo } = useEditorHistory();
  
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

  // Load template
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

  // Setup iframe content & interactions
  useEffect(() => {
    if (!htmlContent || !iframeRef.current || !template) return;
    
    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    iframeDoc.open();
    
    let completeHtml = htmlContent;
    completeHtml = completeHtml.replace('</head>', `<style>${animationStyles}</style>\n</head>`);
    
    if (template.cssFiles) {
      const cssInjects = Object.entries(template.cssFiles).map(([_, content]) => `<style>${content}</style>`).join('\n');
      completeHtml = completeHtml.replace('</head>', `${cssInjects}\n</head>`);
    }
    if (template.jsFiles) {
      const jsInjects = Object.entries(template.jsFiles).map(([_, content]) => `<script>${content}</script>`).join('\n');
      completeHtml = completeHtml.replace('</body>', `${jsInjects}\n</body>`);
    }
    if (template.assets) {
      Object.entries(template.assets).forEach(([filename, dataUrl]) => {
        const escapedFilename = filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
    
    // Inject editor helper styles
    const editorStyles = `
      <style>
        * { cursor: pointer !important; transition: outline 0.15s ease !important; }
        .editor-hover { outline: 2px dashed rgba(59,130,246,0.5) !important; outline-offset: 2px !important; }
        .editor-selected { outline: 2px solid rgb(59,130,246) !important; outline-offset: 3px !important; box-shadow: 0 0 0 1px rgba(59,130,246,0.2) !important; }
        .editor-drop-target { outline: 3px dashed rgba(34,197,94,0.7) !important; outline-offset: 2px !important; }
      </style>
    `;
    completeHtml = completeHtml.replace('</head>', `${editorStyles}\n</head>`);
    
    iframeDoc.write(completeHtml);
    iframeDoc.close();

    // Drag-drop support
    iframeDoc.body.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer!.dropEffect = 'copy';
      const target = iframeDoc.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
      // Remove previous drop targets
      iframeDoc.querySelectorAll('.editor-drop-target').forEach(el => el.classList.remove('editor-drop-target'));
      if (target && target !== iframeDoc.body) {
        target.classList.add('editor-drop-target');
      }
    });

    iframeDoc.body.addEventListener('dragleave', () => {
      iframeDoc.querySelectorAll('.editor-drop-target').forEach(el => el.classList.remove('editor-drop-target'));
    });

    iframeDoc.body.addEventListener('drop', (e) => {
      e.preventDefault();
      iframeDoc.querySelectorAll('.editor-drop-target').forEach(el => el.classList.remove('editor-drop-target'));
      const html = e.dataTransfer?.getData('text/html');
      if (html) {
        const wrapper = iframeDoc.createElement('div');
        wrapper.innerHTML = html;
        const element = wrapper.firstElementChild;
        if (element) {
          const target = iframeDoc.elementFromPoint(e.clientX, e.clientY);
          if (target && target !== iframeDoc.body) {
            target.parentElement?.insertBefore(element, target.nextSibling);
          } else {
            iframeDoc.body.appendChild(element);
          }
          toast.success("Element added");
        }
      }
    });

    // Keyboard shortcuts
    iframeDoc.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'c' && selectedElement) handleCopyElement();
        else if (e.key === 'v') handlePasteElement();
        else if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); handleUndo(); }
        else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') { e.preventDefault(); handleRedo(); }
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElement && !isInlineEditing) {
        handleDeleteElement();
      }
    });

    // Element interactions
    const allElements = iframeDoc.body.querySelectorAll('*');
    allElements.forEach((el) => {
      const element = el as HTMLElement;
      
      element.addEventListener('mouseenter', () => {
        if (element !== selectedElement && !isInlineEditing) {
          element.classList.add('editor-hover');
        }
      });
      
      element.addEventListener('mouseleave', () => {
        element.classList.remove('editor-hover');
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
          element.style.cursor = 'text';
          element.focus();
          const range = iframeDoc.createRange();
          range.selectNodeContents(element);
          const selection = iframeDoc.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
          const handleBlur = () => {
            element.contentEditable = 'false';
            element.style.cursor = '';
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
        
        // Remove previous selection
        iframeDoc.querySelectorAll('.editor-selected').forEach(el => el.classList.remove('editor-selected'));
        
        setSelectedElement(element);
        element.classList.add('editor-selected');
        element.classList.remove('editor-hover');
        
        // Toolbar position
        const rect = element.getBoundingClientRect();
        const iframeRect = iframe.getBoundingClientRect();
        setToolbarPosition({
          x: iframeRect.left + rect.left + rect.width / 2,
          y: iframeRect.top + rect.top,
        });
        setShowToolbar(true);
        detectElementType(element);
      });
    });
    
    // Click body to deselect
    iframeDoc.addEventListener('click', (e) => {
      if (e.target === iframeDoc.body) {
        iframeDoc.querySelectorAll('.editor-selected').forEach(el => el.classList.remove('editor-selected'));
        setSelectedElement(null);
        setElementType('none');
        setShowToolbar(false);
      }
    });
  }, [htmlContent, template]);
  
  // --- Property detection ---
  const detectElementType = (element: HTMLElement) => {
    const tagName = element.tagName.toLowerCase();
    if (tagName === 'img') { setElementType('image'); loadImageProperties(element as HTMLImageElement); }
    else if (tagName === 'video') { setElementType('video'); loadVideoProperties(element as HTMLVideoElement); }
    else if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) { setElementType('text'); loadTextProperties(element); }
    else { setElementType('container'); loadTextProperties(element); }
  };
  
  const loadTextProperties = (element: HTMLElement) => {
    const cs = window.getComputedStyle(element);
    setTextContent(element.innerText || "");
    setTextColor(rgbToHex(cs.color));
    setBackgroundColor(rgbToHex(cs.backgroundColor));
    setFontFamily(cs.fontFamily.replace(/["']/g, '').split(',')[0]);
    setFontSize(parseInt(cs.fontSize).toString());
    setFontWeight(cs.fontWeight);
    setTextAlign(cs.textAlign);
    setTextDecoration(cs.textDecoration.split(' ')[0]);
    setFontStyle(cs.fontStyle);
  };
  
  const loadImageProperties = (el: HTMLImageElement) => {
    const cs = window.getComputedStyle(el);
    setImageWidth(el.style.width || cs.width);
    setImageHeight(el.style.height || cs.height);
    setImageFit(cs.objectFit || 'cover');
  };
  
  const loadVideoProperties = (el: HTMLVideoElement) => {
    setVideoAutoplay(el.autoplay);
    setVideoMuted(el.muted);
    setVideoLoop(el.loop);
    setVideoControls(el.controls);
    setVideoWidth(el.style.width || "100%");
    setVideoHeight(el.style.height || "auto");
    setVideoPoster(el.poster || "");
    setVideoFilter(el.style.filter || "none");
  };
  
  const rgbToHex = (rgb: string): string => {
    if (rgb.startsWith('#')) return rgb;
    const result = rgb.match(/\d+/g);
    if (!result) return '#000000';
    return '#' + [parseInt(result[0]), parseInt(result[1]), parseInt(result[2])].map(x => x.toString(16).padStart(2, '0')).join('');
  };

  // --- Update handlers ---
  const updateTextContent = useCallback((value: string) => { setTextContent(value); if (selectedElement) selectedElement.innerText = value; }, [selectedElement]);
  const updateTextColor = useCallback((value: string) => { setTextColor(value); if (selectedElement) selectedElement.style.color = value; }, [selectedElement]);
  const updateBackgroundColor = useCallback((value: string) => { setBackgroundColor(value); if (selectedElement) selectedElement.style.backgroundColor = value; }, [selectedElement]);
  const updateFontFamily = useCallback((value: string) => { setFontFamily(value); if (selectedElement) selectedElement.style.fontFamily = value; }, [selectedElement]);
  const updateFontSize = useCallback((value: string) => { setFontSize(value); if (selectedElement) selectedElement.style.fontSize = `${value}px`; }, [selectedElement]);
  const updateFontWeight = useCallback((value: string) => { setFontWeight(value); if (selectedElement) selectedElement.style.fontWeight = value; }, [selectedElement]);
  const updateFontStyle = useCallback((value: string) => { setFontStyle(value); if (selectedElement) selectedElement.style.fontStyle = value; }, [selectedElement]);
  const updateTextAlign = useCallback((value: string) => { setTextAlign(value); if (selectedElement) selectedElement.style.textAlign = value; }, [selectedElement]);
  const updateTextDecoration = useCallback((value: string) => { setTextDecoration(value); if (selectedElement) selectedElement.style.textDecoration = value; }, [selectedElement]);
  const addAnimation = useCallback((css: string) => { if (selectedElement) { selectedElement.style.cssText += css; toast.success("Animation applied"); } }, [selectedElement]);
  
  const updateImageWidth = useCallback((v: string) => { setImageWidth(v); if (selectedElement?.tagName === 'IMG') selectedElement.style.width = v.includes('%') || v.includes('px') ? v : `${v}px`; }, [selectedElement]);
  const updateImageHeight = useCallback((v: string) => { setImageHeight(v); if (selectedElement?.tagName === 'IMG') selectedElement.style.height = v === 'auto' ? 'auto' : v.includes('%') || v.includes('px') ? v : `${v}px`; }, [selectedElement]);
  const updateImageFit = useCallback((v: string) => { setImageFit(v); if (selectedElement?.tagName === 'IMG') (selectedElement as HTMLImageElement).style.objectFit = v as any; }, [selectedElement]);
  
  const updateVideoAutoplay = useCallback((v: boolean) => { setVideoAutoplay(v); if (selectedElement?.tagName === 'VIDEO') (selectedElement as HTMLVideoElement).autoplay = v; }, [selectedElement]);
  const updateVideoMuted = useCallback((v: boolean) => { setVideoMuted(v); if (selectedElement?.tagName === 'VIDEO') (selectedElement as HTMLVideoElement).muted = v; }, [selectedElement]);
  const updateVideoLoop = useCallback((v: boolean) => { setVideoLoop(v); if (selectedElement?.tagName === 'VIDEO') (selectedElement as HTMLVideoElement).loop = v; }, [selectedElement]);
  const updateVideoControls = useCallback((v: boolean) => { setVideoControls(v); if (selectedElement?.tagName === 'VIDEO') (selectedElement as HTMLVideoElement).controls = v; }, [selectedElement]);
  const updateVideoWidth = useCallback((v: string) => { setVideoWidth(v); if (selectedElement?.tagName === 'VIDEO') selectedElement.style.width = v; }, [selectedElement]);
  const updateVideoHeight = useCallback((v: string) => { setVideoHeight(v); if (selectedElement?.tagName === 'VIDEO') selectedElement.style.height = v; }, [selectedElement]);
  const updateVideoPoster = useCallback((v: string) => { setVideoPoster(v); if (selectedElement?.tagName === 'VIDEO') (selectedElement as HTMLVideoElement).poster = v; }, [selectedElement]);
  const updateVideoFilter = useCallback((v: string) => { setVideoFilter(v); if (selectedElement?.tagName === 'VIDEO') selectedElement.style.filter = v; }, [selectedElement]);

  // --- Clipboard ---
  const handleCopyElement = useCallback(() => { if (selectedElement) { setClipboard(selectedElement.outerHTML); toast.success("Element copied"); } }, [selectedElement]);
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
    if (selectedElement?.parentElement) {
      pushState(iframeRef.current?.contentDocument?.documentElement.outerHTML || '');
      selectedElement.remove();
      setSelectedElement(null);
      setElementType('none');
      setShowToolbar(false);
      toast.success("Element deleted");
    }
  }, [selectedElement, pushState]);

  const handleUndo = useCallback(() => { const html = undo(); if (html) { setHtmlContent(html); toast.success("Undo"); } }, [undo]);
  const handleRedo = useCallback(() => { const html = redo(); if (html) { setHtmlContent(html); toast.success("Redo"); } }, [redo]);

  // --- Media upload ---
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedElement) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (template) {
          const updatedTemplate = { ...template, assets: { ...(template.assets || {}), [file.name]: dataUrl } };
          templateStorage.save(updatedTemplate);
          setTemplate(updatedTemplate);
        }
        if (selectedElement.tagName === 'IMG') (selectedElement as HTMLImageElement).src = dataUrl;
        else if (selectedElement.tagName === 'VIDEO') { (selectedElement as HTMLVideoElement).src = dataUrl; (selectedElement as HTMLVideoElement).load(); }
        toast.success(`${file.type.includes('video') ? 'Video' : 'Image'} updated`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => updateVideoPoster(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // --- Save/Download ---
  const handleSave = (isDraft = false) => {
    const user = userStorage.getCurrentUser();
    if (!user) { toast.error("Please log in to save"); return; }
    const currentHtml = iframeRef.current?.contentDocument?.documentElement.outerHTML || htmlContent;
    const customized: CustomizedTemplate = {
      id: `custom-${Date.now()}`, userId: user.id, templateId: template?.id || "",
      customizedHtml: currentHtml, customData: {}, isDraft,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    customizedTemplateStorage.save(customized);
    if (isDraft) { if (!user.draftTemplates.includes(customized.id)) user.draftTemplates.push(customized.id); }
    else { if (!user.customizedTemplates.includes(customized.id)) user.customizedTemplates.push(customized.id); }
    userStorage.save(user);
    toast.success(isDraft ? "Saved as draft" : "Template saved");
  };

  const handleDownload = () => {
    const currentHtml = iframeRef.current?.contentDocument?.documentElement.outerHTML || htmlContent;
    const blob = new Blob([currentHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${template?.title || 'template'}.html`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Template downloaded");
  };

  if (!template) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
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
      
      {/* Resize Handles */}
      <ResizeHandles element={selectedElement} iframeRef={iframeRef} />

      {/* Top Toolbar */}
      <div className="border-b bg-card/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/templates")}>
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <h2 className="text-sm font-semibold truncate max-w-[200px]">{template.title}</h2>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Undo/Redo */}
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleUndo} disabled={!canUndo} title="Undo (Ctrl+Z)">
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleRedo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)">
              <Redo2 className="w-4 h-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-5" />
            
            {/* Copy/Paste/Delete */}
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleCopyElement} disabled={!selectedElement} title="Copy (Ctrl+C)">
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handlePasteElement} disabled={!clipboard} title="Paste (Ctrl+V)">
              <Clipboard className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleDeleteElement} disabled={!selectedElement} title="Delete">
              <Trash2 className="w-4 h-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-5" />

            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => handleSave(true)}>
              Save Draft
            </Button>
            <Button variant="default" size="sm" className="h-8 text-xs" onClick={() => handleSave(false)}>
              <Save className="w-3.5 h-3.5 mr-1.5" />
              Save
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleDownload}>
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div
          ref={containerRef}
          className="flex-1 relative overflow-auto bg-muted/30"
          onWheel={handleWheel}
        >
          {/* Canvas background pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }} />

          {/* Device frame */}
          <div className="flex justify-center items-start p-6 min-h-full">
            <div
              className="relative transition-all duration-300 ease-out"
              style={{
                width: viewportWidths[viewport],
                maxWidth: viewport === 'desktop' ? '100%' : viewportWidths[viewport],
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
              }}
            >
              {/* Device chrome for non-desktop */}
              {viewport !== 'desktop' && (
                <div className="mb-2 flex items-center justify-center">
                  <div className="px-3 py-1 rounded-full bg-muted text-[10px] font-mono text-muted-foreground border">
                    {viewport === 'tablet' ? '768 × 1024' : '375 × 812'}
                  </div>
                </div>
              )}
              
              <Card className={`overflow-hidden shadow-2xl ${viewport !== 'desktop' ? 'rounded-2xl border-2' : ''}`}>
                {/* Grid Overlay */}
                <div className="relative">
                  <GridOverlay
                    showGrid={showGrid}
                    showGuides={showGuides}
                    width={viewport === 'desktop' ? 1440 : viewport === 'tablet' ? 768 : 375}
                    height={800}
                    zoom={zoom}
                  />
                  <iframe
                    ref={iframeRef}
                    className="w-full border-0"
                    style={{ 
                      height: viewport === 'mobile' ? '812px' : viewport === 'tablet' ? '1024px' : 'calc(100vh - 120px)',
                      minHeight: '500px',
                    }}
                    title="Template Editor"
                  />
                </div>
              </Card>
            </div>
          </div>

          {/* Canvas Controls (bottom bar) */}
          <CanvasControls
            zoom={zoom}
            viewport={viewport}
            showGrid={showGrid}
            showGuides={showGuides}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onZoomReset={zoomReset}
            onZoomFit={zoomFit}
            onViewportChange={setViewport}
            onToggleGrid={() => setShowGrid(v => !v)}
            onToggleGuides={() => setShowGuides(v => !v)}
          />
        </div>

        {/* Properties Sidebar */}
        <div className="w-80 border-l bg-card flex flex-col">
          <Tabs defaultValue="properties" className="flex-1 flex flex-col">
            <div className="p-3 border-b flex-shrink-0">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="properties" className="gap-1.5 text-xs">
                  <Settings className="w-3.5 h-3.5" />
                  Props
                </TabsTrigger>
                <TabsTrigger value="elements" className="gap-1.5 text-xs">
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </TabsTrigger>
                <TabsTrigger value="layers" className="gap-1.5 text-xs">
                  <Layers className="w-3.5 h-3.5" />
                  Layers
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
                    if (element) { doc.body.appendChild(element); toast.success("Element added"); }
                  }
                }}
              />
            </TabsContent>

            <TabsContent value="properties" className="flex-1 m-0 overflow-hidden">
              <div className="p-3 border-b">
                <p className="text-sm font-medium">
                  {elementType === 'none' ? 'No Selection' : `Editing: ${elementType}`}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {elementType === 'none' ? 'Click an element to edit' : 'Double-click text to edit inline'}
                </p>
              </div>
              
              <ScrollArea className="h-[calc(100vh-12rem)]" onWheel={(e) => e.stopPropagation()}>
                <div className="p-4" onWheel={(e) => e.stopPropagation()}>

                  {elementType === 'none' && (
                    <div className="text-center text-muted-foreground py-8 space-y-2">
                      <div className="w-12 h-12 mx-auto rounded-xl bg-muted flex items-center justify-center">
                        <Settings className="w-6 h-6 opacity-40" />
                      </div>
                      <p className="text-sm">Select an element to edit its properties</p>
                      <p className="text-xs">Click any element in the canvas</p>
                    </div>
                  )}

                  {(elementType === 'text' || elementType === 'container') && (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground uppercase">Content</Label>
                        <Textarea value={textContent} onChange={(e) => updateTextContent(e.target.value)} placeholder="Enter text..." rows={3} className="mt-1.5" />
                      </div>
                      <Separator />
                      <div className="space-y-3">
                        <Label className="text-xs font-medium text-muted-foreground uppercase">Colors</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">Text</Label>
                            <div className="flex gap-1 mt-1">
                              <Input type="color" value={textColor} onChange={(e) => updateTextColor(e.target.value)} className="w-10 h-8 p-0.5 cursor-pointer" />
                              <Input type="text" value={textColor} onChange={(e) => updateTextColor(e.target.value)} className="flex-1 h-8 text-xs" />
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs">Background</Label>
                            <div className="flex gap-1 mt-1">
                              <Input type="color" value={backgroundColor} onChange={(e) => updateBackgroundColor(e.target.value)} className="w-10 h-8 p-0.5 cursor-pointer" />
                              <Input type="text" value={backgroundColor} onChange={(e) => updateBackgroundColor(e.target.value)} className="flex-1 h-8 text-xs" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-3">
                        <Label className="text-xs font-medium text-muted-foreground uppercase">Typography</Label>
                        <div>
                          <Label className="text-xs">Font Family</Label>
                          <Select value={fontFamily} onValueChange={updateFontFamily}>
                            <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {["Arial","Helvetica","Times New Roman","Georgia","Verdana","Courier New","Trebuchet MS","Palatino","Roboto","Open Sans","Lato","Montserrat","Poppins","Playfair Display","Merriweather"].map(f => (
                                <SelectItem key={f} value={f} style={{ fontFamily: f }}>{f}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">Size (px)</Label>
                            <Input type="number" value={fontSize} onChange={(e) => updateFontSize(e.target.value)} min="8" max="200" className="mt-1 h-8 text-xs" />
                          </div>
                          <div>
                            <Label className="text-xs">Weight</Label>
                            <Select value={fontWeight} onValueChange={updateFontWeight}>
                              <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="300">Light</SelectItem>
                                <SelectItem value="400">Normal</SelectItem>
                                <SelectItem value="500">Medium</SelectItem>
                                <SelectItem value="600">Semi Bold</SelectItem>
                                <SelectItem value="700">Bold</SelectItem>
                                <SelectItem value="800">Extra Bold</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-3">
                        <Label className="text-xs font-medium text-muted-foreground uppercase">Alignment & Style</Label>
                        <div>
                          <Label className="text-xs">Align</Label>
                          <Select value={textAlign} onValueChange={updateTextAlign}>
                            <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="left">Left</SelectItem>
                              <SelectItem value="center">Center</SelectItem>
                              <SelectItem value="right">Right</SelectItem>
                              <SelectItem value="justify">Justify</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Decoration</Label>
                          <Select value={textDecoration} onValueChange={updateTextDecoration}>
                            <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="underline">Underline</SelectItem>
                              <SelectItem value="overline">Overline</SelectItem>
                              <SelectItem value="line-through">Line Through</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  {elementType === 'image' && (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground uppercase">Replace Image</Label>
                        <Button variant="outline" className="w-full mt-1.5 h-9" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="w-4 h-4 mr-2" />Choose Image
                        </Button>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleMediaUpload} />
                      </div>
                      <Separator />
                      <div className="space-y-3">
                        <Label className="text-xs font-medium text-muted-foreground uppercase">Dimensions</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <div><Label className="text-xs">Width</Label><Input type="text" value={imageWidth} onChange={(e) => updateImageWidth(e.target.value)} placeholder="100% or 300px" className="mt-1 h-8 text-xs" /></div>
                          <div><Label className="text-xs">Height</Label><Input type="text" value={imageHeight} onChange={(e) => updateImageHeight(e.target.value)} placeholder="auto" className="mt-1 h-8 text-xs" /></div>
                        </div>
                        <div>
                          <Label className="text-xs">Object Fit</Label>
                          <Select value={imageFit} onValueChange={updateImageFit}>
                            <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
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
                    </div>
                  )}

                  {elementType === 'video' && (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground uppercase">Replace Video</Label>
                        <Button variant="outline" className="w-full mt-1.5 h-9" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="w-4 h-4 mr-2" />Choose Video
                        </Button>
                        <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={handleMediaUpload} />
                      </div>
                      <Separator />
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground uppercase">Poster</Label>
                        <Button variant="outline" className="w-full mt-1.5 h-9" onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file'; input.accept = 'image/*';
                          input.onchange = (e) => handlePosterUpload(e as any);
                          input.click();
                        }}>
                          <Upload className="w-4 h-4 mr-2" />Upload Poster
                        </Button>
                        {videoPoster && (
                          <div className="mt-2 relative">
                            <img src={videoPoster} alt="Poster" className="w-full h-20 object-cover rounded" />
                            <Button variant="destructive" size="sm" className="absolute top-1 right-1 h-6 text-xs" onClick={() => updateVideoPoster("")}>Remove</Button>
                          </div>
                        )}
                      </div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label className="text-xs">Width</Label><Input type="text" value={videoWidth} onChange={(e) => updateVideoWidth(e.target.value)} className="mt-1 h-8 text-xs" /></div>
                        <div><Label className="text-xs">Height</Label><Input type="text" value={videoHeight} onChange={(e) => updateVideoHeight(e.target.value)} className="mt-1 h-8 text-xs" /></div>
                      </div>
                      <Separator />
                      <div className="space-y-3">
                        <Label className="text-xs font-medium text-muted-foreground uppercase">Playback</Label>
                        <div className="flex items-center justify-between"><Label className="text-xs">Autoplay</Label><Switch checked={videoAutoplay} onCheckedChange={updateVideoAutoplay} /></div>
                        <div className="flex items-center justify-between"><Label className="text-xs">Muted</Label><Switch checked={videoMuted} onCheckedChange={updateVideoMuted} /></div>
                        <div className="flex items-center justify-between"><Label className="text-xs">Loop</Label><Switch checked={videoLoop} onCheckedChange={updateVideoLoop} /></div>
                        <div className="flex items-center justify-between"><Label className="text-xs">Controls</Label><Switch checked={videoControls} onCheckedChange={updateVideoControls} /></div>
                      </div>
                      <Separator />
                      <div>
                        <Label className="text-xs">Filter</Label>
                        <Select value={videoFilter} onValueChange={updateVideoFilter}>
                          <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="grayscale(100%)">Grayscale</SelectItem>
                            <SelectItem value="sepia(100%)">Sepia</SelectItem>
                            <SelectItem value="blur(2px)">Blur</SelectItem>
                            <SelectItem value="brightness(1.2)">Brightness</SelectItem>
                            <SelectItem value="contrast(1.2)">Contrast</SelectItem>
                            <SelectItem value="saturate(1.5)">Saturate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="layers" className="flex-1 m-0 overflow-hidden">
              <LayersPanel
                iframeRef={iframeRef}
                selectedElement={selectedElement}
                onSelectElement={(el) => {
                  const iframeDoc = iframeRef.current?.contentDocument;
                  if (iframeDoc) iframeDoc.querySelectorAll('.editor-selected').forEach(e => e.classList.remove('editor-selected'));
                  setSelectedElement(el);
                  el.classList.add('editor-selected');
                  detectElementType(el);
                  
                  const rect = el.getBoundingClientRect();
                  const iframeRect = iframeRef.current!.getBoundingClientRect();
                  setToolbarPosition({ x: iframeRect.left + rect.left + rect.width / 2, y: iframeRect.top + rect.top });
                  setShowToolbar(true);
                }}
                onDeleteElement={handleDeleteElement}
                onCopyElement={handleCopyElement}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Editor;
