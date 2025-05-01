import Image from 'next/image'
import Link from 'next/link'
import {  ProjectUser } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/admin/ui/card'
import { Badge } from '@/components/admin/ui/badge'

interface ProjectCardProps {
  project: ProjectUser
  className?: string
}

export default function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <Card className={cn(
        "overflow-hidden group transition-all duration-300 hover:shadow-lg h-full",
        className
      )}>
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={false}
          />
        </div>
        <CardContent className="p-4 space-y-2">
          <h3 className="text-xl font-medium leading-tight">{project.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.summary}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}