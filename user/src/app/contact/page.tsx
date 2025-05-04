import { Metadata } from 'next'
import ContactForm from '@/components/contact/contact-form'
import { Mail, MapPin, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact | Portfolio',
  description: 'Get in touch with me for project inquiries, collaborations, or just to say hello',
}

export default function ContactPage() {
  return (
    <div className="container py-16 md:py-24">
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-medium mb-4">Get in Touch</h1>
        <p className="text-muted-foreground text-lg">
          Have a project in mind? I'd love to hear about it. Send me a message and let's create something amazing together.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <div className="md:col-span-1 space-y-8">
          <div className="flex items-start">
            <MapPin className="h-6 w-6 mr-4 text-primary" />
            <div>
              <h3 className="text-lg font-medium mb-1">Location</h3>
              <p className="text-muted-foreground">Bangkok, Thailand</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Mail className="h-6 w-6 mr-4 text-primary" />
            <div>
              <h3 className="text-lg font-medium mb-1">Email</h3>
              <p className="text-muted-foreground">hello@example.com</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Phone className="h-6 w-6 mr-4 text-primary" />
            <div>
              <h3 className="text-lg font-medium mb-1">Phone</h3>
              <p className="text-muted-foreground">+66 123 456 789</p>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}