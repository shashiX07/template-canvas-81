// Local storage utilities for managing templates, users, and admin data

export type UserRole = 'user' | 'freelancer' | 'admin' | 'superadmin';

export interface Template {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  tags: string[];
  htmlContent: string;
  cssFiles?: Record<string, string>;
  jsFiles?: Record<string, string>;
  assets?: Record<string, string>;
  /** Structured JSON representation from backend (dom/css/js) */
  structuredData?: import('./templateJsonConverter').StructuredTemplate;
  isPublic: boolean;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  downloads: number;
  rating: number;
}

export interface FreelancerProfile {
  userId: string;
  professionalTitle: string;
  bio: string;
  expertise: string[];
  experienceYears: number;
  portfolioUrl?: string;
  websiteUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  resumeUrl: string;
  resumeFileName: string;
  portfolioImages: string[];
  verificationStatus: 'pending' | 'approved' | 'rejected';
  verificationNotes?: string;
  approvedAt?: string;
  approvedBy?: string;
  totalTemplates: number;
  approvedTemplates: number;
  totalDownloads: number;
  totalEarnings: number;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  acceptingWork: boolean;
  minProjectBudget?: number;
  createdAt: string;
  updatedAt: string;
}

export interface FreelancerTemplate extends Template {
  freelancerId: string;
  submissionStatus: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'published';
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  submittedAt?: string;
  price?: number;
  earnings: number;
  salesCount: number;
  version: string;
  changelog?: string;
  compatibilityNotes?: string;
}

export interface FreelancerEarning {
  id: string;
  freelancerId: string;
  templateId: string;
  amount: number;
  transactionType: 'sale' | 'refund' | 'bonus' | 'withdrawal';
  status: 'pending' | 'completed' | 'cancelled';
  description: string;
  createdAt: string;
  processedAt?: string;
}

export interface FreelancerPayout {
  id: string;
  freelancerId: string;
  amount: number;
  paymentMethod: 'paypal' | 'bank_transfer' | 'stripe';
  paymentDetails: Record<string, any>;
  status: 'requested' | 'processing' | 'completed' | 'failed';
  requestedAt: string;
  processedAt?: string;
  transactionId?: string;
  notes?: string;
}

export interface FreelancerReview {
  id: string;
  freelancerId: string;
  templateId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  response?: string;
  respondedAt?: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
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
  freelancerProfileId?: string;
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
  FREELANCER_PROFILES: 'freelancerProfiles',
  FREELANCER_TEMPLATES: 'freelancerTemplates',
  FREELANCER_EARNINGS: 'freelancerEarnings',
  FREELANCER_PAYOUTS: 'freelancerPayouts',
  FREELANCER_REVIEWS: 'freelancerReviews',
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

// Freelancer Profile Storage
export const freelancerStorage = {
  getAll: (): FreelancerProfile[] => {
    return storage.get<FreelancerProfile[]>(STORAGE_KEYS.FREELANCER_PROFILES) || [];
  },
  
  getById: (userId: string): FreelancerProfile | null => {
    const profiles = freelancerStorage.getAll();
    return profiles.find(p => p.userId === userId) || null;
  },
  
  getApproved: (): FreelancerProfile[] => {
    return freelancerStorage.getAll().filter(p => p.verificationStatus === 'approved');
  },
  
  getPending: (): FreelancerProfile[] => {
    return freelancerStorage.getAll().filter(p => p.verificationStatus === 'pending');
  },
  
  save: (profile: FreelancerProfile): void => {
    const profiles = freelancerStorage.getAll();
    const index = profiles.findIndex(p => p.userId === profile.userId);
    
    if (index >= 0) {
      profiles[index] = profile;
    } else {
      profiles.push(profile);
    }
    
    storage.set(STORAGE_KEYS.FREELANCER_PROFILES, profiles);
  },
  
  delete: (userId: string): void => {
    const profiles = freelancerStorage.getAll();
    storage.set(STORAGE_KEYS.FREELANCER_PROFILES, profiles.filter(p => p.userId !== userId));
  },
};

// Freelancer Template Storage
export const freelancerTemplateStorage = {
  getAll: (): FreelancerTemplate[] => {
    return storage.get<FreelancerTemplate[]>(STORAGE_KEYS.FREELANCER_TEMPLATES) || [];
  },
  
  getByFreelancerId: (freelancerId: string): FreelancerTemplate[] => {
    return freelancerTemplateStorage.getAll().filter(t => t.freelancerId === freelancerId);
  },
  
  getByStatus: (status: string): FreelancerTemplate[] => {
    return freelancerTemplateStorage.getAll().filter(t => t.submissionStatus === status);
  },
  
  getById: (id: string): FreelancerTemplate | null => {
    const templates = freelancerTemplateStorage.getAll();
    return templates.find(t => t.id === id) || null;
  },
  
  save: (template: FreelancerTemplate): void => {
    const templates = freelancerTemplateStorage.getAll();
    const index = templates.findIndex(t => t.id === template.id);
    
    if (index >= 0) {
      templates[index] = template;
    } else {
      templates.push(template);
    }
    
    storage.set(STORAGE_KEYS.FREELANCER_TEMPLATES, templates);
  },
  
  delete: (id: string): void => {
    const templates = freelancerTemplateStorage.getAll();
    storage.set(STORAGE_KEYS.FREELANCER_TEMPLATES, templates.filter(t => t.id !== id));
  },
};

// Earnings Storage
export const earningsStorage = {
  getAll: (): FreelancerEarning[] => {
    return storage.get<FreelancerEarning[]>(STORAGE_KEYS.FREELANCER_EARNINGS) || [];
  },
  
  getByFreelancerId: (freelancerId: string): FreelancerEarning[] => {
    return earningsStorage.getAll().filter(e => e.freelancerId === freelancerId);
  },
  
  getTotalEarnings: (freelancerId: string): number => {
    const earnings = earningsStorage.getByFreelancerId(freelancerId);
    return earnings
      .filter(e => e.status === 'completed' && e.transactionType !== 'withdrawal')
      .reduce((sum, e) => sum + e.amount, 0);
  },
  
  getAvailableBalance: (freelancerId: string): number => {
    const earnings = earningsStorage.getByFreelancerId(freelancerId);
    const payouts = payoutStorage.getByFreelancerId(freelancerId);
    
    const totalEarned = earnings
      .filter(e => e.status === 'completed' && e.transactionType !== 'withdrawal')
      .reduce((sum, e) => sum + e.amount, 0);
    
    const totalWithdrawn = payouts
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
    
    return totalEarned - totalWithdrawn;
  },
  
  save: (earning: FreelancerEarning): void => {
    const earnings = earningsStorage.getAll();
    const index = earnings.findIndex(e => e.id === earning.id);
    
    if (index >= 0) {
      earnings[index] = earning;
    } else {
      earnings.push(earning);
    }
    
    storage.set(STORAGE_KEYS.FREELANCER_EARNINGS, earnings);
  },
};

// Payout Storage
export const payoutStorage = {
  getAll: (): FreelancerPayout[] => {
    return storage.get<FreelancerPayout[]>(STORAGE_KEYS.FREELANCER_PAYOUTS) || [];
  },
  
  getByFreelancerId: (freelancerId: string): FreelancerPayout[] => {
    return payoutStorage.getAll().filter(p => p.freelancerId === freelancerId);
  },
  
  getPending: (): FreelancerPayout[] => {
    return payoutStorage.getAll().filter(p => p.status === 'requested');
  },
  
  save: (payout: FreelancerPayout): void => {
    const payouts = payoutStorage.getAll();
    const index = payouts.findIndex(p => p.id === payout.id);
    
    if (index >= 0) {
      payouts[index] = payout;
    } else {
      payouts.push(payout);
    }
    
    storage.set(STORAGE_KEYS.FREELANCER_PAYOUTS, payouts);
  },
};

// Review Storage
export const reviewStorage = {
  getAll: (): FreelancerReview[] => {
    return storage.get<FreelancerReview[]>(STORAGE_KEYS.FREELANCER_REVIEWS) || [];
  },
  
  getByFreelancerId: (freelancerId: string): FreelancerReview[] => {
    return reviewStorage.getAll().filter(r => r.freelancerId === freelancerId);
  },
  
  getByTemplateId: (templateId: string): FreelancerReview[] => {
    return reviewStorage.getAll().filter(r => r.templateId === templateId);
  },
  
  save: (review: FreelancerReview): void => {
    const reviews = reviewStorage.getAll();
    const index = reviews.findIndex(r => r.id === review.id);
    
    if (index >= 0) {
      reviews[index] = review;
    } else {
      reviews.push(review);
    }
    
    storage.set(STORAGE_KEYS.FREELANCER_REVIEWS, reviews);
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
      password: 'admin123',
      name: 'Admin User',
      role: 'superadmin',
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
  }
};
