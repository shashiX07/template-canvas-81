import {
  LayoutDashboard,
  Users,
  FileText,
  Activity,
  Settings,
  LogOut,
  Sparkles,
  Upload,
  PanelLeftClose,
  PanelLeft,
  ChevronsUpDown,
  ShieldCheck,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

type NavItem = {
  title: string;
  url: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
};

type NavSection = { label: string; items: NavItem[] };

const sections: NavSection[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/admin", icon: LayoutDashboard, end: true },
      { title: "Activity", url: "/admin/activity", icon: Activity },
    ],
  },
  {
    label: "Manage",
    items: [
      { title: "Freelancers", url: "/admin/freelancers", icon: Users },
      { title: "Templates", url: "/admin/templates", icon: FileText },
      { title: "Elements", url: "/admin/elements", icon: Sparkles },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Upload", url: "/admin/upload", icon: Upload },
      { title: "Settings", url: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60 bg-sidebar">
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
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background shrink-0">
            <ShieldCheck className="h-4 w-4" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col items-start min-w-0">
              <span className="text-sm font-semibold tracking-tight leading-none truncate">
                Webie
              </span>
              <span className="text-[11px] text-muted-foreground leading-none mt-1 truncate">
                Admin Console
              </span>
            </div>
          )}
        </button>
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isCollapsed && (
        <div className="flex justify-center px-2 py-2 border-b border-border/60">
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
                      "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/60",
                      isCollapsed && "justify-center px-0 mx-1",
                    )}
                    activeClassName="!text-foreground bg-accent font-medium"
                  >
                    <item.icon className="h-[18px] w-[18px] shrink-0" />
                    {!isCollapsed && <span className="truncate">{item.title}</span>}
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

      {/* User card + footer */}
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
                    {user.isSuperAdmin ? "Super admin" : "Administrator"}
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
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span className="text-sm">Sign out</span>}
          </Button>
        </div>
      )}
    </Sidebar>
  );
}
