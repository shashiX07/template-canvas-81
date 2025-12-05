import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Type, 
  Image, 
  Square, 
  Columns, 
  List, 
  Link, 
  CirclePlay,
  FormInput,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  LayoutGrid,
  Navigation,
  SeparatorHorizontal,
  Quote,
  Code,
  Table,
  CheckSquare,
  Minus,
  MapPin,
  Calendar,
  Clock,
  Star,
  Heart,
  Mail,
  Phone,
  Menu
} from "lucide-react";

interface DraggableElement {
  id: string;
  label: string;
  icon: React.ReactNode;
  category: string;
  html: string;
}

interface DraggableElementsProps {
  onElementDrop: (html: string) => void;
}

const elements: DraggableElement[] = [
  // Typography
  { id: "h1", label: "Heading 1", icon: <Heading1 className="w-4 h-4" />, category: "Typography", html: '<h1 style="font-size: 2.5rem; font-weight: bold; margin: 0.5rem 0;">Heading 1</h1>' },
  { id: "h2", label: "Heading 2", icon: <Heading2 className="w-4 h-4" />, category: "Typography", html: '<h2 style="font-size: 2rem; font-weight: bold; margin: 0.5rem 0;">Heading 2</h2>' },
  { id: "h3", label: "Heading 3", icon: <Heading3 className="w-4 h-4" />, category: "Typography", html: '<h3 style="font-size: 1.5rem; font-weight: bold; margin: 0.5rem 0;">Heading 3</h3>' },
  { id: "paragraph", label: "Paragraph", icon: <AlignLeft className="w-4 h-4" />, category: "Typography", html: '<p style="margin: 0.5rem 0; line-height: 1.6;">Enter your paragraph text here. This is a sample paragraph that you can edit.</p>' },
  { id: "text", label: "Text Block", icon: <Type className="w-4 h-4" />, category: "Typography", html: '<span style="display: inline-block;">Text content</span>' },
  { id: "quote", label: "Blockquote", icon: <Quote className="w-4 h-4" />, category: "Typography", html: '<blockquote style="border-left: 4px solid #ccc; padding-left: 1rem; margin: 1rem 0; font-style: italic; color: #666;">"This is a quote. Add your inspiring words here."</blockquote>' },
  { id: "code", label: "Code Block", icon: <Code className="w-4 h-4" />, category: "Typography", html: '<pre style="background: #1e1e1e; color: #d4d4d4; padding: 1rem; border-radius: 8px; overflow-x: auto; font-family: monospace;"><code>// Your code here\nconst greeting = "Hello World";</code></pre>' },

  // Media
  { id: "image", label: "Image", icon: <Image className="w-4 h-4" />, category: "Media", html: '<img src="https://via.placeholder.com/400x300" alt="Placeholder" style="max-width: 100%; height: auto; border-radius: 8px;" />' },
  { id: "video", label: "Video", icon: <CirclePlay className="w-4 h-4" />, category: "Media", html: '<video controls style="max-width: 100%; border-radius: 8px;"><source src="" type="video/mp4">Your browser does not support video.</video>' },
  
  // Layout
  { id: "container", label: "Container", icon: <Square className="w-4 h-4" />, category: "Layout", html: '<div style="padding: 2rem; background: #f5f5f5; border-radius: 8px; margin: 1rem 0;">Container content goes here</div>' },
  { id: "flexbox", label: "Flex Container", icon: <Columns className="w-4 h-4" />, category: "Layout", html: '<div style="display: flex; gap: 1rem; padding: 1rem;"><div style="flex: 1; padding: 1rem; background: #e0e0e0; border-radius: 4px;">Column 1</div><div style="flex: 1; padding: 1rem; background: #e0e0e0; border-radius: 4px;">Column 2</div></div>' },
  { id: "grid", label: "Grid Layout", icon: <LayoutGrid className="w-4 h-4" />, category: "Layout", html: '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; padding: 1rem;"><div style="padding: 1rem; background: #e0e0e0; border-radius: 4px;">Item 1</div><div style="padding: 1rem; background: #e0e0e0; border-radius: 4px;">Item 2</div><div style="padding: 1rem; background: #e0e0e0; border-radius: 4px;">Item 3</div></div>' },
  { id: "divider", label: "Divider", icon: <SeparatorHorizontal className="w-4 h-4" />, category: "Layout", html: '<hr style="border: none; border-top: 1px solid #ddd; margin: 1.5rem 0;" />' },
  { id: "spacer", label: "Spacer", icon: <Minus className="w-4 h-4" />, category: "Layout", html: '<div style="height: 2rem;"></div>' },

  // Navigation
  { id: "navbar", label: "Navbar", icon: <Navigation className="w-4 h-4" />, category: "Navigation", html: '<nav style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: #333; color: white;"><div style="font-weight: bold; font-size: 1.25rem;">Logo</div><div style="display: flex; gap: 1.5rem;"><a href="#" style="color: white; text-decoration: none;">Home</a><a href="#" style="color: white; text-decoration: none;">About</a><a href="#" style="color: white; text-decoration: none;">Services</a><a href="#" style="color: white; text-decoration: none;">Contact</a></div></nav>' },
  { id: "menu", label: "Menu", icon: <Menu className="w-4 h-4" />, category: "Navigation", html: '<ul style="list-style: none; padding: 0; margin: 0;"><li style="padding: 0.75rem 1rem; border-bottom: 1px solid #eee;"><a href="#" style="color: inherit; text-decoration: none;">Menu Item 1</a></li><li style="padding: 0.75rem 1rem; border-bottom: 1px solid #eee;"><a href="#" style="color: inherit; text-decoration: none;">Menu Item 2</a></li><li style="padding: 0.75rem 1rem;"><a href="#" style="color: inherit; text-decoration: none;">Menu Item 3</a></li></ul>' },
  { id: "link", label: "Link", icon: <Link className="w-4 h-4" />, category: "Navigation", html: '<a href="#" style="color: #0066cc; text-decoration: underline;">Click here</a>' },

  // Buttons
  { id: "button-primary", label: "Primary Button", icon: <Square className="w-4 h-4" />, category: "Buttons", html: '<button style="padding: 0.75rem 1.5rem; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: background 0.2s;">Primary Button</button>' },
  { id: "button-secondary", label: "Secondary Button", icon: <Square className="w-4 h-4" />, category: "Buttons", html: '<button style="padding: 0.75rem 1.5rem; background: transparent; color: #2563eb; border: 2px solid #2563eb; border-radius: 6px; cursor: pointer; font-weight: 500;">Secondary Button</button>' },
  { id: "button-ghost", label: "Ghost Button", icon: <Square className="w-4 h-4" />, category: "Buttons", html: '<button style="padding: 0.75rem 1.5rem; background: transparent; color: #666; border: none; cursor: pointer; font-weight: 500;">Ghost Button</button>' },

  // Forms
  { id: "input", label: "Text Input", icon: <FormInput className="w-4 h-4" />, category: "Forms", html: '<input type="text" placeholder="Enter text..." style="padding: 0.75rem 1rem; border: 1px solid #ddd; border-radius: 6px; width: 100%; max-width: 300px;" />' },
  { id: "textarea", label: "Textarea", icon: <AlignLeft className="w-4 h-4" />, category: "Forms", html: '<textarea placeholder="Enter your message..." style="padding: 0.75rem 1rem; border: 1px solid #ddd; border-radius: 6px; width: 100%; max-width: 400px; min-height: 100px; resize: vertical;"></textarea>' },
  { id: "checkbox", label: "Checkbox", icon: <CheckSquare className="w-4 h-4" />, category: "Forms", html: '<label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" style="width: 1rem; height: 1rem;" /> Checkbox label</label>' },
  { id: "form-group", label: "Form Group", icon: <FormInput className="w-4 h-4" />, category: "Forms", html: '<div style="margin-bottom: 1rem;"><label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Label</label><input type="text" placeholder="Enter value..." style="padding: 0.75rem 1rem; border: 1px solid #ddd; border-radius: 6px; width: 100%;" /></div>' },

  // Lists
  { id: "ul", label: "Bullet List", icon: <List className="w-4 h-4" />, category: "Lists", html: '<ul style="padding-left: 1.5rem; margin: 0.5rem 0;"><li style="margin: 0.25rem 0;">List item 1</li><li style="margin: 0.25rem 0;">List item 2</li><li style="margin: 0.25rem 0;">List item 3</li></ul>' },
  { id: "ol", label: "Numbered List", icon: <List className="w-4 h-4" />, category: "Lists", html: '<ol style="padding-left: 1.5rem; margin: 0.5rem 0;"><li style="margin: 0.25rem 0;">First item</li><li style="margin: 0.25rem 0;">Second item</li><li style="margin: 0.25rem 0;">Third item</li></ol>' },

  // Table
  { id: "table", label: "Table", icon: <Table className="w-4 h-4" />, category: "Data", html: '<table style="width: 100%; border-collapse: collapse;"><thead><tr><th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #ddd;">Header 1</th><th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #ddd;">Header 2</th><th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #ddd;">Header 3</th></tr></thead><tbody><tr><td style="padding: 0.75rem; border-bottom: 1px solid #eee;">Data 1</td><td style="padding: 0.75rem; border-bottom: 1px solid #eee;">Data 2</td><td style="padding: 0.75rem; border-bottom: 1px solid #eee;">Data 3</td></tr><tr><td style="padding: 0.75rem; border-bottom: 1px solid #eee;">Data 4</td><td style="padding: 0.75rem; border-bottom: 1px solid #eee;">Data 5</td><td style="padding: 0.75rem; border-bottom: 1px solid #eee;">Data 6</td></tr></tbody></table>' },

  // Icons/Decorative
  { id: "icon-star", label: "Star Icon", icon: <Star className="w-4 h-4" />, category: "Icons", html: '<span style="color: #fbbf24; font-size: 1.5rem;">★</span>' },
  { id: "icon-heart", label: "Heart Icon", icon: <Heart className="w-4 h-4" />, category: "Icons", html: '<span style="color: #ef4444; font-size: 1.5rem;">♥</span>' },
  { id: "rating", label: "Star Rating", icon: <Star className="w-4 h-4" />, category: "Icons", html: '<div style="color: #fbbf24; font-size: 1.25rem;">★★★★☆</div>' },

  // Contact
  { id: "email", label: "Email Link", icon: <Mail className="w-4 h-4" />, category: "Contact", html: '<a href="mailto:email@example.com" style="display: flex; align-items: center; gap: 0.5rem; color: inherit; text-decoration: none;"><span style="font-size: 1.25rem;">✉</span> email@example.com</a>' },
  { id: "phone", label: "Phone Link", icon: <Phone className="w-4 h-4" />, category: "Contact", html: '<a href="tel:+1234567890" style="display: flex; align-items: center; gap: 0.5rem; color: inherit; text-decoration: none;"><span style="font-size: 1.25rem;">☎</span> +1 (234) 567-890</a>' },
  { id: "address", label: "Address", icon: <MapPin className="w-4 h-4" />, category: "Contact", html: '<address style="display: flex; align-items: start; gap: 0.5rem; font-style: normal;"><span style="font-size: 1.25rem;">📍</span><span>123 Main Street<br />City, State 12345</span></address>' },

  // Date/Time
  { id: "date", label: "Date", icon: <Calendar className="w-4 h-4" />, category: "DateTime", html: '<span style="display: flex; align-items: center; gap: 0.5rem;"><span>📅</span> January 1, 2024</span>' },
  { id: "time", label: "Time", icon: <Clock className="w-4 h-4" />, category: "DateTime", html: '<span style="display: flex; align-items: center; gap: 0.5rem;"><span>🕐</span> 10:00 AM</span>' },
];

const categories = [...new Set(elements.map(e => e.category))];

export const DraggableElements = ({ onElementDrop }: DraggableElementsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedElement, setDraggedElement] = useState<DraggableElement | null>(null);

  const filteredElements = elements.filter(el =>
    el.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    el.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragStart = (e: React.DragEvent, element: DraggableElement) => {
    setDraggedElement(element);
    e.dataTransfer.setData("text/html", element.html);
    e.dataTransfer.setData("application/x-element-id", element.id);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragEnd = () => {
    setDraggedElement(null);
  };

  const handleClick = (element: DraggableElement) => {
    onElementDrop(element.html);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs font-medium text-muted-foreground uppercase">Add Elements</Label>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search elements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-4 pr-2">
          {categories.map(category => {
            const categoryElements = filteredElements.filter(el => el.category === category);
            if (categoryElements.length === 0) return null;

            return (
              <div key={category}>
                <Label className="text-xs text-muted-foreground mb-2 block">{category}</Label>
                <div className="grid grid-cols-2 gap-1.5">
                  {categoryElements.map(element => (
                    <div
                      key={element.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, element)}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleClick(element)}
                      className={`flex items-center gap-2 p-2 rounded border cursor-grab hover:bg-muted transition-colors text-xs ${
                        draggedElement?.id === element.id ? "opacity-50" : ""
                      }`}
                    >
                      {element.icon}
                      <span className="truncate">{element.label}</span>
                    </div>
                  ))}
                </div>
                <Separator className="mt-3" />
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <p className="text-xs text-muted-foreground text-center">
        Click or drag elements to add them to your template
      </p>
    </div>
  );
};
