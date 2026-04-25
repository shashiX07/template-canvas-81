import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Key, Smartphone, Settings, Lock, Moon, Sun, Monitor } from "lucide-react";
import { userStorage } from "@/lib/storage";
import { toast } from "sonner";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";

export function ProfileSettings() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "preferences";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const user = userStorage.getCurrentUser();
  const { theme, setTheme, isDark } = useTheme();

  const handleToggle2FA = () => {
    if (user) {
      const updated = { ...user, twoFactorEnabled: !user.twoFactorEnabled };
      userStorage.save(updated);
      userStorage.setCurrentUser(updated);
      toast.success(`2FA ${updated.twoFactorEnabled ? "enabled" : "disabled"}`);
    }
  };

  const themeChoices = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero header */}
      <section className="relative border-b border-foreground/10 overflow-hidden">
        <div className="absolute -top-32 -right-20 w-[400px] h-[400px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="max-w-[1100px] mx-auto px-6 py-12 relative">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-px bg-foreground" />
            <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60">
              Settings · No.06
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-[1.02] tracking-tight">
            The <span className="italic">small things</span>.
          </h1>
          <p className="mt-4 text-foreground/65 text-lg max-w-xl leading-[1.7]">
            Tune the workspace to your hand. Notifications, theme, language,
            and keys to your account.
          </p>
        </div>
      </section>

      <div className="max-w-[1100px] mx-auto px-6 py-10">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent p-0 h-auto gap-2 mb-8">
            <TabsTrigger
              value="preferences"
              className="rounded-full border border-foreground/15 px-5 py-2 data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:border-foreground gap-2"
            >
              <Settings className="w-4 h-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="rounded-full border border-foreground/15 px-5 py-2 data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:border-foreground gap-2"
            >
              <Lock className="w-4 h-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preferences" className="space-y-8">
            <SectionTitle kicker="Chapter 01" title="Notifications" italic="quiet by default" />
            <Card className="rounded-2xl border-foreground/10">
              <CardContent className="divide-y divide-foreground/10 p-0">
                <Row
                  label="Email notifications"
                  hint="Receive email updates about your templates"
                  control={<Switch defaultChecked />}
                />
                <Row
                  label="Marketing emails"
                  hint="Tips and news about new templates"
                  control={<Switch />}
                />
              </CardContent>
            </Card>

            <SectionTitle kicker="Chapter 02" title="Appearance" italic="light, dark, or both" />
            <Card className="rounded-2xl border-foreground/10">
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-3 gap-3">
                  {themeChoices.map(({ value, label, icon: Icon }) => {
                    const active = theme === value;
                    return (
                      <button
                        key={value}
                        onClick={() => setTheme(value)}
                        className={`relative rounded-2xl border p-5 text-left transition-all ${
                          active
                            ? "border-foreground bg-foreground/[0.04]"
                            : "border-foreground/15 hover:border-foreground/40"
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-3 text-foreground/70" />
                        <p className="font-display text-xl font-light leading-tight">
                          {label}
                        </p>
                        <p className="font-mono-accent text-[10px] uppercase tracking-[0.2em] text-foreground/50 mt-1">
                          {active ? "Selected" : "Choose"}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-foreground/10">
                  <div>
                    <Label className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-foreground/70">
                      Quick toggle
                    </Label>
                    <p className="text-sm text-foreground/55 mt-1">
                      Switch between light and dark
                    </p>
                  </div>
                  <Switch
                    checked={isDark}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>
              </CardContent>
            </Card>

            <SectionTitle kicker="Chapter 03" title="Language" italic="speak your way" />
            <Card className="rounded-2xl border-foreground/10">
              <CardContent className="p-6">
                <Label className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-foreground/70">
                  Display language
                </Label>
                <div className="mt-3 max-w-sm">
                  <Select defaultValue="en">
                    <SelectTrigger className="rounded-full h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <SectionTitle
              kicker="Chapter 04"
              title="Danger zone"
              italic="permanent, irreversible"
            />
            <Card className="rounded-2xl border-destructive/30 bg-destructive/[0.03]">
              <CardContent className="divide-y divide-destructive/15 p-0">
                <Row
                  label="Delete all templates"
                  hint="Permanently delete all your customized templates"
                  control={
                    <Button
                      variant="destructive"
                      onClick={() => toast.error("Feature not implemented")}
                    >
                      Delete all
                    </Button>
                  }
                />
                <Row
                  label="Delete account"
                  hint="Permanently delete your account and all data"
                  control={
                    <Button
                      variant="destructive"
                      onClick={() => toast.error("Feature not implemented")}
                    >
                      Delete account
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-8">
            <SectionTitle kicker="Chapter 01" title="Password" italic="change it often" />
            <Card className="rounded-2xl border-foreground/10">
              <CardHeader className="flex-row items-center gap-2 pb-2">
                <Key className="w-4 h-4 text-foreground/60" />
                <CardTitle className="text-base font-medium">Change password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-mono-accent text-[10px] uppercase tracking-[0.25em]">
                    Current password
                  </Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-2">
                  <Label className="font-mono-accent text-[10px] uppercase tracking-[0.25em]">
                    New password
                  </Label>
                  <Input id="new" type="password" />
                </div>
                <div className="space-y-2">
                  <Label className="font-mono-accent text-[10px] uppercase tracking-[0.25em]">
                    Confirm new password
                  </Label>
                  <Input id="confirm" type="password" />
                </div>
                <Button onClick={() => toast.success("Password updated successfully")}>
                  Update password
                </Button>
              </CardContent>
            </Card>

            <SectionTitle
              kicker="Chapter 02"
              title="Two-factor"
              italic="an extra lock"
            />
            <Card className="rounded-2xl border-foreground/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-foreground/60" />
                      <Label>2FA Status</Label>
                      <Badge
                        variant={user?.twoFactorEnabled ? "default" : "secondary"}
                        className="rounded-full"
                      >
                        {user?.twoFactorEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground/55">
                      {user?.twoFactorEnabled
                        ? "Your account is protected with 2FA"
                        : "Enable 2FA for enhanced security"}
                    </p>
                  </div>
                  <Switch
                    checked={user?.twoFactorEnabled}
                    onCheckedChange={handleToggle2FA}
                  />
                </div>
              </CardContent>
            </Card>

            <SectionTitle kicker="Chapter 03" title="Sessions" italic="who is signed in" />
            <Card className="rounded-2xl border-foreground/10">
              <CardHeader className="flex-row items-center gap-2 pb-2">
                <Shield className="w-4 h-4 text-foreground/60" />
                <CardTitle className="text-base font-medium">Active sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border border-foreground/10 rounded-xl">
                  <div>
                    <p className="font-medium">Current device</p>
                    <p className="font-mono-accent text-[10px] uppercase tracking-[0.2em] text-foreground/50 mt-1">
                      Last active · now
                    </p>
                  </div>
                  <Badge className="rounded-full">Active</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function SectionTitle({
  kicker,
  title,
  italic,
}: {
  kicker: string;
  title: string;
  italic: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <span className="w-6 h-px bg-foreground" />
        <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/55">
          {kicker}
        </span>
      </div>
      <h2 className="font-display text-2xl md:text-3xl font-light tracking-tight">
        {title} <span className="italic text-foreground/60">— {italic}</span>
      </h2>
    </div>
  );
}

function Row({
  label,
  hint,
  control,
}: {
  label: string;
  hint: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-5">
      <div className="space-y-1 min-w-0">
        <Label className="text-[15px]">{label}</Label>
        <p className="text-sm text-foreground/55">{hint}</p>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}
