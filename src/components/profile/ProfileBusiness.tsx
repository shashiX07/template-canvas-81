import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Briefcase,
  Database,
  Settings,
  Shield,
  CreditCard,
  Globe,
  Code,
  Server,
  Key,
  Play,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  FileJson,
  Layers,
  Lock,
  Users,
  Webhook,
  Zap,
  Upload,
  Eye
} from "lucide-react";
import { 
  businessTemplateStorage, 
  type BusinessTemplate, 
  type BusinessTemplateConfig 
} from "@/lib/businessTemplateStorage";
import { templateStorage, userStorage, type Template } from "@/lib/storage";
import { toast } from "sonner";
import JSZip from "jszip";

const ProfileBusiness = () => {
  const currentUser = userStorage.getCurrentUser();
  const [businessTemplates, setBusinessTemplates] = useState<BusinessTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<BusinessTemplate | null>(null);
  const [availableTemplates, setAvailableTemplates] = useState<Template[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadingConfig, setUploadingConfig] = useState<BusinessTemplateConfig | null>(null);
  const [selectedBaseTemplate, setSelectedBaseTemplate] = useState<Template | null>(null);
  const [envVariables, setEnvVariables] = useState<Record<string, string>>({});
  const [setupProgress, setSetupProgress] = useState(0);
  const [isSettingUp, setIsSettingUp] = useState(false);

  useEffect(() => {
    loadBusinessTemplates();
    loadAvailableTemplates();
  }, []);

  const loadBusinessTemplates = () => {
    const templates = businessTemplateStorage.getAll();
    setBusinessTemplates(templates);
  };

  const loadAvailableTemplates = () => {
    // Load templates that have isBusiness flag or configuration.json
    const templates = templateStorage.getAll();
    setAvailableTemplates(templates);
  };

  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);
      
      // Look for configuration.json
      const configFile = contents.file('configuration.json');
      if (!configFile) {
        toast.error("No configuration.json found in ZIP file");
        return;
      }

      const configContent = await configFile.async('string');
      const config = await businessTemplateStorage.parseConfigFromZip(configContent);
      
      if (!config) {
        toast.error("Invalid configuration.json format");
        return;
      }

      setUploadingConfig(config);
      
      // Initialize env variables with required ones
      if (config.environment?.required) {
        const vars: Record<string, string> = {};
        config.environment.required.forEach(key => {
          vars[key] = '';
        });
        setEnvVariables(vars);
      }

      toast.success("Configuration loaded successfully!");
    } catch (error) {
      toast.error("Failed to parse ZIP file");
      console.error(error);
    }
  };

  const handleCreateBusinessTemplate = async () => {
    if (!currentUser || !uploadingConfig) return;

    // Validate env variables
    const missingVars = Object.entries(envVariables)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      toast.error(`Please fill in: ${missingVars.join(', ')}`);
      return;
    }

    const newTemplate: BusinessTemplate = {
      id: `biz-${Date.now()}`,
      templateId: selectedBaseTemplate?.id || '',
      config: uploadingConfig,
      envVariables,
      setupStatus: 'pending',
      setupLogs: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: currentUser.id,
    };

    businessTemplateStorage.save(newTemplate);
    loadBusinessTemplates();
    setShowUploadDialog(false);
    setUploadingConfig(null);
    setEnvVariables({});
    toast.success("Business template created!");
  };

  const runSetup = async (template: BusinessTemplate) => {
    setIsSettingUp(true);
    setSetupProgress(0);
    setSelectedTemplate(template);

    const steps = [
      { name: 'Validating configuration...', progress: 10 },
      { name: 'Creating database schema...', progress: 30 },
      { name: 'Setting up authentication...', progress: 50 },
      { name: 'Configuring payment gateway...', progress: 70 },
      { name: 'Generating API endpoints...', progress: 85 },
      { name: 'Finalizing setup...', progress: 100 },
    ];

    for (const step of steps) {
      businessTemplateStorage.updateSetupStatus(template.id, 'in_progress', step.name);
      setSetupProgress(step.progress);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    businessTemplateStorage.updateSetupStatus(template.id, 'completed', 'Setup completed successfully!');
    setIsSettingUp(false);
    loadBusinessTemplates();
    toast.success("Business template setup completed!");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  if (!currentUser) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Please login to access business templates</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Editorial header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-px bg-foreground" />
            <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/60">
              Business · No.04
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="font-display text-5xl md:text-6xl font-light leading-[1.02] tracking-tight">
                Ship <span className="italic">a backend</span>.
              </h1>
              <p className="mt-3 text-foreground/65 text-lg max-w-xl leading-[1.7]">
                Deploy full-stack business applications with database,
                auth, and payments — wired up in minutes.
              </p>
            </div>
            <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Upload className="w-4 h-4" />
                  Upload template
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Upload Business Template</DialogTitle>
                <DialogDescription>
                  Upload a ZIP file containing configuration.json to set up your business template
                </DialogDescription>
              </DialogHeader>
              
              {!uploadingConfig ? (
                <div className="space-y-4">
                  <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-lg p-12 cursor-pointer hover:border-primary transition-colors">
                    <FileJson className="w-12 h-12 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to upload ZIP with configuration.json</span>
                    <input
                      type="file"
                      accept=".zip"
                      className="hidden"
                      onChange={handleZipUpload}
                    />
                  </label>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">What is a Business Template?</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Auto-generated database schema</li>
                      <li>• Built-in authentication system</li>
                      <li>• Payment gateway integration</li>
                      <li>• API endpoints generation</li>
                      <li>• Admin panel configuration</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Config Preview */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{uploadingConfig.templateName}</CardTitle>
                      <CardDescription>{uploadingConfig.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">v{uploadingConfig.version}</Badge>
                        {uploadingConfig.authentication?.enabled && (
                          <Badge variant="secondary">
                            <Lock className="w-3 h-3 mr-1" />
                            Auth Enabled
                          </Badge>
                        )}
                        {uploadingConfig.payment?.enabled && (
                          <Badge variant="secondary">
                            <CreditCard className="w-3 h-3 mr-1" />
                            {uploadingConfig.payment.provider}
                          </Badge>
                        )}
                        {uploadingConfig.adminPanel?.enabled && (
                          <Badge variant="secondary">
                            <Settings className="w-3 h-3 mr-1" />
                            Admin Panel
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Environment Variables */}
                  {uploadingConfig.environment?.required && uploadingConfig.environment.required.length > 0 && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Key className="w-5 h-5" />
                          Environment Variables
                        </CardTitle>
                        <CardDescription>Configure required secrets and API keys</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {uploadingConfig.environment.required.map(key => (
                          <div key={key} className="space-y-1">
                            <Label htmlFor={key}>{key}</Label>
                            <Input
                              id={key}
                              type={key.toLowerCase().includes('secret') || key.toLowerCase().includes('password') ? 'password' : 'text'}
                              placeholder={`Enter ${key}`}
                              value={envVariables[key] || ''}
                              onChange={(e) => setEnvVariables({ ...envVariables, [key]: e.target.value })}
                            />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Features Preview */}
                  <Accordion type="single" collapsible className="w-full">
                    {uploadingConfig.database && (
                      <AccordionItem value="database">
                        <AccordionTrigger>
                          <span className="flex items-center gap-2">
                            <Database className="w-4 h-4" />
                            Database Schema ({Object.keys(uploadingConfig.database).length} tables)
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {Object.entries(uploadingConfig.database).map(([table, schema]) => (
                              <div key={table} className="p-3 bg-muted rounded-lg">
                                <p className="font-medium">{table}</p>
                                <p className="text-xs text-muted-foreground">
                                  {Object.keys(schema.fields).length} fields
                                </p>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {uploadingConfig.roles && (
                      <AccordionItem value="roles">
                        <AccordionTrigger>
                          <span className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Roles & Permissions
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {Object.entries(uploadingConfig.roles).map(([role, config]) => (
                              <div key={role} className="p-3 bg-muted rounded-lg">
                                <p className="font-medium capitalize">{role}</p>
                                <p className="text-xs text-muted-foreground">
                                  {config.permissions.join(', ')}
                                </p>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {uploadingConfig.api && (
                      <AccordionItem value="api">
                        <AccordionTrigger>
                          <span className="flex items-center gap-2">
                            <Code className="w-4 h-4" />
                            API Configuration
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <p className="text-sm">Prefix: {uploadingConfig.api.prefix}</p>
                            <p className="text-sm">
                              Auto-generate CRUD: {uploadingConfig.api.autoGenerateCRUD ? 'Yes' : 'No'}
                            </p>
                            {uploadingConfig.api.customEndpoints && (
                              <div className="mt-2">
                                <p className="text-sm font-medium">Custom Endpoints:</p>
                                {Object.entries(uploadingConfig.api.customEndpoints).map(([name, config]) => (
                                  <div key={name} className="text-xs text-muted-foreground">
                                    {config.method} {config.path} - {name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => {
                      setUploadingConfig(null);
                      setEnvVariables({});
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateBusinessTemplate}>
                      Create Business Template
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Business Templates List */}
        {businessTemplates.length === 0 ? (
          <Card className="p-12 text-center">
            <Briefcase className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Business Templates Yet</h3>
            <p className="text-muted-foreground mb-4">
              Upload a template with configuration.json to get started
            </p>
            <Button onClick={() => setShowUploadDialog(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Business Template
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {businessTemplates.map(template => (
              <Card key={template.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.config.templateName}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {template.config.description}
                      </CardDescription>
                    </div>
                    {getStatusIcon(template.setupStatus)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">v{template.config.version}</Badge>
                    <Badge variant={template.setupStatus === 'completed' ? 'default' : 'secondary'}>
                      {template.setupStatus}
                    </Badge>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {template.config.authentication?.enabled && (
                      <Badge variant="outline" className="gap-1">
                        <Shield className="w-3 h-3" />
                        Auth
                      </Badge>
                    )}
                    {template.config.payment?.enabled && (
                      <Badge variant="outline" className="gap-1">
                        <CreditCard className="w-3 h-3" />
                        {template.config.payment.provider}
                      </Badge>
                    )}
                    {template.config.database && (
                      <Badge variant="outline" className="gap-1">
                        <Database className="w-3 h-3" />
                        {Object.keys(template.config.database).length} tables
                      </Badge>
                    )}
                    {template.config.webhooks && (
                      <Badge variant="outline" className="gap-1">
                        <Webhook className="w-3 h-3" />
                        Webhooks
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {template.setupStatus === 'pending' && (
                      <Button 
                        className="flex-1" 
                        onClick={() => runSetup(template)}
                        disabled={isSettingUp}
                      >
                        {isSettingUp && selectedTemplate?.id === template.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Setting up...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Run Setup
                          </>
                        )}
                      </Button>
                    )}
                    {template.setupStatus === 'completed' && (
                      <>
                        <Button variant="outline" className="flex-1">
                          <Settings className="w-4 h-4 mr-2" />
                          Manage
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open
                        </Button>
                      </>
                    )}
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Setup Progress */}
                  {isSettingUp && selectedTemplate?.id === template.id && (
                    <div className="space-y-2">
                      <Progress value={setupProgress} />
                      <p className="text-xs text-muted-foreground text-center">
                        {setupProgress}% complete
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Template Detail Dialog */}
        <Dialog open={!!selectedTemplate && !isSettingUp} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
            {selectedTemplate && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedTemplate.config.templateName}</DialogTitle>
                  <DialogDescription>{selectedTemplate.config.description}</DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="database">Database</TabsTrigger>
                    <TabsTrigger value="api">API</TabsTrigger>
                    <TabsTrigger value="logs">Logs</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Configuration</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          {selectedTemplate.config.authentication?.enabled && (
                            <div className="p-3 bg-muted rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Shield className="w-4 h-4 text-primary" />
                                <span className="font-medium">Authentication</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Providers: {selectedTemplate.config.authentication.providers.join(', ')}
                              </p>
                            </div>
                          )}
                          {selectedTemplate.config.payment?.enabled && (
                            <div className="p-3 bg-muted rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <CreditCard className="w-4 h-4 text-primary" />
                                <span className="font-medium">Payments</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {selectedTemplate.config.payment.provider} ({selectedTemplate.config.payment.currency})
                              </p>
                            </div>
                          )}
                          {selectedTemplate.config.adminPanel?.enabled && (
                            <div className="p-3 bg-muted rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Settings className="w-4 h-4 text-primary" />
                                <span className="font-medium">Admin Panel</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Resources: {selectedTemplate.config.adminPanel.resources.join(', ')}
                              </p>
                            </div>
                          )}
                          {selectedTemplate.config.localization && (
                            <div className="p-3 bg-muted rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Globe className="w-4 h-4 text-primary" />
                                <span className="font-medium">Localization</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Languages: {selectedTemplate.config.localization.supportedLanguages.join(', ')}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Environment Variables */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Key className="w-5 h-5" />
                          Environment Variables
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {Object.entries(selectedTemplate.envVariables).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-2 bg-muted rounded">
                              <span className="font-mono text-sm">{key}</span>
                              <span className="text-sm text-muted-foreground">
                                {value ? '••••••••' : 'Not set'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="database" className="space-y-4">
                    {selectedTemplate.config.database ? (
                      Object.entries(selectedTemplate.config.database).map(([table, schema]) => (
                        <Card key={table}>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Layers className="w-5 h-5" />
                              {table}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {Object.entries(schema.fields).map(([field, config]) => (
                                <div key={field} className="flex items-center justify-between p-2 bg-muted rounded">
                                  <span className="font-mono text-sm">{field}</span>
                                  <Badge variant="outline">
                                    {typeof config === 'string' ? config : (config as any).type}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No database schema defined</p>
                    )}
                  </TabsContent>

                  <TabsContent value="api" className="space-y-4">
                    {selectedTemplate.config.api ? (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">API Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="p-3 bg-muted rounded-lg">
                            <p><strong>Prefix:</strong> {selectedTemplate.config.api.prefix}</p>
                            <p><strong>Auto CRUD:</strong> {selectedTemplate.config.api.autoGenerateCRUD ? 'Enabled' : 'Disabled'}</p>
                          </div>
                          
                          {selectedTemplate.config.api.customEndpoints && (
                            <div>
                              <h4 className="font-medium mb-2">Custom Endpoints</h4>
                              {Object.entries(selectedTemplate.config.api.customEndpoints).map(([name, config]) => (
                                <div key={name} className="flex items-center gap-2 p-2 bg-muted rounded mb-2">
                                  <Badge>{config.method}</Badge>
                                  <span className="font-mono text-sm">{config.path}</span>
                                  <span className="text-xs text-muted-foreground ml-auto">{config.description}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No API configuration</p>
                    )}
                  </TabsContent>

                  <TabsContent value="logs">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Setup Logs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-64">
                          {selectedTemplate.setupLogs.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">No logs yet</p>
                          ) : (
                            <div className="space-y-1 font-mono text-sm">
                              {selectedTemplate.setupLogs.map((log, i) => (
                                <p key={i} className="text-muted-foreground">{log}</p>
                              ))}
                            </div>
                          )}
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProfileBusiness;
