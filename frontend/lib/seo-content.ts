import type { FaqItem } from "./structured-data";

export type SitemapFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export type IndexedRoute = {
  path: string;
  lastModified?: Date;
  changeFrequency: SitemapFrequency;
  priority: number;
};

export type ToolPage = {
  path: string;
  title: string;
  metaDescription: string;
  keywords: string[];
  eyebrow: string;
  h1: string;
  intro: string;
  whatItDoes: string;
  howToUse: string[];
  benefits: string[];
  faqs: FaqItem[];
  related: string[];
  primaryCta: string;
};

export const toolPages: ToolPage[] = [
  {
    path: "/ai-resume-builder",
    title: "AI Resume Builder | LaunchMind AI",
    metaDescription:
      "Build a focused resume draft with AI guidance for skills, experience, achievements, and role-specific positioning.",
    keywords: ["AI resume builder", "resume generator", "job application AI", "career tools"],
    eyebrow: "Career tool",
    h1: "AI resume builder for focused job applications",
    intro:
      "Create a sharper resume outline that connects your skills, projects, and achievements to the role you want.",
    whatItDoes:
      "The AI resume builder helps you turn scattered career notes into a structured resume draft. It focuses on role fit, measurable achievements, clear sections, and concise language that is easier for recruiters to scan.",
    howToUse: [
      "Choose the role or job family you want to target.",
      "Add your experience, education, projects, skills, and measurable results.",
      "Review the generated resume structure and refine the strongest bullets.",
      "Export or copy the draft into your preferred resume format.",
    ],
    benefits: [
      "Helps remove vague resume language.",
      "Creates a stronger connection between your experience and a target role.",
      "Gives students, founders, and freelancers a faster first draft.",
      "Keeps the resume readable instead of overstuffed with keywords.",
    ],
    faqs: [
      {
        question: "Can AI write my full resume?",
        answer:
          "AI can create a strong draft, but you should review every claim, number, and responsibility before using it in a real job application.",
      },
      {
        question: "Is this AI resume builder useful for students?",
        answer:
          "Yes. Students can use projects, coursework, volunteer work, internships, and startup experience to create a clearer resume draft.",
      },
      {
        question: "Should I use the same resume for every job?",
        answer:
          "No. A stronger approach is to adapt the summary, skills, and achievement bullets for the role you are applying to.",
      },
    ],
    related: ["/ai-cover-letter-generator", "/jobs", "/blog"],
    primaryCta: "Build your resume draft",
  },
  {
    path: "/ai-cover-letter-generator",
    title: "AI Cover Letter Generator | LaunchMind AI",
    metaDescription:
      "Generate a practical cover letter draft tailored to a role, company, experience, and motivation without sounding generic.",
    keywords: ["AI cover letter generator", "cover letter AI", "job application letter", "career AI"],
    eyebrow: "Career tool",
    h1: "AI cover letter generator for practical applications",
    intro:
      "Draft a clear cover letter that explains why you fit a role, what you have done, and why the company should keep reading.",
    whatItDoes:
      "The AI cover letter generator helps convert your role target, background, and motivation into a concise letter. It avoids empty flattery and focuses on relevant proof, contribution, and fit.",
    howToUse: [
      "Paste the job title, company name, and important requirements.",
      "Add your strongest experience, projects, or achievements.",
      "Generate a first draft and remove anything that does not sound like you.",
      "Customize the opening and closing before sending.",
    ],
    benefits: [
      "Saves time on the first draft.",
      "Keeps the letter aligned with a specific job description.",
      "Helps job seekers avoid generic cover letter wording.",
      "Works well alongside a tailored resume draft.",
    ],
    faqs: [
      {
        question: "Do recruiters read cover letters?",
        answer:
          "Some do and some do not, but a concise and relevant cover letter can help when the role values communication, motivation, or a specific background story.",
      },
      {
        question: "Can I send an AI-generated cover letter as-is?",
        answer:
          "You should edit it first. The best cover letters sound specific, accurate, and personal to the applicant.",
      },
      {
        question: "What should a cover letter include?",
        answer:
          "It should include the target role, why you are interested, proof that you can do the work, and a short closing statement.",
      },
    ],
    related: ["/ai-resume-builder", "/jobs", "/blog"],
    primaryCta: "Generate a cover letter",
  },
  {
    path: "/startup-idea-generator",
    title: "Startup Idea Generator | LaunchMind AI",
    metaDescription:
      "Generate, analyze, and refine startup ideas with AI prompts for target audience, feasibility, risks, and MVP direction.",
    keywords: ["startup idea generator", "AI startup ideas", "business idea generator", "MVP ideas"],
    eyebrow: "Startup tool",
    h1: "Startup idea generator for realistic business concepts",
    intro:
      "Explore startup ideas and turn promising concepts into structured plans with audience, feasibility, and launch thinking.",
    whatItDoes:
      "The startup idea generator helps you move from a rough problem area to a more specific concept. It can shape the idea, audience, one-line pitch, feasibility concerns, risks, revenue paths, and MVP direction.",
    howToUse: [
      "Start with a problem, audience, industry, or personal interest.",
      "Generate a focused idea and review who it serves.",
      "Run the idea through feasibility, SWOT, competitor, and MVP planning.",
      "Keep the idea only if the next validation step is clear.",
    ],
    benefits: [
      "Helps founders and students avoid vague idea statements.",
      "Connects ideation with practical validation steps.",
      "Creates internal links to business names, MVP planning, and reports.",
      "Supports class projects, hackathons, and early founder research.",
    ],
    faqs: [
      {
        question: "What makes a good startup idea?",
        answer:
          "A useful startup idea has a clear audience, a real problem, a practical solution, and a validation path that can be tested before heavy development.",
      },
      {
        question: "Can AI validate my startup idea?",
        answer:
          "AI can help structure the reasoning, but real validation still needs interviews, market checks, competitor review, and small experiments.",
      },
      {
        question: "Should I generate many ideas or improve one idea?",
        answer:
          "Generate several options first, then spend more time improving the one with the clearest problem, audience, and testing path.",
      },
    ],
    related: ["/business-name-generator", "/ai-tools", "/blog"],
    primaryCta: "Generate a startup idea",
  },
  {
    path: "/business-name-generator",
    title: "Business Name Generator | LaunchMind AI",
    metaDescription:
      "Create startup and business name ideas with positioning notes, audience fit, naming angles, and brand direction.",
    keywords: ["business name generator", "startup name generator", "AI business names", "brand name ideas"],
    eyebrow: "Naming tool",
    h1: "Business name generator for startup-ready ideas",
    intro:
      "Find clear business name directions that match your audience, category, and positioning instead of random word lists.",
    whatItDoes:
      "The business name generator helps create name options for startup ideas, side projects, and student ventures. It can organize naming directions by tone, audience, category clarity, and memorability.",
    howToUse: [
      "Describe the business idea, audience, and industry.",
      "Choose the tone you want, such as practical, premium, playful, or technical.",
      "Generate name options and shortlist the ones that are easy to say and remember.",
      "Check domain, trademark, and social availability before committing.",
    ],
    benefits: [
      "Creates names tied to positioning instead of random combinations.",
      "Works with early startup idea validation.",
      "Helps compare naming styles before choosing a brand direction.",
      "Encourages practical checks before launch.",
    ],
    faqs: [
      {
        question: "What should I check before choosing a business name?",
        answer:
          "Check domain availability, trademark risk, social handles, pronunciation, spelling, and whether the name still makes sense as the business grows.",
      },
      {
        question: "Should my startup name describe exactly what I do?",
        answer:
          "Not always. Descriptive names are clear, but broader names can work if the positioning and category are still understandable.",
      },
      {
        question: "Can AI create brandable names?",
        answer:
          "AI can generate useful directions and options, but the final name should be checked legally and tested with real people.",
      },
    ],
    related: ["/startup-idea-generator", "/ai-tools", "/blog"],
    primaryCta: "Generate business names",
  },
];

export const publicSitemapRoutes: IndexedRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/features", changeFrequency: "monthly", priority: 0.8 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.65 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.45 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.35 },
  { path: "/terms-of-service", changeFrequency: "yearly", priority: 0.35 },
  { path: "/ai-tools", changeFrequency: "weekly", priority: 0.95 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.75 },
  { path: "/jobs", changeFrequency: "weekly", priority: 0.7 },
  ...toolPages.map((tool) => ({
    path: tool.path,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  })),
];

export const blogArticles = [
  {
    title: "How to validate a startup idea before building",
    description:
      "A practical checklist for interviews, competitor review, MVP scope, and early demand testing.",
    category: "Startup validation",
    readTime: "6 min read",
  },
  {
    title: "How to use AI tools without creating generic business plans",
    description:
      "Use AI for structure, critique, and alternatives while keeping the research grounded in real constraints.",
    category: "AI planning",
    readTime: "5 min read",
  },
  {
    title: "Resume and cover letter tips for startup-minded students",
    description:
      "How to describe class projects, freelance work, hackathons, and early ventures in job applications.",
    category: "Careers",
    readTime: "4 min read",
  },
];

export const jobCategories = [
  "AI product intern",
  "Startup operations assistant",
  "Junior product manager",
  "Growth marketing intern",
  "No-code automation specialist",
  "Founder associate",
];

export async function getDynamicSitemapRoutes(): Promise<IndexedRoute[]> {
  return [];
}
