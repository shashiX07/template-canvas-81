import { User, FileText, Settings, Shield, Home, LogOut } from "lucide-react";
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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  { title: "Dashboard", url: "/profile", icon: Home, end: true },
  { title: "Profile Details", url: "/profile/details", icon: User },
  { title: "My Templates", url: "/profile/templates", icon: FileText },
  { title: "Account Settings", url: "/profile/settings", icon: Settings },
  { title: "Security", url: "/profile/security", icon: Shield },
];

export function ProfileSidebar() {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <div className="p-4 border-b">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => navigate("/")}
        >
          {!isCollapsed && <span className="font-bold text-lg">Template Builder</span>}
        </Button>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>User Profile</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.end}
                      className="hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="p-4 border-t space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Logout</span>}
        </Button>
        <SidebarTrigger className="w-full" />
      </div>
    </Sidebar>
  );
}
