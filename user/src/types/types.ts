export interface PortfolioItem {
  id: number;
  url: string;
  title: string;
  category: string;
  description: string;
}

export interface Service {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  features: string[];
  timeline: string;
  revisions: string;
  subtitles?: { text: string }[];
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface ContactInfo {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  detail: string;
}