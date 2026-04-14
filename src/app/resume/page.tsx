"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faGlobe,
  faPrint,
  faDownload,
  faBriefcase,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { DottedSurface } from "@/components/ui/dotted-surface";
import SpotlightCard from "@/components/SpotlightCard";
import { RevealText } from "@/components/ui/reveal-text";
import {
  contact,
  summary,
  skills,
  jobs,
  additionalExperience,
  education,
} from "@/data/resume";
import type { Job } from "@/data/resume";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const skillProficiency: Record<string, number> = {
  "Cloud & IaC": 90,
  "CI/CD": 95,
  Containers: 88,
  "Config Mgmt": 85,
  "Scripting & VCS": 80,
  Monitoring: 82,
  "AI & Automation": 70,
};

function SectionTitle({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: typeof faBriefcase;
}) {
  return (
    <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-muted-foreground pb-2 mb-5">
      {icon && <FontAwesomeIcon icon={icon} className="w-3" />}
      {children}
    </h2>
  );
}

function JobEntry({ job, index }: { job: Job; index: number }) {
  return (
    <AccordionItem value={`job-${index}`} className="border-border/30">
      <AccordionTrigger className="hover:no-underline py-4">
        <div className="flex flex-col items-start gap-1 text-left flex-1 mr-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-black text-card-foreground">
              {job.title}
            </span>
            {job.dates && (
              <Badge variant="outline" className="text-[0.65rem] font-normal">
                {job.dates}
              </Badge>
            )}
          </div>
          <span className="text-sm text-muted-foreground italic">
            {job.company}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <ul className="space-y-2 pb-2" role="list">
          {job.bullets.map((bullet, i) => (
            <li
              key={i}
              className="text-sm text-foreground/80 pl-5 relative leading-relaxed before:content-['–'] before:absolute before:left-0 before:text-muted-foreground/50"
            >
              {bullet}
            </li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}

export default function ResumePage() {
  return (
    <>
      <DottedSurface />

      <main
        className="relative z-[2] max-w-[900px] mx-auto px-6 py-5"
        role="main"
      >
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/home"
            className="no-print inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs uppercase tracking-[0.12em] mb-6 transition-colors"
            aria-label="Go back to portfolio home page"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Portfolio
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          className="text-center mb-6 pb-7"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="mb-4">
            <RevealText
              text="ASHISH MAHARJAN"
              textColor="text-white"
              overlayColor="text-blue-400"
              fontSize="text-4xl md:text-6xl"
              letterDelay={0.05}
              overlayDelay={0.03}
              overlayDuration={0.3}
              springDuration={400}
            />
          </div>
          <div
            className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground"
            aria-label="Contact information"
          >
            <span className="inline-flex items-center gap-1.5">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3" />
              {contact.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FontAwesomeIcon icon={faPhone} className="w-3" />
              {contact.phone}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FontAwesomeIcon icon={faEnvelope} className="w-3" />
              <a
                href={`mailto:${contact.email}`}
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                {contact.email}
              </a>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FontAwesomeIcon icon={faLinkedin} className="w-3" />
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                LinkedIn
              </a>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FontAwesomeIcon icon={faGlobe} className="w-3" />
              <a
                href={contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                ashishmaharjan.com
              </a>
            </span>
          </div>
          <Separator className="mt-7" />
        </motion.div>

        {/* Summary */}
        <motion.section
          className="mb-6"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          aria-labelledby="summary-heading"
        >
          <SectionTitle>
            <span id="summary-heading">Professional Summary</span>
          </SectionTitle>
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-5">
              <p className="text-[0.95rem] text-foreground/80 leading-relaxed">
                {summary}
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* Skills with Tabs and Progress bars */}
        <motion.section
          className="mb-6"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          aria-labelledby="skills-heading"
        >
          <SectionTitle>
            <span id="skills-heading">Technical Skills</span>
          </SectionTitle>

          <Tabs defaultValue="overview">
            <TabsList variant="line" className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="proficiency">Proficiency</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {skills.map((skill) => (
                  <SpotlightCard key={skill.label}>
                    <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:border-white/20 transition-colors h-full">
                      <CardContent className="p-4">
                        <div className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                          {skill.label}
                        </div>
                        <div className="text-sm text-foreground/80">
                          {skill.value}
                        </div>
                      </CardContent>
                    </Card>
                  </SpotlightCard>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="proficiency">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-5 space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-bold text-foreground/90">
                          {skill.label}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {skillProficiency[skill.label] || 75}%
                        </span>
                      </div>
                      <Progress
                        value={skillProficiency[skill.label] || 75}
                        className="h-1.5"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.section>

        {/* Experience with Accordion */}
        <motion.section
          className="mb-6"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          aria-labelledby="experience-heading"
        >
          <SectionTitle icon={faBriefcase}>
            <span id="experience-heading">Professional Experience</span>
          </SectionTitle>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-4">
              <Accordion defaultValue={["job-0"]}>
                {jobs.map((job, i) => (
                  <JobEntry key={i} job={job} index={i} />
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.section>

        {/* Additional Experience */}
        <motion.section
          className="mb-6"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          aria-labelledby="additional-experience-heading"
        >
          <SectionTitle icon={faBriefcase}>
            <span id="additional-experience-heading">
              Additional Experience
            </span>
          </SectionTitle>
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-4">
              <Accordion>
                <JobEntry job={additionalExperience} index={99} />
              </Accordion>
            </CardContent>
          </Card>
        </motion.section>

        {/* Education */}
        <motion.section
          className="mb-6"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          aria-labelledby="education-heading"
        >
          <SectionTitle icon={faGraduationCap}>
            <span id="education-heading">Education</span>
          </SectionTitle>
          <SpotlightCard>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:border-white/20 transition-colors">
              <CardContent className="p-5 flex justify-between flex-wrap gap-2">
                <span className="font-black text-card-foreground text-[0.95rem]">
                  {education.degree}
                </span>
                <Badge variant="secondary" className="font-normal">
                  {education.school}
                </Badge>
              </CardContent>
            </Card>
          </SpotlightCard>
        </motion.section>

        {/* Actions */}
        <motion.div
          className="no-print text-center mt-6 flex justify-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="gap-2 uppercase tracking-[0.1em] text-xs"
          >
            <FontAwesomeIcon icon={faPrint} />
            Print / Save as PDF
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            className="gap-2 uppercase tracking-[0.1em] text-xs"
            render={(props) => (
              <a
                {...props}
                href="/Ashish_Resume.pdf"
                download="Ashish_Maharjan_Resume.pdf"
              >
                <FontAwesomeIcon icon={faDownload} />
                Download PDF
              </a>
            )}
          />
        </motion.div>
      </main>
    </>
  );
}
