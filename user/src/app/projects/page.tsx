"use client"

import { useState } from 'react'
import { Metadata } from 'next'
import { getAllProjects, getAllCategories, getProjectsByCategory } from '@/lib/data'
import ProjectCard from '@/components/projects/project-card'
import ProjectFilter from '@/components/projects/project-filter'
import { Project } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Projects | Portfolio',
  description: 'Explore my latest design and development projects',
}

export default function ProjectsPage() {
  const allProjects = getAllProjects()
  const allCategories = getAllCategories()
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(allProjects)
  
  const handleFilterChange = (category: string) => {
    if (category === 'All') {
      setFilteredProjects(allProjects)
    } else {
      setFilteredProjects(getProjectsByCategory(category))
    }
  }
  
  return (
    <div className="container py-16 md:py-24">
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-medium mb-4">Projects</h1>
        <p className="text-muted-foreground text-lg">
          Explore my latest work across various design and development disciplines.
        </p>
      </div>
      
      <ProjectFilter categories={allCategories} onFilterChange={handleFilterChange} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}