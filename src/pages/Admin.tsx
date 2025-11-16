import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Users, FileText, Upload, UserPlus, Shield, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { templateStorage, userStorage, type Template, type User } from "@/lib/storage";
import { FreelancerManagement } from "@/components/admin/FreelancerManagement";
import { FreelancerActivity } from "@/components/admin/FreelancerActivity";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserIsAdmin, setNewUserIsAdmin] = useState(false);

  useEffect(() => {
    const user = userStorage.getCurrentUser();
    if (!user || (!user.isAdmin && !user.isSuperAdmin)) {
      toast.error("Access denied");
      navigate("/");
      return;
    }
    setCurrentUser(user);
    setTemplates(templateStorage.getAll());
    setUsers(userStorage.getAll());
  }, [navigate]);

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

  const publicTemplates = templates.filter(t => t.isPublic).length;
  const privateTemplates = templates.length - publicTemplates;
  const totalDownloads = templates.reduce((sum, t) => sum + t.downloads, 0);
  const adminUsers = users.filter(u => u.isAdmin || u.isSuperAdmin).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage templates, users, and analytics</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templates.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {publicTemplates} public, {privateTemplates} private
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {adminUsers} admins
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDownloads}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all templates</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {templates.length > 0 ? (templates.reduce((sum, t) => sum + t.rating, 0) / templates.length).toFixed(1) : '0'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Overall rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={() => navigate("/admin/upload")}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Template
          </Button>
          <Button variant="outline" onClick={() => setShowUserDialog(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Freelancer Management Tabs */}
        <Tabs defaultValue="freelancers" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="freelancers">Freelancers</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="freelancers" className="mt-6">
            <FreelancerManagement />
          </TabsContent>
          
          <TabsContent value="activity" className="mt-6">
            <FreelancerActivity />
          </TabsContent>
          
          <TabsContent value="templates" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Template Management</CardTitle>
              </CardHeader>
              <CardContent>
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Users Management */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{user.name}</h4>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex gap-2 mt-1">
                      {user.isSuperAdmin && <Badge>Super Admin</Badge>}
                      {user.isAdmin && !user.isSuperAdmin && <Badge variant="secondary">Admin</Badge>}
                      {user.isVerified && <Badge variant="outline">Verified</Badge>}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {user.customizedTemplates.length} templates
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add User Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>
            <div>
              <Label>Name</Label>
              <Input
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Admin Access</Label>
              <Switch
                checked={newUserIsAdmin}
                onCheckedChange={setNewUserIsAdmin}
              />
            </div>
            <Button onClick={handleAddUser} className="w-full">
              Add User
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
              <Button onClick={handleSaveTemplate} className="w-full">
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
