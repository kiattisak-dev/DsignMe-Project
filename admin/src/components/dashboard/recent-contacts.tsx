"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, XCircle } from 'lucide-react'

export function RecentContacts() {
  // Sample data in a real app this would come from a database
  const contacts = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      message: 'I would like to discuss a potential collaboration.',
      status: 'New',
      avatar: 'https://i.pravatar.cc/150?img=1',
      time: '2 hours ago',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      message: 'Interested in your services for our upcoming project.',
      status: 'Replied',
      avatar: 'https://i.pravatar.cc/150?img=5',
      time: '1 day ago',
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'mchen@gmail.com',
      message: 'Can you provide more information about your pricing?',
      status: 'Pending',
      avatar: 'https://i.pravatar.cc/150?img=8',
      time: '3 days ago',
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'New':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'Replied':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'Pending':
        return <Clock className="h-4 w-4 text-amber-500" />
      case 'Closed':
        return <XCircle className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'Replied':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'Pending':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      case 'Closed':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
      default:
        return ''
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Contacts</CardTitle>
        <Link href="/dashboard/contacts">
          <Button variant="outline" size="sm">View All</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="flex flex-col space-y-2 rounded-lg border p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.email}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(contact.status)}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(contact.status)}
                    {contact.status}
                  </span>
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2">{contact.message}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{contact.time}</span>
                <Button variant="ghost" size="sm">Respond</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}