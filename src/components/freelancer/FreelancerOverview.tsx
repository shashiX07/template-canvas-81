import { Card } from '@/components/ui/card';
import { FileText, Download, DollarSign, Star, TrendingUp, Clock } from 'lucide-react';
import { FreelancerProfile, freelancerTemplateStorage, earningsStorage } from '@/lib/storage';
import { formatCurrency } from '@/lib/freelancerUtils';
import { Button } from '@/components/ui/button';

interface FreelancerOverviewProps {
  profile: FreelancerProfile;
}

export default function FreelancerOverview({ profile }: FreelancerOverviewProps) {
  const templates = freelancerTemplateStorage.getByFreelancerId(profile.userId);
  const earnings = earningsStorage.getByFreelancerId(profile.userId);
  const availableBalance = earningsStorage.getAvailableBalance(profile.userId);

  const stats = [
    {
      label: 'Total Templates',
      value: profile.totalTemplates,
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Total Downloads',
      value: profile.totalDownloads,
      icon: Download,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Total Earnings',
      value: formatCurrency(profile.totalEarnings),
      icon: DollarSign,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Average Rating',
      value: profile.rating.toFixed(1),
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
  ];

  const recentTemplates = templates.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="h-auto flex-col gap-2 py-4">
            <FileText className="w-6 h-6" />
            <span>Upload New Template</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 py-4">
            <DollarSign className="w-6 h-6" />
            <span>Request Payout</span>
            <span className="text-xs text-muted-foreground">
              Available: {formatCurrency(availableBalance)}
            </span>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 py-4">
            <TrendingUp className="w-6 h-6" />
            <span>View Analytics</span>
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Templates</h2>
          {recentTemplates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No templates yet</p>
              <p className="text-sm">Upload your first template to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTemplates.map((template) => (
                <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <img 
                      src={template.thumbnail} 
                      alt={template.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium">{template.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {template.downloads} downloads
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-2 py-1 rounded text-xs ${
                      template.submissionStatus === 'published' ? 'bg-green-500/10 text-green-500' :
                      template.submissionStatus === 'approved' ? 'bg-blue-500/10 text-blue-500' :
                      template.submissionStatus === 'under_review' ? 'bg-orange-500/10 text-orange-500' :
                      'bg-gray-500/10 text-gray-500'
                    }`}>
                      {template.submissionStatus}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Earnings</h2>
          {earnings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No earnings yet</p>
              <p className="text-sm">Start earning by uploading templates</p>
            </div>
          ) : (
            <div className="space-y-3">
              {earnings.slice(0, 5).map((earning) => (
                <div key={earning.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{earning.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(earning.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-500">
                      +{formatCurrency(earning.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {earning.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Account Status */}
      {profile.verificationStatus === 'pending' && (
        <Card className="p-6 bg-yellow-500/5 border-yellow-500/20">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-yellow-500" />
            <div>
              <h3 className="font-semibold">Application Under Review</h3>
              <p className="text-sm text-muted-foreground">
                Your freelancer application is being reviewed. You'll be notified within 2-3 business days.
              </p>
            </div>
          </div>
        </Card>
      )}

      {profile.verificationStatus === 'rejected' && (
        <Card className="p-6 bg-red-500/5 border-red-500/20">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-red-500" />
            <div>
              <h3 className="font-semibold">Application Rejected</h3>
              <p className="text-sm text-muted-foreground">
                {profile.verificationNotes || 'Your application was rejected. Please contact support for more information.'}
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Resubmit Application
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
