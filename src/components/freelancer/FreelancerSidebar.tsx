import { 
  LayoutDashboard, 
  FileText, 
  DollarSign, 
  Star, 
  User, 
  LogOut, 
  Sparkles,
  ChevronDown
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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { freelancerStorage, type FreelancerProfile } from "@/lib/storage";
import { useState, useEffect } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const mainMenuItems = [
  { title: "Dashboard", url: "/freelancer/dashboard", icon: LayoutDashboard, end: true },
  { title: "Templates", url: "/freelancer/dashboard/templates", icon: FileText },
  { title: "Monetization", url: "/freelancer/dashboard/monetization", icon: DollarSign },
  { title: "Reviews", url: "/freelancer/dashboard/reviews", icon: Star },
  { title: "Account", url: "/freelancer/dashboard/account", icon: User },
];

export function FreelancerSidebar() {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isCollapsed = state === "collapsed";
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);

  useEffect(() => {
    if (user) {
      const freelancerProfile = freelancerStorage.getById(user.id);
      setProfile(freelancerProfile);
    }
  }, [user]);

  const getStatusBadge = () => {
    if (!profile) return null;
    switch (profile.verificationStatus) {
      case 'pending':
        return <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-500">Pending</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-xs bg-red-500/10 text-red-500">Rejected</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500">Verified</Badge>;
      default:
        return null;
    }
  };

  return (
    <Sidebar collapsible="icon">
      <div className="p-4 border-b">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => navigate("/")}
        >
          <Sparkles className="h-5 w-5 text-primary" />
          {!isCollapsed && <span className="ml-2 font-bold text-lg">Template Builder</span>}
        </Button>
      </div>

      {/* User Info */}
      {!isCollapsed && user && (
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <img 
              src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'} 
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user.name}</p>
              {getStatusBadge()}
            </div>
          </div>
        </div>
      )}

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.end}
                      className="hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span className="ml-2">{item.title}</span>}
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
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Logout</span>}
        </Button>
        <SidebarTrigger className="w-full" />
      </div>
    </Sidebar>
  );
}