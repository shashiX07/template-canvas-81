import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { freelancerStorage } from '@/lib/storage';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Bell, 
  Lock, 
  CreditCard, 
  Shield, 
  Eye, 
  Mail,
  MessageSquare,
  DollarSign 
} from 'lucide-react';

interface FreelancerSettingsProps {
  userId: string;
}

export default function FreelancerSettings({ userId }: FreelancerSettingsProps) {
  const [profile, setProfile] = useState(freelancerStorage.getById(userId));
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    orderUpdates: true,
    reviewAlerts: true,
    paymentNotifications: true,
    marketingEmails: false,
  });

  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showEarnings: false,
    showReviews: true,
  });

  useEffect(() => {
    setProfile(freelancerStorage.getById(userId));
  }, [userId]);

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    // In a real app, verify current password and update
    toast.success('Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Notification preferences updated');
  };

  const handlePrivacyToggle = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Privacy settings updated');
  };

  if (!profile) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and security
        </p>
      </div>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Security & Password
          </CardTitle>
          <CardDescription>
            Update your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current">Current Password</Label>
            <Input
              id="current"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new">New Password</Label>
            <Input
              id="new"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm New Password</Label>
            <Input
              id="confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button onClick={handlePasswordChange}>
            <Shield className="w-4 h-4 mr-2" />
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Choose what updates you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive email updates</p>
              </div>
            </div>
            <Switch
              checked={notifications.emailNotifications}
              onCheckedChange={() => handleNotificationToggle('emailNotifications')}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Order Updates</p>
                <p className="text-sm text-muted-foreground">Get notified about new orders</p>
              </div>
            </div>
            <Switch
              checked={notifications.orderUpdates}
              onCheckedChange={() => handleNotificationToggle('orderUpdates')}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Review Alerts</p>
                <p className="text-sm text-muted-foreground">Notifications for new reviews</p>
              </div>
            </div>
            <Switch
              checked={notifications.reviewAlerts}
              onCheckedChange={() => handleNotificationToggle('reviewAlerts')}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Payment Notifications</p>
                <p className="text-sm text-muted-foreground">Alerts for earnings and payouts</p>
              </div>
            </div>
            <Switch
              checked={notifications.paymentNotifications}
              onCheckedChange={() => handleNotificationToggle('paymentNotifications')}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Marketing Emails</p>
                <p className="text-sm text-muted-foreground">Promotional content and updates</p>
              </div>
            </div>
            <Switch
              checked={notifications.marketingEmails}
              onCheckedChange={() => handleNotificationToggle('marketingEmails')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Privacy
          </CardTitle>
          <CardDescription>
            Control your profile visibility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Show Profile Publicly</p>
              <p className="text-sm text-muted-foreground">Make your profile visible to users</p>
            </div>
            <Switch
              checked={privacy.showProfile}
              onCheckedChange={() => handlePrivacyToggle('showProfile')}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Show Earnings</p>
              <p className="text-sm text-muted-foreground">Display earnings on profile</p>
            </div>
            <Switch
              checked={privacy.showEarnings}
              onCheckedChange={() => handlePrivacyToggle('showEarnings')}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Show Reviews</p>
              <p className="text-sm text-muted-foreground">Display customer reviews publicly</p>
            </div>
            <Switch
              checked={privacy.showReviews}
              onCheckedChange={() => handlePrivacyToggle('showReviews')}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
