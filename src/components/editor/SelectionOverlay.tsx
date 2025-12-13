import { useEffect, useState } from "react";

interface SelectionOverlayProps {
  element: HTMLElement | null;
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

interface BoxModel {
  content: DOMRect;
  padding: { top: number; right: number; bottom: number; left: number };
  margin: { top: number; right: number; bottom: number; left: number };
  border: { top: number; right: number; bottom: number; left: number };
}

export const SelectionOverlay = ({ element, iframeRef }: SelectionOverlayProps) => {
  const [boxModel, setBoxModel] = useState<BoxModel | null>(null);
  const [iframeOffset, setIframeOffset] = useState({ left: 0, top: 0 });

  useEffect(() => {
    if (!element || !iframeRef.current) {
      setBoxModel(null);
      return;
    }

    const updateBoxModel = () => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      const iframeRect = iframe.getBoundingClientRect();
      setIframeOffset({ left: iframeRect.left, top: iframeRect.top });

      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);

      const padding = {
        top: parseFloat(style.paddingTop) || 0,
        right: parseFloat(style.paddingRight) || 0,
        bottom: parseFloat(style.paddingBottom) || 0,
        left: parseFloat(style.paddingLeft) || 0,
      };

      const margin = {
        top: parseFloat(style.marginTop) || 0,
        right: parseFloat(style.marginRight) || 0,
        bottom: parseFloat(style.marginBottom) || 0,
        left: parseFloat(style.marginLeft) || 0,
      };

      const border = {
        top: parseFloat(style.borderTopWidth) || 0,
        right: parseFloat(style.borderRightWidth) || 0,
        bottom: parseFloat(style.borderBottomWidth) || 0,
        left: parseFloat(style.borderLeftWidth) || 0,
      };

      setBoxModel({ content: rect, padding, margin, border });
    };

    updateBoxModel();

    // Update on scroll/resize
    const handleUpdate = () => updateBoxModel();
    const iframeDoc = iframeRef.current.contentDocument;
    iframeDoc?.addEventListener("scroll", handleUpdate);
    window.addEventListener("resize", handleUpdate);

    return () => {
      iframeDoc?.removeEventListener("scroll", handleUpdate);
      window.removeEventListener("resize", handleUpdate);
    };
  }, [element, iframeRef]);

  if (!boxModel || !element) return null;

  const { content, padding, margin } = boxModel;

  // Calculate positions
  const contentBox = {
    left: iframeOffset.left + content.left,
    top: iframeOffset.top + content.top,
    width: content.width,
    height: content.height,
  };

  const paddingBox = {
    left: contentBox.left - padding.left,
    top: contentBox.top - padding.top,
    width: content.width + padding.left + padding.right,
    height: content.height + padding.top + padding.bottom,
  };

  const marginBox = {
    left: paddingBox.left - margin.left,
    top: paddingBox.top - margin.top,
    width: paddingBox.width + margin.left + margin.right,
    height: paddingBox.height + margin.top + margin.bottom,
  };

  return (
    <div className="fixed pointer-events-none z-40" style={{ left: 0, top: 0 }}>
      {/* Margin overlay */}
      {(margin.top > 0 || margin.right > 0 || margin.bottom > 0 || margin.left > 0) && (
        <>
          {/* Top margin */}
          {margin.top > 0 && (
            <div
              className="absolute bg-orange-500/20 border-t border-b border-dashed border-orange-500"
              style={{
                left: marginBox.left,
                top: marginBox.top,
                width: marginBox.width,
                height: margin.top,
              }}
            />
          )}
          {/* Bottom margin */}
          {margin.bottom > 0 && (
            <div
              className="absolute bg-orange-500/20 border-t border-b border-dashed border-orange-500"
              style={{
                left: marginBox.left,
                top: marginBox.top + marginBox.height - margin.bottom,
                width: marginBox.width,
                height: margin.bottom,
              }}
            />
          )}
          {/* Left margin */}
          {margin.left > 0 && (
            <div
              className="absolute bg-orange-500/20 border-l border-r border-dashed border-orange-500"
              style={{
                left: marginBox.left,
                top: marginBox.top + margin.top,
                width: margin.left,
                height: marginBox.height - margin.top - margin.bottom,
              }}
            />
          )}
          {/* Right margin */}
          {margin.right > 0 && (
            <div
              className="absolute bg-orange-500/20 border-l border-r border-dashed border-orange-500"
              style={{
                left: marginBox.left + marginBox.width - margin.right,
                top: marginBox.top + margin.top,
                width: margin.right,
                height: marginBox.height - margin.top - margin.bottom,
              }}
            />
          )}
        </>
      )}

      {/* Padding overlay */}
      {(padding.top > 0 || padding.right > 0 || padding.bottom > 0 || padding.left > 0) && (
        <>
          {/* Top padding */}
          {padding.top > 0 && (
            <div
              className="absolute bg-green-500/20 border-t border-b border-dashed border-green-500"
              style={{
                left: paddingBox.left,
                top: paddingBox.top,
                width: paddingBox.width,
                height: padding.top,
              }}
            />
          )}
          {/* Bottom padding */}
          {padding.bottom > 0 && (
            <div
              className="absolute bg-green-500/20 border-t border-b border-dashed border-green-500"
              style={{
                left: paddingBox.left,
                top: paddingBox.top + paddingBox.height - padding.bottom,
                width: paddingBox.width,
                height: padding.bottom,
              }}
            />
          )}
          {/* Left padding */}
          {padding.left > 0 && (
            <div
              className="absolute bg-green-500/20 border-l border-r border-dashed border-green-500"
              style={{
                left: paddingBox.left,
                top: paddingBox.top + padding.top,
                width: padding.left,
                height: paddingBox.height - padding.top - padding.bottom,
              }}
            />
          )}
          {/* Right padding */}
          {padding.right > 0 && (
            <div
              className="absolute bg-green-500/20 border-l border-r border-dashed border-green-500"
              style={{
                left: paddingBox.left + paddingBox.width - padding.right,
                top: paddingBox.top + padding.top,
                width: padding.right,
                height: paddingBox.height - padding.top - padding.bottom,
              }}
            />
          )}
        </>
      )}

      {/* Content box outline */}
      <div
        className="absolute border-2 border-primary"
        style={{
          left: contentBox.left,
          top: contentBox.top,
          width: contentBox.width,
          height: contentBox.height,
        }}
      />

      {/* Box model labels */}
      <div
        className="absolute text-[10px] px-1 py-0.5 bg-primary text-primary-foreground rounded"
        style={{
          left: contentBox.left,
          top: contentBox.top - 18,
        }}
      >
        {element.tagName.toLowerCase()}
        {element.className && typeof element.className === 'string' && `.${element.className.split(' ')[0]}`}
      </div>

      {/* Dimension indicators */}
      <div
        className="absolute text-[9px] px-1 bg-muted text-muted-foreground rounded"
        style={{
          left: contentBox.left + contentBox.width / 2 - 25,
          top: contentBox.top + contentBox.height + 4,
        }}
      >
        {Math.round(content.width)} × {Math.round(content.height)}
      </div>
    </div>
  );
};
