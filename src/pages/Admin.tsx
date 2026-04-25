import { useNavigate, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BarChart3, Users, FileText, Upload, UserPlus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { templateStorage, userStorage, type Template, type User } from "@/lib/storage";
import { FreelancerManagement } from "@/components/admin/FreelancerManagement";
import { FreelancerActivity } from "@/components/admin/FreelancerActivity";
import { CustomElementEditor } from "@/components/admin/CustomElementEditor";
import { toast } from "sonner";

// Dashboard Overview — editorial layout matching auth/landing pages
function AdminDashboard() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserIsAdmin, setNewUserIsAdmin] = useState(false);

  useEffect(() => {
    setTemplates(templateStorage.getAll());
    setUsers(userStorage.getAll());
  }, []);

  const handleAddUser = () => {
    if (!newUserEmail || !newUserName) {
      toast.error("Please fill all fields");
      return;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: newUserEmail,
      password: 'password123',
      name: newUserName,
      role: newUserIsAdmin ? 'admin' : 'user',
      isVerified: false,
      isAdmin: newUserIsAdmin,
      isSuperAdmin: false,
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
      customizedTemplates: [],
      draftTemplates: [],
    };

    userStorage.save(newUser);
    setUsers([...users, newUser]);
    setShowUserDialog(false);
    setNewUserEmail("");
    setNewUserName("");
    setNewUserIsAdmin(false);
    toast.success("User added successfully");
  };

  const publicTemplates = templates.filter(t => t.isPublic).length;
  const privateTemplates = templates.length - publicTemplates;
  const totalDownloads = templates.reduce((sum, t) => sum + t.downloads, 0);
  const adminUsers = users.filter(u => u.isAdmin || u.isSuperAdmin).length;
  const avgRating = templates.length > 0
    ? (templates.reduce((sum, t) => sum + t.rating, 0) / templates.length).toFixed(1)
    : '0.0';

  const stats = [
    { no: "01", label: "Templates", value: String(templates.length), sub: `${publicTemplates} public · ${privateTemplates} private`, icon: FileText },
    { no: "02", label: "Members", value: String(users.length), sub: `${adminUsers} with admin access`, icon: Users },
    { no: "03", label: "Downloads", value: totalDownloads.toLocaleString(), sub: "Across all templates", icon: BarChart3 },
    { no: "04", label: "Avg rating", value: avgRating, sub: "Out of 5 stars", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Background ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative max-w-[1200px] mx-auto px-6 md:px-10 py-10 space-y-10">
        {/* Editorial header */}
        <header>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-px bg-foreground" />
            <span className="font-mono-accent text-[11px] uppercase tracking-[0.25em] text-foreground/70">
              Admin desk · Vol. 01 · Today
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-[1.02] tracking-tight">
            The <span className="italic">control</span> room.
          </h1>
          <p className="mt-5 max-w-xl text-foreground/65 text-lg leading-[1.7]">
            Templates, members, downloads — the studio's quiet pulse, gathered in one place.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={() => navigate("/admin/upload")} size="lg" className="group">
              <Upload className="w-4 h-4 mr-2" />
              Upload a template
            </Button>
            <Button variant="outline" size="lg" onClick={() => setShowUserDialog(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add a member
            </Button>
          </div>
        </header>

        {/* Stats — editorial grid */}
        <section>
          <div className="flex items-end justify-between mb-5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-6 h-px bg-foreground" />
                <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60">
                  Numbers · This week
                </span>
              </div>
              <h2 className="font-display text-3xl font-light tracking-tight">
                A <span className="italic">quiet</span> snapshot.
              </h2>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.no}
                className="group relative border border-foreground/10 rounded-2xl p-6 bg-background hover:border-foreground/30 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/50">
                    №{stat.no} · {stat.label}
                  </span>
                  <stat.icon className="w-4 h-4 text-foreground/40 group-hover:text-foreground transition-colors" />
                </div>
                <div className="font-display text-5xl font-light tracking-tight leading-none">
                  {stat.value}
                </div>
                <p className="mt-3 text-xs text-foreground/55 leading-relaxed">
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Two-column: recent members + quick links */}
        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 border border-foreground/10 rounded-2xl bg-background overflow-hidden">
            <div className="px-6 py-5 border-b border-foreground/10 flex items-center justify-between">
              <div>
                <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/50">
                  Chapter 03 · Recent
                </span>
                <h3 className="font-display text-2xl font-light mt-1">
                  New <span className="italic">faces</span>.
                </h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/admin/freelancers")}>
                See all
              </Button>
            </div>
            <div className="divide-y divide-foreground/10">
              {users.slice(0, 5).map((user, i) => (
                <div key={user.id} className="flex items-center justify-between px-6 py-4 hover:bg-foreground/[0.02] transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/40 w-6">
                      №{String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h4 className="font-medium text-foreground">{user.name}</h4>
                      <p className="text-sm text-foreground/55">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {user.isSuperAdmin && (
                      <Badge className="font-mono-accent text-[10px] uppercase tracking-[0.2em]">
                        Super
                      </Badge>
                    )}
                    {user.isAdmin && !user.isSuperAdmin && (
                      <Badge variant="secondary" className="font-mono-accent text-[10px] uppercase tracking-[0.2em]">
                        Admin
                      </Badge>
                    )}
                    {!user.isAdmin && !user.isSuperAdmin && (
                      <span className="font-mono-accent text-[10px] uppercase tracking-[0.2em] text-foreground/40">
                        Member
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {users.length === 0 && (
                <div className="px-6 py-12 text-center text-foreground/50 text-sm">
                  No members yet.
                </div>
              )}
            </div>
          </div>

          {/* Editorial quick-links column */}
          <div className="space-y-4">
            <div className="border border-foreground/10 rounded-2xl p-6 bg-muted/30">
              <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/50">
                Chapter 04 · Shortcuts
              </span>
              <h3 className="font-display text-2xl font-light mt-1 mb-4">
                Jump <span className="italic">in</span>.
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Templates", to: "/admin/templates", icon: FileText },
                  { label: "Freelancers", to: "/admin/freelancers", icon: Users },
                  { label: "Activity log", to: "/admin/activity", icon: BarChart3 },
                ].map((item) => (
                  <button
                    key={item.to}
                    onClick={() => navigate(item.to)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-full border border-foreground/10 bg-background hover:border-foreground/40 transition-all group"
                  >
                    <span className="flex items-center gap-3 text-sm">
                      <item.icon className="w-4 h-4 text-foreground/60 group-hover:text-foreground" />
                      {item.label}
                    </span>
                    <span className="font-mono-accent text-[10px] uppercase tracking-[0.2em] text-foreground/40 group-hover:text-foreground">
                      Open →
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-l-2 border-primary pl-5 py-3">
              <div className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/50 mb-2">
                Note from the desk
              </div>
              <p className="font-display italic text-lg leading-snug">
                "Run the studio quietly. Let the work speak."
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Add User Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-light">
              Add a <span className="italic">new</span> member
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60">
                Email
              </Label>
              <Input
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60">
                Name
              </Label>
              <Input
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="Jane Doe"
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <Label className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60">
                Admin access
              </Label>
              <Switch checked={newUserIsAdmin} onCheckedChange={setNewUserIsAdmin} />
            </div>
            <Button onClick={handleAddUser} className="w-full">Add member</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Freelancers Management
function FreelancersPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Freelancer Management</h1>
      <FreelancerManagement />
    </div>
  );
}

// Templates Management
function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  useEffect(() => {
    setTemplates(templateStorage.getAll());
  }, []);

  const handleToggleTemplateVisibility = (template: Template) => {
    const updated = { ...template, isPublic: !template.isPublic };
    templateStorage.save(updated);
    setTemplates(templates.map(t => t.id === template.id ? updated : t));
    toast.success(`Template is now ${updated.isPublic ? 'public' : 'private'}`);
  };

  const handleDeleteTemplate = (id: string) => {
    templateStorage.delete(id);
    setTemplates(templates.filter(t => t.id !== id));
    toast.success("Template deleted");
  };

  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setShowTemplateDialog(true);
  };

  const handleSaveTemplate = () => {
    if (selectedTemplate) {
      templateStorage.save(selectedTemplate);
      setTemplates(templates.map(t => t.id === selectedTemplate.id ? selectedTemplate : t));
      setShowTemplateDialog(false);
      toast.success("Template updated");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Template Management</h1>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {templates.map((template) => (
              <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <img
                    src={template.thumbnail}
                    alt={template.title}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{template.title}</h4>
                    <p className="text-sm text-muted-foreground">{template.category}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant={template.isPublic ? "default" : "secondary"}>
                        {template.isPublic ? "Public" : "Private"}
                      </Badge>
                      {template.isPremium && <Badge variant="outline">Premium</Badge>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleTemplateVisibility(template)}
                  >
                    {template.isPublic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditTemplate(template)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {templates.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No templates found</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Template Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={selectedTemplate.title}
                  onChange={(e) => setSelectedTemplate({ ...selectedTemplate, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={selectedTemplate.description}
                  onChange={(e) => setSelectedTemplate({ ...selectedTemplate, description: e.target.value })}
                />
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  value={selectedTemplate.category}
                  onChange={(e) => setSelectedTemplate({ ...selectedTemplate, category: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Premium</Label>
                <Switch
                  checked={selectedTemplate.isPremium}
                  onCheckedChange={(checked) => setSelectedTemplate({ ...selectedTemplate, isPremium: checked })}
                />
              </div>
              <Button onClick={handleSaveTemplate} className="w-full">Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Activity Log
function ActivityPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Activity Log</h1>
      <FreelancerActivity />
    </div>
  );
}

// Custom Elements Page
function ElementsPage() {
  return (
    <div className="container mx-auto p-6">
      <CustomElementEditor />
    </div>
  );
}

// Settings Page
function SettingsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Admin settings coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

const Admin = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const user = userStorage.getCurrentUser();
    if (!user || (!user.isAdmin && !user.isSuperAdmin)) {
      toast.error("Access denied");
      navigate("/");
      return;
    }
    setCurrentUser(user);
  }, [navigate]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background text-foreground">
          <AdminSidebar />
          <main className="flex-1 bg-background overflow-auto">
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/freelancers" element={<FreelancersPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/elements" element={<ElementsPage />} />
              <Route path="/activity" element={<ActivityPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Admin;