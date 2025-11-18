import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  FileText, 
  Upload, 
  BarChart3, 
  DollarSign, 
  CreditCard,
  Star,
  User,
  Settings,
  LogOut,
  Sparkles,
  Download,
  TrendingUp,
  AlertCircle,
  Code
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { 
  freelancerStorage, 
  freelancerTemplateStorage, 
  earningsStorage, 
  reviewStorage
} from '@/lib/storage';
import type { FreelancerProfile as FreelancerProfileType } from '@/lib/storage';
import { formatCurrency } from '@/lib/freelancerUtils';
import FreelancerOverview from '@/components/freelancer/FreelancerOverview';
import FreelancerTemplates from '@/components/freelancer/FreelancerTemplates';
import FreelancerUpload from '@/components/freelancer/FreelancerUpload';
import FreelancerAnalytics from '@/components/freelancer/FreelancerAnalytics';
import FreelancerEarnings from '@/components/freelancer/FreelancerEarnings';
import FreelancerPayouts from '@/components/freelancer/FreelancerPayouts';
import FreelancerReviews from '@/components/freelancer/FreelancerReviews';
import FreelancerProfile from '@/components/freelancer/FreelancerProfile';
import FreelancerSettings from '@/components/freelancer/FreelancerSettings';
import FreelancerCodeEditor from '@/components/freelancer/FreelancerCodeEditor';
import { toast } from 'sonner';

export default function FreelancerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState<FreelancerProfileType | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/freelancer/auth');
      return;
    }

    if (user.role !== 'freelancer') {
      toast.error('Access denied. Freelancer account required.');
      navigate('/');
      return;
    }

    const freelancerProfile = freelancerStorage.getById(user.id);
    if (!freelancerProfile) {
      toast.error('Freelancer profile not found');
      navigate('/');
      return;
    }

    setProfile(freelancerProfile);
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!profile || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">Template Builder</span>
            </Link>

            <div className="flex items-center gap-4">
              {profile.verificationStatus === 'pending' && (
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Pending Approval
                </Badge>
              )}
              {profile.verificationStatus === 'rejected' && (
                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Application Rejected
                </Badge>
              )}
              {profile.verificationStatus === 'approved' && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Verified Freelancer
                </Badge>
              )}
              
              <div className="flex items-center gap-2">
                <img 
                  src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium">{user.name}</span>
              </div>

              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-10 w-full max-w-6xl">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden md:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden md:inline">Templates</span>
            </TabsTrigger>
            <TabsTrigger value="code-editor" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span className="hidden md:inline">Code Editor</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span className="hidden md:inline">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden md:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="earnings" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden md:inline">Earnings</span>
            </TabsTrigger>
            <TabsTrigger value="payouts" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden md:inline">Payouts</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span className="hidden md:inline">Reviews</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden md:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <FreelancerOverview profile={profile} />
          </TabsContent>

          <TabsContent value="templates">
            <FreelancerTemplates freelancerId={user.id} />
          </TabsContent>

          <TabsContent value="code-editor">
            <FreelancerCodeEditor />
          </TabsContent>

          <TabsContent value="upload">
            <FreelancerUpload freelancerId={user.id} />
          </TabsContent>

          <TabsContent value="analytics">
            <FreelancerAnalytics freelancerId={user.id} />
          </TabsContent>

          <TabsContent value="earnings">
            <FreelancerEarnings freelancerId={user.id} />
          </TabsContent>

          <TabsContent value="payouts">
            <FreelancerPayouts freelancerId={user.id} profile={profile} />
          </TabsContent>

          <TabsContent value="reviews">
            <FreelancerReviews freelancerId={user.id} />
          </TabsContent>

          <TabsContent value="profile">
            <FreelancerProfile userId={user.id} />
          </TabsContent>

          <TabsContent value="settings">
            <FreelancerSettings userId={user.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
