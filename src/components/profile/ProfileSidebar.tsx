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
  no: string;
  title: string;
  url: string;
  icon: typeof Home;
  end?: boolean;
  hasBadge?: boolean;
  italic?: boolean;
};

const navItems: NavItem[] = [
  { no: "01", title: "Feed", url: "/profile", icon: Home, end: true, italic: true },
  { no: "02", title: "Explore", url: "/profile/explore", icon: Compass },
  { no: "03", title: "Messages", url: "/profile/messages", icon: MessageCircle, hasBadge: true },
  { no: "04", title: "Business", url: "/profile/business", icon: Briefcase, italic: true },
  { no: "05", title: "Profile", url: "/profile/details", icon: User },
  { no: "06", title: "Settings", url: "/profile/settings", icon: Settings },
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
      className="border-r border-foreground/10 bg-background"
    >
      {/* Brand */}
      <div
        className={cn(
          "flex items-center justify-between px-5 pt-6 pb-4",
          isCollapsed && "px-2 justify-center",
        )}
      >
        <button
          onClick={() => navigate("/")}
          className={cn(
            "group flex items-center gap-2 text-left",
            isCollapsed && "flex-col gap-1",
          )}
        >
          <span className="font-mono-accent text-[10px] uppercase tracking-[0.3em] text-foreground/50">
            Webie
          </span>
          {!isCollapsed && (
            <span className="font-mono-accent text-[10px] uppercase tracking-[0.3em] text-foreground/30">
              · Vol. 01
            </span>
          )}
        </button>
        {!isCollapsed && (
          <div className="flex items-center gap-1">
            <NotificationDropdown />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 rounded-full"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {isCollapsed && (
        <div className="flex flex-col items-center gap-1 px-2 pb-2">
          <NotificationDropdown />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 rounded-full"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Headline */}
      {!isCollapsed && (
        <div className="px-5 pb-6 border-b border-foreground/10">
          <h2 className="font-display text-3xl font-light leading-[1.05] tracking-tight">
            Your <span className="italic">workspace</span>.
          </h2>
          <p className="mt-2 text-xs text-foreground/55 leading-relaxed">
            Six chapters. One quiet place to make things.
          </p>
        </div>
      )}

      <SidebarContent className="px-3 py-5 gap-0">
        {!isCollapsed && (
          <div className="flex items-center gap-2 px-2 mb-3">
            <span className="w-6 h-px bg-foreground/40" />
            <span className="font-mono-accent text-[10px] uppercase tracking-[0.25em] text-foreground/45">
              Index
            </span>
          </div>
        )}

        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const link = (
              <NavLink
                to={item.url}
                end={item.end}
                className={cn(
                  "group/link relative flex items-center gap-3 rounded-full px-3 py-2.5 text-sm transition-all text-foreground/65 hover:text-foreground hover:bg-foreground/[0.04]",
                  isCollapsed && "justify-center px-2",
                )}
                activeClassName="!text-foreground bg-foreground/[0.06] font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-[3px] before:rounded-r-full before:bg-foreground"
              >
                {!isCollapsed && (
                  <span className="font-mono-accent text-[10px] tracking-[0.2em] text-foreground/40 w-7 shrink-0">
                    №{item.no}
                  </span>
                )}
                <div className="relative">
                  <item.icon className="h-[17px] w-[17px] shrink-0" />
                  {item.hasBadge && unreadCount > 0 && (
                    <Badge className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center p-0 text-[10px] rounded-full bg-foreground text-background border-0">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                </div>
                {!isCollapsed && (
                  <span
                    className={cn(
                      "truncate text-[15px]",
                      item.italic && "font-display italic font-light text-[17px]",
                    )}
                  >
                    {item.title}
                  </span>
                )}
              </NavLink>
            );
            return isCollapsed ? (
              <Tooltip key={item.title} delayDuration={0}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">
                  №{item.no} · {item.title}
                </TooltipContent>
              </Tooltip>
            ) : (
              <div key={item.title}>{link}</div>
            );
          })}
        </nav>
      </SidebarContent>

      {/* User card */}
      {!isCollapsed && user && (
        <div className="mx-3 mb-3 rounded-2xl border border-foreground/10 p-3 bg-muted/40">
          <div className="flex items-center gap-3">
            <img
              src={
                user.avatar ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
              }
              alt={user.name}
              className="h-10 w-10 rounded-full object-cover ring-1 ring-foreground/10"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {user.name}
              </p>
              <p className="truncate font-mono-accent text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                Member · Signed in
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-foreground/10 p-3">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-foreground/60 hover:bg-destructive/10 hover:text-destructive rounded-full",
            isCollapsed && "justify-center px-0",
          )}
          onClick={logout}
        >
          <LogOut className="h-[17px] w-[17px] shrink-0" />
          {!isCollapsed && <span className="text-sm">Sign out</span>}
        </Button>
      </div>
    </Sidebar>
  );
}
