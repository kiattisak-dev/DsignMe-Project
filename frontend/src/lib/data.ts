export interface ProjectUser {
  id: string;
  title: string;
  slug: string;
  description: string;
  summary: string;
  coverImage: string;
  images: string[];
  category: string;
  tags: string[];
  technologies: string[];
  featured: boolean;
  completedAt: string;
  client: string;
  url: string;
}

export const projects: ProjectUser[] = [
  {
    id: '1',
    title: 'Minimalist E-commerce Website',
    slug: 'minimalist-ecommerce-website',
    description: 'A clean and modern e-commerce platform designed for a fashion brand. Focusing on user experience and elegant product presentation.',
    summary: 'Clean, modern e-commerce platform with minimalist UI and seamless user experience.',
    coverImage: 'https://picsum.photos/200/300?grayscale',
    images: [
      'https://picsum.photos/200/300?grayscale',
      'https://picsum.photos/200/300?grayscale',
      'https://picsum.photos/200/300?grayscale'
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
    coverImage: 'https://picsum.photos/200/300?grayscale',
    images: [
      'https://picsum.photos/200/300?grayscale',
      'https://picsum.photos/200/300?grayscale',
      'https://picsum.photos/200/300?grayscale'
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
    coverImage: 'https://picsum.photos/200/300?grayscale',
    images: [
      'https://picsum.photos/200/300?grayscale',
      'https://picsum.photos/200/300?grayscale',
      'https://picsum.photos/200/300?grayscale'
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
    coverImage: 'https://picsum.photos/200/300?grayscale',
    images: [
      'https://picsum.photos/200/300?grayscale',
      'https://picsum.photos/200/300?grayscale',
      'https://picsum.photos/200/300?grayscale'
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
    coverImage: 'https://picsum.photos/200/300?grayscale',
    images: [
      'https://picsum.photos/200/300?grayscale',
      'https://picsum.photos/200/300?grayscale',
      'https://picsum.photos/200/300?grayscale'
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
    coverImage: 'https://picsum.photos/200/300?grayscale',
    images: [
      'https://picsum.photos/200/300?grayscale',
      'https://picsum.photos/200/300?grayscale',
      'https://picsum.photos/200/300?grayscale'
    ],
    category: 'Web Application',
    tags: ['Education', 'E-learning', 'Interactive'],
    technologies: ['Vue.js', 'Node.js', 'MongoDB'],
    featured: false,
    completedAt: '2023-04-15',
    client: 'EduTech Innovations',
    url: 'https://example.com/eduplatform'
  }
];

// Get featured projects
export function getFeaturedProjects(): ProjectUser[] {
  return projects.filter(project => project.featured);
}

// Get all projects
export function getAllProjects(): ProjectUser[] {
  return projects;
}

// Get project by slug
export function getProjectBySlug(slug: string): ProjectUser | undefined {
  return projects.find(project => project.slug === slug);
}

// Get all categories
export function getAllCategories(): string[] {
  const categories = projects.map(project => project.category);
  return Array.from(new Set(categories));
}

// Get projects by category
export function getProjectsByCategory(category: string): ProjectUser[] {
  return projects.filter(project => project.category === category);
}

// Get all tags
export function getAllTags(): string[] {
  const tags = projects.flatMap(project => project.tags);
  return Array.from(new Set(tags));
}