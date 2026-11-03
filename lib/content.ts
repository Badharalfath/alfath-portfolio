export type Project = {
  number: string;
  title: string;
  description: string;
  tags: readonly string[];
  tone: "ink" | "cobalt" | "sunflower" | "paper";
};

export type PortfolioDocument = {
  id: string;
  category: "education" | "credential";
  title: string;
  issuer: string;
  issued: string;
  identifierLabel: string;
  identifier: string;
  secondary?: string;
  summary: string;
  pdf: string;
  pdfViewerEnabled?: boolean;
  privacyNote?: string;
};

export type EducationEntry = {
  title: string;
  detail: string;
  period: string;
  documentId?: string;
};

export const contact = {
  email: "outlockalfath@gmail.com",
  github: "https://github.com/Badharalfath",
  linkedin: "https://www.linkedin.com/in/alfatihnaman/",
} as const;

export const projects: readonly Project[] = [
  {
    number: "01",
    title: "Online Gambling Ad Blocker",
    description:
      "A Chrome extension I built to help detect and hide online gambling ads. The project also became part of my final research at UNIKOM.",
    tags: ["Manifest V3", "Heuristic scoring", "Published research"],
    tone: "ink",
  },
  {
    number: "02",
    title: "ISBI Helpdesk & Asset Management",
    description:
      "A web app I worked on during my internship to help campus staff handle support requests and keep track of IT assets.",
    tags: ["Web application", "Helpdesk", "Asset reporting"],
    tone: "cobalt",
  },
  {
    number: "03",
    title: "Employee Dashboard",
    description: "A dashboard for adding, updating, and organizing employee records in one place.",
    tags: ["Dashboard", "Database", "Records management"],
    tone: "sunflower",
  },
  {
    number: "04",
    title: "Cinema Ticket Booking",
    description:
      "A Java project my team and I built to cover the main steps of booking a cinema ticket.",
    tags: ["Java", "Booking flow", "Team project"],
    tone: "paper",
  },
  {
    number: "05",
    title: "AI Image Generator",
    description:
      "A small web app that turns a written idea into a prompt and uses it to generate an image.",
    tags: ["Generative AI", "Web application", "Prompt design"],
    tone: "cobalt",
  },
  {
    number: "06",
    title: "Smart Parking System",
    description: "A web app for checking parking availability and booking an open space.",
    tags: ["Booking", "Slot management", "Web application"],
    tone: "ink",
  },
] as const;

export const skills = [
  {
    group: "Languages and frameworks",
    description: "The main building blocks I use for web interfaces and application logic.",
    items: ["HTML & CSS", "JavaScript", "TypeScript", "Java", "React", "Next.js"],
  },
  {
    group: "Databases",
    description: "The tools I use to structure, query, and work with application data.",
    items: ["SQL", "MySQL", "Data modeling"],
  },
  {
    group: "Tools I use",
    description: "The everyday tools that help me build, connect, and maintain a project.",
    items: ["Git & GitHub", "REST APIs", "Chrome Extensions", "OpenAI API"],
  },
] as const;

export const education: readonly EducationEntry[] = [
  {
    title: "SMK, Rekayasa Perangkat Lunak",
    detail: "Software development studies with hands-on programming projects",
    period: "2018–2021",
  },
  {
    title: "Universitas Komputer Indonesia",
    detail: "Bachelor of Informatics Engineering · S.Kom. · GPA 3.40",
    period: "2021–2026",
    documentId: "unikom-diploma",
  },
] as const;

export const portfolioDocuments: readonly PortfolioDocument[] = [
  {
    id: "unikom-diploma",
    category: "education",
    title: "Bachelor of Informatics Engineering Diploma",
    issuer: "Universitas Komputer Indonesia, UNIKOM",
    issued: "19 February 2026",
    identifierLabel: "Certificate serial",
    identifier: "11.01.1.6808",
    secondary: "National certificate: 041027552012026100036",
    summary:
      "My bachelor’s diploma in Informatics Engineering from UNIKOM. I graduated with an S.Kom. degree and a Very Satisfactory distinction.",
    pdf: "/documents/unikom-diploma-public.pdf",
    pdfViewerEnabled: false,
  },
  {
    id: "bnsp-junior-web-programmer",
    category: "credential",
    title: "Junior Web Programmer",
    issuer: "BNSP · LSP Teknologi Digital",
    issued: "20 March 2025",
    identifierLabel: "Certificate number",
    identifier: "62090 2513 3 0136337 2025",
    secondary: "Registration: TIK 1565 21026 2025",
    summary:
      "A professional certificate covering the core tasks of junior web development. It is valid for three years from the issue date.",
    pdf: "/documents/bnsp-junior-web-programmer.pdf",
  },
  {
    id: "unikom-english-proficiency",
    category: "credential",
    title: "English Proficiency Test",
    issuer: "UNIKOM Language Center",
    issued: "9 November 2024",
    identifierLabel: "Certificate number",
    identifier: "17.24.03260",
    secondary: "Valid until 9 November 2026",
    summary:
      "My English proficiency test result with a total score of 550 across listening, structure, and reading.",
    pdf: "/documents/unikom-english-proficiency-public.pdf",
    privacyNote: "This public viewer copy redacts birth details.",
  },
  {
    id: "revou-software-engineering",
    category: "credential",
    title: "Introduction to Software Engineering",
    issuer: "RevoU Coding Camp",
    issued: "3 July 2026",
    identifierLabel: "Credential ID",
    identifier: "CCSE-290626-01-1-00040",
    summary:
      "A short introductory course where I reviewed the basic workflow of software engineering.",
    pdf: "/documents/revou-intro-software-engineering.pdf",
  },
  {
    id: "cisco-cybersecurity-essentials",
    category: "credential",
    title: "Cybersecurity Essentials",
    issuer: "Cisco Networking Academy",
    issued: "8 May 2024",
    identifierLabel: "Verification",
    identifier: "QR-verifiable credential",
    summary:
      "A course that introduced common cybersecurity risks and the basic ways people and organizations can respond to them.",
    pdf: "/documents/cisco-cybersecurity-essentials.pdf",
  },
  {
    id: "cisco-introduction-cybersecurity",
    category: "credential",
    title: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
    issued: "20 May 2024",
    identifierLabel: "Verification",
    identifier: "QR-verifiable credential",
    summary:
      "An introductory course on cyber threats, personal safety, organizational protection, and cybersecurity careers.",
    pdf: "/documents/cisco-introduction-cybersecurity.pdf",
  },
  {
    id: "cisco-introduction-networks",
    category: "credential",
    title: "CCNA: Introduction to Networks",
    issuer: "Cisco Networking Academy",
    issued: "20 February 2023",
    identifierLabel: "Verification",
    identifier: "QR-verifiable credential",
    summary:
      "A networking course covering basic architecture, protocols, addressing, and device configuration.",
    pdf: "/documents/cisco-introduction-networks.pdf",
  },
] as const;

export const credentials = portfolioDocuments.filter(
  (document) => document.category === "credential",
);
