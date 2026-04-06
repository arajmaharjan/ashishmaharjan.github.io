"use client";
import React, { useEffect, useState, useSyncExternalStore, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDocker,
  faAws,
  faPython,
  faLinux,
  faGitAlt,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import {
  faNetworkWired,
  faCode,
  faCogs,
  faCloud,
  faServer,
  faTerminal,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type GlowColor = "cyan" | "purple" | "blue";

interface SkillConfig {
  id: string;
  orbitRadius: number;
  size: number;
  speed: number;
  icon: IconDefinition;
  iconColor: string;
  phaseShift: number;
  glowColor: GlowColor;
  label: string;
}

interface OrbitingSkillProps {
  config: SkillConfig;
  angle: number;
}

interface GlowingOrbitPathProps {
  radius: number;
  glowColor?: GlowColor;
  animationDelay?: number;
}

const skillsConfig: SkillConfig[] = [
  // Inner Orbit — Core DevOps
  {
    id: "docker",
    orbitRadius: 100,
    size: 42,
    speed: 1,
    icon: faDocker,
    iconColor: "#2496ED",
    phaseShift: 0,
    glowColor: "cyan",
    label: "Docker",
  },
  {
    id: "kubernetes",
    orbitRadius: 100,
    size: 42,
    speed: 1,
    icon: faNetworkWired,
    iconColor: "#326CE5",
    phaseShift: (2 * Math.PI) / 3,
    glowColor: "cyan",
    label: "Kubernetes",
  },
  {
    id: "aws",
    orbitRadius: 100,
    size: 42,
    speed: 1,
    icon: faAws,
    iconColor: "#FF9900",
    phaseShift: (4 * Math.PI) / 3,
    glowColor: "cyan",
    label: "AWS",
  },
  // Middle Orbit — IaC & CI/CD
  {
    id: "terraform",
    orbitRadius: 170,
    size: 40,
    speed: -0.6,
    icon: faCode,
    iconColor: "#7B42BC",
    phaseShift: 0,
    glowColor: "purple",
    label: "Terraform",
  },
  {
    id: "jenkins",
    orbitRadius: 170,
    size: 40,
    speed: -0.6,
    icon: faCogs,
    iconColor: "#D24939",
    phaseShift: (2 * Math.PI) / 4,
    glowColor: "purple",
    label: "Jenkins",
  },
  {
    id: "ansible",
    orbitRadius: 170,
    size: 40,
    speed: -0.6,
    icon: faServer,
    iconColor: "#EE0000",
    phaseShift: (4 * Math.PI) / 4,
    glowColor: "purple",
    label: "Ansible",
  },
  {
    id: "github",
    orbitRadius: 170,
    size: 40,
    speed: -0.6,
    icon: faGithub,
    iconColor: "#ffffff",
    phaseShift: (6 * Math.PI) / 4,
    glowColor: "purple",
    label: "GitHub Actions",
  },
  // Outer Orbit — Languages & Tools
  {
    id: "python",
    orbitRadius: 240,
    size: 38,
    speed: 0.4,
    icon: faPython,
    iconColor: "#3776AB",
    phaseShift: 0,
    glowColor: "blue",
    label: "Python",
  },
  {
    id: "linux",
    orbitRadius: 240,
    size: 38,
    speed: 0.4,
    icon: faLinux,
    iconColor: "#FCC624",
    phaseShift: (2 * Math.PI) / 5,
    glowColor: "blue",
    label: "Linux",
  },
  {
    id: "git",
    orbitRadius: 240,
    size: 38,
    speed: 0.4,
    icon: faGitAlt,
    iconColor: "#F05032",
    phaseShift: (4 * Math.PI) / 5,
    glowColor: "blue",
    label: "Git",
  },
  {
    id: "bash",
    orbitRadius: 240,
    size: 38,
    speed: 0.4,
    icon: faTerminal,
    iconColor: "#4EAA25",
    phaseShift: (6 * Math.PI) / 5,
    glowColor: "blue",
    label: "Bash/Shell",
  },
  {
    id: "cloudformation",
    orbitRadius: 240,
    size: 38,
    speed: 0.4,
    icon: faCloud,
    iconColor: "#FF9900",
    phaseShift: (8 * Math.PI) / 5,
    glowColor: "blue",
    label: "CloudFormation",
  },
];

const OrbitingSkill = memo(({ config, angle }: OrbitingSkillProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { orbitRadius, size, icon, iconColor, label } = config;

  const x = Math.cos(angle) * orbitRadius;
  const y = Math.sin(angle) * orbitRadius;

  return (
    <div
      className="absolute top-1/2 left-1/2 pointer-events-auto"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
        zIndex: isHovered ? 20 : 10,
        transition: "width 0.3s, height 0.3s",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative w-full h-full bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer transition-transform duration-300 ${
          isHovered ? "scale-125" : ""
        }`}
        style={{
          boxShadow: isHovered
            ? `0 0 30px ${iconColor}40, 0 0 60px ${iconColor}20`
            : `0 4px 12px rgba(0,0,0,0.3)`,
        }}
      >
        <FontAwesomeIcon
          icon={icon}
          style={{ color: iconColor }}
          className="w-[55%] h-[55%]"
        />
        {isHovered && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900/95 backdrop-blur-sm rounded text-xs text-white whitespace-nowrap pointer-events-none z-30">
            {label}
          </div>
        )}
      </div>
    </div>
  );
});
OrbitingSkill.displayName = "OrbitingSkill";

const GlowingOrbitPath = memo(
  ({ radius, glowColor = "cyan", animationDelay = 0 }: GlowingOrbitPathProps) => {
    const glowColors = {
      cyan: {
        primary: "rgba(6, 182, 212, 0.3)",
        secondary: "rgba(6, 182, 212, 0.15)",
        border: "rgba(6, 182, 212, 0.2)",
      },
      purple: {
        primary: "rgba(147, 51, 234, 0.3)",
        secondary: "rgba(147, 51, 234, 0.15)",
        border: "rgba(147, 51, 234, 0.2)",
      },
      blue: {
        primary: "rgba(96, 165, 250, 0.25)",
        secondary: "rgba(96, 165, 250, 0.1)",
        border: "rgba(96, 165, 250, 0.15)",
      },
    };

    const colors = glowColors[glowColor];

    return (
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: `${radius * 2}px`,
          height: `${radius * 2}px`,
        }}
      >
        <div
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            background: `radial-gradient(circle, transparent 30%, ${colors.secondary} 70%, ${colors.primary} 100%)`,
            boxShadow: `0 0 40px ${colors.primary}, inset 0 0 40px ${colors.secondary}`,
            animationDelay: `${animationDelay}s`,
          }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: `1px solid ${colors.border}`,
            boxShadow: `inset 0 0 20px ${colors.secondary}`,
          }}
        />
      </div>
    );
  }
);
GlowingOrbitPath.displayName = "GlowingOrbitPath";

export default function OrbitingSkills() {
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const emptySubscribe = () => () => {};
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    if (isPaused || !mounted) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      setTime((prev) => prev + deltaTime);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, mounted]);

  const orbitConfigs: Array<{
    radius: number;
    glowColor: GlowColor;
    delay: number;
  }> = [
    { radius: 100, glowColor: "cyan", delay: 0 },
    { radius: 170, glowColor: "purple", delay: 1 },
    { radius: 240, glowColor: "blue", delay: 2 },
  ];

  return (
    <div
      className="relative w-[min(520px,90vw)] h-[min(520px,90vw)] flex items-center justify-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Central icon */}
      <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center z-10 relative shadow-2xl">
        <div className="absolute inset-0 rounded-full bg-cyan-500/30 blur-xl animate-pulse" />
        <div
          className="absolute inset-0 rounded-full bg-purple-500/20 blur-2xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="relative z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="url(#orbit-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <defs>
              <linearGradient
                id="orbit-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#9333EA" />
              </linearGradient>
            </defs>
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>
      </div>

      {/* Orbit paths */}
      {orbitConfigs.map((config) => (
        <GlowingOrbitPath
          key={`path-${config.radius}`}
          radius={config.radius}
          glowColor={config.glowColor}
          animationDelay={config.delay}
        />
      ))}

      {/* Orbiting skills — only render client-side to avoid hydration mismatch */}
      {mounted && skillsConfig.map((config) => {
        const angle = time * config.speed + config.phaseShift;
        return (
          <OrbitingSkill key={config.id} config={config} angle={angle} />
        );
      })}
    </div>
  );
}
