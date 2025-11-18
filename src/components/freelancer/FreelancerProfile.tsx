import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { freelancerStorage, userStorage } from '@/lib/storage';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Shield } from 'lucide-react';

interface FreelancerProfileProps {
  userId: string;
}

export default function FreelancerProfile({ userId }: FreelancerProfileProps) {
  const [profile, setProfile] = useState(freelancerStorage.getById(userId));
  const [user, setUser] = useState(userStorage.getById(userId));

  useEffect(() => {
    setProfile(freelancerStorage.getById(userId));
    setUser(userStorage.getById(userId));
  }, [userId]);

  const handleProfileUpdate = (field: string, value: any) => {
    if (profile) {
      const updated = { ...profile, [field]: value, updatedAt: new Date().toISOString() };
      freelancerStorage.save(updated);
      setProfile(updated);
      toast.success('Profile updated successfully');
    }
  };

  const handleUserUpdate = (field: string, value: string) => {
    if (user) {
      const updated = { ...user, [field]: value };
      userStorage.save(updated);
      setUser(updated);
      toast.success('Profile updated successfully');
    }
  };

  if (!profile || !user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Freelancer Profile</h1>
        <p className="text-muted-foreground">
          Manage your professional information and settings
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Picture Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src={user.avatar || profile.portfolioUrl} />
              <AvatarFallback className="text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="font-semibold text-lg">{user.name}</p>
              <p className="text-sm text-muted-foreground">{profile.professionalTitle}</p>
              <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
            </div>
            <Badge variant={getStatusColor(profile.verificationStatus)}>
              {profile.verificationStatus.toUpperCase()}
            </Badge>
          </CardContent>
        </Card>

        {/* Personal Information Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={user.name}
                  onChange={(e) => handleUserUpdate('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  onChange={(e) => handleUserUpdate('email', e.target.value)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={user.phone || ''}
                  onChange={(e) => handleUserUpdate('phone', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Professional Title
                </Label>
                <Input
                  id="title"
                  value={profile.professionalTitle}
                  onChange={(e) => handleProfileUpdate('professionalTitle', e.target.value)}
                  placeholder="e.g. Web Designer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Professional Bio
              </Label>
              <Textarea
                id="bio"
                value={profile.bio || ''}
                onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                placeholder="Tell us about your experience and expertise..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Portfolio URL
              </Label>
              <Input
                id="portfolio"
                type="url"
                value={profile.portfolioUrl || ''}
                onChange={(e) => handleProfileUpdate('portfolioUrl', e.target.value)}
                placeholder="https://yourportfolio.com"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  value={profile.experienceYears}
                  onChange={(e) => handleProfileUpdate('experienceYears', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="rating"
                    value={profile.rating.toFixed(1)}
                    disabled
                  />
                  <span className="text-sm text-muted-foreground">({profile.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Member since {new Date(profile.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
