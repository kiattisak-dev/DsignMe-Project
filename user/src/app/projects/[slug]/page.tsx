import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProjectBySlug, getAllProjects } from '@/lib/data'
import ProjectGallery from '@/components/projects/project-gallery'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Globe, User } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface ProjectPageProps {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  const projects = getAllProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export function generateMetadata({ params }: ProjectPageProps): Metadata {
  const project = getProjectBySlug(params.slug)
  
  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }
  
  return {
    title: `${project.title} | Portfolio`,
    description: project.summary,
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getProjectBySlug(params.slug)
  
  if (!project) {
    notFound()
  }
  
  return (
    <div className="container py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-medium mb-4">{project.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">{project.summary}</p>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <ProjectGallery images={project.images} title={project.title} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-medium mb-4">Project Details</h2>
            <p className="text-muted-foreground mb-6">{project.description}</p>
            
            <h3 className="text-xl font-medium mb-3">Technologies</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="outline">
                  {tech}
                </Badge>
              ))}
            </div>
            
            {project.url && (
              <Button asChild>
                <Link href={project.url} target="_blank" rel="noopener noreferrer">
                  <Globe className="mr-2 h-4 w-4" />
                  Visit Project
                </Link>
              </Button>
            )}
          </div>
          
          <div className="bg-muted/40 p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-4">Project Info</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="text-sm font-medium">Completed</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(project.completedAt)}
                  </p>
                </div>
              </div>
              
              {project.client && (
                <div className="flex items-start">
                  <User className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Client</p>
                    <p className="text-sm text-muted-foreground">{project.client}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start">
                <div className="h-5 w-5 mr-3 text-primary flex items-center justify-center">
                  <span className="text-xs font-bold">#{}</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm text-muted-foreground">{project.category}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}