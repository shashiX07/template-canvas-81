import { Card } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface FreelancerAnalyticsProps {
  freelancerId: string;
}

export default function FreelancerAnalytics({ freelancerId }: FreelancerAnalyticsProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      
      <Card className="p-12 text-center">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-xl font-semibold mb-2">Analytics Coming Soon</h3>
        <p className="text-muted-foreground">
          Detailed analytics and insights will be available soon
        </p>
      </Card>
    </div>
  );
}
