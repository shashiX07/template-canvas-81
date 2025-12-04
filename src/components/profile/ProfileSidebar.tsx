import { Home, Compass, User, Settings, LogOut, Sparkles, PanelLeftClose, PanelLeft } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Home", url: "/profile", icon: Home, end: true },
  { title: "Explore", url: "/profile/explore", icon: Compass },
  { title: "Profile", url: "/profile/details", icon: User },
  { title: "Settings", url: "/profile/settings", icon: Settings },
];

export function ProfileSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r">
      {/* Header with Logo and Toggle */}
      <div className="p-3 border-b">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className={cn(
              "justify-start gap-2 p-2",
              isCollapsed && "justify-center"
            )}
            onClick={() => navigate("/")}
          >
            <Sparkles className="h-6 w-6 text-primary shrink-0" />
            {!isCollapsed && <span className="font-bold text-lg">Webie</span>}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn(
              "h-8 w-8 shrink-0",
              isCollapsed && "absolute left-1/2 -translate-x-1/2 mt-2"
            )}
          >
            {isCollapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11">
                    <NavLink
                      to={item.url}
                      end={item.end}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted",
                        isCollapsed && "justify-center px-2"
                      )}
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with Logout */}
      <div className="mt-auto p-3 border-t">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10",
            isCollapsed && "justify-center px-2"
          )}
          onClick={logout}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </Button>
      </div>
    </Sidebar>
  );
}
