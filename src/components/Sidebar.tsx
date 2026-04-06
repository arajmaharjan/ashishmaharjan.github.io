"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDocker,
  faAws,
  faPython,
  faLinux,
  faGitAlt,
  faGithub,
  faMicrosoft,
  faUbuntu,
  faWindows,
} from "@fortawesome/free-brands-svg-icons";
import {
  faNetworkWired,
  faSyncAlt,
  faCloud,
  faCode,
  faServer,
  faCogs,
  faTasks,
  faSearch,
  faChartBar,
  faChartLine,
  faDatabase,
  faDesktop,
  faShieldAlt,
  faLock,
  faBug,
  faRobot,
  faTerminal,
  faFire,
  faBalanceScale,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Badge } from "@/components/ui/badge";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface Skill {
  icon: IconDefinition;
  name: string;
  category?: string;
}

const skills: Skill[] = [
  { icon: faDocker, name: "Docker", category: "Containers" },
  { icon: faNetworkWired, name: "Kubernetes", category: "Containers" },
  { icon: faAws, name: "AWS", category: "Cloud" },
  { icon: faSyncAlt, name: "CI/CD", category: "DevOps" },
  { icon: faPython, name: "Python", category: "Scripting" },
  { icon: faLinux, name: "Linux", category: "OS" },
  { icon: faGitAlt, name: "Git", category: "VCS" },
  { icon: faGithub, name: "GitHub Actions", category: "CI/CD" },
  { icon: faCloud, name: "CloudFormation", category: "IaC" },
  { icon: faCode, name: "Terraform", category: "IaC" },
  { icon: faServer, name: "Ansible", category: "Config" },
  { icon: faCogs, name: "Jenkins", category: "CI/CD" },
  { icon: faCogs, name: "Bamboo", category: "CI/CD" },
  { icon: faTasks, name: "Jira", category: "PM" },
  { icon: faMicrosoft, name: "Azure DevOps", category: "Cloud" },
  { icon: faSearch, name: "SonarQube", category: "Quality" },
  { icon: faChartBar, name: "Prometheus", category: "Monitoring" },
  { icon: faChartLine, name: "Grafana", category: "Monitoring" },
  { icon: faDatabase, name: "Splunk", category: "Monitoring" },
  { icon: faDatabase, name: "ELK Stack", category: "Monitoring" },
  { icon: faDesktop, name: "Nagios", category: "Monitoring" },
  { icon: faDatabase, name: "MySQL", category: "Database" },
  { icon: faDatabase, name: "PostgreSQL", category: "Database" },
  { icon: faDatabase, name: "MongoDB", category: "Database" },
  { icon: faUbuntu, name: "Ubuntu", category: "OS" },
  { icon: faWindows, name: "Windows Server", category: "OS" },
  { icon: faShieldAlt, name: "Security", category: "Security" },
  { icon: faLock, name: "SSL/TLS", category: "Security" },
  { icon: faBug, name: "Debugging", category: "DevOps" },
  { icon: faRobot, name: "Automation", category: "DevOps" },
  { icon: faTerminal, name: "Bash/Shell", category: "Scripting" },
  { icon: faFire, name: "Incident Response", category: "DevOps" },
  { icon: faBalanceScale, name: "Load Balancing", category: "Infra" },
  { icon: faTasks, name: "Agile", category: "PM" },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <nav
      aria-label="Core technologies"
      className={`fixed top-0 right-0 z-50 h-full bg-card/95 backdrop-blur-md border-l border-border overflow-y-auto transition-[width] duration-300 ease-out ${
        expanded ? "w-72" : "w-12"
      }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 text-muted-foreground hover:text-foreground transition-colors md:hidden"
        aria-label={expanded ? "Close skills sidebar" : "Open skills sidebar"}
        aria-expanded={expanded}
      >
        <FontAwesomeIcon icon={expanded ? faTimes : faBars} />
      </button>

      {expanded && (
        <div className="animate-in fade-in duration-200">
          <h2 className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground px-4 pt-6 pb-3">
            Core Technologies
          </h2>
          <ul className="space-y-0.5 px-2 pb-6" role="list">
            {skills.map((skill, i) => (
              <li
                key={`${skill.name}-${i}`}
                className="flex items-center gap-3 px-3 py-1.5 text-sm text-foreground/70 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors group"
              >
                <FontAwesomeIcon
                  icon={skill.icon}
                  className="w-4 shrink-0 text-muted-foreground group-hover:text-accent-foreground transition-colors"
                />
                <span className="flex-1">{skill.name}</span>
                {skill.category && (
                  <Badge
                    variant="secondary"
                    className="text-[0.6rem] px-1.5 py-0 h-4 opacity-60 group-hover:opacity-100 transition-opacity"
                  >
                    {skill.category}
                  </Badge>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!expanded && (
        <div className="flex flex-col items-center gap-3 pt-16 px-1">
          {skills.slice(0, 8).map((skill, i) => (
            <FontAwesomeIcon
              key={i}
              icon={skill.icon}
              className="w-3.5 text-muted-foreground/50"
              title={skill.name}
            />
          ))}
          <span className="text-[0.5rem] text-muted-foreground/30 mt-1">
            +{skills.length - 8}
          </span>
        </div>
      )}
    </nav>
  );
}
