"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import TunnelShowcase from "@/components/ui/tunnel-hero";
import { IconCloud } from "@/components/ui/icon-cloud";
import {
  SiDocker,
  SiKubernetes,
  SiTerraform,
  SiJenkins,
  SiAnsible,
  SiGithubactions,
  SiPython,
  SiLinux,
  SiGit,
  SiGnubash,
  SiAnthropic,
  SiOpenai,
  SiGooglegemini,
  SiN8N,
  SiZapier,
  SiVercel,
} from "react-icons/si";
import { FaAws, FaGithub } from "react-icons/fa";
import { SiWindsurf, SiClaude } from "react-icons/si";
import { Terminal, Heart, MousePointer, Braces } from "lucide-react";
import SpotlightCard from "@/components/SpotlightCard";
import { SocialIcons } from "@/components/ui/social-icons";
import { MinimalistHero } from "@/components/ui/minimalist-hero";
import { MorphingText } from "@/components/ui/morphing-text";
import { AnimatedText } from "@/components/ui/animated-text";

const highlights = [
  { label: "Years Experience", value: "5+" },
  { label: "Cloud Platforms", value: "AWS & Azure" },
  { label: "Apps Migrated", value: "200+" },
  { label: "Platform Engineering", value: "Tools" },
  { label: "CI/CD Pipelines", value: "Enterprise" },
  { label: "Agentic DevOps", value: "AI-Powered" },
];

const typingTexts = [
  "AI-Native DevOps Engineer",
  "DevSecOps Platform Architect",
  "Cloud Migration & Reliability Lead",
  "CI/CD Specialist & Pipeline Architect",
  "Infrastructure Automation Engineer",
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};


export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <TunnelShowcase />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "rgba(30,30,50,0.95)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
          },
        }}
      />

      <main
        className="relative z-[2] flex flex-col items-center justify-center py-24 origin-top scale-[0.995]"
        role="main"
      >
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Badge
            variant="outline"
            className="px-4 py-1.5 text-xs tracking-wider uppercase border-green-500/30 text-green-400 bg-green-500/5"
          >
            <span className="mr-2 inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Available for opportunities
          </Badge>
        </motion.div>

        {/* Header */}
        <motion.header
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-5 inline-flex flex-col items-center">
            <AnimatedText
              text="Ashish Maharjan"
              as="h1"
              duration={0.06}
              delay={0.04}
              textClassName="text-[2.5rem] sm:text-[3.5rem] md:text-[4rem] lg:text-[5rem] xl:text-[6rem] font-black tracking-tight text-white"
              underlineGradient="from-indigo-500 via-purple-500 to-pink-500"
              underlineHeight="h-1"
              underlineOffset="-bottom-2"
              className="py-2"
            />
            <div className="mt-2 w-full flex justify-center items-center">
              <MorphingText
                words={typingTexts}
                className="h-8 md:h-10 lg:h-10 whitespace-nowrap text-[clamp(12px,3.5vw,25px)] text-center"
              />
            </div>
          </motion.div>
          <motion.p
            className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto px-4 mt-4"
            variants={itemVariants}
          >
            Bridging code and cloud — aspiring engineer automating delivery from
            idea to production.
          </motion.p>
        </motion.header>

        {/* Minimalist Hero */}
        <MinimalistHero
          logoText="AM."
          navLinks={[]}
          mainText="DevOps Engineer bridging code and cloud — automating delivery pipelines, orchestrating containers, and building resilient infrastructure at scale."
          readMoreLink="/resume"
          imageSrc="/ace.png"
          imageAlt="Ashish Maharjan — DevOps Engineer"
          overlayText={{
            part1: "Build.",
            part2: "Deploy.",
          }}
          showHeader={false}
          showFooter={false}
          className="h-auto min-h-[60vh] bg-transparent !pb-0 mb-0"
        >
          {/* Highlight stats — inside hero, seamlessly below photo */}
          <motion.div
            className="grid grid-cols-3 md:grid-cols-6 gap-3 w-full max-w-5xl px-4 mt-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {highlights.map((item) => (
              <SpotlightCard key={item.label} className="h-full">
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:border-white/20 transition-colors h-full">
                  <CardContent className="p-4 text-center flex flex-col items-center justify-center min-h-[90px]">
                    <div className="text-xl md:text-2xl font-black text-white">
                      {item.value}
                    </div>
                    <div className="text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground mt-1">
                      {item.label}
                    </div>
                  </CardContent>
                </Card>
              </SpotlightCard>
            ))}
          </motion.div>

          {/* Social icons */}
          <motion.nav
            aria-label="Social links and navigation"
            className="mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <SocialIcons />
          </motion.nav>
        </MinimalistHero>

        {/* CTA */}
        <motion.div
          className="mt-5 flex gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Button
            variant="outline"
            nativeButton={false}
            className="gap-2 text-xs uppercase tracking-wider border-white/20 text-white/70 hover:text-white hover:bg-white/5"
            render={(props) => (
              <Link {...props} href="/resume">
                View Full Resume
                <FontAwesomeIcon icon={faArrowRight} className="text-[0.7em]" />
              </Link>
            )}
          />
        </motion.div>

      </main>

      {/* Core Technologies — Icon Cloud */}
      <section className="relative z-[2] flex flex-col items-center justify-center pt-4 pb-5 origin-top scale-[0.995]">
        <motion.h2
          className="text-lg md:text-xl font-black uppercase tracking-[0.3em] text-muted-foreground mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Core Technologies
        </motion.h2>
        <motion.p
          className="text-sm text-white/50 mb-5 text-center max-w-md px-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          The ecosystem I rely on every day — from cloud provisioning and container orchestration to CI/CD pipelines, AI-assisted development, and infrastructure automation at scale.
        </motion.p>

        <div className="relative flex w-full max-w-2xl mx-auto items-center justify-center overflow-hidden rounded-lg">
          <IconCloud
            icons={[
              // DevOps & Cloud
              <SiDocker key="docker" size={100} color="#2496ED" />,
              <SiKubernetes key="k8s" size={100} color="#326CE5" />,
              <FaAws key="aws" size={100} color="#FF9900" />,
              <SiTerraform key="terraform" size={100} color="#7B42BC" />,
              <SiJenkins key="jenkins" size={100} color="#D24939" />,
              <SiAnsible key="ansible" size={100} color="#EE0000" />,
              <SiGithubactions key="ghactions" size={100} color="#2088FF" />,
              <FaGithub key="github" size={100} color="#FFFFFF" />,
              // Languages & Tools
              <SiPython key="python" size={100} color="#3776AB" />,
              <SiLinux key="linux" size={100} color="#FCC624" />,
              <SiGit key="git" size={100} color="#F05032" />,
              <SiGnubash key="bash" size={100} color="#4EAA25" />,
              // AI & Automation
              <SiAnthropic key="claude" size={100} color="#D4A27F" />,
              <SiOpenai key="chatgpt" size={100} color="#FFFFFF" />,
              <SiGooglegemini key="gemini" size={100} color="#8E75B2" />,
              <SiN8N key="n8n" size={100} color="#EA4B71" />,
              <SiZapier key="zapier" size={100} color="#FF4F00" />,
              <SiVercel key="vercel" size={100} color="#FFFFFF" />,
              // AI-Powered Dev Tools
              <SiClaude key="claude-code" size={100} color="#D4A27F" />,
              <SiWindsurf key="windsurf" size={100} color="#00D4AA" />,
              <Braces key="codex" size={100} color="#10A37F" />,
              <MousePointer key="cursor" size={100} color="#00BFFF" />,
              <Heart key="lovable" size={100} color="#FF6B8A" />,
            ]}
            labels={[
              "Docker",
              "Kubernetes",
              "AWS",
              "Terraform",
              "Jenkins",
              "Ansible",
              "GitHub Actions",
              "GitHub",
              "Python",
              "Linux",
              "Git",
              "Bash",
              "Claude",
              "ChatGPT",
              "Gemini",
              "n8n",
              "Zapier",
              "Vercel",
              "Claude Code",
              "Windsurf",
              "Codex",
              "Cursor IDE",
              "Lovable",
            ]}
          />
        </div>
      </section>

      {/* Projects */}
      <section className="relative z-[2] flex flex-col items-center justify-center pt-5 pb-16 px-4 origin-top scale-[0.995]">
        <Separator className="mb-5 max-w-md opacity-20" />
        <motion.h2
          className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Projects
        </motion.h2>
        <motion.p
          className="text-sm text-white/50 mb-6 text-center max-w-md"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          A selection of things I&apos;ve built and contributed to.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {/* TODO: Replace these placeholder cards with real projects */}
          {[1, 2, 3, 4].map((i) => (
            <Card
              key={i}
              className="bg-white/5 border-white/10 border-dashed hover:border-white/20 transition-colors"
            >
              <CardContent className="p-6 flex flex-col items-center justify-center min-h-[160px] text-center">
                <div className="text-white/20 text-sm uppercase tracking-widest">
                  Project {i}
                </div>
                <div className="text-white/10 text-xs mt-2">
                  Coming soon
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-[2] text-center py-5 text-muted-foreground text-xs font-bold tracking-wider origin-top scale-[0.995]">
        &copy; 2026 Ashish Maharjan. All Rights Reserved.
      </footer>
    </motion.div>
  );
}
