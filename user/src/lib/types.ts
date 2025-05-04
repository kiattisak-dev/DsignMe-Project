// Project type definition
export interface Project {
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