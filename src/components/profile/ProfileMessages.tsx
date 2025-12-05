import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Search, 
  Send, 
  ArrowLeft, 
  MoreVertical, 
  Phone, 
  Video, 
  Info,
  Check,
  CheckCheck,
  Circle
} from "lucide-react";
import { userStorage, type User } from "@/lib/storage";
import { chatStorage, type ChatMessage, type Conversation } from "@/lib/chatStorage";
import { cn } from "@/lib/utils";

const ProfileMessages = () => {
  const currentUser = userStorage.getCurrentUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserList, setShowUserList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser) {
      loadConversations();
      loadUsers();
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedUser && currentUser) {
      loadMessages();
      chatStorage.markAsRead(currentUser.id, selectedUser.id);
    }
  }, [selectedUser, currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = () => {
    if (currentUser) {
      const convs = chatStorage.getUserConversations(currentUser.id);
      setConversations(convs);
    }
  };

  const loadUsers = () => {
    const users = userStorage.getAll().filter(u => u.id !== currentUser?.id);
    setAllUsers(users);
  };

  const loadMessages = () => {
    if (currentUser && selectedUser) {
      const msgs = chatStorage.getConversationMessages(currentUser.id, selectedUser.id);
      setMessages(msgs);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!newMessage.trim() || !currentUser || !selectedUser) return;

    chatStorage.sendMessage(currentUser.id, selectedUser.id, newMessage.trim());
    setNewMessage("");
    loadMessages();
    loadConversations();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startNewChat = (user: User) => {
    if (currentUser) {
      chatStorage.startConversation(currentUser.id, user.id);
      setSelectedUser(user);
      setShowUserList(false);
      loadConversations();
    }
  };

  const getOtherUser = (conversation: Conversation): User | null => {
    if (!currentUser) return null;
    const otherId = conversation.participants.find(id => id !== currentUser.id);
    return otherId ? userStorage.getById(otherId) : null;
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const filteredUsers = allUsers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!currentUser) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Please login to access messages</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Conversations List */}
      <div className={cn(
        "w-full md:w-80 border-r flex flex-col",
        selectedUser && "hidden md:flex"
      )}>
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Messages</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowUserList(!showUserList)}
            >
              {showUserList ? "Cancel" : "New"}
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Conversations or User List */}
        <ScrollArea className="flex-1">
          {showUserList ? (
            <div className="p-2">
              <p className="text-xs text-muted-foreground px-2 py-2">Start a new conversation</p>
              {filteredUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => startNewChat(user)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </button>
              ))}
              {filteredUsers.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No users found</p>
              )}
            </div>
          ) : (
            <div className="p-2">
              {conversations.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-2">No conversations yet</p>
                  <Button variant="outline" size="sm" onClick={() => setShowUserList(true)}>
                    Start a conversation
                  </Button>
                </div>
              ) : (
                conversations.map(conv => {
                  const otherUser = getOtherUser(conv);
                  if (!otherUser) return null;

                  const unreadCount = chatStorage.getUnreadCountFromUser(currentUser.id, otherUser.id);

                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedUser(otherUser)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg transition-colors",
                        selectedUser?.id === otherUser.id ? "bg-muted" : "hover:bg-muted/50"
                      )}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={otherUser.avatar} />
                          <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Circle className="absolute bottom-0 right-0 w-3 h-3 fill-green-500 text-green-500" />
                      </div>
                      <div className="flex-1 text-left overflow-hidden">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{otherUser.name}</p>
                          {conv.lastMessage && (
                            <span className="text-xs text-muted-foreground">
                              {formatTime(conv.lastMessage.createdAt)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                            {conv.lastMessage?.senderId === currentUser.id && "You: "}
                            {conv.lastMessage?.content || "Start chatting"}
                          </p>
                          {unreadCount > 0 && (
                            <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                              {unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className={cn(
        "flex-1 flex flex-col",
        !selectedUser && "hidden md:flex"
      )}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setSelectedUser(null)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <Avatar>
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedUser.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Info className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                      <AvatarImage src={selectedUser.avatar} />
                      <AvatarFallback className="text-2xl">{selectedUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold">{selectedUser.name}</p>
                    <p className="text-sm text-muted-foreground">Send a message to start the conversation</p>
                  </div>
                )}

                {messages.map((msg, index) => {
                  const isOwn = msg.senderId === currentUser.id;
                  const showAvatar = index === 0 || messages[index - 1]?.senderId !== msg.senderId;

                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex items-end gap-2",
                        isOwn && "flex-row-reverse"
                      )}
                    >
                      {showAvatar && !isOwn ? (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={selectedUser.avatar} />
                          <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-8" />
                      )}
                      <div
                        className={cn(
                          "max-w-[70%] rounded-2xl px-4 py-2",
                          isOwn
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-muted rounded-bl-sm"
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <div className={cn(
                          "flex items-center gap-1 mt-1",
                          isOwn ? "justify-end" : "justify-start"
                        )}>
                          <span className="text-[10px] opacity-70">
                            {formatTime(msg.createdAt)}
                          </span>
                          {isOwn && (
                            msg.read ? (
                              <CheckCheck className="w-3 h-3 opacity-70" />
                            ) : (
                              <Check className="w-3 h-3 opacity-70" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Send className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
              <p className="text-muted-foreground mb-4">
                Send private messages to other users
              </p>
              <Button onClick={() => setShowUserList(true)}>
                Start a Conversation
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileMessages;
