import Link from 'next/link'
import { Button } from '@/components/admin/ui/button'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 -right-60 w-[600px] h-[600px] rounded-full bg-primary/5" />
        <div className="absolute bottom-1/4 -left-32 w-[400px] h-[400px] rounded-full bg-primary/5" />
      </div>
      
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className={cn(
            "mb-6 animate-fade-up",
            "text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl"
          )}>
            Creative Designer & <span className="text-primary">Developer</span>
          </h1>
          
          <p className="mb-8 text-lg text-muted-foreground animate-fade-up">
            I create beautiful, functional websites and applications 
            that help businesses grow and succeed in the digital world.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up">
            <Button asChild size="lg">
              <Link href="/projects">
                View My Work
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">
                Get in Touch
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}