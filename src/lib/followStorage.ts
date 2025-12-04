// Follow/Follower System Storage

export interface FollowRelation {
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface SavedWebie {
  userId: string;
  webieId: string;
  savedAt: string;
}

const FOLLOW_KEY = 'followRelations';
const SAVED_WEBIES_KEY = 'savedWebies';

export const followStorage = {
  getAll: (): FollowRelation[] => {
    try {
      const item = localStorage.getItem(FOLLOW_KEY);
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  },

  follow: (followerId: string, followingId: string): void => {
    const relations = followStorage.getAll();
    const exists = relations.some(
      r => r.followerId === followerId && r.followingId === followingId
    );
    
    if (!exists) {
      relations.push({
        followerId,
        followingId,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(FOLLOW_KEY, JSON.stringify(relations));
    }
  },

  unfollow: (followerId: string, followingId: string): void => {
    const relations = followStorage.getAll();
    const filtered = relations.filter(
      r => !(r.followerId === followerId && r.followingId === followingId)
    );
    localStorage.setItem(FOLLOW_KEY, JSON.stringify(filtered));
  },

  isFollowing: (followerId: string, followingId: string): boolean => {
    const relations = followStorage.getAll();
    return relations.some(
      r => r.followerId === followerId && r.followingId === followingId
    );
  },

  getFollowers: (userId: string): string[] => {
    const relations = followStorage.getAll();
    return relations
      .filter(r => r.followingId === userId)
      .map(r => r.followerId);
  },

  getFollowing: (userId: string): string[] => {
    const relations = followStorage.getAll();
    return relations
      .filter(r => r.followerId === userId)
      .map(r => r.followingId);
  },

  getFollowerCount: (userId: string): number => {
    return followStorage.getFollowers(userId).length;
  },

  getFollowingCount: (userId: string): number => {
    return followStorage.getFollowing(userId).length;
  },
};

export const savedWebieStorage = {
  getAll: (): SavedWebie[] => {
    try {
      const item = localStorage.getItem(SAVED_WEBIES_KEY);
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  },

  save: (userId: string, webieId: string): void => {
    const saved = savedWebieStorage.getAll();
    const exists = saved.some(s => s.userId === userId && s.webieId === webieId);
    
    if (!exists) {
      saved.push({
        userId,
        webieId,
        savedAt: new Date().toISOString()
      });
      localStorage.setItem(SAVED_WEBIES_KEY, JSON.stringify(saved));
    }
  },

  unsave: (userId: string, webieId: string): void => {
    const saved = savedWebieStorage.getAll();
    const filtered = saved.filter(
      s => !(s.userId === userId && s.webieId === webieId)
    );
    localStorage.setItem(SAVED_WEBIES_KEY, JSON.stringify(filtered));
  },

  isSaved: (userId: string, webieId: string): boolean => {
    const saved = savedWebieStorage.getAll();
    return saved.some(s => s.userId === userId && s.webieId === webieId);
  },

  getSavedByUser: (userId: string): string[] => {
    const saved = savedWebieStorage.getAll();
    return saved
      .filter(s => s.userId === userId)
      .map(s => s.webieId);
  },
};
