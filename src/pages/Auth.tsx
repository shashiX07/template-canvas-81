import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, LogIn, UserPlus, ArrowRight, Mail, Lock, User, Sparkles, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const Auth = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupStep, setSignupStep] = useState(1);
  const [activeTab, setActiveTab] = useState('login');

  const { login, signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      return;
    }

    if (login(loginEmail, loginPassword)) {
      navigate('/');
    }
  };

  const handleSignupNext = () => {
    if (signupStep === 1 && signupName && signupEmail) {
      setSignupStep(2);
    }
  };

  const handleSignupBack = () => {
    if (signupStep === 2) {
      setSignupStep(1);
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      return;
    }

    if (signupPassword.length < 6) {
      return;
    }

    if (signup(signupName, signupEmail, signupPassword)) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Branding & Features */}
          <div className="hidden lg:flex flex-col gap-8 p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary-foreground" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Template Editor
                </h1>
              </div>
              <p className="text-xl text-muted-foreground">
                Create stunning templates with our powerful editor
              </p>
            </div>

            <div className="space-y-6 mt-8">
              {[
                { icon: Sparkles, title: "AI-Powered Design", desc: "Smart suggestions as you create" },
                { icon: FileText, title: "Rich Templates", desc: "Access hundreds of pre-made templates" },
                { icon: Check, title: "Easy Customization", desc: "Edit everything with simple clicks" }
              ].map((feature, i) => (
                <div key={i} className="flex gap-4 items-start group hover:translate-x-2 transition-transform">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Trusted by <span className="font-semibold text-foreground">10,000+</span> creators worldwide
              </p>
            </div>
          </div>

          {/* Right side - Auth Forms */}
          <div className="w-full max-w-md mx-auto">
            <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setSignupStep(1); }} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
                <TabsTrigger value="login" className="text-base">Login</TabsTrigger>
                <TabsTrigger value="signup" className="text-base">Sign Up</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="mt-0">
                <Card className="border-2 shadow-xl">
                  <CardHeader className="space-y-3 pb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                      <LogIn className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
                    <CardDescription className="text-center">
                      Enter your credentials to access your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLogin} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="login-email" className="text-base">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="name@example.com"
                            className="pl-10 h-11"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password" className="text-base">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="login-password"
                            type="password"
                            placeholder="Enter your password"
                            className="pl-10 h-11"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full h-11 text-base group">
                        Login
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      <div className="rounded-lg bg-muted/50 p-4 mt-4">
                        <p className="text-sm text-muted-foreground text-center">
                          <strong className="text-foreground">Demo Account:</strong><br />
                          admin@example.com / admin123
                        </p>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Signup Tab with Steps */}
              <TabsContent value="signup" className="mt-0">
                <Card className="border-2 shadow-xl">
                  <CardHeader className="space-y-3 pb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                      <UserPlus className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl text-center">Create Account</CardTitle>
                    <CardDescription className="text-center">
                      {signupStep === 1 ? "Let's start with your basic info" : "Secure your account with a password"}
                    </CardDescription>
                    
                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <div className={cn(
                        "h-2 w-16 rounded-full transition-all",
                        signupStep >= 1 ? "bg-primary" : "bg-muted"
                      )} />
                      <div className={cn(
                        "h-2 w-16 rounded-full transition-all",
                        signupStep >= 2 ? "bg-primary" : "bg-muted"
                      )} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSignup} className="space-y-5">
                      {/* Step 1: Name & Email */}
                      <div className={cn(
                        "space-y-5 transition-all",
                        signupStep !== 1 && "hidden"
                      )}>
                        <div className="space-y-2">
                          <Label htmlFor="signup-name" className="text-base">Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input
                              id="signup-name"
                              type="text"
                              placeholder="John Doe"
                              className="pl-10 h-11"
                              value={signupName}
                              onChange={(e) => setSignupName(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-email" className="text-base">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input
                              id="signup-email"
                              type="email"
                              placeholder="name@example.com"
                              className="pl-10 h-11"
                              value={signupEmail}
                              onChange={(e) => setSignupEmail(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <Button 
                          type="button" 
                          onClick={handleSignupNext}
                          className="w-full h-11 text-base group"
                          disabled={!signupName || !signupEmail}
                        >
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>

                      {/* Step 2: Password */}
                      <div className={cn(
                        "space-y-5 transition-all",
                        signupStep !== 2 && "hidden"
                      )}>
                        <div className="space-y-2">
                          <Label htmlFor="signup-password" className="text-base">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input
                              id="signup-password"
                              type="password"
                              placeholder="Min. 6 characters"
                              className="pl-10 h-11"
                              value={signupPassword}
                              onChange={(e) => setSignupPassword(e.target.value)}
                              required
                              minLength={6}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-confirm" className="text-base">Confirm Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input
                              id="signup-confirm"
                              type="password"
                              placeholder="Re-enter password"
                              className="pl-10 h-11"
                              value={signupConfirmPassword}
                              onChange={(e) => setSignupConfirmPassword(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={handleSignupBack}
                            className="flex-1 h-11 text-base"
                          >
                            Back
                          </Button>
                          <Button 
                            type="submit" 
                            className="flex-1 h-11 text-base group"
                            disabled={!signupPassword || !signupConfirmPassword}
                          >
                            Create Account
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
