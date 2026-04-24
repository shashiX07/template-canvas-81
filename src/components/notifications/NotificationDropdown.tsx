import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Bell, 
  Heart, 
  MessageCircle, 
  Reply, 
  UserPlus, 
  Check,
  CheckCheck,
  Trash2,
  X
} from "lucide-react";
import { notificationStorage, type Notification } from "@/lib/notificationStorage";
import { userStorage } from "@/lib/storage";
import { cn } from "@/lib/utils";

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'like':
      return <Heart className="w-4 h-4 text-pink-500" />;
    case 'comment':
      return <MessageCircle className="w-4 h-4 text-blue-500" />;
    case 'reply':
      return <Reply className="w-4 h-4 text-purple-500" />;
    case 'follow':
      return <UserPlus className="w-4 h-4 text-green-500" />;
    default:
      return <Bell className="w-4 h-4 text-muted-foreground" />;
  }
};

const getNotificationBg = (type: Notification['type']) => {
  switch (type) {
    case 'like':
      return 'bg-pink-500/10';
    case 'comment':
      return 'bg-blue-500/10';
    case 'reply':
      return 'bg-purple-500/10';
    case 'follow':
      return 'bg-green-500/10';
    default:
      return 'bg-muted';
  }
};

export function NotificationDropdown() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = userStorage.getCurrentUser();

  const loadNotifications = () => {
    if (currentUser) {
      setNotifications(notificationStorage.getByUserId(currentUser.id));
    }
  };

  useEffect(() => {
    loadNotifications();
    // Poll for new notifications every 10 seconds
    const interval = setInterval(loadNotifications, 10000);
    return () => clearInterval(interval);
  }, [currentUser?.id]);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notification: Notification) => {
    notificationStorage.markAsRead(notification.id);
    loadNotifications();
    setIsOpen(false);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const handleMarkAllRead = () => {
    if (currentUser) {
      notificationStorage.markAllAsRead(currentUser.id);
      loadNotifications();
    }
  };

  const handleDeleteNotification = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    notificationStorage.delete(notificationId);
    loadNotifications();
  };

  const handleClearAll = () => {
    if (currentUser) {
      notificationStorage.deleteAll(currentUser.id);
      loadNotifications();
    }
  };

  const timeAgo = (date: string): string => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return Math.floor(seconds / 60) + "m";
    if (seconds < 86400) return Math.floor(seconds / 3600) + "h";
    if (seconds < 604800) return Math.floor(seconds / 86400) + "d";
    return new Date(date).toLocaleDateString();
  };

  if (!currentUser) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10">
          <Bell className="h-5 w-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-0.5 -right-0.5"
              >
                <Badge 
                  className="h-5 min-w-5 flex items-center justify-center p-0 text-[10px] bg-primary text-primary-foreground border-0"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end" sideOffset={8}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleMarkAllRead}
                className="h-8 text-xs gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <h4 className="font-medium mb-1">No notifications yet</h4>
              <p className="text-sm text-muted-foreground">
                We'll notify you when something happens
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={cn(
                    "flex items-start gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors group relative",
                    !notification.isRead && "bg-primary/5"
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={notification.fromUserAvatar} />
                      <AvatarFallback className={getNotificationBg(notification.type)}>
                        {notification.fromUserName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute -bottom-1 -right-1 p-1 rounded-full",
                      getNotificationBg(notification.type)
                    )}>
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm leading-snug",
                      !notification.isRead && "font-medium"
                    )}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {timeAgo(notification.createdAt)}
                    </p>
                  </div>

                  {!notification.isRead && (
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
                    onClick={(e) => handleDeleteNotification(e, notification.id)}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-3 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearAll}
              className="w-full text-xs text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Clear all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
