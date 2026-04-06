export const contact = {
  name: "Ashish Maharjan",
  location: "San Francisco, CA",
  phone: "(510) 531-4982",
  email: "amhrjn94@gmail.com",
  linkedin: "https://www.linkedin.com/in/aashish-raj-maharjan-00112137a/",
  website: "https://www.ashishmaharjan.com",
};

export const summary =
  "DevOps Engineer with over 5 years of experience designing and managing CI/CD pipelines, automating cloud infrastructure, and driving large-scale application migrations across AWS and Azure. Proven expertise in container orchestration, infrastructure-as-code, and configuration management within Agile environments. Skilled at coordinating cross-functional teams to deliver secure, high-availability solutions in enterprise settings spanning retail, healthcare, banking, and insurance.";

export const skills = [
  {
    label: "Cloud & IaC",
    value:
      "AWS (EC2, S3, RDS, IAM, Lambda, ELB, CloudFormation), Azure, Terraform",
  },
  {
    label: "CI/CD",
    value:
      "Jenkins, Bamboo, Azure DevOps, Maven, Gradle, SonarQube, Checkmarx",
  },
  {
    label: "Containers",
    value: "Docker, Kubernetes, JFrog Artifactory, Nexus",
  },
  { label: "Config Mgmt", value: "Ansible (AAP), Ansible Playbooks" },
  {
    label: "Scripting & VCS",
    value: "Python, Shell, PowerShell, Groovy — Git, Bitbucket, GitHub",
  },
  {
    label: "Monitoring",
    value:
      "CloudWatch, Nagios, ServiceNow — OS: RHEL, Ubuntu, Windows Server",
  },
  {
    label: "AI & Automation",
    value: "Claude Code, n8n, Prompting, AI-assisted pipeline automation",
  },
];

export interface Job {
  title: string;
  dates: string;
  company: string;
  bullets: string[];
}

export const jobs: Job[] = [
  {
    title: "DevOps Engineer",
    dates: "Sep 2025 – Mar 2026",
    company: "Cognizant – TJ Maxx (Remote)",
    bullets: [
      "Participated in Agile Scrum ceremonies (stand-ups, sprint planning, estimation, retrospectives, and demos) and utilized JIRA for issue tracking and Confluence for documentation, maintaining transparency and continuous improvement across the team.",
      "Led the Ansible Automation Platform (AAP) upgrade across production and non-prod environments, coordinating F5 load balancer reconfiguration, gateway node setup, Red Hat support engagement, and maintenance communications to all Ansible users.",
      "Executed AAP data export and backup activities using Postman and REST APIs, converting JSON to CSV, capturing VM snapshots across 15 servers, and documenting Automation Hub namespaces and 235 collections in Confluence for IQ/OQ compliance.",
      "Upgraded PostgreSQL as an AAP prerequisite, configured database replication between servers, and managed backup/restore procedures while coordinating firewall access requests through ARMS and troubleshooting via the Red Hat support portal.",
      "Configured LDAP and SAML-based SSO authentication across all AAP environments post-upgrade, managed service account lifecycle and IAM policy changes to restrict deployer access, and administered AAP user and team governance.",
      "Built an end-to-end Jenkins-based test automation pipeline to validate AAP post-upgrade stability, set up and maintained Jenkins agents (including Windows agents for ZBot), troubleshot Gradle build pipelines, and performed smoke testing to prevent critical failures in production.",
      "Remediated vulnerabilities across Jenkins, Ansible servers via ServiceNow, led the SonarQube cloud migration and Apigee proxy decommission, and managed the full Change Request lifecycle through ServiceNow CAB approvals and post-implementation validation documentation in Confluence.",
    ],
  },
  {
    title: "DevOps Engineer",
    dates: "Jun 2024 – Sep 2025",
    company: "Cognizant – Elevance Health (Remote)",
    bullets: [
      "Architected and managed high-scale CI/CD pipelines in Bamboo, automating the full build and deployment lifecycle for the migration of 200+ processing applications from on-premise to Azure, synchronizing build plans with Bitbucket triggers for a seamless transition.",
      "Administered version control and branching strategies in Bitbucket, facilitating a rigorous multi-environment deployment strategy across Dev, UAT, and Production while ensuring code integrity and seamless collaboration across global teams.",
      "Organized and led technical demo sessions for every environment promotion, coordinated end-user validation testing cycles, and ensured stakeholder alignment and operational readiness before advancing through each stage of the lifecycle.",
      "Integrated SonarQube static code analysis and automated quality gates into the CI/CD lifecycle, partnered with DevSecOps and QA teams to embed security scanning, and ensured only packages meeting strict performance and security benchmarks were promoted to production.",
      "Managed artifact versioning and centralized storage in JFrog Artifactory, optimized build performance and artifact cleanup within JFrog and Bamboo, and designed robust packaging workflows to bundle complex applications for deployment into Azure High Availability and Disaster Recovery (HADR) environments.",
      "Automated infrastructure provisioning, application configuration, smoke testing, and environment validation using PowerShell scripting and Terraform (IaC), significantly reducing manual effort across rapid deployment phases.",
      "Supported the post-migration warranty period by providing rapid troubleshooting and deploying stability patches through the established Bamboo and JFrog framework, ensuring zero service disruption throughout the engagement.",
    ],
  },
  {
    title: "DevOps / Systems Engineer",
    dates: "Jun 2023 – Feb 2024",
    company: "Columbia Sportswear (Remote)",
    bullets: [
      "Led migration and modernization of a mixed portfolio of COTS and in-house retail applications from on-premise to AWS, implementing end-to-end Jenkins CI/CD pipelines with GitHub integration and containerized deployments across Dev, Staging, Production, and DR environments.",
      "Provisioned AWS infrastructure via Terraform and CloudFormation with ELB/ALB load balancing; authored Ansible playbooks for configuration management and automated routine operations including snapshots, Lambda-based log ingestion, and S3 storage using Python scripting.",
      "Implemented multi-branch Jenkins pipelines using Groovy, managed Docker image lifecycle through DockerHub, maintained ANT/Maven build files, and participated in Agile Scrum using JIRA and Confluence.",
    ],
  },
  {
    title: "DevOps Engineer",
    dates: "Aug 2022 – Mar 2023",
    company: "Capital One (Remote)",
    bullets: [
      "Led migration of a legacy COTS application from Infosys, deploying a headless server environment for automated report generation and decommissioning a legacy mainframe system using CloudFormation, Terraform, Docker, and Vagrant across AWS and Amazon VPCs.",
      "Developed Ansible Playbooks rewriting legacy Puppet modules, authored Terraform scripts for Dev/Staging/Prod environments with IAM and Security Group policies, and designed Jenkins CI/CD pipelines integrated with GitHub across all environments.",
      "Leveraged a broad AWS services suite (EC2, RDS, EBS, ELB, ALB, S3, KMS, IAM) and built serverless architectures for the Risk Controls platform, enforcing FDIC and internal audit compliance through LDAP/AD-based access management.",
      "Automated infrastructure provisioning using Shell and Python scripting, streamlined secrets management with Vault and AWS AMI, and collaborated across three cross-functional teams using JIRA and Confluence.",
    ],
  },
  {
    title: "Cloud / System Engineer",
    dates: "Mar 2021 – Jun 2022",
    company: "Pacific Specialty Insurance, CA",
    bullets: [
      "Administered Git, and AWS monitoring (CloudWatch, SNS, Config, Control Tower) for alerting, security incident response, and vulnerability remediation; maintained Ansible CM across AWS and VMware using Boto3 for artifact publishing.",
      "Deployed and managed Docker containers per GitHub branch within Jenkins CI and administered Ubuntu Linux servers, and supported pipeline templates for application teams.",
    ],
  },
  {
    title: "Jr. DevOps Engineer",
    dates: "Sep 2019 – Dec 2020",
    company: "Shutterfly, CA",
    bullets: [
      "Served as DevOps/Release POC for two development teams, gathering stakeholder approvals and building automated CI/CD pipelines using Jenkins and Maven to generate Java build artifacts and deploy applications across QA, UAT, and Production environments.",
      "Worked on AWS solutions (EC2, S3, ELB, Auto Scaling), managed Git branching, tagging, and releases, and automated environment provisioning across AWS using Ansible and Jenkins.",
    ],
  },
];

export const additionalExperience: Job = {
  title: "On-Site Deskside Support Technician",
  dates: "",
  company: "Western Oregon University (On-Campus)",
  bullets: [
    "Partnered with the campus IT team to deploy, configure, and sustain standardized endpoint environments across academic labs, faculty workspaces, and administrative offices university-wide.",
    "Collaborated with senior technicians to image, configure, and commission student and faculty devices ahead of each deployment cycle.",
    "Contributed to a team-led workstation refresh initiative by executing OS upgrades and platform migrations, followed by post-deployment validation to confirm full operational readiness.",
    "Worked within a structured IMAC workflow alongside IT staff to fulfill install, move, add, and change requests for desktops, laptops, and peripherals across all campus divisions.",
    "Served as an on-site escalation resource for the university Helpdesk, delivering hands-on Tier 1/2 hardware and software resolution for students and faculty across departments.",
    "Supported the infrastructure team in monitoring library servers and academic resource systems to uphold high availability for the campus community.",
    "Worked alongside administrators to manage and troubleshoot the Canvas LMS, coordinating fixes for access and configuration issues affecting course delivery for faculty and students.",
    "Contributed to a cross-functional cloud migration effort by assisting with data transfer, environment testing, and post-migration validation as the university transitioned departmental servers off on-premises infrastructure.",
    "Teamed with field technicians to source parts and complete both warranty and non-warranty repairs on university computers and connected peripherals.",
    "Supported the IT asset management program by maintaining inventory accuracy, processing equipment decommissions, and coordinating hardware relocations across campus as operational needs evolved.",
    "Worked in coordination with network and AV support staff to sustain classroom and conference room technology, assisting with connectivity troubleshooting, printer deployments, and audiovisual equipment setups.",
  ],
};

export const education = {
  degree: "Bachelor of Science in Computer Information Systems",
  school: "Western Oregon University, Monmouth, OR",
};
