import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Circle,
  Paperclip,
  Image as ImageIcon,
  File,
  Mic,
  MicOff,
  Smile,
  Reply,
  Trash2,
  Edit3,
  Pin,
  Copy,
  Download,
  X,
  Play,
  Pause,
  Square
} from "lucide-react";
import { userStorage, type User } from "@/lib/storage";
import { chatStorage, VoiceRecorder, type ChatMessage, type Conversation, type MessageAttachment } from "@/lib/chatStorage";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const EMOJI_LIST = ["❤️", "👍", "😂", "😮", "😢", "🙏", "🔥", "👏"];

const ProfileMessages = () => {
  const currentUser = userStorage.getCurrentUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserList, setShowUserList] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [editContent, setEditContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [searchMessagesQuery, setSearchMessagesQuery] = useState("");
  const [showSearchMessages, setShowSearchMessages] = useState(false);
  const [pinnedMessages, setPinnedMessages] = useState<ChatMessage[]>([]);
  const [showPinnedMessages, setShowPinnedMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const voiceRecorderRef = useRef<VoiceRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Audio playback state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState<Record<string, number>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

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
      loadPinnedMessages();
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

  const loadPinnedMessages = () => {
    if (currentUser && selectedUser) {
      const pinned = chatStorage.getPinnedMessages(currentUser.id, selectedUser.id);
      setPinnedMessages(pinned);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!newMessage.trim() || !currentUser || !selectedUser) return;

    chatStorage.sendMessage(
      currentUser.id, 
      selectedUser.id, 
      newMessage.trim(),
      'text',
      undefined,
      replyingTo?.id
    );
    setNewMessage("");
    setReplyingTo(null);
    loadMessages();
    loadConversations();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const file = e.target.files?.[0];
    if (!file || !currentUser || !selectedUser) return;

    // Convert to base64 for storage
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const attachment: MessageAttachment = {
        id: `att-${Date.now()}`,
        type: type,
        url: base64,
        name: file.name,
        size: file.size,
        mimeType: file.type,
      };

      chatStorage.sendMessage(
        currentUser.id,
        selectedUser.id,
        type === 'image' ? '📷 Image' : `📎 ${file.name}`,
        type,
        [attachment]
      );
      loadMessages();
      loadConversations();
      toast.success(`${type === 'image' ? 'Image' : 'File'} sent!`);
    };
    reader.readAsDataURL(file);
    setShowAttachmentMenu(false);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    if (!currentUser) return;
    chatStorage.addReaction(messageId, currentUser.id, emoji);
    loadMessages();
    setShowEmojiPicker(null);
  };

  const handleDeleteMessage = (messageId: string) => {
    chatStorage.deleteMessage(messageId);
    loadMessages();
    toast.success("Message deleted");
  };

  const handleEditMessage = () => {
    if (!editingMessage || !editContent.trim()) return;
    chatStorage.editMessage(editingMessage.id, editContent.trim());
    setEditingMessage(null);
    setEditContent("");
    loadMessages();
    toast.success("Message edited");
  };

  const handlePinMessage = (messageId: string) => {
    chatStorage.togglePinMessage(messageId);
    loadMessages();
    loadPinnedMessages();
    toast.success("Message pin toggled");
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  // Voice recording functions
  const startVoiceRecording = async () => {
    try {
      voiceRecorderRef.current = new VoiceRecorder();
      await voiceRecorderRef.current.start();
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      toast.success("Recording started");
    } catch (error) {
      toast.error("Could not access microphone");
      console.error(error);
    }
  };

  const stopVoiceRecording = async () => {
    if (!voiceRecorderRef.current || !currentUser || !selectedUser) return;
    
    try {
      const { base64, duration } = await voiceRecorderRef.current.stop();
      
      // Clear timer
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      
      const attachment: MessageAttachment = {
        id: `voice-${Date.now()}`,
        type: 'voice',
        url: base64,
        name: 'Voice message',
        size: base64.length,
        mimeType: 'audio/webm',
        duration
      };

      chatStorage.sendMessage(
        currentUser.id,
        selectedUser.id,
        `🎤 Voice message (${formatVoiceDuration(duration)})`,
        'voice',
        [attachment]
      );
      
      setIsRecording(false);
      setRecordingDuration(0);
      loadMessages();
      loadConversations();
      toast.success("Voice message sent!");
    } catch (error) {
      toast.error("Failed to send voice message");
      console.error(error);
    }
  };

  const cancelVoiceRecording = () => {
    if (voiceRecorderRef.current) {
      voiceRecorderRef.current.cancel();
    }
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    setIsRecording(false);
    setRecordingDuration(0);
    toast.info("Recording cancelled");
  };

  const formatVoiceDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleAudioPlayback = (messageId: string, audioUrl: string) => {
    // Stop current audio if playing a different one
    if (playingAudioId && playingAudioId !== messageId) {
      const prevAudio = audioRefs.current[playingAudioId];
      if (prevAudio) {
        prevAudio.pause();
        prevAudio.currentTime = 0;
      }
    }

    let audio = audioRefs.current[messageId];
    
    if (!audio) {
      audio = new Audio(audioUrl);
      audioRefs.current[messageId] = audio;
      
      audio.ontimeupdate = () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        setAudioProgress(prev => ({ ...prev, [messageId]: progress }));
      };
      
      audio.onended = () => {
        setPlayingAudioId(null);
        setAudioProgress(prev => ({ ...prev, [messageId]: 0 }));
      };
    }

    if (playingAudioId === messageId) {
      audio.pause();
      setPlayingAudioId(null);
    } else {
      audio.play();
      setPlayingAudioId(messageId);
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const filteredUsers = allUsers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const searchedMessages = searchMessagesQuery
    ? chatStorage.searchMessages(currentUser?.id || '', selectedUser?.id || '', searchMessagesQuery)
    : [];

  if (!currentUser) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Please login to access messages</p>
      </div>
    );
  }

  const getReplyMessage = (replyToId?: string) => {
    if (!replyToId) return null;
    return chatStorage.getMessageById(replyToId);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => handleFileUpload(e, 'file')}
      />
      <input
        type="file"
        ref={imageInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileUpload(e, 'image')}
      />

      {/* Conversations List */}
      <div className={cn(
        "w-full md:w-80 border-r flex flex-col bg-card",
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
            <div className="p-4 border-b flex items-center justify-between bg-card">
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
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowSearchMessages(!showSearchMessages)}
                >
                  <Search className="w-5 h-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowPinnedMessages(true)}
                >
                  <Pin className="w-5 h-5" />
                </Button>
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

            {/* Search Messages Bar */}
            {showSearchMessages && (
              <div className="p-2 border-b bg-muted/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search in conversation..."
                    value={searchMessagesQuery}
                    onChange={(e) => setSearchMessagesQuery(e.target.value)}
                    className="pl-9 pr-9"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                    onClick={() => {
                      setShowSearchMessages(false);
                      setSearchMessagesQuery("");
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {searchMessagesQuery && (
                  <p className="text-xs text-muted-foreground mt-1 px-2">
                    {searchedMessages.length} result(s) found
                  </p>
                )}
              </div>
            )}

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
                  const replyMessage = getReplyMessage(msg.replyTo);

                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex items-end gap-2 group",
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
                      <div className="max-w-[70%] space-y-1">
                        {/* Reply Preview */}
                        {replyMessage && (
                          <div className={cn(
                            "text-xs px-3 py-1 rounded-lg border-l-2",
                            isOwn ? "bg-primary/10 border-primary" : "bg-muted border-muted-foreground"
                          )}>
                            <p className="font-medium truncate">{replyMessage.content}</p>
                          </div>
                        )}
                        
                        {/* Message Bubble */}
                        <div
                          className={cn(
                            "rounded-2xl px-4 py-2 relative",
                            isOwn
                              ? "bg-primary text-primary-foreground rounded-br-sm"
                              : "bg-muted rounded-bl-sm",
                            msg.isPinned && "ring-2 ring-primary/50"
                          )}
                        >
                          {msg.isPinned && (
                            <Pin className="absolute -top-2 -right-2 w-4 h-4 text-primary" />
                          )}
                          
                          {/* Attachments */}
                          {msg.attachments?.map(att => (
                            <div key={att.id} className="mb-2">
                              {att.type === 'image' ? (
                                <img 
                                  src={att.url} 
                                  alt={att.name}
                                  className="rounded-lg max-w-full max-h-64 object-cover cursor-pointer"
                                  onClick={() => window.open(att.url, '_blank')}
                                />
                              ) : att.type === 'voice' ? (
                                <div className="flex items-center gap-3 p-3 bg-background/10 rounded-lg min-w-[200px]">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-full bg-primary/20 hover:bg-primary/30"
                                    onClick={() => toggleAudioPlayback(msg.id, att.url)}
                                  >
                                    {playingAudioId === msg.id ? (
                                      <Pause className="w-5 h-5" />
                                    ) : (
                                      <Play className="w-5 h-5 ml-0.5" />
                                    )}
                                  </Button>
                                  <div className="flex-1">
                                    <Progress 
                                      value={audioProgress[msg.id] || 0} 
                                      className="h-1.5"
                                    />
                                    <p className="text-xs opacity-70 mt-1">
                                      {att.duration ? formatVoiceDuration(att.duration) : '0:00'}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 p-2 bg-background/10 rounded-lg">
                                  <File className="w-8 h-8" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{att.name}</p>
                                    <p className="text-xs opacity-70">{formatFileSize(att.size)}</p>
                                  </div>
                                  <a href={att.url} download={att.name}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Download className="w-4 h-4" />
                                    </Button>
                                  </a>
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {msg.type === 'text' && (
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          )}
                          
                          <div className={cn(
                            "flex items-center gap-1 mt-1",
                            isOwn ? "justify-end" : "justify-start"
                          )}>
                            <span className="text-[10px] opacity-70">
                              {formatTime(msg.createdAt)}
                            </span>
                            {msg.isEdited && (
                              <span className="text-[10px] opacity-50">edited</span>
                            )}
                            {isOwn && (
                              msg.read ? (
                                <CheckCheck className="w-3 h-3 opacity-70" />
                              ) : (
                                <Check className="w-3 h-3 opacity-70" />
                              )
                            )}
                          </div>

                          {/* Reactions */}
                          {msg.reactions && msg.reactions.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {msg.reactions.map((r, i) => (
                                <span 
                                  key={i} 
                                  className="text-xs bg-background/20 rounded-full px-1.5 py-0.5"
                                >
                                  {r.emoji}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Message Actions */}
                        <div className={cn(
                          "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
                          isOwn && "justify-end"
                        )}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setShowEmojiPicker(msg.id)}
                          >
                            <Smile className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setReplyingTo(msg)}
                          >
                            <Reply className="w-3 h-3" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreVertical className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align={isOwn ? "end" : "start"}>
                              <DropdownMenuItem onClick={() => handleCopyMessage(msg.content)}>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePinMessage(msg.id)}>
                                <Pin className="w-4 h-4 mr-2" />
                                {msg.isPinned ? 'Unpin' : 'Pin'}
                              </DropdownMenuItem>
                              {isOwn && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => {
                                    setEditingMessage(msg);
                                    setEditContent(msg.content);
                                  }}>
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => handleDeleteMessage(msg.id)}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Emoji Picker */}
                        {showEmojiPicker === msg.id && (
                          <div className="flex gap-1 p-2 bg-card rounded-lg shadow-lg border">
                            {EMOJI_LIST.map(emoji => (
                              <button
                                key={emoji}
                                className="text-lg hover:scale-125 transition-transform"
                                onClick={() => handleReaction(msg.id, emoji)}
                              >
                                {emoji}
                              </button>
                            ))}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => setShowEmojiPicker(null)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Reply Preview */}
            {replyingTo && (
              <div className="px-4 py-2 border-t bg-muted/50 flex items-center gap-2">
                <Reply className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Replying to</p>
                  <p className="text-sm truncate">{replyingTo.content}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setReplyingTo(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Message Input */}
            <div className="p-4 border-t bg-card">
              {isRecording ? (
                <div className="flex items-center gap-3 bg-destructive/10 rounded-lg p-3">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Recording...</span>
                    <span className="text-sm text-muted-foreground">
                      {formatVoiceDuration(recordingDuration)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={cancelVoiceRecording}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="default"
                    size="icon"
                    onClick={stopVoiceRecording}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <DropdownMenu open={showAttachmentMenu} onOpenChange={setShowAttachmentMenu}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Paperclip className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => imageInputRef.current?.click()}>
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Image
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                        <File className="w-4 h-4 mr-2" />
                        File
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  
                  {newMessage.trim() ? (
                    <Button 
                      onClick={handleSend}
                      size="icon"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={startVoiceRecording}
                      className="hover:bg-primary/10"
                    >
                      <Mic className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-muted/20">
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

      {/* Edit Message Dialog */}
      <Dialog open={!!editingMessage} onOpenChange={() => setEditingMessage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Message</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={4}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingMessage(null)}>Cancel</Button>
            <Button onClick={handleEditMessage}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pinned Messages Dialog */}
      <Dialog open={showPinnedMessages} onOpenChange={setShowPinnedMessages}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pin className="w-5 h-5" />
              Pinned Messages
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[400px]">
            {pinnedMessages.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No pinned messages</p>
            ) : (
              <div className="space-y-3">
                {pinnedMessages.map(msg => (
                  <div key={msg.id} className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatTime(msg.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileMessages;
