import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  Save, 
  Eye, 
  Trash2, 
  Edit, 
  Copy,
  Code,
  Palette,
  Tag,
  Layout,
  LayoutGrid,
  Quote,
  DollarSign,
  Columns,
  Image,
  Type,
  Square
} from "lucide-react";
import { customElementStorage, defaultSections, type CustomElement } from "@/lib/customElementStorage";
import { userStorage } from "@/lib/storage";
import { toast } from "sonner";

const iconOptions = [
  { name: "Layout", icon: Layout },
  { name: "LayoutGrid", icon: LayoutGrid },
  { name: "Quote", icon: Quote },
  { name: "DollarSign", icon: DollarSign },
  { name: "Columns", icon: Columns },
  { name: "Image", icon: Image },
  { name: "Type", icon: Type },
  { name: "Square", icon: Square },
];

const categories = ["Sections", "Headers", "Footers", "Cards", "Forms", "Navigation", "Custom"];

export function CustomElementEditor() {
  const [elements, setElements] = useState<CustomElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<CustomElement | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const previewRef = useRef<HTMLIFrameElement>(null);

  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Sections");
  const [description, setDescription] = useState("");
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [icon, setIcon] = useState("Layout");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    loadElements();
  }, []);

  useEffect(() => {
    if (selectedElement) {
      setName(selectedElement.name);
      setCategory(selectedElement.category);
      setDescription(selectedElement.description);
      setHtml(selectedElement.html);
      setCss(selectedElement.css || "");
      setIcon(selectedElement.icon);
      setTags(selectedElement.tags);
      setIsActive(selectedElement.isActive);
      setPreviewHtml(selectedElement.html);
    }
  }, [selectedElement]);

  useEffect(() => {
    // Update preview when HTML changes
    if (previewRef.current && html) {
      const doc = previewRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { margin: 0; padding: 16px; font-family: system-ui, sans-serif; }
              ${css}
            </style>
          </head>
          <body>${html}</body>
          </html>
        `);
        doc.close();
      }
    }
  }, [html, css]);

  const loadElements = () => {
    setElements(customElementStorage.getAll());
  };

  const resetForm = () => {
    setName("");
    setCategory("Sections");
    setDescription("");
    setHtml("");
    setCss("");
    setIcon("Layout");
    setTags([]);
    setIsActive(true);
    setSelectedElement(null);
    setIsCreating(false);
  };

  const handleSave = () => {
    if (!name || !html) {
      toast.error("Name and HTML are required");
      return;
    }

    const user = userStorage.getCurrentUser();
    const element: CustomElement = {
      id: selectedElement?.id || `custom-${Date.now()}`,
      name,
      category,
      description,
      html,
      css,
      icon,
      isActive,
      tags,
      version: selectedElement ? selectedElement.version + 1 : 1,
      createdAt: selectedElement?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user?.id || "admin",
    };

    customElementStorage.save(element);
    loadElements();
    resetForm();
    toast.success(selectedElement ? "Element updated" : "Element created");
  };

  const handleDelete = (id: string) => {
    customElementStorage.delete(id);
    loadElements();
    if (selectedElement?.id === id) {
      resetForm();
    }
    toast.success("Element deleted");
  };

  const handleDuplicate = (id: string) => {
    const copy = customElementStorage.duplicate(id);
    if (copy) {
      loadElements();
      toast.success("Element duplicated");
    }
  };

  const handleAddDefaultSections = () => {
    const user = userStorage.getCurrentUser();
    defaultSections.forEach((section) => {
      const element: CustomElement = {
        ...section,
        id: `default-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: user?.id || "admin",
      };
      customElementStorage.save(element);
    });
    loadElements();
    toast.success("Default sections added");
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const IconComponent = iconOptions.find((i) => i.name === icon)?.icon || Layout;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Custom Elements</h2>
          <p className="text-sm text-muted-foreground">
            Create and manage prebuilt elements for the editor
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAddDefaultSections}>
            <Plus className="w-4 h-4 mr-2" />
            Add Default Sections
          </Button>
          <Button onClick={() => { resetForm(); setIsCreating(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Create Element
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Element List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">All Elements ({elements.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {elements.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No custom elements yet. Create one or add default sections.
                  </p>
                ) : (
                  elements.map((el) => {
                    const ElIcon = iconOptions.find((i) => i.name === el.icon)?.icon || Layout;
                    return (
                      <div
                        key={el.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedElement?.id === el.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                        }`}
                        onClick={() => { setSelectedElement(el); setIsCreating(false); }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted rounded">
                              <ElIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">{el.name}</h4>
                              <p className="text-xs text-muted-foreground">{el.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant={el.isActive ? "default" : "secondary"} className="text-[10px]">
                              {el.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-1 mt-2">
                          {el.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-[10px]">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-1 mt-2 pt-2 border-t">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={(e) => { e.stopPropagation(); handleDuplicate(el.id); }}
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Duplicate
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-destructive"
                            onClick={(e) => { e.stopPropagation(); handleDelete(el.id); }}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Editor Panel */}
        {(selectedElement || isCreating) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                {isCreating ? (
                  <>
                    <Plus className="w-4 h-4" />
                    Create New Element
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4" />
                    Edit: {selectedElement?.name}
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Hero Section"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="A beautiful hero section with centered text..."
                      rows={2}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Icon</Label>
                      <Select value={icon} onValueChange={setIcon}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((opt) => (
                            <SelectItem key={opt.name} value={opt.name}>
                              <div className="flex items-center gap-2">
                                <opt.icon className="w-4 h-4" />
                                {opt.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between pt-6">
                      <Label>Active</Label>
                      <Switch checked={isActive} onCheckedChange={setIsActive} />
                    </div>
                  </div>

                  <div>
                    <Label>Tags</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add tag..."
                        className="flex-1"
                        onKeyPress={(e) => e.key === "Enter" && addTag()}
                      />
                      <Button onClick={addTag} size="sm">
                        <Tag className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => removeTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="code" className="space-y-4 mt-4">
                  <div>
                    <Label className="flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      HTML
                    </Label>
                    <Textarea
                      value={html}
                      onChange={(e) => setHtml(e.target.value)}
                      placeholder="<section>...</section>"
                      rows={10}
                      className="mt-1 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      CSS (Optional)
                    </Label>
                    <Textarea
                      value={css}
                      onChange={(e) => setCss(e.target.value)}
                      placeholder=".my-class { ... }"
                      rows={5}
                      className="mt-1 font-mono text-xs"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="mt-4">
                  <div className="border rounded-lg overflow-hidden bg-white">
                    <iframe
                      ref={previewRef}
                      className="w-full h-[300px]"
                      title="Element Preview"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 mt-6">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  {isCreating ? "Create Element" : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
