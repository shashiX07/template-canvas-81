import { useCallback, useEffect, useState, useRef } from "react";

interface ResizeHandlesProps {
  element: HTMLElement | null;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  onResizeEnd?: () => void;
}

type HandlePosition = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

const handleCursors: Record<HandlePosition, string> = {
  nw: 'nwse-resize',
  n: 'ns-resize',
  ne: 'nesw-resize',
  e: 'ew-resize',
  se: 'nwse-resize',
  s: 'ns-resize',
  sw: 'nesw-resize',
  w: 'ew-resize',
};

export const ResizeHandles = ({ element, iframeRef, onResizeEnd }: ResizeHandlesProps) => {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [iframeOffset, setIframeOffset] = useState({ left: 0, top: 0 });
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0 });
  const activeHandle = useRef<HandlePosition | null>(null);

  const updateRect = useCallback(() => {
    if (!element || !iframeRef.current) {
      setRect(null);
      return;
    }
    const iframe = iframeRef.current;
    const iframeRect = iframe.getBoundingClientRect();
    setIframeOffset({ left: iframeRect.left, top: iframeRect.top });
    setRect(element.getBoundingClientRect());
  }, [element, iframeRef]);

  useEffect(() => {
    updateRect();
    const interval = setInterval(updateRect, 200);
    const iframeDoc = iframeRef.current?.contentDocument;
    iframeDoc?.addEventListener('scroll', updateRect);
    window.addEventListener('resize', updateRect);
    return () => {
      clearInterval(interval);
      iframeDoc?.removeEventListener('scroll', updateRect);
      window.removeEventListener('resize', updateRect);
    };
  }, [updateRect]);

  const handleMouseDown = useCallback((e: React.MouseEvent, position: HandlePosition) => {
    e.preventDefault();
    e.stopPropagation();
    if (!element) return;

    isDragging.current = true;
    activeHandle.current = position;
    startPos.current = { x: e.clientX, y: e.clientY };
    const computedStyle = element.ownerDocument.defaultView?.getComputedStyle(element);
    startSize.current = {
      width: parseFloat(computedStyle?.width || '0'),
      height: parseFloat(computedStyle?.height || '0'),
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !element) return;
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      const pos = activeHandle.current;

      let newWidth = startSize.current.width;
      let newHeight = startSize.current.height;

      if (pos?.includes('e')) newWidth = Math.max(20, startSize.current.width + dx);
      if (pos?.includes('w')) newWidth = Math.max(20, startSize.current.width - dx);
      if (pos?.includes('s')) newHeight = Math.max(20, startSize.current.height + dy);
      if (pos?.includes('n')) newHeight = Math.max(20, startSize.current.height - dy);

      element.style.width = `${newWidth}px`;
      element.style.height = `${newHeight}px`;
      updateRect();
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      activeHandle.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      onResizeEnd?.();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [element, updateRect, onResizeEnd]);

  if (!rect || !element) return null;

  const positions: { pos: HandlePosition; style: React.CSSProperties }[] = [
    { pos: 'nw', style: { left: -4, top: -4 } },
    { pos: 'n', style: { left: '50%', top: -4, transform: 'translateX(-50%)' } },
    { pos: 'ne', style: { right: -4, top: -4 } },
    { pos: 'e', style: { right: -4, top: '50%', transform: 'translateY(-50%)' } },
    { pos: 'se', style: { right: -4, bottom: -4 } },
    { pos: 's', style: { left: '50%', bottom: -4, transform: 'translateX(-50%)' } },
    { pos: 'sw', style: { left: -4, bottom: -4 } },
    { pos: 'w', style: { left: -4, top: '50%', transform: 'translateY(-50%)' } },
  ];

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: iframeOffset.left + rect.left,
        top: iframeOffset.top + rect.top,
        width: rect.width,
        height: rect.height,
      }}
    >
      {positions.map(({ pos, style }) => (
        <div
          key={pos}
          className="absolute w-[8px] h-[8px] bg-primary border-2 border-primary-foreground rounded-sm shadow-sm pointer-events-auto"
          style={{ ...style, cursor: handleCursors[pos] }}
          onMouseDown={(e) => handleMouseDown(e, pos)}
        />
      ))}
    </div>
  );
};
