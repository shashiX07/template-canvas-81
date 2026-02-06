import { useState, useCallback, useRef } from "react";

const ZOOM_STEPS = [25, 33, 50, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200, 250, 300];

export function useCanvasZoom(initialZoom = 100) {
  const [zoom, setZoom] = useState(initialZoom);
  const containerRef = useRef<HTMLDivElement>(null);

  const zoomIn = useCallback(() => {
    setZoom((prev) => {
      const nextStep = ZOOM_STEPS.find((s) => s > prev);
      return nextStep || prev;
    });
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((prev) => {
      const prevStep = [...ZOOM_STEPS].reverse().find((s) => s < prev);
      return prevStep || prev;
    });
  }, []);

  const zoomReset = useCallback(() => {
    setZoom(100);
  }, []);

  const zoomFit = useCallback(() => {
    if (!containerRef.current) {
      setZoom(100);
      return;
    }
    // Fit to container width with some padding
    const containerWidth = containerRef.current.clientWidth - 64;
    const iframeWidth = containerRef.current.querySelector('iframe')?.clientWidth || 1440;
    const fitZoom = Math.round((containerWidth / iframeWidth) * 100);
    setZoom(Math.min(Math.max(fitZoom, 25), 200));
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      if (e.deltaY < 0) {
        zoomIn();
      } else {
        zoomOut();
      }
    }
  }, [zoomIn, zoomOut]);

  return {
    zoom,
    setZoom,
    zoomIn,
    zoomOut,
    zoomReset,
    zoomFit,
    handleWheel,
    containerRef,
  };
}
