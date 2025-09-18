import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, MessageSquare, Users, Tag, Folder } from 'lucide-react';
import { BlogStatistics } from '../../config/blog.types';

interface BlogStatsCardsProps {
  statistics: BlogStatistics;
}

export function BlogStatsCards({ statistics }: BlogStatsCardsProps) {
  const statsCards = [
    {
      title: 'Total Posts',
      value: statistics.totalPosts,
      description: `${statistics.publishedPosts} published, ${statistics.draftPosts} drafts`,
      icon: BookOpen,
    },
    {
      title: 'Categories',
      value: statistics.totalCategories,
      description: 'Content categories',
      icon: Folder,
    },
    {
      title: 'Tags',
      value: statistics.totalTags,
      description: 'Content tags',
      icon: Tag,
    },
    {
      title: 'Comments',
      value: statistics.totalComments,
      description: `${statistics.approvedComments} approved, ${statistics.pendingComments} pending`,
      icon: MessageSquare,
    },
    {
      title: 'Authors',
      value: statistics.totalAuthors,
      description: 'Content contributors',
      icon: Users,
    },
  ];

  return (
    <>
      {statsCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">{stat.title}</CardTitle>
              <Icon className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-primary text-2xl">
                {stat.value}
              </div>
              <p className="mt-1 text-muted-foreground text-xs">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}