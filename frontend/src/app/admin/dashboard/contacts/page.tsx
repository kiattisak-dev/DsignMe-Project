"use client"

import React, { useState } from 'react'
import { Button } from '@/components/admin/ui/button'
import { Input } from '@/components/admin/ui/input'
import { Search, Filter, MoreHorizontal, Mail, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/admin/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/admin/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select"
import { Badge } from '@/components/admin/ui/badge'
import { Card, CardContent } from '@/components/admin/ui/card'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/admin/ui/table'
import { ContactStatus } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/admin/ui/dialog"

// Sample data - in a real app this would come from an API or database
const initialContacts = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    message: 'I would like to discuss a potential collaboration on our upcoming corporate event. Please let me know when you might be available for a call.',
    status: 'New' as ContactStatus,
    createdAt: '2023-06-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    message: 'Interested in your services for our upcoming project. We need a complete website redesign with modern aesthetics and improved user experience. Looking forward to your response.',
    status: 'Replied' as ContactStatus,
    createdAt: '2023-06-12T14:20:00Z',
  },
  {
    id: 3,
    name: 'Michael Chen',
    email: 'mchen@gmail.com',
    message: 'Can you provide more information about your pricing for e-commerce development? We are a small business looking to expand our online presence.',
    status: 'Pending' as ContactStatus,
    createdAt: '2023-06-10T09:15:00Z',
  },
  {
    id: 4,
    name: 'Emily Rodriguez',
    email: 'emily.r@corporation.net',
    message: 'We found your portfolio impressive and would like to inquire about availability for our upcoming rebrand project starting next month.',
    status: 'New' as ContactStatus,
    createdAt: '2023-06-08T16:45:00Z',
  },
  {
    id: 5,
    name: 'David Williams',
    email: 'david.w@example.org',
    message: 'Thank you for your previous work on our website. We would like to discuss some additional features and updates if you are available.',
    status: 'Closed' as ContactStatus,
    createdAt: '2023-06-05T11:20:00Z',
  },
  {
    id: 6,
    name: 'Jessica Taylor',
    email: 'j.taylor@startup.co',
    message: 'We are a startup looking for a developer to help us build our MVP. Your work looks great and we would love to discuss our project further.',
    status: 'Replied' as ContactStatus,
    createdAt: '2023-06-03T13:10:00Z',
  },
]

export default function ContactsPage() {
  const [contacts, setContacts] = useState(initialContacts)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ContactStatus | 'All'>('All')
  const { toast } = useToast()
  const [selectedContact, setSelectedContact] = useState<typeof initialContacts[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // Filter contacts based on search query and status filter
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'All' || contact.status === statusFilter
    
    return matchesSearch && matchesStatus
  })
  
  // Update contact status
  const updateContactStatus = (id: number, status: ContactStatus) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, status } : contact
    ))
    
    toast({
      title: "Contact updated",
      description: `Contact status has been changed to ${status}.`,
    })
    
    setIsDialogOpen(false)
  }
  
  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  // Get badge color based on status
  const getStatusColor = (status: ContactStatus) => {
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
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  // Get status icon based on status
  const getStatusIcon = (status: ContactStatus) => {
    switch (status) {
      case 'New':
        return <Clock className="h-4 w-4" />
      case 'Replied':
        return <CheckCircle className="h-4 w-4" />
      case 'Pending':
        return <Clock className="h-4 w-4" />
      case 'Closed':
        return <XCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
        <p className="text-muted-foreground">
          Manage inquiries and messages from your contacts.
        </p>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as ContactStatus | 'All')}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Replied">Replied</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${contact.email}`} alt={contact.name} />
                        <AvatarFallback>{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(contact.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(contact.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(contact.status)}
                        {contact.status}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => {
                          setSelectedContact(contact)
                          setIsDialogOpen(true)
                        }}>
                          <Mail className="mr-2 h-4 w-4" />
                          <span>View Message</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => updateContactStatus(contact.id, 'Replied')}>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          <span>Mark as Replied</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => updateContactStatus(contact.id, 'Pending')}>
                          <Clock className="mr-2 h-4 w-4 text-amber-500" />
                          <span>Mark as Pending</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => updateContactStatus(contact.id, 'Closed')}>
                          <XCircle className="mr-2 h-4 w-4 text-gray-500" />
                          <span>Mark as Closed</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No contacts found. Try adjusting your search or filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Contact Message Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Message from {selectedContact?.name}
            </DialogTitle>
            <DialogDescription className="flex items-center justify-between">
              <span>{selectedContact?.email}</span>
              <Badge className={getStatusColor(selectedContact?.status as ContactStatus)}>
                <span className="flex items-center gap-1">
                  {selectedContact && getStatusIcon(selectedContact.status as ContactStatus)}
                  {selectedContact?.status}
                </span>
              </Badge>
            </DialogDescription>
          </DialogHeader>
          
          <div className="border rounded-md p-4 my-4 bg-muted/30 max-h-[200px] overflow-y-auto">
            <p className="whitespace-pre-line">{selectedContact?.message}</p>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Received: {selectedContact && formatDate(selectedContact.createdAt)}
          </div>
          
          <DialogFooter className="flex sm:justify-between gap-4">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => updateContactStatus(selectedContact?.id as number, 'Replied')}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Replied
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => updateContactStatus(selectedContact?.id as number, 'Closed')}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Mark as Closed
              </Button>
            </div>
            <Button 
              size="sm"
              onClick={() => setIsDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}