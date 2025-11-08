import { Routes, Route } from "react-router-dom";
import { ProfileDashboard } from "./ProfileDashboard";
import { ProfileDetails } from "./ProfileDetails";
import { ProfileTemplates } from "./ProfileTemplates";
import { ProfileSettings } from "./ProfileSettings";
import { ProfileSecurity } from "./ProfileSecurity";

export function ProfileContent() {
  return (
    <div className="container mx-auto p-6">
      <Routes>
        <Route path="/" element={<ProfileDashboard />} />
        <Route path="/details" element={<ProfileDetails />} />
        <Route path="/templates" element={<ProfileTemplates />} />
        <Route path="/settings" element={<ProfileSettings />} />
        <Route path="/security" element={<ProfileSecurity />} />
      </Routes>
    </div>
  );
}
