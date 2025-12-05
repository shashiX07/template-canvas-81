// Chat System Storage

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: ChatMessage;
  updatedAt: string;
}

const MESSAGES_KEY = 'chatMessages';
const CONVERSATIONS_KEY = 'chatConversations';

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
        (m.senderId === userId1 && m.receiverId === userId2) ||
        (m.senderId === userId2 && m.receiverId === userId1)
      )
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  sendMessage: (senderId: string, receiverId: string, content: string): ChatMessage => {
    const messages = chatStorage.getAllMessages();
    
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId,
      receiverId,
      content,
      createdAt: new Date().toISOString(),
      read: false,
    };

    messages.push(newMessage);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));

    // Update or create conversation
    chatStorage.updateConversation(senderId, receiverId, newMessage);

    return newMessage;
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
    return messages.filter(m => m.receiverId === userId && !m.read).length;
  },

  getUnreadCountFromUser: (userId: string, fromUserId: string): number => {
    const messages = chatStorage.getAllMessages();
    return messages.filter(m => m.receiverId === userId && m.senderId === fromUserId && !m.read).length;
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
      .filter(c => c.participants.includes(userId))
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

  deleteConversation: (conversationId: string): void => {
    const conversations = chatStorage.getAllConversations();
    const filtered = conversations.filter(c => c.id !== conversationId);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(filtered));
  },
};
