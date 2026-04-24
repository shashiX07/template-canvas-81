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
  ShieldCheck,
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

const mainMenuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, end: true },
  { title: "Freelancers", url: "/admin/freelancers", icon: Users },
  { title: "Templates", url: "/admin/templates", icon: FileText },
  { title: "Custom Elements", url: "/admin/elements", icon: Sparkles },
  { title: "Activity Log", url: "/admin/activity", icon: Activity },
];

const managementItems = [
  { title: "Upload Template", url: "/admin/upload", icon: Upload },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isCollapsed = state === "collapsed";

  const renderMenu = (items: typeof mainMenuItems) =>
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
          <item.icon className="h-[18px] w-[18px] shrink-0" />
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
            <ShieldCheck className="h-[18px] w-[18px]" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col items-start leading-tight">
              <span className="text-sm font-semibold">Admin Panel</span>
              <span className="text-[10px] text-sidebar-foreground/60">Control Center</span>
            </div>
          )}
        </button>
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 shrink-0"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isCollapsed && (
        <div className="flex justify-center px-2 pt-2">
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
              <Badge variant="outline" className="mt-0.5 h-4 border-sidebar-primary/30 px-1.5 text-[10px] font-medium text-sidebar-primary">
                Administrator
              </Badge>
            </div>
          </div>
        </div>
      )}

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              Overview
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">{renderMenu(mainMenuItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          {!isCollapsed && (
            <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              Management
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">{renderMenu(managementItems)}</SidebarMenu>
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
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </Button>
      </div>
    </Sidebar>
  );
}
