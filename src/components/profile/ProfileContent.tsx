import { Routes, Route } from "react-router-dom";
import { ProfileDashboard } from "./ProfileDashboard";
import { ProfileDetails } from "./ProfileDetails";
import { ProfileTemplates } from "./ProfileTemplates";
import { ProfileSettings } from "./ProfileSettings";
import { ProfileSecurity } from "./ProfileSecurity";
import ProfileHome from "./ProfileHome";
import ProfileExplore from "./ProfileExplore";

export function ProfileContent() {
  return (
    <div className="flex-1 overflow-auto">
      <Routes>
        <Route path="/" element={<ProfileHome />} />
        <Route path="/explore" element={<ProfileExplore />} />
        <Route path="/details" element={<ProfileDetails />} />
        <Route path="/templates" element={<ProfileTemplates />} />
        <Route path="/settings" element={<ProfileSettings />} />
        <Route path="/security" element={<ProfileSecurity />} />
      </Routes>
    </div>
  );
}