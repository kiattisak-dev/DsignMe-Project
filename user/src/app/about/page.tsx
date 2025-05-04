import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Download } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About | Portfolio',
  description: 'Learn more about my background, skills, and experience as a designer and developer',
}

export default function AboutPage() {
  const skills = [
    'UI/UX Design', 'Web Development', 'Mobile Apps', 
    'React', 'Next.js', 'TypeScript', 'Tailwind CSS',
    'Figma', 'Responsive Design', 'Branding'
  ]
  
  return (
    <div className="container py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        <div>
          <h1 className="text-4xl font-medium mb-4">About Me</h1>
          <p className="text-muted-foreground mb-6">
            I'm a designer and developer passionate about creating beautiful, functional digital experiences.
            With over 5 years of experience, I specialize in crafting user interfaces and developing
            responsive web applications that deliver exceptional user experiences.
          </p>
          
          <p className="text-muted-foreground mb-6">
            My approach combines clean aesthetics with user-centered design principles,
            ensuring that every project not only looks great but also functions seamlessly
            across all devices and platforms.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link href="/contact">
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link href="#">
                <Download className="mr-2 h-4 w-4" />
                Download CV
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-lg">
            <Image
              src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Portrait"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          
          <div className="absolute -bottom-6 -right-6 -z-10 w-full h-full rounded-lg bg-primary/10" />
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto mt-24">
        <h2 className="text-3xl font-medium mb-8 text-center">My Journey</h2>
        
        <div className="space-y-12">
          <div className="relative pl-8 border-l border-muted-foreground/20">
            <div className="absolute w-4 h-4 bg-primary rounded-full -left-2 top-0" />
            <h3 className="text-xl font-medium mb-2">Senior Designer & Developer</h3>
            <p className="text-sm text-primary mb-2">2021 - Present</p>
            <p className="text-muted-foreground">
              Leading design and development projects for various clients, focusing on
              creating minimalist, user-friendly digital experiences with modern technologies.
            </p>
          </div>
          
          <div className="relative pl-8 border-l border-muted-foreground/20">
            <div className="absolute w-4 h-4 bg-primary rounded-full -left-2 top-0" />
            <h3 className="text-xl font-medium mb-2">UI/UX Designer</h3>
            <p className="text-sm text-primary mb-2">2018 - 2021</p>
            <p className="text-muted-foreground">
              Designed user interfaces and experiences for web and mobile applications,
              collaborating with development teams to implement responsive, accessible designs.
            </p>
          </div>
          
          <div className="relative pl-8 border-l border-muted-foreground/20">
            <div className="absolute w-4 h-4 bg-primary rounded-full -left-2 top-0" />
            <h3 className="text-xl font-medium mb-2">Front-end Developer</h3>
            <p className="text-sm text-primary mb-2">2016 - 2018</p>
            <p className="text-muted-foreground">
              Developed responsive websites and web applications, focusing on clean code,
              performance optimization, and cross-browser compatibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}