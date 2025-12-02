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
