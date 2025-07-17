import { TrendingNews } from '@/components/trending-news';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, FileText, Image as ImageIcon, Music, Video } from 'lucide-react';
import Link from 'next/link';

const quickAccessItems = [
  {
    title: "LegeztTube",
    icon: Video,
    href: "/legezttube",
    description: "Explore and watch videos.",
    colorClasses: "text-chart-1 bg-chart-1/10",
  },
  {
    title: "Legeztify",
    icon: Music,
    href: "/legeztify",
    description: "Listen to your favorite audio.",
    colorClasses: "text-chart-2 bg-chart-2/10",
  },
  {
    title: "Legezterest",
    icon: ImageIcon,
    href: "/legezterest",
    description: "Discover beautiful images.",
    colorClasses: "text-chart-3 bg-chart-3/10",
  },
  {
    title: "AI Chat",
    icon: Bot,
    href: "/ai-chat",
    description: "Chat with our smart AI.",
    colorClasses: "text-chart-4 bg-chart-4/10",
  },
  {
    title: "PDF AI",
    icon: FileText,
    href: "/pdf-ai",
    description: "Analyze your PDF documents.",
    colorClasses: "text-chart-5 bg-chart-5/10",
  },
];

export default function Home() {
  return (
    <>
      <TrendingNews />
      <div className="p-4 md:p-6">
        <h2 className="text-3xl font-bold mb-6">Quick Access</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {quickAccessItems.map(item => (
                <Card key={item.title} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium font-body">{item.title}</CardTitle>
                        <div className={`p-2 rounded-full ${item.colorClasses}`}>
                            <item.icon className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                        <Button asChild variant="link" className="p-0 h-auto mt-2 text-primary">
                            <Link href={item.href}>Go to section &rarr;</Link>
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </>
  );
}
