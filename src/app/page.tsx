"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShaderLines } from "@/components/ui/shader-lines";
import { SpiralAnimation } from "@/components/ui/spiral-animation";
import { ShaderAnimation } from "@/components/ui/shader-animation";
import { MorphingText } from "@/components/ui/morphing-text";

const morphingTexts = [
  "Enter",
  "Explore",
  "Discover",
  "Begin",
  "Welcome",
  "Launch",
];

export default function EntryPage() {
  // Phases: shaderLines → welcome → moving → spiral
  const [phase, setPhase] = useState<
    "shaderLines" | "welcome" | "moving" | "spiral"
  >("shaderLines");
  const [enterVisible, setEnterVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [showShader, setShowShader] = useState(false);
  const router = useRouter();

  // Prefetch /home so it's ready when we navigate
  useEffect(() => {
    router.prefetch("/home");
  }, [router]);

  // Phase 1: Shader Lines plays for 3 seconds, then show welcome text
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("welcome");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Phase 2: Welcome text shows for 2.5 seconds, then moves up
  useEffect(() => {
    if (phase !== "welcome") return;
    const timer = setTimeout(() => {
      setPhase("moving");
    }, 2500);
    return () => clearTimeout(timer);
  }, [phase]);

  // Phase 3: Text moves to top over 1.5s, then start spiral
  useEffect(() => {
    if (phase !== "moving") return;
    const timer = setTimeout(() => {
      setPhase("spiral");
    }, 2000);
    return () => clearTimeout(timer);
  }, [phase]);

  const handleSpiralComplete = useCallback(() => {
    setEnterVisible(true);
  }, []);

  const handleEnter = () => {
    setExiting(true);

    // Immediately show shader rings — they cross-fade in over the spiral
    setShowShader(true);

    // 1.5s: shader is fully visible — navigate NOW while shader covers the screen
    // This hides the black gap because the shader stays mounted during Next.js navigation
    setTimeout(() => {
      router.push("/home");
    }, 1500);
  };

  return (
    <>
      <div
        className="fixed inset-0 w-full h-full overflow-hidden bg-black"
      >
        {/* Shader Lines — immediate background for shaderLines and welcome phases */}
        <AnimatePresence>
          {(phase === "shaderLines" || phase === "welcome" || phase === "moving") && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              <ShaderLines />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Spiral — fades in once text reaches the top */}
        {phase === "spiral" && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <SpiralAnimation onComplete={handleSpiralComplete} />
          </motion.div>
        )}

        {/* Welcome text — appears over shader lines */}
        <AnimatePresence>
          {(phase === "welcome" || phase === "moving") && !exiting && (
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 pointer-events-none"
              initial={{ top: "50%", y: "-50%", opacity: 0 }}
              animate={
                phase === "welcome"
                  ? { top: "50%", y: "-50%", opacity: 1 }
                  : { top: "6%", y: "0%", opacity: 1 }
              }
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 1, ease: "easeInOut" },
                top: { duration: 1.5, ease: "easeInOut" },
                y: { duration: 1.5, ease: "easeInOut" },
              }}
            >
              <span className="text-white/40 text-sm uppercase tracking-[0.3em] font-light">
                Welcome to
              </span>
              <h1 className="text-white text-3xl md:text-5xl tracking-[0.2em] uppercase text-center font-extralight">
                <span className="font-bold">Ashish Maharjan</span>
              </h1>
              <span className="text-white/30 text-xs uppercase tracking-[0.25em]">
                Portfolio
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enter Button — appears after spiral completes */}
        <div
          className={`
            absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10
            flex flex-col items-center gap-6
            transition-all duration-[1500ms] ease-out
            ${exiting ? "opacity-0 scale-95" : enterVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
          `}
        >
          <button
            onClick={handleEnter}
            className="text-white cursor-pointer group"
            aria-label="Enter portfolio"
          >
            <MorphingText
              texts={morphingTexts}
              className="h-10 text-2xl tracking-[0.2em] uppercase font-extralight md:h-12 md:text-3xl lg:text-4xl transition-all duration-700 group-hover:tracking-[0.3em]"
            />
          </button>
        </div>
      </div>

      {/* Shader Animation — covers screen during navigation to /home */}
      {showShader && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <ShaderAnimation />
        </motion.div>
      )}
    </>
  );
}
