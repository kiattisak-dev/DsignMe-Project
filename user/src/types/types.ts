export interface PortfolioItem {
  id: number | string;
  url?: string;
  videoUrl?: string;
  videoLink?: string;
  title: string;
  category: string;
  description?: string;
  mediaType?: "image" | "video" | "youtube"; 
}

export interface Service {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string[];
  features: string[];
  timeline?: string;
  revisions?: string;
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
