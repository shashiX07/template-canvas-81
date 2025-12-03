// Webie - Social Template Sharing Storage

export interface Webie {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  templateId: string;
  title: string;
  description: string;
  thumbnail: string;
  htmlContent: string;
  cssFiles?: Record<string, string>;
  jsFiles?: Record<string, string>;
  assets?: Record<string, string>;
  likes: string[]; // Array of user IDs who liked
  comments: WebieComment[];
  shares: number;
  views: number;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WebieComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  likes: string[];
  replies: WebieReply[];
  createdAt: string;
}

export interface WebieReply {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

const WEBIE_KEY = 'webies';

// Sample webies data for demonstration
const sampleWebies: Webie[] = [
  {
    id: 'webie-sample-1',
    userId: 'user-sample-1',
    userName: 'Sarah Design',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    templateId: 'template-1',
    title: 'Elegant Birthday Celebration',
    description: 'A beautiful birthday invitation with elegant typography and warm colors. Perfect for milestone birthdays.',
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800',
    htmlContent: '<html><body><h1>Happy Birthday!</h1></body></html>',
    likes: ['user-1', 'user-2', 'user-3'],
    comments: [
      {
        id: 'comment-1',
        userId: 'user-2',
        userName: 'John Doe',
        content: 'This is absolutely stunning! Love the color palette.',
        likes: ['user-1'],
        replies: [],
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ],
    shares: 15,
    views: 234,
    tags: ['birthday', 'elegant', 'celebration'],
    isPublic: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'webie-sample-2',
    userId: 'user-sample-2',
    userName: 'Mike Creative',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    templateId: 'template-2',
    title: 'Modern Wedding Invitation',
    description: 'Minimalist wedding invitation with a contemporary feel. Clean lines and sophisticated design.',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    htmlContent: '<html><body><h1>Wedding</h1></body></html>',
    likes: ['user-1', 'user-3', 'user-4', 'user-5'],
    comments: [],
    shares: 28,
    views: 456,
    tags: ['wedding', 'modern', 'minimalist'],
    isPublic: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 'webie-sample-3',
    userId: 'user-sample-3',
    userName: 'Emily Art',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    templateId: 'template-3',
    title: 'Corporate Event Announcement',
    description: 'Professional corporate event template with clean design suitable for business occasions.',
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    htmlContent: '<html><body><h1>Corporate Event</h1></body></html>',
    likes: ['user-2', 'user-4'],
    comments: [
      {
        id: 'comment-2',
        userId: 'user-4',
        userName: 'Alex Pro',
        content: 'Very professional looking! Great for our company events.',
        likes: [],
        replies: [],
        createdAt: new Date(Date.now() - 7200000).toISOString()
      }
    ],
    shares: 8,
    views: 189,
    tags: ['corporate', 'professional', 'business'],
    isPublic: true,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString()
  }
];

// Initialize sample data if storage is empty
const initializeSampleData = () => {
  const existing = localStorage.getItem(WEBIE_KEY);
  if (!existing || JSON.parse(existing).length === 0) {
    localStorage.setItem(WEBIE_KEY, JSON.stringify(sampleWebies));
  }
};

// Call initialization
initializeSampleData();

export const webieStorage = {
  getAll: (): Webie[] => {
    try {
      const item = localStorage.getItem(WEBIE_KEY);
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  },

  getPublic: (): Webie[] => {
    return webieStorage.getAll().filter(w => w.isPublic);
  },

  getById: (id: string): Webie | null => {
    const webies = webieStorage.getAll();
    return webies.find(w => w.id === id) || null;
  },

  getByUserId: (userId: string): Webie[] => {
    return webieStorage.getAll().filter(w => w.userId === userId);
  },

  getTrending: (): Webie[] => {
    return webieStorage.getPublic()
      .sort((a, b) => (b.likes.length + b.shares) - (a.likes.length + a.shares))
      .slice(0, 20);
  },

  getRecent: (): Webie[] => {
    return webieStorage.getPublic()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 20);
  },

  search: (query: string): Webie[] => {
    const lowerQuery = query.toLowerCase();
    return webieStorage.getPublic().filter(w =>
      w.title.toLowerCase().includes(lowerQuery) ||
      w.description.toLowerCase().includes(lowerQuery) ||
      w.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      w.userName.toLowerCase().includes(lowerQuery)
    );
  },

  save: (webie: Webie): void => {
    const webies = webieStorage.getAll();
    const index = webies.findIndex(w => w.id === webie.id);

    if (index >= 0) {
      webies[index] = webie;
    } else {
      webies.push(webie);
    }

    localStorage.setItem(WEBIE_KEY, JSON.stringify(webies));
  },

  delete: (id: string): void => {
    const webies = webieStorage.getAll();
    localStorage.setItem(WEBIE_KEY, JSON.stringify(webies.filter(w => w.id !== id)));
  },

  toggleLike: (webieId: string, userId: string): boolean => {
    const webie = webieStorage.getById(webieId);
    if (!webie) return false;

    const likeIndex = webie.likes.indexOf(userId);
    if (likeIndex >= 0) {
      webie.likes.splice(likeIndex, 1);
    } else {
      webie.likes.push(userId);
    }

    webieStorage.save(webie);
    return likeIndex < 0; // Returns true if liked, false if unliked
  },

  addComment: (webieId: string, comment: WebieComment): void => {
    const webie = webieStorage.getById(webieId);
    if (!webie) return;

    webie.comments.push(comment);
    webieStorage.save(webie);
  },

  toggleCommentLike: (webieId: string, commentId: string, userId: string): void => {
    const webie = webieStorage.getById(webieId);
    if (!webie) return;

    const comment = webie.comments.find(c => c.id === commentId);
    if (!comment) return;

    const likeIndex = comment.likes.indexOf(userId);
    if (likeIndex >= 0) {
      comment.likes.splice(likeIndex, 1);
    } else {
      comment.likes.push(userId);
    }

    webieStorage.save(webie);
  },

  addReply: (webieId: string, commentId: string, reply: WebieReply): void => {
    const webie = webieStorage.getById(webieId);
    if (!webie) return;

    const comment = webie.comments.find(c => c.id === commentId);
    if (!comment) return;

    comment.replies.push(reply);
    webieStorage.save(webie);
  },

  incrementShares: (webieId: string): void => {
    const webie = webieStorage.getById(webieId);
    if (!webie) return;

    webie.shares += 1;
    webieStorage.save(webie);
  },

  incrementViews: (webieId: string): void => {
    const webie = webieStorage.getById(webieId);
    if (!webie) return;

    webie.views += 1;
    webieStorage.save(webie);
  },
};