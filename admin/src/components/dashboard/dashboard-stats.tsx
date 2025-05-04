import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { FolderKanban, Inbox, Award, TrendingUp } from 'lucide-react'

export function DashboardStats() {
  const stats = [
    {
      title: 'Total Projects',
      value: '32',
      change: '+4',
      changeType: 'increase',
      icon: FolderKanban,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Active Projects',
      value: '24',
      change: '+2',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Completed Projects',
      value: '8',
      change: '+1',
      changeType: 'increase',
      icon: Award,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'New Messages',
      value: '12',
      change: '+3',
      changeType: 'increase',
      icon: Inbox,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-3xl font-bold">{stat.value}</h4>
                  <span className={`text-xs font-medium ${
                    stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              
              <div className={`rounded-full p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}