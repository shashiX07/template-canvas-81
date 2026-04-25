import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { FreelancerSidebar } from '@/components/freelancer/FreelancerSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { freelancerStorage } from '@/lib/storage';
import type { FreelancerProfile as FreelancerProfileType } from '@/lib/storage';
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
import { FileText, Code, Upload, BarChart3, DollarSign, CreditCard, User, Settings } from 'lucide-react';

// Dashboard Overview Component — header now lives inside FreelancerOverview
function DashboardContent({ profile }: { profile: FreelancerProfileType }) {
  return (
    <div className="container mx-auto px-6 md:px-10 py-10">
      <FreelancerOverview profile={profile} />
    </div>
  );
}

// Templates Section with Tabs
function TemplatesSection({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] = useState('templates');
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Templates</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="templates" className="gap-2">
            <FileText className="w-4 h-4" />
            My Templates
          </TabsTrigger>
          <TabsTrigger value="code-editor" className="gap-2">
            <Code className="w-4 h-4" />
            Code Editor
          </TabsTrigger>
          <TabsTrigger value="upload" className="gap-2">
            <Upload className="w-4 h-4" />
            Upload
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates">
          <FreelancerTemplates freelancerId={userId} />
        </TabsContent>
        <TabsContent value="code-editor">
          <FreelancerCodeEditor />
        </TabsContent>
        <TabsContent value="upload">
          <FreelancerUpload freelancerId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Monetization Section with Tabs
function MonetizationSection({ userId, profile }: { userId: string; profile: FreelancerProfileType }) {
  const [activeTab, setActiveTab] = useState('analytics');
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Monetization</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="earnings" className="gap-2">
            <DollarSign className="w-4 h-4" />
            Earnings
          </TabsTrigger>
          <TabsTrigger value="payouts" className="gap-2">
            <CreditCard className="w-4 h-4" />
            Payouts
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics">
          <FreelancerAnalytics freelancerId={userId} />
        </TabsContent>
        <TabsContent value="earnings">
          <FreelancerEarnings freelancerId={userId} />
        </TabsContent>
        <TabsContent value="payouts">
          <FreelancerPayouts freelancerId={userId} profile={profile} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Reviews Section
function ReviewsSection({ userId }: { userId: string }) {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Reviews</h1>
      <FreelancerReviews freelancerId={userId} />
    </div>
  );
}

// Account Section with Tabs
function AccountSection({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] = useState('profile');
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Account</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <FreelancerProfile userId={userId} />
        </TabsContent>
        <TabsContent value="settings">
          <FreelancerSettings userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function FreelancerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  if (!profile || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <FreelancerSidebar />
        <main className="flex-1 bg-background overflow-auto">
          <Routes>
            <Route path="/" element={<DashboardContent profile={profile} />} />
            <Route path="/templates" element={<TemplatesSection userId={user.id} />} />
            <Route path="/monetization" element={<MonetizationSection userId={user.id} profile={profile} />} />
            <Route path="/reviews" element={<ReviewsSection userId={user.id} />} />
            <Route path="/account" element={<AccountSection userId={user.id} />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
}