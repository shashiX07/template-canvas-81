// Business Template Configuration Storage

export interface BusinessTemplateConfig {
  templateName: string;
  description: string;
  version: string;
  
  routes?: Record<string, string>;
  dynamicRoutes?: Record<string, string>;
  
  environment?: {
    required: string[];
  };
  
  authentication?: {
    enabled: boolean;
    providers: string[];
    passwordPolicy?: {
      minLength: number;
      requireNumber?: boolean;
      requireSpecialChar?: boolean;
    };
  };
  
  roles?: Record<string, {
    permissions: string[];
  }>;
  
  database?: Record<string, {
    fields: Record<string, any>;
  }>;
  
  api?: {
    prefix: string;
    autoGenerateCRUD: boolean;
    customEndpoints?: Record<string, {
      method: string;
      path: string;
      description: string;
    }>;
  };
  
  validation?: {
    globalRules?: Record<string, any>;
  };
  
  uiMapping?: Record<string, Record<string, string>>;
  
  storage?: Record<string, {
    maxSizeMB: number;
    allowedTypes?: string[];
  }>;
  
  payment?: {
    enabled: boolean;
    provider: string;
    currency: string;
  };
  
  adminPanel?: {
    enabled: boolean;
    resources: string[];
    theme?: {
      colorPrimary: string;
      logo?: string;
    };
  };
  
  localization?: {
    defaultLanguage: string;
    supportedLanguages: string[];
  };
  
  seo?: {
    metaDefaults: {
      title: string;
      description: string;
      keywords: string[];
    };
  };
  
  integrations?: Record<string, string>;
  webhooks?: Record<string, string>;
  
  triggers?: Record<string, {
    type: string;
    function: string;
  }>;
  
  commands?: {
    postDeployment: string[];
  };
  
  deploy?: {
    frontend?: string;
    backend?: string;
    database?: string;
    storage?: string;
  };
}

export interface BusinessTemplate {
  id: string;
  templateId: string;
  config: BusinessTemplateConfig;
  envVariables: Record<string, string>;
  setupStatus: 'pending' | 'in_progress' | 'completed' | 'failed';
  setupLogs: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

const BUSINESS_TEMPLATES_KEY = 'businessTemplates';

export const businessTemplateStorage = {
  getAll: (): BusinessTemplate[] => {
    try {
      const item = localStorage.getItem(BUSINESS_TEMPLATES_KEY);
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  },
  
  getById: (id: string): BusinessTemplate | null => {
    const templates = businessTemplateStorage.getAll();
    return templates.find(t => t.id === id) || null;
  },
  
  getByTemplateId: (templateId: string): BusinessTemplate | null => {
    const templates = businessTemplateStorage.getAll();
    return templates.find(t => t.templateId === templateId) || null;
  },
  
  save: (template: BusinessTemplate): void => {
    const templates = businessTemplateStorage.getAll();
    const index = templates.findIndex(t => t.id === template.id);
    
    if (index >= 0) {
      templates[index] = template;
    } else {
      templates.push(template);
    }
    
    localStorage.setItem(BUSINESS_TEMPLATES_KEY, JSON.stringify(templates));
  },
  
  delete: (id: string): void => {
    const templates = businessTemplateStorage.getAll();
    localStorage.setItem(BUSINESS_TEMPLATES_KEY, JSON.stringify(templates.filter(t => t.id !== id)));
  },
  
  updateEnvVariables: (id: string, envVariables: Record<string, string>): void => {
    const template = businessTemplateStorage.getById(id);
    if (template) {
      template.envVariables = envVariables;
      template.updatedAt = new Date().toISOString();
      businessTemplateStorage.save(template);
    }
  },
  
  updateSetupStatus: (id: string, status: BusinessTemplate['setupStatus'], log?: string): void => {
    const template = businessTemplateStorage.getById(id);
    if (template) {
      template.setupStatus = status;
      if (log) {
        template.setupLogs.push(`[${new Date().toISOString()}] ${log}`);
      }
      template.updatedAt = new Date().toISOString();
      businessTemplateStorage.save(template);
    }
  },
  
  parseConfigFromZip: async (configJson: string): Promise<BusinessTemplateConfig | null> => {
    try {
      const config = JSON.parse(configJson);
      // Validate required fields
      if (!config.templateName || !config.version) {
        return null;
      }
      return config as BusinessTemplateConfig;
    } catch {
      return null;
    }
  },
};
