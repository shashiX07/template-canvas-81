import { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  File, 
  Folder, 
  Plus, 
  Trash2, 
  Save, 
  Eye, 
  Upload, 
  FileCode,
  FileText,
  Image as ImageIcon,
  Download,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

interface ProjectFile {
  name: string;
  type: 'html' | 'css' | 'js' | 'json' | 'image' | 'other';
  content: string;
  path: string;
}

interface CodeProject {
  id: string;
  name: string;
  files: ProjectFile[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'freelancer_code_projects';

export default function FreelancerCodeEditor() {
  const [projects, setProjects] = useState<CodeProject[]>([]);
  const [currentProject, setCurrentProject] = useState<CodeProject | null>(null);
  const [currentFile, setCurrentFile] = useState<ProjectFile | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const loadedProjects = JSON.parse(stored);
      setProjects(loadedProjects);
      if (loadedProjects.length > 0 && !currentProject) {
        setCurrentProject(loadedProjects[0]);
        if (loadedProjects[0].files.length > 0) {
          setCurrentFile(loadedProjects[0].files[0]);
        }
      }
    }
  };

  const saveProjects = useCallback((updatedProjects: CodeProject[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
  }, []);

  const createNewProject = () => {
    if (!newProjectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    const newProject: CodeProject = {
      id: Date.now().toString(),
      name: newProjectName,
      files: [
        {
          name: 'index.html',
          type: 'html',
          content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>New Project</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Hello World!</h1>\n  <script src="script.js"></script>\n</body>\n</html>',
          path: 'index.html'
        },
        {
          name: 'style.css',
          type: 'css',
          content: 'body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n  background: #f5f5f5;\n}\n\nh1 {\n  color: #333;\n}',
          path: 'style.css'
        },
        {
          name: 'script.js',
          type: 'js',
          content: 'console.log("Hello from script.js!");',
          path: 'script.js'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedProjects = [...projects, newProject];
    saveProjects(updatedProjects);
    setCurrentProject(newProject);
    setCurrentFile(newProject.files[0]);
    setNewProjectName('');
    setShowNewProjectDialog(false);
    toast.success('Project created successfully');
  };

  const createNewFile = () => {
    if (!currentProject || !newFileName.trim()) {
      toast.error('Please enter a file name');
      return;
    }

    const extension = newFileName.split('.').pop()?.toLowerCase();
    let fileType: ProjectFile['type'] = 'other';
    let defaultContent = '';

    if (extension === 'html') {
      fileType = 'html';
      defaultContent = '<!DOCTYPE html>\n<html>\n<head>\n  <title>New Page</title>\n</head>\n<body>\n  \n</body>\n</html>';
    } else if (extension === 'css') {
      fileType = 'css';
      defaultContent = '/* Add your styles here */';
    } else if (extension === 'js') {
      fileType = 'js';
      defaultContent = '// Add your JavaScript here';
    } else if (extension === 'json') {
      fileType = 'json';
      defaultContent = '{}';
    }

    const newFile: ProjectFile = {
      name: newFileName,
      type: fileType,
      content: defaultContent,
      path: newFileName
    };

    const updatedProject = {
      ...currentProject,
      files: [...currentProject.files, newFile],
      updatedAt: new Date().toISOString()
    };

    const updatedProjects = projects.map(p => 
      p.id === currentProject.id ? updatedProject : p
    );

    saveProjects(updatedProjects);
    setCurrentProject(updatedProject);
    setCurrentFile(newFile);
    setNewFileName('');
    setShowNewFileDialog(false);
    toast.success('File created successfully');
  };

  const deleteFile = (fileName: string) => {
    if (!currentProject) return;

    const updatedProject = {
      ...currentProject,
      files: currentProject.files.filter(f => f.name !== fileName),
      updatedAt: new Date().toISOString()
    };

    const updatedProjects = projects.map(p => 
      p.id === currentProject.id ? updatedProject : p
    );

    saveProjects(updatedProjects);
    setCurrentProject(updatedProject);
    
    if (currentFile?.name === fileName) {
      setCurrentFile(updatedProject.files[0] || null);
    }
    
    toast.success('File deleted successfully');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentProject) return;

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      let fileType: ProjectFile['type'] = 'other';
      if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension || '')) {
        fileType = 'image';
      } else if (extension === 'html') {
        fileType = 'html';
      } else if (extension === 'css') {
        fileType = 'css';
      } else if (extension === 'js') {
        fileType = 'js';
      } else if (extension === 'json') {
        fileType = 'json';
      }

      const newFile: ProjectFile = {
        name: file.name,
        type: fileType,
        content: content,
        path: file.name
      };

      const updatedProject = {
        ...currentProject,
        files: [...currentProject.files, newFile],
        updatedAt: new Date().toISOString()
      };

      const updatedProjects = projects.map(p => 
        p.id === currentProject.id ? updatedProject : p
      );

      saveProjects(updatedProjects);
      setCurrentProject(updatedProject);
      toast.success('File uploaded successfully');
    };

    if (file.type.startsWith('image/')) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }

    e.target.value = '';
  };

  const saveCurrentFile = () => {
    if (!currentProject || !currentFile) return;

    const updatedProject = {
      ...currentProject,
      files: currentProject.files.map(f => 
        f.name === currentFile.name ? currentFile : f
      ),
      updatedAt: new Date().toISOString()
    };

    const updatedProjects = projects.map(p => 
      p.id === currentProject.id ? updatedProject : p
    );

    saveProjects(updatedProjects);
    toast.success('File saved successfully');
  };

  const handleEditorChange = (value: string | undefined) => {
    if (currentFile && value !== undefined) {
      setCurrentFile({ ...currentFile, content: value });
    }
  };

  const refreshPreview = () => {
    setPreviewKey(prev => prev + 1);
    toast.success('Preview refreshed');
  };

  const getPreviewHTML = () => {
    if (!currentProject) return '';

    const htmlFile = currentProject.files.find(f => f.type === 'html' && f.name === 'index.html');
    if (!htmlFile) return '<html><body><h1>No index.html file found</h1></body></html>';

    let html = htmlFile.content;

    // Inject CSS files
    currentProject.files.filter(f => f.type === 'css').forEach(cssFile => {
      html = html.replace(
        `href="${cssFile.name}"`,
        `href="data:text/css;base64,${btoa(cssFile.content)}"`
      );
      if (!html.includes(cssFile.name)) {
        html = html.replace('</head>', `<style>${cssFile.content}</style></head>`);
      }
    });

    // Inject JS files
    currentProject.files.filter(f => f.type === 'js').forEach(jsFile => {
      html = html.replace(
        `src="${jsFile.name}"`,
        `src="data:text/javascript;base64,${btoa(jsFile.content)}"`
      );
      if (!html.includes(jsFile.name)) {
        html = html.replace('</body>', `<script>${jsFile.content}</script></body>`);
      }
    });

    // Replace image sources with base64 data URLs
    currentProject.files.filter(f => f.type === 'image').forEach(imageFile => {
      html = html.replace(
        new RegExp(`src=["']${imageFile.name}["']`, 'g'),
        `src="${imageFile.content}"`
      );
    });

    return html;
  };

  const downloadProject = () => {
    if (!currentProject) return;

    const zip: Record<string, string> = {};
    currentProject.files.forEach(file => {
      zip[file.path] = file.content;
    });

    const dataStr = JSON.stringify(zip, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentProject.name}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Project downloaded');
  };

  const getFileIcon = (type: ProjectFile['type']) => {
    switch (type) {
      case 'html': return <FileCode className="w-4 h-4 text-orange-500" />;
      case 'css': return <FileCode className="w-4 h-4 text-blue-500" />;
      case 'js': return <FileCode className="w-4 h-4 text-yellow-500" />;
      case 'json': return <FileText className="w-4 h-4 text-green-500" />;
      case 'image': return <ImageIcon className="w-4 h-4 text-purple-500" />;
      default: return <File className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getEditorLanguage = (type: ProjectFile['type']) => {
    switch (type) {
      case 'html': return 'html';
      case 'css': return 'css';
      case 'js': return 'javascript';
      case 'json': return 'json';
      default: return 'plaintext';
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)]">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Sidebar - File Explorer */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <Card className="h-full rounded-none border-0 border-r">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Projects</CardTitle>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => setShowNewProjectDialog(true)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <ScrollArea className="h-[calc(100%-5rem)]">
              <CardContent className="space-y-2">
                {projects.map(project => (
                  <div
                    key={project.id}
                    className={`p-2 rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                      currentProject?.id === project.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => {
                      setCurrentProject(project);
                      setCurrentFile(project.files[0] || null);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Folder className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium truncate">{project.name}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </ScrollArea>
          </Card>
        </ResizablePanel>

        <ResizableHandle />

        {/* File List */}
        <ResizablePanel defaultSize={15} minSize={12} maxSize={25}>
          <Card className="h-full rounded-none border-0 border-r">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Files</CardTitle>
                <div className="flex gap-1">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setShowNewFileDialog(true)}
                    disabled={!currentProject}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    disabled={!currentProject}
                    asChild
                  >
                    <label>
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileUpload}
                        accept=".html,.css,.js,.json,image/*"
                      />
                    </label>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <ScrollArea className="h-[calc(100%-5rem)]">
              <CardContent className="space-y-1">
                {currentProject?.files.map(file => (
                  <div
                    key={file.name}
                    className={`p-2 rounded-lg cursor-pointer hover:bg-muted transition-colors group ${
                      currentFile?.name === file.name ? 'bg-muted' : ''
                    }`}
                    onClick={() => setCurrentFile(file)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {getFileIcon(file.type)}
                        <span className="text-xs truncate">{file.name}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFile(file.name);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </ScrollArea>
          </Card>
        </ResizablePanel>

        <ResizableHandle />

        {/* Editor */}
        <ResizablePanel defaultSize={35} minSize={25}>
          <Card className="h-full rounded-none border-0 border-r">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm truncate">
                  {currentFile ? currentFile.name : 'No file selected'}
                </CardTitle>
                <div className="flex gap-1">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={saveCurrentFile}
                    disabled={!currentFile}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={downloadProject}
                    disabled={!currentProject}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-4rem)]">
              {currentFile ? (
                currentFile.type === 'image' ? (
                  <div className="flex items-center justify-center h-full bg-muted/20">
                    <img 
                      src={currentFile.content} 
                      alt={currentFile.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <Editor
                    height="100%"
                    language={getEditorLanguage(currentFile.type)}
                    value={currentFile.content}
                    onChange={handleEditorChange}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      wordWrap: 'on',
                      automaticLayout: true,
                    }}
                  />
                )
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Select a file to edit
                </div>
              )}
            </CardContent>
          </Card>
        </ResizablePanel>

        <ResizableHandle />

        {/* Preview */}
        <ResizablePanel defaultSize={30} minSize={25}>
          <Card className="h-full rounded-none border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Live Preview</CardTitle>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={refreshPreview}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-4rem)]">
              {currentProject ? (
                <iframe
                  key={previewKey}
                  srcDoc={getPreviewHTML()}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts"
                  title="Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Create a project to see preview
                </div>
              )}
            </CardContent>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* New Project Dialog */}
      <AlertDialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Project</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a name for your new project. A basic HTML, CSS, and JS structure will be created.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            placeholder="Project name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createNewProject()}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={createNewProject}>Create</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* New File Dialog */}
      <AlertDialog open={showNewFileDialog} onOpenChange={setShowNewFileDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create New File</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a file name with extension (e.g., about.html, styles.css, app.js)
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            placeholder="File name"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createNewFile()}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={createNewFile}>Create</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
