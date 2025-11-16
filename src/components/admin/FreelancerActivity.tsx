import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Activity,
  Upload,
  Download,
  DollarSign,
  Star,
  MessageSquare,
  FileText,
  CheckCircle,
  Clock
} from "lucide-react";
import { freelancerTemplateStorage, earningsStorage, type FreelancerTemplate, type FreelancerEarning } from "@/lib/storage";
import { formatCurrency } from "@/lib/freelancerUtils";

interface ActivityLog {
  id: string;
  freelancerId: string;
  type: 'template_upload' | 'template_approved' | 'template_rejected' | 'download' | 'earning' | 'review' | 'payout';
  description: string;
  timestamp: string;
  metadata?: any;
}

export function FreelancerActivity() {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [filter, setFilter] = useState<'all' | 'uploads' | 'earnings' | 'reviews'>('all');

  useEffect(() => {
    loadActivityLogs();
  }, []);

  const loadActivityLogs = () => {
    const templates = freelancerTemplateStorage.getAll();
    const earnings = Object.values(localStorage)
      .filter(item => {
        try {
          const parsed = JSON.parse(item);
          return parsed && parsed.freelancerId;
        } catch {
          return false;
        }
      });

    const logs: ActivityLog[] = [];

    // Add template activities
    templates.forEach(template => {
      logs.push({
        id: `template-${template.id}`,
        freelancerId: template.freelancerId,
        type: 'template_upload',
        description: `Uploaded template "${template.title}"`,
        timestamp: template.submittedAt || template.createdAt,
        metadata: template
      });

      if (template.reviewedAt) {
        logs.push({
          id: `review-${template.id}`,
          freelancerId: template.freelancerId,
          type: template.submissionStatus === 'approved' ? 'template_approved' : 'template_rejected',
          description: `Template "${template.title}" was ${template.submissionStatus}`,
          timestamp: template.reviewedAt,
          metadata: template
        });
      }
    });

    // Sort by timestamp (newest first)
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setActivityLogs(logs);
  };

  const filteredLogs = activityLogs.filter(log => {
    if (filter === 'all') return true;
    if (filter === 'uploads') return log.type.includes('template');
    if (filter === 'earnings') return log.type.includes('earning') || log.type.includes('payout');
    if (filter === 'reviews') return log.type.includes('review');
    return true;
  });

  const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'template_upload':
        return <Upload className="w-4 h-4" />;
      case 'template_approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'template_rejected':
        return <Clock className="w-4 h-4 text-red-600" />;
      case 'download':
        return <Download className="w-4 h-4" />;
      case 'earning':
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'review':
        return <Star className="w-4 h-4 text-yellow-600" />;
      case 'payout':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: ActivityLog['type']) => {
    switch (type) {
      case 'template_approved':
        return 'bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-900';
      case 'template_rejected':
        return 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-900';
      case 'earning':
      case 'payout':
        return 'bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900';
      case 'review':
        return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900';
      default:
        return 'bg-muted border-border';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Freelancer Activity Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="mb-4">
          <TabsList>
            <TabsTrigger value="all">All Activity</TabsTrigger>
            <TabsTrigger value="uploads">Uploads</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
        </Tabs>

        <ScrollArea className="h-[600px]">
          <div className="space-y-3 pr-4">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No activity found</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className={`flex items-start gap-3 p-4 border rounded-lg ${getActivityColor(log.type)}`}
                >
                  <div className="mt-1">
                    {getActivityIcon(log.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{log.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        Freelancer ID: {log.freelancerId.substring(0, 8)}...
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(log.timestamp)}
                      </span>
                    </div>
                    
                    {log.metadata?.reviewNotes && (
                      <div className="mt-2 p-2 bg-background/50 rounded text-sm">
                        <p className="text-muted-foreground">{log.metadata.reviewNotes}</p>
                      </div>
                    )}
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    {log.type.replace(/_/g, ' ')}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
