import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Grid3X3,
  Monitor,
  Tablet,
  Smartphone,
  Ruler,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CanvasControlsProps {
  zoom: number;
  viewport: 'desktop' | 'tablet' | 'mobile';
  showGrid: boolean;
  showGuides: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onZoomFit: () => void;
  onViewportChange: (viewport: 'desktop' | 'tablet' | 'mobile') => void;
  onToggleGrid: () => void;
  onToggleGuides: () => void;
}

const viewportSizes = {
  desktop: { width: 1440, label: "Desktop", icon: Monitor },
  tablet: { width: 768, label: "Tablet", icon: Tablet },
  mobile: { width: 375, label: "Mobile", icon: Smartphone },
};

export const CanvasControls = ({
  zoom,
  viewport,
  showGrid,
  showGuides,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onZoomFit,
  onViewportChange,
  onToggleGrid,
  onToggleGuides,
}: CanvasControlsProps) => {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 px-2 py-1.5 bg-popover/95 backdrop-blur border rounded-xl shadow-lg">
      {/* Viewport Switcher */}
      {(Object.keys(viewportSizes) as Array<keyof typeof viewportSizes>).map((key) => {
        const { label, icon: Icon } = viewportSizes[key];
        return (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              <Button
                variant={viewport === key ? "default" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onViewportChange(key)}
              >
                <Icon className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">{label}</TooltipContent>
          </Tooltip>
        );
      })}

      <Separator orientation="vertical" className="h-5 mx-1" />

      {/* Zoom Controls */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">Zoom Out</TooltipContent>
      </Tooltip>

      <button
        onClick={onZoomReset}
        className="h-8 min-w-[52px] px-2 rounded-md text-xs font-mono font-medium hover:bg-muted transition-colors"
      >
        {zoom}%
      </button>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">Zoom In</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onZoomFit}>
            <Maximize className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">Fit to Screen</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="h-5 mx-1" />

      {/* Grid & Guides */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={showGrid ? "default" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onToggleGrid}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">Toggle Grid</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={showGuides ? "default" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onToggleGuides}
          >
            <Ruler className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">Toggle Guides</TooltipContent>
      </Tooltip>
    </div>
  );
};
