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
  no: string;
  title: string;
  url: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
  italic?: boolean;
};

const navItems: NavItem[] = [
  { no: "01", title: "Overview", url: "/admin", icon: LayoutDashboard, end: true, italic: true },
  { no: "02", title: "Freelancers", url: "/admin/freelancers", icon: Users },
  { no: "03", title: "Templates", url: "/admin/templates", icon: FileText },
  { no: "04", title: "Elements", url: "/admin/elements", icon: Sparkles, italic: true },
  { no: "05", title: "Activity", url: "/admin/activity", icon: Activity },
  { no: "06", title: "Upload", url: "/admin/upload", icon: Upload },
  { no: "07", title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-foreground/10 bg-background">
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
              · Admin desk
            </span>
          )}
        </button>
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 rounded-full"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isCollapsed && (
        <div className="flex justify-center px-2 pb-2">
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
            The <span className="italic">control</span> room.
          </h2>
          <p className="mt-2 text-xs text-foreground/55 leading-relaxed">
            Seven chapters. The whole studio at a glance.
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
                <item.icon className="h-[17px] w-[17px] shrink-0" />
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
                {user.isSuperAdmin ? "Super admin · On duty" : "Admin · On duty"}
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
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          <LogOut className="h-[17px] w-[17px] shrink-0" />
          {!isCollapsed && <span className="text-sm">Sign out</span>}
        </Button>
      </div>
    </Sidebar>
  );
}
