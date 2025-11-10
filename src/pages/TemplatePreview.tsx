import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import { templateStorage, type Template } from "@/lib/storage";
import { toast } from "sonner";

const TemplatePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);

  useEffect(() => {
    if (id) {
      const found = templateStorage.getById(id);
      if (found) {
        setTemplate(found);
      } else {
        toast.error("Template not found");
        navigate("/templates");
      }
    }
  }, [id, navigate]);

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/template/${id}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Details
            </Button>
            <Button
              size="sm"
              onClick={() => navigate(`/editor/${id}`)}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Customize Template
            </Button>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1">
        <iframe
          srcDoc={template.htmlContent}
          className="w-full h-full border-0"
          title="Template Preview"
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
};

export default TemplatePreview;
