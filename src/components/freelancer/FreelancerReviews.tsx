import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface FreelancerReviewsProps {
  freelancerId: string;
}

export default function FreelancerReviews({ freelancerId }: FreelancerReviewsProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reviews</h1>
      
      <Card className="p-12 text-center">
        <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
        <p className="text-muted-foreground">
          Reviews from customers will appear here
        </p>
      </Card>
    </div>
  );
}
