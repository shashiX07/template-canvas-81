export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'reply' | 'follow' | 'mention';
  title: string;
  message: string;
  actionUrl?: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar?: string;
  relatedId?: string; // webieId, commentId, etc.
  isRead: boolean;
  createdAt: string;
}

const NOTIFICATION_KEY = 'webie_notifications';

const getNotifications = (): Notification[] => {
  const data = localStorage.getItem(NOTIFICATION_KEY);
  return data ? JSON.parse(data) : [];
};

const saveNotifications = (notifications: Notification[]): void => {
  localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(notifications));
};

export const notificationStorage = {
  getAll: (): Notification[] => {
    return getNotifications();
  },

  getByUserId: (userId: string): Notification[] => {
    return getNotifications()
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getUnreadCount: (userId: string): number => {
    return getNotifications().filter(n => n.userId === userId && !n.isRead).length;
  },

  create: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Notification => {
    const notifications = getNotifications();
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    notifications.unshift(newNotification);
    // Keep only last 100 notifications per user
    const userNotifications = notifications.filter(n => n.userId === notification.userId);
    if (userNotifications.length > 100) {
      const toRemove = userNotifications.slice(100);
      toRemove.forEach(n => {
        const index = notifications.findIndex(x => x.id === n.id);
        if (index > -1) notifications.splice(index, 1);
      });
    }
    saveNotifications(notifications);
    return newNotification;
  },

  markAsRead: (notificationId: string): void => {
    const notifications = getNotifications();
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      saveNotifications(notifications);
    }
  },

  markAllAsRead: (userId: string): void => {
    const notifications = getNotifications();
    notifications.forEach(n => {
      if (n.userId === userId) {
        n.isRead = true;
      }
    });
    saveNotifications(notifications);
  },

  delete: (notificationId: string): void => {
    const notifications = getNotifications().filter(n => n.id !== notificationId);
    saveNotifications(notifications);
  },

  deleteAll: (userId: string): void => {
    const notifications = getNotifications().filter(n => n.userId !== userId);
    saveNotifications(notifications);
  },

  // Helper to create specific notification types
  notifyLike: (toUserId: string, fromUser: { id: string; name: string; avatar?: string }, webieId: string, webieTitle: string) => {
    if (toUserId === fromUser.id) return; // Don't notify self
    return notificationStorage.create({
      userId: toUserId,
      type: 'like',
      title: 'New Like',
      message: `${fromUser.name} liked your webie "${webieTitle}"`,
      actionUrl: `/webie/${webieId}`,
      fromUserId: fromUser.id,
      fromUserName: fromUser.name,
      fromUserAvatar: fromUser.avatar,
      relatedId: webieId,
    });
  },

  notifyComment: (toUserId: string, fromUser: { id: string; name: string; avatar?: string }, webieId: string, webieTitle: string, commentPreview: string) => {
    if (toUserId === fromUser.id) return;
    return notificationStorage.create({
      userId: toUserId,
      type: 'comment',
      title: 'New Comment',
      message: `${fromUser.name} commented on "${webieTitle}": "${commentPreview.slice(0, 50)}${commentPreview.length > 50 ? '...' : ''}"`,
      actionUrl: `/webie/${webieId}#comments`,
      fromUserId: fromUser.id,
      fromUserName: fromUser.name,
      fromUserAvatar: fromUser.avatar,
      relatedId: webieId,
    });
  },

  notifyReply: (toUserId: string, fromUser: { id: string; name: string; avatar?: string }, webieId: string, replyPreview: string) => {
    if (toUserId === fromUser.id) return;
    return notificationStorage.create({
      userId: toUserId,
      type: 'reply',
      title: 'New Reply',
      message: `${fromUser.name} replied to your comment: "${replyPreview.slice(0, 50)}${replyPreview.length > 50 ? '...' : ''}"`,
      actionUrl: `/webie/${webieId}#comments`,
      fromUserId: fromUser.id,
      fromUserName: fromUser.name,
      fromUserAvatar: fromUser.avatar,
      relatedId: webieId,
    });
  },

  notifyFollow: (toUserId: string, fromUser: { id: string; name: string; avatar?: string }) => {
    if (toUserId === fromUser.id) return;
    return notificationStorage.create({
      userId: toUserId,
      type: 'follow',
      title: 'New Follower',
      message: `${fromUser.name} started following you`,
      actionUrl: `/user/${fromUser.id}`,
      fromUserId: fromUser.id,
      fromUserName: fromUser.name,
      fromUserAvatar: fromUser.avatar,
    });
  },
};
