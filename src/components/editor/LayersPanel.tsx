import { useState, useEffect, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
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
  ArrowDown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LayerNode {
  element: HTMLElement;
  tagName: string;
  id: string;
  className: string;
  children: LayerNode[];
  isExpanded: boolean;
  isVisible: boolean;
  isLocked: boolean;
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
    case 'img':
      return <Image className="w-3.5 h-3.5" />;
    case 'video':
      return <Video className="w-3.5 h-3.5" />;
    case 'a':
      return <Link className="w-3.5 h-3.5" />;
    case 'ul':
    case 'ol':
    case 'li':
      return <List className="w-3.5 h-3.5" />;
    case 'table':
    case 'tr':
    case 'td':
    case 'th':
      return <Table className="w-3.5 h-3.5" />;
    case 'input':
    case 'textarea':
    case 'select':
    case 'form':
      return <FormInput className="w-3.5 h-3.5" />;
    case 'nav':
    case 'header':
    case 'footer':
      return <Navigation className="w-3.5 h-3.5" />;
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
    case 'p':
    case 'span':
      return <Type className="w-3.5 h-3.5" />;
    default:
      return <Square className="w-3.5 h-3.5" />;
  }
};

const getElementLabel = (element: HTMLElement): string => {
  const tagName = element.tagName.toLowerCase();
  const id = element.id ? `#${element.id}` : '';
  const className = element.className && typeof element.className === 'string' 
    ? `.${element.className.split(' ')[0]}` 
    : '';
  
  // For text elements, show truncated content
  if (['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'button', 'label'].includes(tagName)) {
    const text = element.textContent?.trim().substring(0, 20);
    if (text) return `${tagName}${id}${className} "${text}${text && text.length >= 20 ? '...' : ''}"`;
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

  const buildLayerTree = useCallback((element: HTMLElement, depth: number = 0): LayerNode | null => {
    // Skip script, style, meta, link tags
    const skipTags = ['script', 'style', 'meta', 'link', 'title', 'head', 'noscript'];
    if (skipTags.includes(element.tagName.toLowerCase())) return null;

    const children: LayerNode[] = [];
    Array.from(element.children).forEach((child) => {
      const childNode = buildLayerTree(child as HTMLElement, depth + 1);
      if (childNode) children.push(childNode);
    });

    const nodeId = `layer-${depth}-${element.tagName}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      element,
      tagName: element.tagName.toLowerCase(),
      id: element.id || '',
      className: typeof element.className === 'string' ? element.className : '',
      children,
      isExpanded: depth < 2,
      isVisible: element.style.display !== 'none' && element.style.visibility !== 'hidden',
      isLocked: false,
      depth,
    };
  }, []);

  const refreshLayers = useCallback(() => {
    const iframeDoc = iframeRef.current?.contentDocument;
    if (!iframeDoc?.body) return;

    const bodyNode = buildLayerTree(iframeDoc.body, 0);
    if (bodyNode) {
      setLayers([bodyNode]);
      // Auto-expand first two levels
      const autoExpand = new Set<string>();
      const addExpanded = (node: LayerNode, currentDepth: number) => {
        if (currentDepth < 3) {
          autoExpand.add(JSON.stringify([node.tagName, node.id, node.className, node.depth]));
          node.children.forEach(child => addExpanded(child, currentDepth + 1));
        }
      };
      addExpanded(bodyNode, 0);
      setExpandedIds(autoExpand);
    }
  }, [iframeRef, buildLayerTree]);

  useEffect(() => {
    refreshLayers();
    
    // Refresh when iframe content changes
    const interval = setInterval(refreshLayers, 2000);
    return () => clearInterval(interval);
  }, [refreshLayers]);

  const toggleExpand = (node: LayerNode) => {
    const key = JSON.stringify([node.tagName, node.id, node.className, node.depth]);
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
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
    } else if (direction === 'down' && currentIndex < siblings.length - 1) {
      parent.insertBefore(siblings[currentIndex + 1], selectedElement);
    }
    
    refreshLayers();
  };

  const renderLayer = (node: LayerNode): React.ReactNode => {
    const key = JSON.stringify([node.tagName, node.id, node.className, node.depth]);
    const isExpanded = expandedIds.has(key);
    const isSelected = selectedElement === node.element;
    const hasChildren = node.children.length > 0;

    return (
      <div key={key}>
        <div
          className={cn(
            "flex items-center gap-1 py-1 px-2 rounded-sm cursor-pointer transition-colors text-xs group",
            isSelected 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-muted"
          )}
          style={{ paddingLeft: `${node.depth * 12 + 4}px` }}
          onClick={() => onSelectElement(node.element)}
        >
          {hasChildren ? (
            <button
              className="p-0.5 hover:bg-background/20 rounded"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          ) : (
            <span className="w-4" />
          )}
          
          {getElementIcon(node.tagName)}
          
          <span className="flex-1 truncate ml-1">
            {getElementLabel(node.element)}
          </span>

          <div className="hidden group-hover:flex items-center gap-0.5">
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
          <div>
            {node.children.map(child => renderLayer(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => moveElement('up')}
          disabled={!selectedElement}
          title="Move Up"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => moveElement('down')}
          disabled={!selectedElement}
          title="Move Down"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </Button>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={onCopyElement}
          disabled={!selectedElement}
          title="Copy"
        >
          <Copy className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
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
        Click to select • Double-click in canvas to edit text
      </div>
    </div>
  );
};