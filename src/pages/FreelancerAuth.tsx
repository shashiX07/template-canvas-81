import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  ArrowRight, 
  ArrowLeft, 
  Mail, 
  Lock, 
  User, 
  Briefcase,
  Globe,
  Github,
  Linkedin,
  Upload,
  Check,
  Sparkles,
  FileText,
  Image as ImageIcon,
  DollarSign
} from 'lucide-react';
import { userStorage, freelancerStorage } from '@/lib/storage';
import type { FreelancerProfile as FreelancerProfileType, User as UserType } from '@/lib/storage';
import { fileToBase64 } from '@/lib/freelancerUtils';
import { cn } from '@/lib/utils';

const EXPERTISE_OPTIONS = [
  'HTML/CSS', 'JavaScript', 'React', 'Vue', 'Angular', 'Node.js',
  'WordPress', 'Shopify', 'UI/UX Design', 'Graphic Design',
  'Animation', 'Responsive Design', 'E-commerce', 'Landing Pages'
];

export default function FreelancerAuth() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Step 1: Account Basics
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Step 2: Professional Info
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState([3]);
  const [expertise, setExpertise] = useState<string[]>([]);

  // Step 3: Portfolio & Links
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);

  // Step 4: Resume
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');

  // Step 5: Payment
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'bank_transfer' | 'stripe'>('paypal');
  const [paymentEmail, setPaymentEmail] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'portfolio') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'resume') {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Resume file must be less than 10MB');
        return;
      }
      const base64 = await fileToBase64(file);
      setResumeUrl(base64);
      setResumeFileName(file.name);
      toast.success('Resume uploaded successfully');
    } else if (type === 'portfolio') {
      if (portfolioImages.length >= 5) {
        toast.error('Maximum 5 portfolio images allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      const base64 = await fileToBase64(file);
      setPortfolioImages(prev => [...prev, base64]);
      toast.success('Portfolio image added');
    }
  };

  const validateStep = (): boolean => {
    switch (step) {
      case 1:
        if (!name || !email || !password || !confirmPassword) {
          toast.error('Please fill in all fields');
          return false;
        }
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          return false;
        }
        if (password.length < 8) {
          toast.error('Password must be at least 8 characters');
          return false;
        }
        if (!termsAccepted) {
          toast.error('Please accept the terms and conditions');
          return false;
        }
        // Check if email already exists
        const existingUser = userStorage.getAll().find(u => u.email === email);
        if (existingUser) {
          toast.error('Email already registered');
          return false;
        }
        return true;
      case 2:
        if (!professionalTitle || !bio || expertise.length === 0) {
          toast.error('Please complete all required fields');
          return false;
        }
        return true;
      case 3:
        // Optional fields
        return true;
      case 4:
        if (!resumeUrl) {
          toast.error('Please upload your resume');
          return false;
        }
        return true;
      case 5:
        // Optional, can be completed later
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleSubmit = () => {
    // Create user account
    const userId = `freelancer-${Date.now()}`;
    const newUser: UserType = {
      id: userId,
      name,
      email,
      password,
      role: 'freelancer',
      isVerified: false,
      isAdmin: false,
      isSuperAdmin: false,
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
      customizedTemplates: [],
      draftTemplates: [],
      freelancerProfileId: userId,
    };

    // Create freelancer profile
    const profile: FreelancerProfileType = {
      userId,
      professionalTitle,
      bio,
      expertise,
      experienceYears: experienceYears[0],
      portfolioUrl,
      websiteUrl,
      linkedinUrl,
      githubUrl,
      resumeUrl,
      resumeFileName,
      portfolioImages,
      verificationStatus: 'pending',
      totalTemplates: 0,
      approvedTemplates: 0,
      totalDownloads: 0,
      totalEarnings: 0,
      rating: 0,
      reviewCount: 0,
      isActive: true,
      acceptingWork: true,
      minProjectBudget: 500,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    userStorage.save(newUser);
    freelancerStorage.save(profile);
    userStorage.setCurrentUser(newUser);

    toast.success('Application submitted! Pending admin approval.');
    navigate('/freelancer/dashboard');
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">Template Builder</span>
          </Link>
          <Link to="/auth">
            <Button variant="outline">Regular Login</Button>
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Step {step} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Content */}
        <Card className="max-w-4xl mx-auto p-8">
          {/* Step 1: Account Basics */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Become a Freelancer</h1>
                <p className="text-muted-foreground">Join our community of talented template creators</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      className="pl-10"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      className="pl-10"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      className="pl-10"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the Freelancer Terms & Conditions and Privacy Policy
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Professional Info */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Briefcase className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Professional Information</h2>
                <p className="text-muted-foreground">Tell us about your expertise</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Professional Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Senior Web Designer"
                    value={professionalTitle}
                    onChange={(e) => setProfessionalTitle(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio / About Me * (Max 500 characters)</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself, your experience, and what makes you unique..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 500))}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{bio.length}/500 characters</p>
                </div>

                <div>
                  <Label>Years of Experience: {experienceYears[0]}</Label>
                  <Slider
                    value={experienceYears}
                    onValueChange={setExperienceYears}
                    max={20}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Areas of Expertise * (Select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {EXPERTISE_OPTIONS.map((option) => (
                      <div key={option} className="flex items-center gap-2">
                        <Checkbox
                          id={option}
                          checked={expertise.includes(option)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setExpertise([...expertise, option]);
                            } else {
                              setExpertise(expertise.filter(e => e !== option));
                            }
                          }}
                        />
                        <Label htmlFor={option} className="text-sm">{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Portfolio & Links */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Portfolio & Links</h2>
                <p className="text-muted-foreground">Showcase your work (optional)</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="portfolio">Portfolio Website</Label>
                  <Input
                    id="portfolio"
                    type="url"
                    placeholder="https://yourportfolio.com"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="website">Personal Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://yourwebsite.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="linkedin">LinkedIn Profile</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="linkedin"
                      type="url"
                      className="pl-10"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="github">GitHub Profile</Label>
                  <div className="relative">
                    <Github className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="github"
                      type="url"
                      className="pl-10"
                      placeholder="https://github.com/yourusername"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Portfolio Images (Max 5 images, 5MB each)</Label>
                  <div className="mt-2">
                    <label className="flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 cursor-pointer hover:border-primary transition-colors">
                      <ImageIcon className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Click to upload images</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'portfolio')}
                        disabled={portfolioImages.length >= 5}
                      />
                    </label>
                  </div>
                  {portfolioImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {portfolioImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt={`Portfolio ${idx + 1}`} className="w-full h-24 object-cover rounded" />
                          <Button
                            size="icon"
                            variant="destructive"
                            className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setPortfolioImages(portfolioImages.filter((_, i) => i !== idx))}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Resume Upload */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Resume Upload</h2>
                <p className="text-muted-foreground">Upload your resume or CV</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Upload Resume * (PDF, DOC, DOCX - Max 10MB)</Label>
                  <div className="mt-2">
                    {!resumeUrl ? (
                      <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-12 cursor-pointer hover:border-primary transition-colors">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Click to upload your resume</span>
                        <span className="text-xs text-muted-foreground">PDF, DOC, DOCX (Max 10MB)</span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'resume')}
                        />
                      </label>
                    ) : (
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-primary" />
                          <div>
                            <p className="font-medium">{resumeFileName}</p>
                            <p className="text-xs text-muted-foreground">Resume uploaded successfully</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setResumeUrl('');
                            setResumeFileName('');
                          }}
                        >
                          Replace
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Payment Information */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Payment Information</h2>
                <p className="text-muted-foreground">Set up how you'd like to receive payments (optional - can be completed later)</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Preferred Payment Method</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {(['paypal', 'bank_transfer', 'stripe'] as const).map((method) => (
                      <Button
                        key={method}
                        variant={paymentMethod === method ? 'default' : 'outline'}
                        onClick={() => setPaymentMethod(method)}
                        className="capitalize"
                      >
                        {method.replace('_', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>

                {paymentMethod === 'paypal' && (
                  <div>
                    <Label htmlFor="paymentEmail">PayPal Email</Label>
                    <Input
                      id="paymentEmail"
                      type="email"
                      placeholder="paypal@example.com"
                      value={paymentEmail}
                      onChange={(e) => setPaymentEmail(e.target.value)}
                    />
                  </div>
                )}

                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Payout Information</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Minimum payout threshold: $50</li>
                    <li>• Payouts processed within 5-7 business days</li>
                    <li>• You can update payment details anytime</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Review & Submit */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Check className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Review & Submit</h2>
                <p className="text-muted-foreground">Please review your information before submitting</p>
              </div>

              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Account Information</h3>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p><strong>Name:</strong> {name}</p>
                    <p><strong>Email:</strong> {email}</p>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Professional Details</h3>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p><strong>Title:</strong> {professionalTitle}</p>
                    <p><strong>Experience:</strong> {experienceYears[0]} years</p>
                    <p><strong>Expertise:</strong> {expertise.join(', ')}</p>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Documents</h3>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p><strong>Resume:</strong> {resumeFileName}</p>
                    <p><strong>Portfolio Images:</strong> {portfolioImages.length} uploaded</p>
                  </div>
                </Card>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    What happens next?
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>1. Your application will be reviewed by our team</li>
                    <li>2. You'll receive an email notification within 2-3 business days</li>
                    <li>3. Once approved, you can start uploading templates</li>
                    <li>4. Start earning from your creative work!</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-8 border-t">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            {step < totalSteps ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                <Check className="w-4 h-4 mr-2" />
                Submit Application
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
