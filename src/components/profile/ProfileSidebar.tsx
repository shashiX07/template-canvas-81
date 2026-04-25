import {
  Home,
  Compass,
  User,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  MessageCircle,
  Briefcase,
  ChevronsUpDown,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
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

type NavItem = {
  title: string;
  url: string;
  icon: typeof Home;
  end?: boolean;
  hasBadge?: boolean;
};

type NavSection = { label: string; items: NavItem[] };

const sections: NavSection[] = [
  {
    label: "Workspace",
    items: [
      { title: "Feed", url: "/profile", icon: Home, end: true },
      { title: "Explore", url: "/profile/explore", icon: Compass },
      { title: "Messages", url: "/profile/messages", icon: MessageCircle, hasBadge: true },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Business", url: "/profile/business", icon: Briefcase },
      { title: "Profile", url: "/profile/details", icon: User },
      { title: "Settings", url: "/profile/settings", icon: Settings },
    ],
  },
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
      if (currentUser) setUnreadCount(chatStorage.getUnreadCount(currentUser.id));
    };
    checkUnread();
    const interval = setInterval(checkUnread, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/60 bg-sidebar"
    >
      {/* Brand */}
      <div
        className={cn(
          "flex items-center justify-between gap-2 px-4 h-14 border-b border-border/60",
          isCollapsed && "px-2 justify-center",
        )}
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 min-w-0"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-sm shrink-0">
            W
          </div>
          {!isCollapsed && (
            <div className="flex flex-col items-start min-w-0">
              <span className="text-sm font-semibold tracking-tight leading-none truncate">
                Webie
              </span>
              <span className="text-[11px] text-muted-foreground leading-none mt-1 truncate">
                Workspace
              </span>
            </div>
          )}
        </button>
        {!isCollapsed && (
          <div className="flex items-center gap-0.5">
            <NotificationDropdown />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {isCollapsed && (
        <div className="flex flex-col items-center gap-1 px-2 py-2 border-b border-border/60">
          <NotificationDropdown />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        </div>
      )}

      <SidebarContent className="px-2 py-3 gap-4">
        {sections.map((section) => (
          <div key={section.label} className="flex flex-col gap-0.5">
            {!isCollapsed && (
              <div className="px-2 pb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                {section.label}
              </div>
            )}
            <nav className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const link = (
                  <NavLink
                    to={item.url}
                    end={item.end}
                    className={cn(
                      "group/link relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/60",
                      isCollapsed && "justify-center px-0 mx-1",
                    )}
                    activeClassName="!text-foreground bg-accent font-medium"
                  >
                    <div className="relative flex items-center justify-center">
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      {item.hasBadge && unreadCount > 0 && (
                        <Badge className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center p-0 px-1 text-[10px] rounded-full bg-primary text-primary-foreground border-0">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                      )}
                    </div>
                    {!isCollapsed && (
                      <span className="truncate">{item.title}</span>
                    )}
                  </NavLink>
                );
                return isCollapsed ? (
                  <Tooltip key={item.title} delayDuration={0}>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  </Tooltip>
                ) : (
                  <div key={item.title}>{link}</div>
                );
              })}
            </nav>
          </div>
        ))}
      </SidebarContent>

      {/* User card */}
      {user && (
        <div className={cn("p-2 border-t border-border/60", isCollapsed && "px-1")}>
          <div
            className={cn(
              "flex items-center gap-2.5 rounded-md p-2 hover:bg-accent/60 transition-colors cursor-pointer",
              isCollapsed && "justify-center p-1",
            )}
          >
            <img
              src={
                user.avatar ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
              }
              alt={user.name}
              className="h-8 w-8 rounded-md object-cover ring-1 ring-border shrink-0"
            />
            {!isCollapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground leading-tight">
                    {user.name}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground leading-tight mt-0.5">
                    {user.email || "Member"}
                  </p>
                </div>
                <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              </>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start gap-2.5 mt-1 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10",
              isCollapsed && "justify-center px-0",
            )}
            onClick={logout}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span className="text-sm">Sign out</span>}
          </Button>
        </div>
      )}
    </Sidebar>
  );
}
