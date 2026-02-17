import { useState, useEffect, useCallback, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  Type,
  Image,
  Video,
  Square,
  Link,
  List,
  Table,
  FormInput,
  Navigation,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  GripVertical,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface LayerNode {
  element: HTMLElement;
  tagName: string;
  id: string;
  className: string;
  children: LayerNode[];
  isVisible: boolean;
  depth: number;
}

interface LayersPanelProps {
  iframeRef: React.RefObject<HTMLIFrameElement>;
  selectedElement: HTMLElement | null;
  onSelectElement: (element: HTMLElement) => void;
  onDeleteElement: () => void;
  onCopyElement: () => void;
}

const getElementIcon = (tagName: string) => {
  switch (tagName.toLowerCase()) {
    case 'img': return <Image className="w-3.5 h-3.5" />;
    case 'video': return <Video className="w-3.5 h-3.5" />;
    case 'a': return <Link className="w-3.5 h-3.5" />;
    case 'ul': case 'ol': case 'li': return <List className="w-3.5 h-3.5" />;
    case 'table': case 'tr': case 'td': case 'th': return <Table className="w-3.5 h-3.5" />;
    case 'input': case 'textarea': case 'select': case 'form': return <FormInput className="w-3.5 h-3.5" />;
    case 'nav': case 'header': case 'footer': return <Navigation className="w-3.5 h-3.5" />;
    case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6': case 'p': case 'span':
      return <Type className="w-3.5 h-3.5" />;
    default: return <Square className="w-3.5 h-3.5" />;
  }
};

const getElementLabel = (element: HTMLElement): string => {
  const tagName = element.tagName.toLowerCase();
  const id = element.id ? `#${element.id}` : '';
  const className = element.className && typeof element.className === 'string' 
    ? `.${element.className.split(' ').filter(c => !c.startsWith('editor-'))[0] || ''}` 
    : '';
  
  if (['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'button', 'label'].includes(tagName)) {
    const text = element.textContent?.trim().substring(0, 20);
    if (text) return `${tagName}${id}${className} "${text}${text.length >= 20 ? '...' : ''}"`;
  }
  
  return `${tagName}${id}${className}`;
};

export const LayersPanel = ({
  iframeRef,
  selectedElement,
  onSelectElement,
  onDeleteElement,
  onCopyElement,
}: LayersPanelProps) => {
  const [layers, setLayers] = useState<LayerNode[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [draggedElement, setDraggedElement] = useState<HTMLElement | null>(null);
  const [dropTarget, setDropTarget] = useState<HTMLElement | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | 'inside'>('after');
  const dragCounter = useRef(0);

  const getNodeKey = (node: { tagName: string; element: HTMLElement; depth: number }) => {
    // Use a stable key based on element reference
    const idx = Array.from(node.element.parentElement?.children || []).indexOf(node.element);
    return `${node.depth}-${node.tagName}-${idx}`;
  };

  const buildLayerTree = useCallback((element: HTMLElement, depth: number = 0): LayerNode | null => {
    const skipTags = ['script', 'style', 'meta', 'link', 'title', 'head', 'noscript'];
    if (skipTags.includes(element.tagName.toLowerCase())) return null;

    const children: LayerNode[] = [];
    Array.from(element.children).forEach((child) => {
      const childNode = buildLayerTree(child as HTMLElement, depth + 1);
      if (childNode) children.push(childNode);
    });

    return {
      element,
      tagName: element.tagName.toLowerCase(),
      id: element.id || '',
      className: typeof element.className === 'string' ? element.className : '',
      children,
      isVisible: element.style.display !== 'none' && element.style.visibility !== 'hidden',
      depth,
    };
  }, []);

  const refreshLayers = useCallback(() => {
    const iframeDoc = iframeRef.current?.contentDocument;
    if (!iframeDoc?.body) return;

    const bodyNode = buildLayerTree(iframeDoc.body, 0);
    if (bodyNode) {
      setLayers([bodyNode]);
      setExpandedIds(prev => {
        if (prev.size > 0) return prev;
        const autoExpand = new Set<string>();
        const addExpanded = (node: LayerNode, d: number) => {
          if (d < 3) {
            autoExpand.add(getNodeKey(node));
            node.children.forEach(child => addExpanded(child, d + 1));
          }
        };
        addExpanded(bodyNode, 0);
        return autoExpand;
      });
    }
  }, [iframeRef, buildLayerTree]);

  useEffect(() => {
    refreshLayers();
    const interval = setInterval(refreshLayers, 2000);
    return () => clearInterval(interval);
  }, [refreshLayers]);

  const toggleExpand = (node: LayerNode) => {
    const key = getNodeKey(node);
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) newSet.delete(key);
      else newSet.add(key);
      return newSet;
    });
  };

  const toggleVisibility = (node: LayerNode) => {
    const element = node.element;
    if (element.style.display === 'none') {
      element.style.display = '';
    } else {
      element.style.display = 'none';
    }
    refreshLayers();
  };

  const moveElement = (direction: 'up' | 'down') => {
    if (!selectedElement || !selectedElement.parentElement) return;
    const parent = selectedElement.parentElement;
    const siblings = Array.from(parent.children);
    const currentIndex = siblings.indexOf(selectedElement);
    
    if (direction === 'up' && currentIndex > 0) {
      parent.insertBefore(selectedElement, siblings[currentIndex - 1]);
      toast.success("Moved up");
    } else if (direction === 'down' && currentIndex < siblings.length - 1) {
      parent.insertBefore(siblings[currentIndex + 1], selectedElement);
      toast.success("Moved down");
    }
    refreshLayers();
  };

  const alignElement = (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (!selectedElement) return;
    
    switch (alignment) {
      case 'left':
        selectedElement.style.marginLeft = '0';
        selectedElement.style.marginRight = 'auto';
        selectedElement.style.textAlign = 'left';
        break;
      case 'center':
        selectedElement.style.marginLeft = 'auto';
        selectedElement.style.marginRight = 'auto';
        selectedElement.style.textAlign = 'center';
        break;
      case 'right':
        selectedElement.style.marginLeft = 'auto';
        selectedElement.style.marginRight = '0';
        selectedElement.style.textAlign = 'right';
        break;
      case 'top':
        selectedElement.style.alignSelf = 'flex-start';
        selectedElement.style.verticalAlign = 'top';
        break;
      case 'middle':
        selectedElement.style.alignSelf = 'center';
        selectedElement.style.verticalAlign = 'middle';
        break;
      case 'bottom':
        selectedElement.style.alignSelf = 'flex-end';
        selectedElement.style.verticalAlign = 'bottom';
        break;
    }
    toast.success(`Aligned ${alignment}`);
  };

  // Drag and drop for reordering
  const handleDragStart = (e: React.DragEvent, element: HTMLElement) => {
    e.stopPropagation();
    setDraggedElement(element);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', ''); // Required for Firefox
  };

  const handleDragOver = (e: React.DragEvent, targetElement: HTMLElement) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedElement || draggedElement === targetElement) return;
    if (draggedElement.contains(targetElement)) return; // Can't drop into own children
    
    e.dataTransfer.dropEffect = 'move';
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const third = rect.height / 3;
    
    if (y < third) {
      setDropPosition('before');
    } else if (y > third * 2) {
      setDropPosition('after');
    } else {
      setDropPosition('inside');
    }
    
    setDropTarget(targetElement);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current <= 0) {
      setDropTarget(null);
      dragCounter.current = 0;
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.stopPropagation();
    dragCounter.current++;
  };

  const handleDrop = (e: React.DragEvent, targetElement: HTMLElement) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedElement || draggedElement === targetElement) {
      resetDrag();
      return;
    }
    if (draggedElement.contains(targetElement)) {
      resetDrag();
      return;
    }

    try {
      if (dropPosition === 'before') {
        targetElement.parentElement?.insertBefore(draggedElement, targetElement);
      } else if (dropPosition === 'after') {
        targetElement.parentElement?.insertBefore(draggedElement, targetElement.nextSibling);
      } else {
        // inside
        targetElement.appendChild(draggedElement);
      }
      toast.success("Element reordered");
    } catch {
      toast.error("Could not move element there");
    }

    resetDrag();
    refreshLayers();
  };

  const resetDrag = () => {
    setDraggedElement(null);
    setDropTarget(null);
    dragCounter.current = 0;
  };

  const renderLayer = (node: LayerNode): React.ReactNode => {
    const key = getNodeKey(node);
    const isExpanded = expandedIds.has(key);
    const isSelected = selectedElement === node.element;
    const hasChildren = node.children.length > 0;
    const isDragTarget = dropTarget === node.element;
    const isDragged = draggedElement === node.element;

    return (
      <div key={key + '-' + node.element.tagName}>
        <div
          className={cn(
            "flex items-center gap-0.5 py-1 px-1 rounded-sm cursor-pointer transition-all text-xs group relative",
            isSelected 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-muted",
            isDragged && "opacity-40",
            isDragTarget && dropPosition === 'before' && "border-t-2 border-primary",
            isDragTarget && dropPosition === 'after' && "border-b-2 border-primary",
            isDragTarget && dropPosition === 'inside' && "bg-primary/20 ring-1 ring-primary",
          )}
          style={{ paddingLeft: `${node.depth * 12 + 4}px` }}
          onClick={() => onSelectElement(node.element)}
          draggable
          onDragStart={(e) => handleDragStart(e, node.element)}
          onDragOver={(e) => handleDragOver(e, node.element)}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, node.element)}
          onDragEnd={resetDrag}
        >
          {/* Drag handle */}
          <span className="opacity-0 group-hover:opacity-60 cursor-grab active:cursor-grabbing shrink-0">
            <GripVertical className="w-3 h-3" />
          </span>

          {hasChildren ? (
            <button
              className="p-0.5 hover:bg-background/20 rounded shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node);
              }}
            >
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          ) : (
            <span className="w-4 shrink-0" />
          )}
          
          <span className="shrink-0">{getElementIcon(node.tagName)}</span>
          
          <span className="flex-1 truncate ml-1">
            {getElementLabel(node.element)}
          </span>

          <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
            <button
              className="p-0.5 hover:bg-background/20 rounded"
              onClick={(e) => {
                e.stopPropagation();
                toggleVisibility(node);
              }}
            >
              {node.isVisible ? (
                <Eye className="w-3 h-3 opacity-50" />
              ) : (
                <EyeOff className="w-3 h-3 opacity-50" />
              )}
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>{node.children.map(child => renderLayer(child))}</div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar: Move + Align */}
      <div className="flex items-center gap-0.5 p-2 border-b flex-wrap">
        <Button
          variant="ghost" size="sm" className="h-7 w-7 p-0"
          onClick={() => moveElement('up')}
          disabled={!selectedElement}
          title="Move Up"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost" size="sm" className="h-7 w-7 p-0"
          onClick={() => moveElement('down')}
          disabled={!selectedElement}
          title="Move Down"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </Button>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Horizontal alignment */}
        <Button
          variant="ghost" size="sm" className="h-7 w-7 p-0"
          onClick={() => alignElement('left')}
          disabled={!selectedElement}
          title="Align Left"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost" size="sm" className="h-7 w-7 p-0"
          onClick={() => alignElement('center')}
          disabled={!selectedElement}
          title="Align Center"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost" size="sm" className="h-7 w-7 p-0"
          onClick={() => alignElement('right')}
          disabled={!selectedElement}
          title="Align Right"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </Button>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Vertical alignment */}
        <Button
          variant="ghost" size="sm" className="h-7 w-7 p-0"
          onClick={() => alignElement('top')}
          disabled={!selectedElement}
          title="Align Top"
        >
          <AlignVerticalJustifyStart className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost" size="sm" className="h-7 w-7 p-0"
          onClick={() => alignElement('middle')}
          disabled={!selectedElement}
          title="Align Middle"
        >
          <AlignVerticalJustifyCenter className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost" size="sm" className="h-7 w-7 p-0"
          onClick={() => alignElement('bottom')}
          disabled={!selectedElement}
          title="Align Bottom"
        >
          <AlignVerticalJustifyEnd className="w-3.5 h-3.5" />
        </Button>

        <div className="flex-1" />

        <Button
          variant="ghost" size="sm" className="h-7 w-7 p-0"
          onClick={onCopyElement}
          disabled={!selectedElement}
          title="Copy"
        >
          <Copy className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive"
          onClick={onDeleteElement}
          disabled={!selectedElement}
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Layer Tree */}
      <ScrollArea className="flex-1">
        <div className="p-1">
          {layers.map(layer => renderLayer(layer))}
        </div>
      </ScrollArea>

      <div className="p-2 border-t text-xs text-muted-foreground text-center">
        Drag to reorder • Arrows to move • Click to select
      </div>
    </div>
  );
};
