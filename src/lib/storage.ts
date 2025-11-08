// Local storage utilities for managing templates, users, and admin data

export interface Template {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  tags: string[];
  htmlContent: string;
  isPublic: boolean;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  downloads: number;
  rating: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  dob?: string;
  phone?: string;
  avatar?: string;
  isVerified: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  customizedTemplates: string[];
  draftTemplates: string[];
}

export interface CustomizedTemplate {
  id: string;
  userId: string;
  templateId: string;
  customizedHtml: string;
  customData: Record<string, any>;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
}

// Storage keys
const STORAGE_KEYS = {
  TEMPLATES: 'templates',
  USERS: 'users',
  CURRENT_USER: 'currentUser',
  CUSTOMIZED_TEMPLATES: 'customizedTemplates',
} as const;

// Generic storage functions
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
  
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },
  
  clear: (): void => {
    localStorage.clear();
  },
};

// Template functions
export const templateStorage = {
  getAll: (): Template[] => {
    return storage.get<Template[]>(STORAGE_KEYS.TEMPLATES) || [];
  },
  
  getById: (id: string): Template | null => {
    const templates = templateStorage.getAll();
    return templates.find(t => t.id === id) || null;
  },
  
  getPublic: (): Template[] => {
    return templateStorage.getAll().filter(t => t.isPublic);
  },
  
  getByCategory: (category: string): Template[] => {
    return templateStorage.getAll().filter(t => t.category === category && t.isPublic);
  },
  
  search: (query: string): Template[] => {
    const templates = templateStorage.getPublic();
    const lowerQuery = query.toLowerCase();
    return templates.filter(t => 
      t.title.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  },
  
  save: (template: Template): void => {
    const templates = templateStorage.getAll();
    const index = templates.findIndex(t => t.id === template.id);
    
    if (index >= 0) {
      templates[index] = template;
    } else {
      templates.push(template);
    }
    
    storage.set(STORAGE_KEYS.TEMPLATES, templates);
  },
  
  delete: (id: string): void => {
    const templates = templateStorage.getAll();
    storage.set(STORAGE_KEYS.TEMPLATES, templates.filter(t => t.id !== id));
  },
};

// User functions
export const userStorage = {
  getAll: (): User[] => {
    return storage.get<User[]>(STORAGE_KEYS.USERS) || [];
  },
  
  getById: (id: string): User | null => {
    const users = userStorage.getAll();
    return users.find(u => u.id === id) || null;
  },
  
  getCurrentUser: (): User | null => {
    return storage.get<User>(STORAGE_KEYS.CURRENT_USER);
  },
  
  setCurrentUser: (user: User | null): void => {
    if (user) {
      storage.set(STORAGE_KEYS.CURRENT_USER, user);
    } else {
      storage.remove(STORAGE_KEYS.CURRENT_USER);
    }
  },
  
  save: (user: User): void => {
    const users = userStorage.getAll();
    const index = users.findIndex(u => u.id === user.id);
    
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    
    storage.set(STORAGE_KEYS.USERS, users);
  },
  
  isAdmin: (): boolean => {
    const user = userStorage.getCurrentUser();
    return user?.isAdmin || user?.isSuperAdmin || false;
  },
  
  isSuperAdmin: (): boolean => {
    const user = userStorage.getCurrentUser();
    return user?.isSuperAdmin || false;
  },
};

// Customized template functions
export const customizedTemplateStorage = {
  getAll: (): CustomizedTemplate[] => {
    return storage.get<CustomizedTemplate[]>(STORAGE_KEYS.CUSTOMIZED_TEMPLATES) || [];
  },
  
  getByUserId: (userId: string): CustomizedTemplate[] => {
    return customizedTemplateStorage.getAll().filter(t => t.userId === userId);
  },
  
  getById: (id: string): CustomizedTemplate | null => {
    const templates = customizedTemplateStorage.getAll();
    return templates.find(t => t.id === id) || null;
  },
  
  save: (template: CustomizedTemplate): void => {
    const templates = customizedTemplateStorage.getAll();
    const index = templates.findIndex(t => t.id === template.id);
    
    if (index >= 0) {
      templates[index] = template;
    } else {
      templates.push(template);
    }
    
    storage.set(STORAGE_KEYS.CUSTOMIZED_TEMPLATES, templates);
  },
  
  delete: (id: string): void => {
    const templates = customizedTemplateStorage.getAll();
    storage.set(STORAGE_KEYS.CUSTOMIZED_TEMPLATES, templates.filter(t => t.id !== id));
  },
};

// Initialize with mock data if empty
export const initializeMockData = (): void => {
  if (templateStorage.getAll().length === 0) {
    const mockTemplates: Template[] = [
      {
        id: '1',
        title: 'Birthday Celebration',
        description: 'Beautiful birthday invitation template with confetti and balloons',
        thumbnail: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400',
        category: 'Birthday',
        tags: ['party', 'celebration', 'colorful'],
        htmlContent: '<html><body><h1>Happy Birthday!</h1></body></html>',
        isPublic: true,
        isPremium: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'admin',
        downloads: 120,
        rating: 4.8,
      },
      {
        id: '2',
        title: 'Wedding Invitation',
        description: 'Elegant wedding invitation with floral design',
        thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
        category: 'Wedding',
        tags: ['elegant', 'romantic', 'flowers'],
        htmlContent: '<html><body><h1>You\'re Invited!</h1></body></html>',
        isPublic: true,
        isPremium: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'admin',
        downloads: 85,
        rating: 4.9,
      },
      {
        id: '3',
        title: 'Condolence Message',
        description: 'Respectful condolence message template',
        thumbnail: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400',
        category: 'Condolence',
        tags: ['sympathy', 'memorial', 'peaceful'],
        htmlContent: '<html><body><h1>With Deepest Sympathy</h1></body></html>',
        isPublic: true,
        isPremium: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'admin',
        downloads: 45,
        rating: 4.7,
      },
    ];
    
    mockTemplates.forEach(template => templateStorage.save(template));
  }
  
  if (userStorage.getAll().length === 0) {
    const adminUser: User = {
      id: 'admin-1',
      email: 'admin@example.com',
      name: 'Admin User',
      dob: '1990-01-01',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      isVerified: true,
      isAdmin: true,
      isSuperAdmin: true,
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
      customizedTemplates: [],
      draftTemplates: [],
    };
    
    userStorage.save(adminUser);
    userStorage.setCurrentUser(adminUser);
  }
};
