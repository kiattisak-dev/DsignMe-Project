'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { ArrowRight, ExternalLink, Plus, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { RecentProjects } from '@/components/dashboard/recent-projects';
import { RecentContacts } from '@/components/dashboard/recent-contacts';

// Define Types for Chart Data
interface ProjectData {
  name: string;
  Complete: number;
  InProgress: number;
  Planning: number;
}

interface ContactData {
  name: string;
  value: number;
}

export default function DashboardPage() {
  return (
    <div className="space-y-8 bg-background text-foreground p-6">
      <DashboardHeader />

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1 border border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Project Statistics</CardTitle>
              <CardDescription>Project distribution by status</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Details
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] w-full pt-4">
              <ProjectChart />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 border border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Contact Categories</CardTitle>
              <CardDescription>Contact requests by category</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Details
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] w-full pt-4">
              <ContactChart />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentProjects />
        </div>

        <div className="lg:col-span-1">
          <RecentContacts />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/admin/dashboard/projects/new">
              <Button className="w-full justify-between bg-primary text-primary-foreground">
                <div className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Add New Project</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/admin/dashboard/contacts">
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center">
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>View Recent Contacts</span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="p-4 bg-red-500 text-white animate-accordion-down">
        Test Tailwind CSS and Animation
      </div>
    </div>
  );
}

function ProjectChart() {
  const data: ProjectData[] = [
    { name: 'Jan', Complete: 12, InProgress: 8, Planning: 5 },
    { name: 'Feb', Complete: 15, InProgress: 10, Planning: 7 },
    { name: 'Mar', Complete: 18, InProgress: 7, Planning: 10 },
    { name: 'Apr', Complete: 14, InProgress: 12, Planning: 8 },
    { name: 'May', Complete: 21, InProgress: 15, Planning: 5 },
    { name: 'Jun', Complete: 25, InProgress: 10, Planning: 8 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <XAxis dataKey="name" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} />
        <Tooltip />
        <Bar
          dataKey="Planning"
          stackId="a"
          fill="hsl(var(--chart-3))"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="InProgress"
          stackId="a"
          fill="hsl(var(--chart-2))"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="Complete"
          stackId="a"
          fill="hsl(var(--chart-1))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

function ContactChart() {
  const data: ContactData[] = [
    { name: 'Information', value: 35 },
    { name: 'Feedback', value: 25 },
    { name: 'Support', value: 20 },
    { name: 'Collaboration', value: 15 },
    { name: 'Other', value: 5 },
  ];

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }: { name: string; percent: number }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}