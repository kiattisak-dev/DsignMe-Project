import { ProjectUser } from '@/lib/types'
import ProjectCard from './project-card'

interface FeaturedProjectsProps {
  projects: ProjectUser[]
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <h2 className="text-3xl font-medium mb-8 text-center md:text-left">Featured Projects</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}