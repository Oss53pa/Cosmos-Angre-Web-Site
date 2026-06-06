import { useRef, useState, useCallback, useEffect } from 'react';

interface MapInteraction {
  scale: number;
  translateX: number;
  translateY: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  svgWrapRef: React.RefObject<HTMLDivElement | null>;
  handleWheel: (e: React.WheelEvent) => void;
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  isGrabbing: boolean;
  zoomPercent: number;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 3.0;
const ZOOM_STEP = 0.15;
const WHEEL_SENSITIVITY = 0.001;

export function useMapInteraction(): MapInteraction {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isGrabbing, setIsGrabbing] = useState(false);

  const lastPointer = useRef<{ x: number; y: number } | null>(null);

  const clampScale = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      const delta = -e.deltaY * WHEEL_SENSITIVITY;
      const newScale = clampScale(scale + delta * scale);
      const ratio = newScale / scale;

      // Zoom toward cursor position
      setTranslateX((prev) => cursorX - ratio * (cursorX - prev));
      setTranslateY((prev) => cursorY - ratio * (cursorY - prev));
      setScale(newScale);
    },
    [scale]
  );

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Only pan with left button or touch
    if (e.button !== 0) return;
    setIsGrabbing(true);
    lastPointer.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isGrabbing || !lastPointer.current) return;
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      setTranslateX((prev) => prev + dx);
      setTranslateY((prev) => prev + dy);
    },
    [isGrabbing]
  );

  const handlePointerUp = useCallback(() => {
    setIsGrabbing(false);
    lastPointer.current = null;
  }, []);

  const zoomIn = useCallback(() => {
    setScale((prev) => clampScale(prev + ZOOM_STEP));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((prev) => clampScale(prev - ZOOM_STEP));
  }, []);

  const resetView = useCallback(() => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
  }, []);

  // Prevent default wheel scrolling on the container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const prevent = (e: WheelEvent) => e.preventDefault();
    el.addEventListener('wheel', prevent, { passive: false });
    return () => el.removeEventListener('wheel', prevent);
  }, []);

  return {
    scale,
    translateX,
    translateY,
    containerRef,
    svgWrapRef,
    handleWheel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    zoomIn,
    zoomOut,
    resetView,
    isGrabbing,
    zoomPercent: Math.round(scale * 100),
  };
}
