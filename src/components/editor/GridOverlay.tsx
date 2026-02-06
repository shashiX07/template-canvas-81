import { cn } from "@/lib/utils";

interface GridOverlayProps {
  showGrid: boolean;
  showGuides: boolean;
  width: number;
  height: number;
  zoom: number;
}

export const GridOverlay = ({ showGrid, showGuides, width, height, zoom }: GridOverlayProps) => {
  if (!showGrid && !showGuides) return null;

  const gridSize = 20;
  const majorGridSize = 100;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-10"
      style={{ width, height }}
    >
      {/* Minor Grid */}
      {showGrid && (
        <svg className="absolute inset-0 w-full h-full opacity-[0.08]">
          <defs>
            <pattern
              id="minor-grid"
              width={gridSize}
              height={gridSize}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
            <pattern
              id="major-grid"
              width={majorGridSize}
              height={majorGridSize}
              patternUnits="userSpaceOnUse"
            >
              <rect width={majorGridSize} height={majorGridSize} fill="url(#minor-grid)" />
              <path
                d={`M ${majorGridSize} 0 L 0 0 0 ${majorGridSize}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#major-grid)" />
        </svg>
      )}

      {/* Center Guides */}
      {showGuides && (
        <>
          {/* Vertical center */}
          <div
            className="absolute top-0 bottom-0 border-l border-dashed border-primary/30"
            style={{ left: '50%' }}
          />
          {/* Horizontal center */}
          <div
            className="absolute left-0 right-0 border-t border-dashed border-primary/30"
            style={{ top: '50%' }}
          />
          {/* Third guides vertical */}
          <div
            className="absolute top-0 bottom-0 border-l border-dashed border-accent/20"
            style={{ left: '33.33%' }}
          />
          <div
            className="absolute top-0 bottom-0 border-l border-dashed border-accent/20"
            style={{ left: '66.66%' }}
          />
        </>
      )}
    </div>
  );
};
