import { Project } from './types'

export const projects: Project[] = [
  {
    id: '1',
    title: 'Minimalist E-commerce Website',
    slug: 'minimalist-ecommerce-website',
    description: 'A clean and modern e-commerce platform designed for a fashion brand. Focusing on user experience and elegant product presentation.',
    summary: 'Clean, modern e-commerce platform with minimalist UI and seamless user experience.',
    coverImage: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    images: [
      'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/5632403/pexels-photo-5632403.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    category: 'Web Development',
    tags: ['E-commerce', 'UI/UX', 'Minimalist'],
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Stripe'],
    featured: true,
    completedAt: '2024-03-15',
    client: 'Fashion Brand Inc.',
    url: 'https://example.com/ecommerce'
  },
  {
    id: '2',
    title: 'Financial Dashboard',
    slug: 'financial-dashboard',
    description: 'A comprehensive financial dashboard for portfolio management, with real-time data visualization and customizable views for different user needs.',
    summary: 'Financial dashboard with real-time analytics and interactive charts.',
    coverImage: 'https://images.pexels.com/photos/7567434/pexels-photo-7567434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    images: [
      'https://images.pexels.com/photos/7567434/pexels-photo-7567434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/6801647/pexels-photo-6801647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    category: 'Web Application',
    tags: ['Dashboard', 'Finance', 'Data Visualization'],
    technologies: ['React', 'TypeScript', 'D3.js', 'Recharts'],
    featured: true,
    completedAt: '2024-01-20',
    client: 'FinTech Solutions',
    url: 'https://example.com/dashboard'
  },
  {
    id: '3',
    title: 'Productivity Mobile App',
    slug: 'productivity-mobile-app',
    description: 'A productivity application designed to help users manage tasks, track habits, and set goals. Features include calendar integration, notifications, and progress tracking.',
    summary: 'Intuitive task management app with habit tracking and goal setting features.',
    coverImage: 'https://images.pexels.com/photos/6633920/pexels-photo-6633920.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    images: [
      'https://images.pexels.com/photos/6633920/pexels-photo-6633920.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/6633928/pexels-photo-6633928.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/6633923/pexels-photo-6633923.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    category: 'Mobile App',
    tags: ['Productivity', 'UI/UX', 'Mobile'],
    technologies: ['React Native', 'Firebase', 'Redux'],
    featured: true,
    completedAt: '2023-11-10',
    client: 'Self-initiated',
    url: 'https://example.com/productivity'
  },
  {
    id: '4',
    title: 'Corporate Identity Redesign',
    slug: 'corporate-identity-redesign',
    description: 'A complete corporate identity redesign for a technology company, including logo, typography, color scheme, business cards, and digital assets.',
    summary: 'Complete corporate identity redesign with cohesive brand elements.',
    coverImage: 'https://images.pexels.com/photos/4458554/pexels-photo-4458554.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    images: [
      'https://images.pexels.com/photos/4458554/pexels-photo-4458554.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/5709659/pexels-photo-5709659.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    category: 'Branding',
    tags: ['Corporate Identity', 'Logo Design', 'Branding'],
    technologies: ['Adobe Illustrator', 'Adobe Photoshop', 'Figma'],
    featured: false,
    completedAt: '2023-09-05',
    client: 'Tech Innovations LLC',
    url: 'https://example.com/branding'
  },
  {
    id: '5',
    title: 'Smart Home IoT Interface',
    slug: 'smart-home-interface',
    description: 'A user-friendly interface for controlling smart home devices. The design focuses on accessibility and intuitive controls for users of all ages.',
    summary: 'Accessible and intuitive smart home control interface with elegant visualizations.',
    coverImage: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    images: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/6518610/pexels-photo-6518610.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    category: 'UI/UX Design',
    tags: ['IoT', 'Smart Home', 'Interface Design'],
    technologies: ['Figma', 'Sketch', 'Prototyping'],
    featured: false,
    completedAt: '2023-06-30',
    client: 'HomeConnect Systems',
    url: 'https://example.com/smarthome'
  },
  {
    id: '6',
    title: 'Educational Platform',
    slug: 'educational-platform',
    description: 'An interactive learning platform for coding education, featuring project-based learning, code playgrounds, and progress tracking.',
    summary: 'Interactive learning platform with code playgrounds and progress tracking.',
    coverImage: 'https://images.pexels.com/photos/4144179/pexels-photo-4144179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    images: [
      'https://images.pexels.com/photos/4144179/pexels-photo-4144179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/4144222/pexels-photo-4144222.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/4144101/pexels-photo-4144101.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    category: 'Web Application',
    tags: ['Education', 'E-learning', 'Interactive'],
    technologies: ['Vue.js', 'Node.js', 'MongoDB'],
    featured: false,
    completedAt: '2023-04-15',
    client: 'EduTech Innovations',
    url: 'https://example.com/eduplatform'
  }
]

// Get featured projects
export function getFeaturedProjects(): Project[] {
  return projects.filter(project => project.featured)
}

// Get all projects
export function getAllProjects(): Project[] {
  return projects
}

// Get project by slug
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(project => project.slug === slug)
}

// Get all categories
export function getAllCategories(): string[] {
  const categories = projects.map(project => project.category)
  return Array.from(new Set(categories))
}

// Get projects by category
export function getProjectsByCategory(category: string): Project[] {
  return projects.filter(project => project.category === category)
}

// Get all tags
export function getAllTags(): string[] {
  const tags = projects.flatMap(project => project.tags)
  return Array.from(new Set(tags))
}