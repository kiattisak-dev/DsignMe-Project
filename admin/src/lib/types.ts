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

export interface ProjectData {
  name: string;
  [key: string]: number | string;
}

export interface CategoryData {
  name: string;
  value: number;
}

export interface Project {
  ID: string;
  ImageUrl: string;
  VideoUrl: string;
  CategoryID: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface Category {
  ID: string;
  NameCategory: string;
  CreatedAt?: string;
  UpdatedAt?: string;
}