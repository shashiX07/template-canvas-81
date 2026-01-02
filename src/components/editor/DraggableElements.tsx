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
  
  // Sections - NEW
  { id: "hero-section", label: "Hero Section", icon: <LayoutGrid className="w-4 h-4" />, category: "Sections", html: '<section style="padding: 4rem 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center;"><h1 style="font-size: 3rem; font-weight: bold; margin: 0 0 1rem 0;">Welcome to Our Website</h1><p style="font-size: 1.25rem; margin: 0 0 2rem 0; opacity: 0.9;">Create something amazing with our platform</p><button style="padding: 1rem 2rem; background: white; color: #764ba2; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer;">Get Started</button></section>' },
  { id: "features-section", label: "Features Grid", icon: <LayoutGrid className="w-4 h-4" />, category: "Sections", html: '<section style="padding: 4rem 2rem; background: #f8f9fa;"><h2 style="text-align: center; margin: 0 0 3rem 0; font-size: 2rem;">Our Features</h2><div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; max-width: 1200px; margin: 0 auto;"><div style="text-align: center; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"><div style="font-size: 2.5rem; margin-bottom: 1rem;">🚀</div><h3 style="margin: 0 0 0.5rem 0;">Fast Performance</h3><p style="color: #666; margin: 0;">Lightning fast load times</p></div><div style="text-align: center; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"><div style="font-size: 2.5rem; margin-bottom: 1rem;">🔒</div><h3 style="margin: 0 0 0.5rem 0;">Secure</h3><p style="color: #666; margin: 0;">Enterprise-grade security</p></div><div style="text-align: center; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"><div style="font-size: 2.5rem; margin-bottom: 1rem;">💎</div><h3 style="margin: 0 0 0.5rem 0;">Premium Quality</h3><p style="color: #666; margin: 0;">Best in class experience</p></div></div></section>' },
  { id: "testimonial", label: "Testimonial", icon: <Quote className="w-4 h-4" />, category: "Sections", html: '<div style="padding: 2rem; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); max-width: 600px; margin: 2rem auto;"><div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;"><img src="https://via.placeholder.com/60" alt="Avatar" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;" /><div><h4 style="margin: 0; font-weight: 600;">John Doe</h4><p style="margin: 0; color: #666; font-size: 0.875rem;">CEO, Company</p></div></div><p style="font-style: italic; color: #444; line-height: 1.6; margin: 0;">"This product has completely transformed how we work. The results have been incredible and the team support is outstanding."</p><div style="margin-top: 1rem; color: #fbbf24; font-size: 1.25rem;">★★★★★</div></div>' },
  { id: "pricing-card", label: "Pricing Card", icon: <Square className="w-4 h-4" />, category: "Sections", html: '<div style="padding: 2rem; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); max-width: 320px; text-align: center;"><h3 style="margin: 0 0 0.5rem 0; font-size: 1.5rem;">Pro Plan</h3><p style="color: #666; margin: 0 0 1.5rem 0;">Perfect for growing businesses</p><div style="font-size: 3rem; font-weight: bold; margin: 0 0 1.5rem 0;">$49<span style="font-size: 1rem; font-weight: normal; color: #666;">/mo</span></div><ul style="list-style: none; padding: 0; margin: 0 0 2rem 0; text-align: left;"><li style="padding: 0.5rem 0; border-bottom: 1px solid #eee;">✓ Unlimited projects</li><li style="padding: 0.5rem 0; border-bottom: 1px solid #eee;">✓ Priority support</li><li style="padding: 0.5rem 0; border-bottom: 1px solid #eee;">✓ Advanced analytics</li><li style="padding: 0.5rem 0;">✓ Custom integrations</li></ul><button style="width: 100%; padding: 1rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Get Started</button></div>' },
  { id: "cta-section", label: "CTA Section", icon: <LayoutGrid className="w-4 h-4" />, category: "Sections", html: '<section style="padding: 4rem 2rem; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); text-align: center;"><h2 style="color: white; font-size: 2.5rem; margin: 0 0 1rem 0;">Ready to Get Started?</h2><p style="color: #aaa; font-size: 1.25rem; margin: 0 0 2rem 0;">Join thousands of satisfied customers today</p><div style="display: flex; gap: 1rem; justify-content: center;"><button style="padding: 1rem 2rem; background: white; color: #1a1a2e; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Start Free Trial</button><button style="padding: 1rem 2rem; background: transparent; color: white; border: 2px solid white; border-radius: 8px; font-weight: 600; cursor: pointer;">Learn More</button></div></section>' },
  { id: "stats-section", label: "Stats Section", icon: <LayoutGrid className="w-4 h-4" />, category: "Sections", html: '<section style="padding: 3rem 2rem; background: #f8f9fa;"><div style="display: flex; justify-content: center; gap: 4rem; flex-wrap: wrap;"><div style="text-align: center;"><div style="font-size: 3rem; font-weight: bold; color: #667eea;">10K+</div><p style="color: #666; margin: 0;">Happy Customers</p></div><div style="text-align: center;"><div style="font-size: 3rem; font-weight: bold; color: #667eea;">99%</div><p style="color: #666; margin: 0;">Satisfaction Rate</p></div><div style="text-align: center;"><div style="font-size: 3rem; font-weight: bold; color: #667eea;">24/7</div><p style="color: #666; margin: 0;">Support Available</p></div><div style="text-align: center;"><div style="font-size: 3rem; font-weight: bold; color: #667eea;">50+</div><p style="color: #666; margin: 0;">Countries Served</p></div></div></section>' },

  // Layout
  { id: "container", label: "Container", icon: <Square className="w-4 h-4" />, category: "Layout", html: '<div style="padding: 2rem; background: #f5f5f5; border-radius: 8px; margin: 1rem 0;"><h3 style="margin: 0 0 0.5rem 0;">Container Title</h3><p style="margin: 0; color: #666;">Add your content here. Click to edit.</p></div>' },
  { id: "flexbox", label: "Flex Container", icon: <Columns className="w-4 h-4" />, category: "Layout", html: '<div style="display: flex; gap: 1rem; padding: 1rem;"><div style="flex: 1; padding: 1.5rem; background: #e0e0e0; border-radius: 8px; text-align: center;"><h4 style="margin: 0 0 0.5rem 0;">Column 1</h4><p style="margin: 0; font-size: 0.875rem; color: #666;">Add your content here</p></div><div style="flex: 1; padding: 1.5rem; background: #e0e0e0; border-radius: 8px; text-align: center;"><h4 style="margin: 0 0 0.5rem 0;">Column 2</h4><p style="margin: 0; font-size: 0.875rem; color: #666;">Add your content here</p></div></div>' },
  { id: "grid", label: "Grid Layout", icon: <LayoutGrid className="w-4 h-4" />, category: "Layout", html: '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; padding: 1rem;"><div style="padding: 1.5rem; background: #e0e0e0; border-radius: 8px; text-align: center;"><span style="font-size: 2rem;">📦</span><p style="margin: 0.5rem 0 0 0;">Item 1</p></div><div style="padding: 1.5rem; background: #e0e0e0; border-radius: 8px; text-align: center;"><span style="font-size: 2rem;">📦</span><p style="margin: 0.5rem 0 0 0;">Item 2</p></div><div style="padding: 1.5rem; background: #e0e0e0; border-radius: 8px; text-align: center;"><span style="font-size: 2rem;">📦</span><p style="margin: 0.5rem 0 0 0;">Item 3</p></div></div>' },
  { id: "divider", label: "Divider", icon: <SeparatorHorizontal className="w-4 h-4" />, category: "Layout", html: '<hr style="border: none; border-top: 1px solid #ddd; margin: 1.5rem 0;" />' },
  { id: "spacer", label: "Spacer", icon: <Minus className="w-4 h-4" />, category: "Layout", html: '<div style="height: 2rem;"></div>' },
  { id: "card", label: "Card", icon: <Square className="w-4 h-4" />, category: "Layout", html: '<div style="background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 1.5rem; margin: 1rem 0;"><img src="https://via.placeholder.com/400x200" alt="Card image" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;" /><h3 style="margin: 0 0 0.5rem 0;">Card Title</h3><p style="margin: 0; color: #666; font-size: 0.875rem;">Card description goes here. Add your content.</p><button style="margin-top: 1rem; padding: 0.5rem 1rem; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer;">Learn More</button></div>' },

  // Navigation
  { id: "navbar", label: "Navbar", icon: <Navigation className="w-4 h-4" />, category: "Navigation", html: '<nav style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: #333; color: white;"><div style="font-weight: bold; font-size: 1.25rem;">Logo</div><div style="display: flex; gap: 1.5rem;"><a href="#" style="color: white; text-decoration: none;">Home</a><a href="#" style="color: white; text-decoration: none;">About</a><a href="#" style="color: white; text-decoration: none;">Services</a><a href="#" style="color: white; text-decoration: none;">Contact</a></div></nav>' },
  { id: "menu", label: "Menu", icon: <Menu className="w-4 h-4" />, category: "Navigation", html: '<ul style="list-style: none; padding: 0; margin: 0;"><li style="padding: 0.75rem 1rem; border-bottom: 1px solid #eee;"><a href="#" style="color: inherit; text-decoration: none;">Menu Item 1</a></li><li style="padding: 0.75rem 1rem; border-bottom: 1px solid #eee;"><a href="#" style="color: inherit; text-decoration: none;">Menu Item 2</a></li><li style="padding: 0.75rem 1rem;"><a href="#" style="color: inherit; text-decoration: none;">Menu Item 3</a></li></ul>' },
  { id: "link", label: "Link", icon: <Link className="w-4 h-4" />, category: "Navigation", html: '<a href="#" style="color: #0066cc; text-decoration: underline;">Click here</a>' },
  { id: "footer", label: "Footer", icon: <Navigation className="w-4 h-4" />, category: "Navigation", html: '<footer style="padding: 2rem; background: #1a1a2e; color: white; text-align: center;"><div style="margin-bottom: 1rem;"><a href="#" style="color: #aaa; margin: 0 0.75rem; text-decoration: none;">Home</a><a href="#" style="color: #aaa; margin: 0 0.75rem; text-decoration: none;">About</a><a href="#" style="color: #aaa; margin: 0 0.75rem; text-decoration: none;">Contact</a></div><p style="color: #666; margin: 0;">© 2024 Your Company. All rights reserved.</p></footer>' },
  { id: "breadcrumb", label: "Breadcrumb", icon: <Navigation className="w-4 h-4" />, category: "Navigation", html: '<nav style="padding: 0.5rem 0;"><a href="#" style="color: #666; text-decoration: none;">Home</a> <span style="color: #999; margin: 0 0.5rem;">›</span> <a href="#" style="color: #666; text-decoration: none;">Category</a> <span style="color: #999; margin: 0 0.5rem;">›</span> <span style="color: #333;">Current Page</span></nav>' },

  // Buttons
  { id: "button-primary", label: "Primary Button", icon: <Square className="w-4 h-4" />, category: "Buttons", html: '<button style="padding: 0.75rem 1.5rem; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: background 0.2s;">Primary Button</button>' },
  { id: "button-secondary", label: "Secondary Button", icon: <Square className="w-4 h-4" />, category: "Buttons", html: '<button style="padding: 0.75rem 1.5rem; background: transparent; color: #2563eb; border: 2px solid #2563eb; border-radius: 6px; cursor: pointer; font-weight: 500;">Secondary Button</button>' },
  { id: "button-ghost", label: "Ghost Button", icon: <Square className="w-4 h-4" />, category: "Buttons", html: '<button style="padding: 0.75rem 1.5rem; background: transparent; color: #666; border: none; cursor: pointer; font-weight: 500;">Ghost Button</button>' },
  { id: "button-gradient", label: "Gradient Button", icon: <Square className="w-4 h-4" />, category: "Buttons", html: '<button style="padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">Gradient Button</button>' },
  { id: "button-icon", label: "Icon Button", icon: <Square className="w-4 h-4" />, category: "Buttons", html: '<button style="padding: 0.75rem 1.5rem; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 0.5rem;">→ Learn More</button>' },
  { id: "button-group", label: "Button Group", icon: <Square className="w-4 h-4" />, category: "Buttons", html: '<div style="display: inline-flex; border-radius: 6px; overflow: hidden;"><button style="padding: 0.5rem 1rem; background: #2563eb; color: white; border: none; cursor: pointer;">Left</button><button style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-left: 1px solid rgba(255,255,255,0.2); cursor: pointer;">Center</button><button style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-left: 1px solid rgba(255,255,255,0.2); cursor: pointer;">Right</button></div>' },

  // Forms
  { id: "input", label: "Text Input", icon: <FormInput className="w-4 h-4" />, category: "Forms", html: '<input type="text" placeholder="Enter text..." style="padding: 0.75rem 1rem; border: 1px solid #ddd; border-radius: 6px; width: 100%; max-width: 300px;" />' },
  { id: "textarea", label: "Textarea", icon: <AlignLeft className="w-4 h-4" />, category: "Forms", html: '<textarea placeholder="Enter your message..." style="padding: 0.75rem 1rem; border: 1px solid #ddd; border-radius: 6px; width: 100%; max-width: 400px; min-height: 100px; resize: vertical;"></textarea>' },
  { id: "checkbox", label: "Checkbox", icon: <CheckSquare className="w-4 h-4" />, category: "Forms", html: '<label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" style="width: 1rem; height: 1rem;" /> Checkbox label</label>' },
  { id: "radio-group", label: "Radio Group", icon: <CheckSquare className="w-4 h-4" />, category: "Forms", html: '<div style="display: flex; flex-direction: column; gap: 0.5rem;"><label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="radio" name="radio-group" style="width: 1rem; height: 1rem;" /> Option 1</label><label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="radio" name="radio-group" style="width: 1rem; height: 1rem;" /> Option 2</label><label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="radio" name="radio-group" style="width: 1rem; height: 1rem;" /> Option 3</label></div>' },
  { id: "select", label: "Select Dropdown", icon: <FormInput className="w-4 h-4" />, category: "Forms", html: '<select style="padding: 0.75rem 1rem; border: 1px solid #ddd; border-radius: 6px; background: white; min-width: 200px;"><option>Select an option</option><option>Option 1</option><option>Option 2</option><option>Option 3</option></select>' },
  { id: "form-group", label: "Form Group", icon: <FormInput className="w-4 h-4" />, category: "Forms", html: '<div style="margin-bottom: 1rem;"><label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Label</label><input type="text" placeholder="Enter value..." style="padding: 0.75rem 1rem; border: 1px solid #ddd; border-radius: 6px; width: 100%;" /></div>' },
  { id: "contact-form", label: "Contact Form", icon: <FormInput className="w-4 h-4" />, category: "Forms", html: '<form style="max-width: 500px; padding: 2rem; background: #f8f9fa; border-radius: 12px;"><h3 style="margin: 0 0 1.5rem 0;">Contact Us</h3><div style="margin-bottom: 1rem;"><label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Name</label><input type="text" placeholder="Your name" style="padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; width: 100%;" /></div><div style="margin-bottom: 1rem;"><label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Email</label><input type="email" placeholder="your@email.com" style="padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; width: 100%;" /></div><div style="margin-bottom: 1rem;"><label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Message</label><textarea placeholder="Your message..." style="padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; width: 100%; min-height: 100px;"></textarea></div><button type="submit" style="width: 100%; padding: 0.75rem; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">Send Message</button></form>' },
  { id: "newsletter", label: "Newsletter", icon: <Mail className="w-4 h-4" />, category: "Forms", html: '<div style="padding: 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; text-align: center;"><h3 style="color: white; margin: 0 0 0.5rem 0;">Subscribe to our Newsletter</h3><p style="color: rgba(255,255,255,0.8); margin: 0 0 1.5rem 0;">Get the latest updates directly in your inbox</p><div style="display: flex; gap: 0.5rem; max-width: 400px; margin: 0 auto;"><input type="email" placeholder="Enter your email" style="flex: 1; padding: 0.75rem 1rem; border: none; border-radius: 6px;" /><button style="padding: 0.75rem 1.5rem; background: white; color: #667eea; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">Subscribe</button></div></div>' },

  // Lists
  { id: "ul", label: "Bullet List", icon: <List className="w-4 h-4" />, category: "Lists", html: '<ul style="padding-left: 1.5rem; margin: 0.5rem 0;"><li style="margin: 0.25rem 0;">List item 1</li><li style="margin: 0.25rem 0;">List item 2</li><li style="margin: 0.25rem 0;">List item 3</li></ul>' },
  { id: "ol", label: "Numbered List", icon: <List className="w-4 h-4" />, category: "Lists", html: '<ol style="padding-left: 1.5rem; margin: 0.5rem 0;"><li style="margin: 0.25rem 0;">First item</li><li style="margin: 0.25rem 0;">Second item</li><li style="margin: 0.25rem 0;">Third item</li></ol>' },
  { id: "checklist", label: "Checklist", icon: <CheckSquare className="w-4 h-4" />, category: "Lists", html: '<ul style="list-style: none; padding: 0; margin: 0;"><li style="padding: 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;">✓ <span>Completed task</span></li><li style="padding: 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;">✓ <span>Another completed task</span></li><li style="padding: 0.5rem 0; display: flex; align-items: center; gap: 0.5rem; color: #999;">○ <span>Pending task</span></li></ul>' },

  // Table
  { id: "table", label: "Table", icon: <Table className="w-4 h-4" />, category: "Data", html: '<table style="width: 100%; border-collapse: collapse;"><thead><tr><th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #ddd;">Header 1</th><th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #ddd;">Header 2</th><th style="padding: 0.75rem; text-align: left; border-bottom: 2px solid #ddd;">Header 3</th></tr></thead><tbody><tr><td style="padding: 0.75rem; border-bottom: 1px solid #eee;">Data 1</td><td style="padding: 0.75rem; border-bottom: 1px solid #eee;">Data 2</td><td style="padding: 0.75rem; border-bottom: 1px solid #eee;">Data 3</td></tr><tr><td style="padding: 0.75rem; border-bottom: 1px solid #eee;">Data 4</td><td style="padding: 0.75rem; border-bottom: 1px solid #eee;">Data 5</td><td style="padding: 0.75rem; border-bottom: 1px solid #eee;">Data 6</td></tr></tbody></table>' },
  { id: "data-card", label: "Data Card", icon: <Square className="w-4 h-4" />, category: "Data", html: '<div style="padding: 1.5rem; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"><div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;"><span style="color: #666; font-size: 0.875rem;">Total Revenue</span><span style="color: #22c55e; font-size: 0.875rem;">+12.5%</span></div><div style="font-size: 2rem; font-weight: bold;">$45,231</div><p style="color: #666; font-size: 0.875rem; margin: 0.5rem 0 0 0;">Compared to last month</p></div>' },
  { id: "progress-bar", label: "Progress Bar", icon: <Minus className="w-4 h-4" />, category: "Data", html: '<div style="margin: 1rem 0;"><div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="font-size: 0.875rem;">Progress</span><span style="font-size: 0.875rem; color: #666;">75%</span></div><div style="height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden;"><div style="width: 75%; height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); border-radius: 4px;"></div></div></div>' },

  // Icons/Decorative
  { id: "icon-star", label: "Star Icon", icon: <Star className="w-4 h-4" />, category: "Icons", html: '<span style="color: #fbbf24; font-size: 1.5rem;">★</span>' },
  { id: "icon-heart", label: "Heart Icon", icon: <Heart className="w-4 h-4" />, category: "Icons", html: '<span style="color: #ef4444; font-size: 1.5rem;">♥</span>' },
  { id: "rating", label: "Star Rating", icon: <Star className="w-4 h-4" />, category: "Icons", html: '<div style="color: #fbbf24; font-size: 1.25rem;">★★★★☆</div>' },
  { id: "badge", label: "Badge", icon: <Square className="w-4 h-4" />, category: "Icons", html: '<span style="display: inline-block; padding: 0.25rem 0.75rem; background: #2563eb; color: white; font-size: 0.75rem; font-weight: 600; border-radius: 9999px;">New</span>' },
  { id: "avatar", label: "Avatar", icon: <Square className="w-4 h-4" />, category: "Icons", html: '<div style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">JD</div>' },

  // Contact
  { id: "email", label: "Email Link", icon: <Mail className="w-4 h-4" />, category: "Contact", html: '<a href="mailto:email@example.com" style="display: flex; align-items: center; gap: 0.5rem; color: inherit; text-decoration: none;"><span style="font-size: 1.25rem;">✉</span> email@example.com</a>' },
  { id: "phone", label: "Phone Link", icon: <Phone className="w-4 h-4" />, category: "Contact", html: '<a href="tel:+1234567890" style="display: flex; align-items: center; gap: 0.5rem; color: inherit; text-decoration: none;"><span style="font-size: 1.25rem;">☎</span> +1 (234) 567-890</a>' },
  { id: "address", label: "Address", icon: <MapPin className="w-4 h-4" />, category: "Contact", html: '<address style="display: flex; align-items: start; gap: 0.5rem; font-style: normal;"><span style="font-size: 1.25rem;">📍</span><span>123 Main Street<br />City, State 12345</span></address>' },
  { id: "social-links", label: "Social Links", icon: <Link className="w-4 h-4" />, category: "Contact", html: '<div style="display: flex; gap: 1rem;"><a href="#" style="width: 40px; height: 40px; background: #1877f2; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none;">f</a><a href="#" style="width: 40px; height: 40px; background: #1da1f2; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none;">t</a><a href="#" style="width: 40px; height: 40px; background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none;">i</a><a href="#" style="width: 40px; height: 40px; background: #0077b5; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none;">in</a></div>' },

  // Date/Time
  { id: "date", label: "Date", icon: <Calendar className="w-4 h-4" />, category: "DateTime", html: '<span style="display: flex; align-items: center; gap: 0.5rem;"><span>📅</span> January 1, 2024</span>' },
  { id: "time", label: "Time", icon: <Clock className="w-4 h-4" />, category: "DateTime", html: '<span style="display: flex; align-items: center; gap: 0.5rem;"><span>🕐</span> 10:00 AM</span>' },
  { id: "countdown", label: "Countdown", icon: <Clock className="w-4 h-4" />, category: "DateTime", html: '<div style="display: flex; gap: 1rem; justify-content: center;"><div style="text-align: center;"><div style="font-size: 2rem; font-weight: bold;">07</div><div style="font-size: 0.75rem; color: #666;">Days</div></div><div style="text-align: center;"><div style="font-size: 2rem; font-weight: bold;">12</div><div style="font-size: 0.75rem; color: #666;">Hours</div></div><div style="text-align: center;"><div style="font-size: 2rem; font-weight: bold;">45</div><div style="font-size: 0.75rem; color: #666;">Minutes</div></div><div style="text-align: center;"><div style="font-size: 2rem; font-weight: bold;">30</div><div style="font-size: 0.75rem; color: #666;">Seconds</div></div></div>' },
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
