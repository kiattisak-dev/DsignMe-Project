export type ProjectStatus = 'Planning' | 'In Progress' | 'Complete' | 'On Hold' | 'Cancelled';

export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export type ContactStatus = 'New' | 'Replied' | 'Pending' | 'Closed';

export interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
}