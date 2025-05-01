"use client"

import { useState } from 'react'
import { Button } from '@/components/admin/ui/button'
import { cn } from '@/lib/utils'

interface ProjectFilterProps {
  categories: string[]
  onFilterChange: (category: string) => void
}

export default function ProjectFilter({ categories, onFilterChange }: ProjectFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const handleFilter = (category: string) => {
    setActiveCategory(category)
    onFilterChange(category)
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "rounded-full",
          activeCategory === 'All' ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
        )}
        onClick={() => handleFilter('All')}
      >
        All
      </Button>
      
      {categories.map((category) => (
        <Button
          key={category}
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-full",
            activeCategory === category ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
          )}
          onClick={() => handleFilter(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  )
}