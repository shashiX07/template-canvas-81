import { Card } from '@/components/ui/card';
import { User } from 'lucide-react';

interface FreelancerProfileProps {
  userId: string;
}

export default function FreelancerProfile({ userId }: FreelancerProfileProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      
      <Card className="p-12 text-center">
        <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-xl font-semibold mb-2">Profile Management</h3>
        <p className="text-muted-foreground">
          Profile editing features coming soon
        </p>
      </Card>
    </div>
  );
}
