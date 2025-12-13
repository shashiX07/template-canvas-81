import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import { templateStorage, type Template } from "@/lib/storage";
import { toast } from "sonner";

const TemplatePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  useEffect(() => {
    if (template && iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (doc) {
        doc.open();
        let html = template.htmlContent;
        
        // Inject CSS files
        if (template.cssFiles) {
          const cssInjects = Object.values(template.cssFiles)
            .map(content => `<style>${content}</style>`)
            .join('\n');
          html = html.replace('</head>', `${cssInjects}\n</head>`);
        }
        
        // Inject JS files
        if (template.jsFiles) {
          const jsInjects = Object.values(template.jsFiles)
            .map(content => `<script>${content}</script>`)
            .join('\n');
          html = html.replace('</body>', `${jsInjects}\n</body>`);
        }
        
        // Replace asset paths with base64 data (robust matching)
        if (template.assets) {
          Object.entries(template.assets).forEach(([filename, dataUrl]) => {
            // Escape special regex characters in filename
            const escapedFilename = filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            
            // Match various path formats: ./assets/img.png, assets/img.png, ../img.png, img.png
            const patterns = [
              new RegExp(`src=["'][^"']*${escapedFilename}["']`, 'gi'),
              new RegExp(`href=["'][^"']*${escapedFilename}["']`, 'gi'),
              new RegExp(`url\\(["']?[^)]*${escapedFilename}["']?\\)`, 'gi'),
              new RegExp(`poster=["'][^"']*${escapedFilename}["']`, 'gi'),
            ];
            
            patterns.forEach(pattern => {
              html = html.replace(pattern, (match) => {
                if (match.toLowerCase().startsWith('src=')) return `src="${dataUrl}"`;
                if (match.toLowerCase().startsWith('href=')) return `href="${dataUrl}"`;
                if (match.toLowerCase().startsWith('poster=')) return `poster="${dataUrl}"`;
                return `url('${dataUrl}')`;
              });
            });
          });
        }
        
        doc.write(html);
        doc.close();
      }
    }
  }, [template]);

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
          ref={iframeRef}
          className="w-full h-full border-0"
          title="Template Preview"
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
    </div>
  );
};

export default TemplatePreview;
