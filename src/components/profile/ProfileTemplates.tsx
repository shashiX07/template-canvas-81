import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Trash2, Eye, Edit } from "lucide-react";
import { userStorage, customizedTemplateStorage, templateStorage } from "@/lib/storage";
import { useNavigate } from "react-router-dom";

export function ProfileTemplates() {
  const navigate = useNavigate();
  const user = userStorage.getCurrentUser();
  const [customized, setCustomized] = useState(
    customizedTemplateStorage.getByUserId(user?.id || "")
  );

  const drafts = customized.filter(t => t.isDraft);
  const completed = customized.filter(t => !t.isDraft);

  const handleDelete = (id: string) => {
    customizedTemplateStorage.delete(id);
    setCustomized(customizedTemplateStorage.getByUserId(user?.id || ""));
  };

  const renderTemplateCard = (item: any) => {
    const original = templateStorage.getById(item.templateId);
    
    return (
      <Card key={item.id} className="group hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
              {original?.thumbnail && (
                <img
                  src={original.thumbnail}
                  alt={original.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold truncate">{original?.title || "Untitled"}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={item.isDraft ? "secondary" : "default"}>
                  {item.isDraft ? "Draft" : "Completed"}
                </Badge>
              </div>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/editor/${item.templateId}?custom=${item.id}`)}
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/preview/${item.id}`)}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Templates</h1>
        <p className="text-muted-foreground">
          Manage your customized templates and drafts
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All ({customized.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completed.length})
          </TabsTrigger>
          <TabsTrigger value="drafts">
            Drafts ({drafts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {customized.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">No templates yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by browsing and customizing a template
              </p>
              <Button onClick={() => navigate("/templates")}>
                Browse Templates
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {customized.map(renderTemplateCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completed.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No completed templates</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {completed.map(renderTemplateCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          {drafts.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No draft templates</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {drafts.map(renderTemplateCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
