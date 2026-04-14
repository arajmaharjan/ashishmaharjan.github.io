"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

export default function SpotlightCard({
  children,
  className,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<{ x: number; y: number } | null>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    pendingRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const el = ref.current;
      const p = pendingRef.current;
      if (!el || !p) return;
      el.style.setProperty("--mouse-x", `${p.x}px`);
      el.style.setProperty("--mouse-y", `${p.y}px`);
    });
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn("spotlight-card", className)}
    >
      {children}
    </div>
  );
}
