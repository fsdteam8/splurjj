"use client";

import { User, Lock, LogOut } from "lucide-react";
import ProfileAvatar from "./profile-avatar";
import LogoutModal from "@/components/shared/modals/LogoutModal";
import { useState } from "react";
import { toast } from "react-toastify";
import { signOut } from "next-auth/react";

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
}

interface ProfileSidebarProps {
  userProfile?: UserProfile;
  profileImage: string;
  setProfileImage: (image: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  token: string;
}

export default function ProfileSidebar({
  userProfile,
  profileImage,
  setProfileImage,
  activeTab,
  setActiveTab,
  token,
}: ProfileSidebarProps) {
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handLogout = () => {
    try {
      toast.success("Logout successful!");
      setTimeout(async () => {
        await signOut({
          callbackUrl: "/",
        });
      }, 1000);
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };
  return (
    <div className="w-80 rounded-lg h-fit">
      <div className="text-center mb-8">
        <ProfileAvatar
          profileImage={profileImage}
          setProfileImage={setProfileImage}
          userName={`${userProfile?.first_name || ""} ${
            userProfile?.last_name || ""
          }`}
          token={token}
        />
        <h2 className="text-lg md:text-xl font-semibold leading-[120%] text-[#424242] tracking-[0%]  pt-3">
          {userProfile?.first_name || ""} {userProfile?.last_name || ""}
        </h2>
        <p className="text-base font-normal text-[#BFBFBF]  leading-[120%] tracking-[0%] ">
          {userProfile?.email || ""}
        </p>
      </div>

      <nav className="space-y-[7px]">
        <button
          onClick={() => setActiveTab("personal")}
          className={`w-full md:w-[307px] h-[62px] flex items-center gap-[10px] text-lg font-normal  leading-[120%] tracking-[0%] px-4 py-3 rounded-[8px] text-left transition-colors ${
            activeTab === "personal"
              ? "bg-[#595959] text-white"
              : "text-[#131313]"
          }`}
        >
          <User className="w-[30px] h-[30px]" />
          Personal Information
        </button>

        <button
          onClick={() => setActiveTab("password")}
          className={`w-full md:w-[307px] h-[62px] flex items-center gap-[10px] text-lg font-normal  leading-[120%] tracking-[0%] px-4 py-3 rounded-[8px] text-left transition-colors ${
            activeTab === "password"
              ? "bg-[#595959] text-white"
              : "text-[#131313]"
          }`}
        >
          <Lock className="w-[30px] h-[30px]" />
          Change Password
        </button>

        <button
          onClick={() => setLogoutModalOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-red-50 hover:dark:bg-red-800 transition-colors text-lg md:text-xl font-medium leading-[120%]  text-[#FF0000]"
        >
          <LogOut className="w-[30px] h-[30px]" />
          Log out
        </button>
      </nav>

      {/* logout modal  */}
      {logoutModalOpen && (
        <LogoutModal
          isOpen={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          onConfirm={handLogout}
        />
      )}
    </div>
  );
}
