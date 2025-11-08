import { SidebarProvider } from "@/components/ui/sidebar";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileContent } from "@/components/profile/ProfileContent";

const Profile = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <ProfileSidebar />
        <main className="flex-1 bg-background">
          <ProfileContent />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Profile;
