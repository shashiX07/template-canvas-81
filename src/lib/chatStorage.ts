// Chat System Storage - Enhanced with file sharing, reactions, and more

export type MessageType = 'text' | 'image' | 'file' | 'voice' | 'gif';

export interface MessageAttachment {
  id: string;
  type: 'image' | 'file' | 'voice';
  url: string;
  name: string;
  size: number;
  mimeType?: string;
  duration?: number; // For voice messages
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: MessageType;
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
  replyTo?: string; // Message ID being replied to
  isEdited?: boolean;
  editedAt?: string;
  isDeleted?: boolean;
  isPinned?: boolean;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: ChatMessage;
  updatedAt: string;
  pinnedMessages?: string[];
  isArchived?: boolean;
  isMuted?: boolean;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  isTyping: boolean;
  timestamp: string;
}

const MESSAGES_KEY = 'chatMessages';
const CONVERSATIONS_KEY = 'chatConversations';
const TYPING_KEY = 'typingIndicators';

export const chatStorage = {
  // Messages
  getAllMessages: (): ChatMessage[] => {
    try {
      const item = localStorage.getItem(MESSAGES_KEY);
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  },

  getConversationMessages: (userId1: string, userId2: string): ChatMessage[] => {
    const messages = chatStorage.getAllMessages();
    return messages
      .filter(m => 
        !m.isDeleted &&
        ((m.senderId === userId1 && m.receiverId === userId2) ||
        (m.senderId === userId2 && m.receiverId === userId1))
      )
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  sendMessage: (
    senderId: string, 
    receiverId: string, 
    content: string,
    type: MessageType = 'text',
    attachments?: MessageAttachment[],
    replyTo?: string
  ): ChatMessage => {
    const messages = chatStorage.getAllMessages();
    
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      senderId,
      receiverId,
      content,
      type,
      attachments,
      replyTo,
      reactions: [],
      createdAt: new Date().toISOString(),
      read: false,
    };

    messages.push(newMessage);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));

    // Update or create conversation
    chatStorage.updateConversation(senderId, receiverId, newMessage);

    return newMessage;
  },

  editMessage: (messageId: string, newContent: string): void => {
    const messages = chatStorage.getAllMessages();
    const index = messages.findIndex(m => m.id === messageId);
    if (index >= 0) {
      messages[index].content = newContent;
      messages[index].isEdited = true;
      messages[index].editedAt = new Date().toISOString();
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    }
  },

  deleteMessage: (messageId: string): void => {
    const messages = chatStorage.getAllMessages();
    const index = messages.findIndex(m => m.id === messageId);
    if (index >= 0) {
      messages[index].isDeleted = true;
      messages[index].content = 'This message was deleted';
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    }
  },

  addReaction: (messageId: string, userId: string, emoji: string): void => {
    const messages = chatStorage.getAllMessages();
    const index = messages.findIndex(m => m.id === messageId);
    if (index >= 0) {
      if (!messages[index].reactions) {
        messages[index].reactions = [];
      }
      // Remove existing reaction from same user
      messages[index].reactions = messages[index].reactions!.filter(r => r.userId !== userId);
      // Add new reaction
      messages[index].reactions!.push({
        emoji,
        userId,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    }
  },

  removeReaction: (messageId: string, userId: string): void => {
    const messages = chatStorage.getAllMessages();
    const index = messages.findIndex(m => m.id === messageId);
    if (index >= 0 && messages[index].reactions) {
      messages[index].reactions = messages[index].reactions!.filter(r => r.userId !== userId);
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    }
  },

  togglePinMessage: (messageId: string): void => {
    const messages = chatStorage.getAllMessages();
    const index = messages.findIndex(m => m.id === messageId);
    if (index >= 0) {
      messages[index].isPinned = !messages[index].isPinned;
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    }
  },

  getPinnedMessages: (userId1: string, userId2: string): ChatMessage[] => {
    return chatStorage.getConversationMessages(userId1, userId2).filter(m => m.isPinned);
  },

  searchMessages: (userId1: string, userId2: string, query: string): ChatMessage[] => {
    return chatStorage.getConversationMessages(userId1, userId2)
      .filter(m => m.content.toLowerCase().includes(query.toLowerCase()));
  },

  markAsRead: (userId: string, otherUserId: string): void => {
    const messages = chatStorage.getAllMessages();
    const updated = messages.map(m => {
      if (m.senderId === otherUserId && m.receiverId === userId && !m.read) {
        return { ...m, read: true };
      }
      return m;
    });
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
  },

  getUnreadCount: (userId: string): number => {
    const messages = chatStorage.getAllMessages();
    return messages.filter(m => m.receiverId === userId && !m.read && !m.isDeleted).length;
  },

  getUnreadCountFromUser: (userId: string, fromUserId: string): number => {
    const messages = chatStorage.getAllMessages();
    return messages.filter(m => m.receiverId === userId && m.senderId === fromUserId && !m.read && !m.isDeleted).length;
  },

  getMessageById: (messageId: string): ChatMessage | null => {
    const messages = chatStorage.getAllMessages();
    return messages.find(m => m.id === messageId) || null;
  },

  // Conversations
  getAllConversations: (): Conversation[] => {
    try {
      const item = localStorage.getItem(CONVERSATIONS_KEY);
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  },

  getUserConversations: (userId: string): Conversation[] => {
    const conversations = chatStorage.getAllConversations();
    return conversations
      .filter(c => c.participants.includes(userId) && !c.isArchived)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  getConversation: (userId1: string, userId2: string): Conversation | null => {
    const conversations = chatStorage.getAllConversations();
    return conversations.find(c => 
      c.participants.includes(userId1) && c.participants.includes(userId2)
    ) || null;
  },

  updateConversation: (userId1: string, userId2: string, lastMessage: ChatMessage): void => {
    const conversations = chatStorage.getAllConversations();
    const existingIndex = conversations.findIndex(c =>
      c.participants.includes(userId1) && c.participants.includes(userId2)
    );

    if (existingIndex >= 0) {
      conversations[existingIndex].lastMessage = lastMessage;
      conversations[existingIndex].updatedAt = new Date().toISOString();
    } else {
      conversations.push({
        id: `conv-${Date.now()}`,
        participants: [userId1, userId2],
        lastMessage,
        updatedAt: new Date().toISOString(),
      });
    }

    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  },

  startConversation: (userId1: string, userId2: string): Conversation => {
    const existing = chatStorage.getConversation(userId1, userId2);
    if (existing) return existing;

    const conversations = chatStorage.getAllConversations();
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      participants: [userId1, userId2],
      updatedAt: new Date().toISOString(),
    };

    conversations.push(newConversation);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));

    return newConversation;
  },

  archiveConversation: (conversationId: string): void => {
    const conversations = chatStorage.getAllConversations();
    const index = conversations.findIndex(c => c.id === conversationId);
    if (index >= 0) {
      conversations[index].isArchived = true;
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    }
  },

  muteConversation: (conversationId: string, muted: boolean): void => {
    const conversations = chatStorage.getAllConversations();
    const index = conversations.findIndex(c => c.id === conversationId);
    if (index >= 0) {
      conversations[index].isMuted = muted;
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    }
  },

  deleteConversation: (conversationId: string): void => {
    const conversations = chatStorage.getAllConversations();
    const filtered = conversations.filter(c => c.id !== conversationId);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(filtered));
  },

  // Typing indicators
  setTyping: (conversationId: string, userId: string, isTyping: boolean): void => {
    try {
      const indicators: TypingIndicator[] = JSON.parse(localStorage.getItem(TYPING_KEY) || '[]');
      const index = indicators.findIndex(i => i.conversationId === conversationId && i.userId === userId);
      
      if (index >= 0) {
        indicators[index].isTyping = isTyping;
        indicators[index].timestamp = new Date().toISOString();
      } else if (isTyping) {
        indicators.push({
          conversationId,
          userId,
          isTyping,
          timestamp: new Date().toISOString(),
        });
      }
      
      localStorage.setItem(TYPING_KEY, JSON.stringify(indicators));
    } catch {}
  },

  isTyping: (conversationId: string, userId: string): boolean => {
    try {
      const indicators: TypingIndicator[] = JSON.parse(localStorage.getItem(TYPING_KEY) || '[]');
      const indicator = indicators.find(i => i.conversationId === conversationId && i.userId === userId);
      if (indicator && indicator.isTyping) {
        // Check if typing indicator is stale (older than 5 seconds)
        const age = Date.now() - new Date(indicator.timestamp).getTime();
        return age < 5000;
      }
      return false;
    } catch {
      return false;
    }
  },
};
