import {
  Home,
  Compass,
  User,
  Settings,
  LogOut,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
  MessageCircle,
  Briefcase,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { userStorage } from "@/lib/storage";
import { chatStorage } from "@/lib/chatStorage";
import { useState, useEffect } from "react";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";

const discoverItems = [
  { title: "Home", url: "/profile", icon: Home, end: true },
  { title: "Explore", url: "/profile/explore", icon: Compass },
];

const personalItems = [
  { title: "Messages", url: "/profile/messages", icon: MessageCircle, hasBadge: true },
  { title: "Business", url: "/profile/business", icon: Briefcase },
  { title: "Profile", url: "/profile/details", icon: User },
  { title: "Settings", url: "/profile/settings", icon: Settings },
];

export function ProfileSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isCollapsed = state === "collapsed";
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const checkUnread = () => {
      const currentUser = userStorage.getCurrentUser();
      if (currentUser) {
        const count = chatStorage.getUnreadCount(currentUser.id);
        setUnreadCount(count);
      }
    };

    checkUnread();
    const interval = setInterval(checkUnread, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderMenu = (
    items: Array<{ title: string; url: string; icon: typeof Home; end?: boolean; hasBadge?: boolean }>
  ) =>
    items.map((item) => {
      const link = (
        <NavLink
          to={item.url}
          end={item.end}
          className={cn(
            "group/link relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isCollapsed && "justify-center px-2"
          )}
          activeClassName="bg-sidebar-accent text-sidebar-primary font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:rounded-r-full before:bg-sidebar-primary"
        >
          <div className="relative">
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            {item.hasBadge && unreadCount > 0 && (
              <Badge className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center p-0 text-[10px]">
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </div>
          {!isCollapsed && <span className="truncate">{item.title}</span>}
        </NavLink>
      );
      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild className="h-10 p-0 hover:bg-transparent active:bg-transparent">
            {isCollapsed ? (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.title}</TooltipContent>
              </Tooltip>
            ) : (
              link
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-3">
        <button
          onClick={() => navigate("/")}
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-sidebar-accent",
            isCollapsed && "w-full justify-center px-0"
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
            <Sparkles className="h-[18px] w-[18px]" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col items-start leading-tight">
              <span className="text-sm font-semibold">Webie</span>
              <span className="text-[10px] text-sidebar-foreground/60">Your Workspace</span>
            </div>
          )}
        </button>
        {!isCollapsed && (
          <div className="flex items-center gap-1">
            <NotificationDropdown />
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8 shrink-0">
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {isCollapsed && (
        <div className="flex flex-col items-center gap-1 px-2 pt-2">
          <NotificationDropdown />
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8">
            <PanelLeft className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* User Info */}
      {!isCollapsed && user && (
        <div className="mx-3 mt-3 rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"}
              alt={user.name}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-sidebar-primary/20"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-foreground">{user.name}</p>
              <p className="truncate text-[11px] text-sidebar-foreground/60">Member</p>
            </div>
          </div>
        </div>
      )}

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              Discover
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">{renderMenu(discoverItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          {!isCollapsed && (
            <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              Personal
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">{renderMenu(personalItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <div className="mt-auto border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive",
            isCollapsed && "justify-center px-0"
          )}
          onClick={logout}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </Button>
      </div>
    </Sidebar>
  );
}
