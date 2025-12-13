// Custom Elements Storage for Admin-created prebuilt elements

export interface CustomElement {
  id: string;
  name: string;
  category: string;
  description: string;
  html: string;
  css?: string;
  icon: string; // Lucide icon name
  thumbnail?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  version: number;
  tags: string[];
}

const CUSTOM_ELEMENTS_KEY = 'custom_elements';

export const customElementStorage = {
  getAll: (): CustomElement[] => {
    const data = localStorage.getItem(CUSTOM_ELEMENTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getActive: (): CustomElement[] => {
    return customElementStorage.getAll().filter(el => el.isActive);
  },

  getById: (id: string): CustomElement | undefined => {
    return customElementStorage.getAll().find(el => el.id === id);
  },

  getByCategory: (category: string): CustomElement[] => {
    return customElementStorage.getAll().filter(el => el.category === category && el.isActive);
  },

  save: (element: CustomElement): void => {
    const elements = customElementStorage.getAll();
    const index = elements.findIndex(el => el.id === element.id);
    
    if (index >= 0) {
      elements[index] = { ...element, updatedAt: new Date().toISOString() };
    } else {
      elements.push(element);
    }
    
    localStorage.setItem(CUSTOM_ELEMENTS_KEY, JSON.stringify(elements));
  },

  delete: (id: string): void => {
    const elements = customElementStorage.getAll().filter(el => el.id !== id);
    localStorage.setItem(CUSTOM_ELEMENTS_KEY, JSON.stringify(elements));
  },

  toggleActive: (id: string): void => {
    const elements = customElementStorage.getAll();
    const index = elements.findIndex(el => el.id === id);
    if (index >= 0) {
      elements[index].isActive = !elements[index].isActive;
      elements[index].updatedAt = new Date().toISOString();
      localStorage.setItem(CUSTOM_ELEMENTS_KEY, JSON.stringify(elements));
    }
  },

  getCategories: (): string[] => {
    const elements = customElementStorage.getAll();
    return [...new Set(elements.map(el => el.category))];
  },

  duplicate: (id: string): CustomElement | undefined => {
    const original = customElementStorage.getById(id);
    if (!original) return undefined;
    
    const copy: CustomElement = {
      ...original,
      id: `custom-${Date.now()}`,
      name: `${original.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    };
    
    customElementStorage.save(copy);
    return copy;
  },
};

// Default prebuilt sections that admins can customize
export const defaultSections: Omit<CustomElement, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>[] = [
  {
    name: "Hero Section - Centered",
    category: "Sections",
    description: "Full-width hero with centered text and CTA button",
    icon: "Layout",
    isActive: true,
    version: 1,
    tags: ["hero", "landing", "cta"],
    html: `<section style="padding: 80px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); text-align: center; color: white;">
  <h1 style="font-size: 3rem; font-weight: bold; margin-bottom: 1rem;">Welcome to Our Platform</h1>
  <p style="font-size: 1.25rem; opacity: 0.9; max-width: 600px; margin: 0 auto 2rem;">Create stunning websites with our intuitive drag-and-drop editor. No coding required.</p>
  <button style="padding: 1rem 2rem; background: white; color: #667eea; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer;">Get Started Free</button>
</section>`
  },
  {
    name: "Feature Grid",
    category: "Sections",
    description: "3-column feature showcase with icons",
    icon: "LayoutGrid",
    isActive: true,
    version: 1,
    tags: ["features", "grid", "showcase"],
    html: `<section style="padding: 60px 20px; background: #f8f9fa;">
  <h2 style="text-align: center; font-size: 2rem; margin-bottom: 3rem;">Our Features</h2>
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; max-width: 1200px; margin: 0 auto;">
    <div style="text-align: center; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="font-size: 2.5rem; margin-bottom: 1rem;">⚡</div>
      <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Lightning Fast</h3>
      <p style="color: #666;">Optimized performance for the best user experience.</p>
    </div>
    <div style="text-align: center; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="font-size: 2.5rem; margin-bottom: 1rem;">🔒</div>
      <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Secure</h3>
      <p style="color: #666;">Enterprise-grade security to protect your data.</p>
    </div>
    <div style="text-align: center; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="font-size: 2.5rem; margin-bottom: 1rem;">🎨</div>
      <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Beautiful Design</h3>
      <p style="color: #666;">Stunning templates ready to customize.</p>
    </div>
  </div>
</section>`
  },
  {
    name: "Testimonial Card",
    category: "Sections",
    description: "Customer testimonial with avatar and quote",
    icon: "Quote",
    isActive: true,
    version: 1,
    tags: ["testimonial", "review", "quote"],
    html: `<div style="max-width: 600px; margin: 2rem auto; padding: 2rem; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
  <p style="font-size: 1.125rem; line-height: 1.8; color: #333; font-style: italic; margin-bottom: 1.5rem;">"This platform has completely transformed how we build websites. The intuitive interface and powerful features make it a joy to use. Highly recommended!"</p>
  <div style="display: flex; align-items: center; gap: 1rem;">
    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;" alt="Avatar" />
    <div>
      <h4 style="font-weight: 600; margin: 0;">John Smith</h4>
      <p style="color: #666; font-size: 0.875rem; margin: 0;">CEO at TechCorp</p>
    </div>
  </div>
</div>`
  },
  {
    name: "Pricing Table",
    category: "Sections",
    description: "3-tier pricing comparison table",
    icon: "DollarSign",
    isActive: true,
    version: 1,
    tags: ["pricing", "plans", "subscription"],
    html: `<section style="padding: 60px 20px; background: #fff;">
  <h2 style="text-align: center; font-size: 2rem; margin-bottom: 3rem;">Choose Your Plan</h2>
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; max-width: 1000px; margin: 0 auto;">
    <div style="padding: 2rem; border: 1px solid #e0e0e0; border-radius: 12px; text-align: center;">
      <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Starter</h3>
      <div style="font-size: 2.5rem; font-weight: bold; margin: 1rem 0;">$9<span style="font-size: 1rem; font-weight: normal;">/mo</span></div>
      <ul style="list-style: none; padding: 0; margin: 1.5rem 0; text-align: left;">
        <li style="padding: 0.5rem 0; border-bottom: 1px solid #eee;">✓ 5 Projects</li>
        <li style="padding: 0.5rem 0; border-bottom: 1px solid #eee;">✓ Basic Templates</li>
        <li style="padding: 0.5rem 0;">✓ Email Support</li>
      </ul>
      <button style="width: 100%; padding: 0.75rem; background: #f0f0f0; border: none; border-radius: 6px; cursor: pointer;">Get Started</button>
    </div>
    <div style="padding: 2rem; border: 2px solid #667eea; border-radius: 12px; text-align: center; transform: scale(1.05); background: #f8f7ff;">
      <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem; color: #667eea;">Professional</h3>
      <div style="font-size: 2.5rem; font-weight: bold; margin: 1rem 0;">$29<span style="font-size: 1rem; font-weight: normal;">/mo</span></div>
      <ul style="list-style: none; padding: 0; margin: 1.5rem 0; text-align: left;">
        <li style="padding: 0.5rem 0; border-bottom: 1px solid #eee;">✓ Unlimited Projects</li>
        <li style="padding: 0.5rem 0; border-bottom: 1px solid #eee;">✓ Premium Templates</li>
        <li style="padding: 0.5rem 0;">✓ Priority Support</li>
      </ul>
      <button style="width: 100%; padding: 0.75rem; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">Get Started</button>
    </div>
    <div style="padding: 2rem; border: 1px solid #e0e0e0; border-radius: 12px; text-align: center;">
      <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Enterprise</h3>
      <div style="font-size: 2.5rem; font-weight: bold; margin: 1rem 0;">$99<span style="font-size: 1rem; font-weight: normal;">/mo</span></div>
      <ul style="list-style: none; padding: 0; margin: 1.5rem 0; text-align: left;">
        <li style="padding: 0.5rem 0; border-bottom: 1px solid #eee;">✓ Everything in Pro</li>
        <li style="padding: 0.5rem 0; border-bottom: 1px solid #eee;">✓ Custom Branding</li>
        <li style="padding: 0.5rem 0;">✓ 24/7 Support</li>
      </ul>
      <button style="width: 100%; padding: 0.75rem; background: #f0f0f0; border: none; border-radius: 6px; cursor: pointer;">Contact Sales</button>
    </div>
  </div>
</section>`
  },
  {
    name: "Footer - Multi Column",
    category: "Sections",
    description: "Full-width footer with multiple link columns",
    icon: "Columns",
    isActive: true,
    version: 1,
    tags: ["footer", "links", "navigation"],
    html: `<footer style="padding: 60px 20px 30px; background: #1a1a2e; color: white;">
  <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; max-width: 1200px; margin: 0 auto;">
    <div>
      <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">YourBrand</h3>
      <p style="color: #aaa; line-height: 1.6;">Building the future of web development with innovative tools and solutions.</p>
    </div>
    <div>
      <h4 style="font-weight: 600; margin-bottom: 1rem;">Product</h4>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="margin: 0.5rem 0;"><a href="#" style="color: #aaa; text-decoration: none;">Features</a></li>
        <li style="margin: 0.5rem 0;"><a href="#" style="color: #aaa; text-decoration: none;">Pricing</a></li>
        <li style="margin: 0.5rem 0;"><a href="#" style="color: #aaa; text-decoration: none;">Templates</a></li>
      </ul>
    </div>
    <div>
      <h4 style="font-weight: 600; margin-bottom: 1rem;">Company</h4>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="margin: 0.5rem 0;"><a href="#" style="color: #aaa; text-decoration: none;">About</a></li>
        <li style="margin: 0.5rem 0;"><a href="#" style="color: #aaa; text-decoration: none;">Blog</a></li>
        <li style="margin: 0.5rem 0;"><a href="#" style="color: #aaa; text-decoration: none;">Careers</a></li>
      </ul>
    </div>
    <div>
      <h4 style="font-weight: 600; margin-bottom: 1rem;">Support</h4>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="margin: 0.5rem 0;"><a href="#" style="color: #aaa; text-decoration: none;">Help Center</a></li>
        <li style="margin: 0.5rem 0;"><a href="#" style="color: #aaa; text-decoration: none;">Contact</a></li>
        <li style="margin: 0.5rem 0;"><a href="#" style="color: #aaa; text-decoration: none;">Status</a></li>
      </ul>
    </div>
  </div>
  <div style="border-top: 1px solid #333; margin-top: 3rem; padding-top: 2rem; text-align: center; color: #666;">
    <p>© 2024 YourBrand. All rights reserved.</p>
  </div>
</footer>`
  },
];
