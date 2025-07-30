export interface PortfolioItem {
  id: number | string; // อัพเดทให้รองรับ string ด้วย เพราะ backend ส่ง ObjectID เป็น string
  url?: string;
  videoUrl?: string;
  videoLink?: string;
  title: string;
  category: string;
  description?: string;
  mediaType?: "image" | "video" | "youtube"; // เพิ่มฟิลด์นี้
}

export interface Service {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string[]; // เปลี่ยนจาก string เป็น string[]
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
