import { Routes, Route } from "react-router-dom";
import ProfileHome from "./ProfileHome";
import ProfileExplore from "./ProfileExplore";
import { ProfileDetails } from "./ProfileDetails";
import { ProfileSettings } from "./ProfileSettings";
import UserProfile from "./UserProfile";
import ProfileMessages from "./ProfileMessages";
import ProfileBusiness from "./ProfileBusiness";

export function ProfileContent() {
  return (
    <div className="flex-1 overflow-auto">
      <Routes>
        <Route path="/" element={<ProfileHome />} />
        <Route path="/explore" element={<ProfileExplore />} />
        <Route path="/messages" element={<ProfileMessages />} />
        <Route path="/business" element={<ProfileBusiness />} />
        <Route path="/details" element={<ProfileDetails />} />
        <Route path="/settings/*" element={<ProfileSettings />} />
        <Route path="/user/:userId" element={<UserProfile />} />
      </Routes>
    </div>
  );
}
