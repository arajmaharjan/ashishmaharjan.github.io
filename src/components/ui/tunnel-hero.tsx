"use client";

import { useRef, useEffect } from "react";

export default function TunnelShowcase() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;

    // If the browser doesn't support OffscreenCanvas+Worker, bail gracefully —
    // the canvas stays blank rather than blocking the main thread.
    const supportsOffscreen =
      typeof (canvas as HTMLCanvasElement).transferControlToOffscreen === "function" &&
      typeof Worker !== "undefined";
    if (!supportsOffscreen) return;

    const worker = new Worker(new URL("./tunnel-worker.ts", import.meta.url), {
      type: "module",
    });

    const dprCap = 1.25;
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    const offscreen = canvas.transferControlToOffscreen();
    worker.postMessage(
      {
        type: "init",
        canvas: offscreen,
        width: window.innerWidth,
        height: window.innerHeight,
        dpr,
      },
      [offscreen],
    );

    let resizeQueued = false;
    const doResize = () => {
      resizeQueued = false;
      worker.postMessage({
        type: "resize",
        width: window.innerWidth,
        height: window.innerHeight,
        dpr: Math.min(window.devicePixelRatio || 1, dprCap),
      });
    };
    const handleResize = () => {
      if (resizeQueued) return;
      resizeQueued = true;
      requestAnimationFrame(doResize);
    };
    const handleOrientation = () => setTimeout(doResize, 150);

    const handleMouseMove = (e: MouseEvent) => {
      worker.postMessage({
        type: "mouse",
        x: e.clientX / window.innerWidth,
        y: 1 - e.clientY / window.innerHeight,
      });
    };

    const handleVisibility = () => {
      worker.postMessage({ type: "pause", paused: !!document.hidden });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientation);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientation);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibility);
      worker.terminate();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        transform: "translateZ(0)",
        willChange: "transform",
        contain: "strict",
      }}
    />
  );
}
