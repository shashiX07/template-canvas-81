import { SidebarProvider } from "@/components/ui/sidebar";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileContent } from "@/components/profile/ProfileContent";

const Profile = () => {
  return (
    <div className="dashboard-shell">
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background text-foreground">
          <ProfileSidebar />
          <main className="flex-1 bg-background overflow-auto">
            <ProfileContent />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Profile;