export type ProjectStatus = 'Planning' | 'In Progress' | 'Complete' | 'On Hold' | 'Cancelled';

export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export type ContactStatus = 'New' | 'Replied' | 'Pending' | 'Closed';

export interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
}

// Project type definition
export interface ProjectUser {
  id: string
  title: string
  slug: string
  description: string
  summary: string
  coverImage: string
  images: string[]
  category: string
  tags: string[]
  technologies: string[]
  featured: boolean
  completedAt: string
  client?: string
  url?: string
}

// Form submission type
export interface ContactFormValues {
  name: string
  email: string
  subject: string
  message: string
}