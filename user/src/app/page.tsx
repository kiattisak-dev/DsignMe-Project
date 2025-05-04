import { Metadata } from 'next'
import Hero from '@/components/home/hero'
import FeaturedProjects from '@/components/projects/featured-projects'
import { getFeaturedProjects } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Portfolio | Creative Designer & Developer',
  description: 'A minimalist portfolio showcasing creative design and development projects',
}

export default function Home() {
  const featuredProjects = getFeaturedProjects()
  
  return (
    <div>
      <Hero />
      <FeaturedProjects projects={featuredProjects} />
    </div>
  )
}