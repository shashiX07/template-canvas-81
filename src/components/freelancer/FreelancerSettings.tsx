import { Card } from '@/components/ui/card';
import { Settings } from 'lucide-react';

interface FreelancerSettingsProps {
  userId: string;
}

export default function FreelancerSettings({ userId }: FreelancerSettingsProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <Card className="p-12 text-center">
        <Settings className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-xl font-semibold mb-2">Settings</h3>
        <p className="text-muted-foreground">
          Account settings and preferences coming soon
        </p>
      </Card>
    </div>
  );
}
