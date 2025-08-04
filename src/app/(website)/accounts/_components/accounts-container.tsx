"use client";

import { useState, useEffect } from "react";
import ProfileSidebar from "./profile-sidebar";
import PersonalInformation from "./personal-information";
import ChangePassword from "./change-password";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

type ProfilePicResponse = {
  success: boolean;
  profile_pic_url: string;
};

type UserSettingsResponse = {
  success: boolean;
  message: string;
  data: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    country: string;
    city: string;
    road: string;
    postal_code: string;
  };
};

export default function AccountContainer() {
  const [activeTab, setActiveTab] = useState("personal");
  const [profileImage, setProfileImage] = useState("");

  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;

  // get profile information from API
  const { data: userInfo } = useQuery<UserSettingsResponse>({
    queryKey: ["personal-information"],
    enabled: !!token,
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/updateInfo`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
  });

  console.log(userInfo?.data);

  const userProfile = userInfo?.data;

  // get profile pic
  const { data } = useQuery<ProfilePicResponse>({
    queryKey: ["userProfilePic"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-pic`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
    enabled: !!token, // only run if token exists
  });

  // ✅ Set profileImage once fetched
  useEffect(() => {
    if (data?.success && data.profile_pic_url) {
      setProfileImage(data.profile_pic_url);
    }
  }, [data]);

  return (
    <div className="min-h-screen py-10 md:py-[60px] lg:py-[88px]">
      <h1 className="text-3xl md:text-[35px] lg:text-[40px] font-bold leading-[120%] tracking-[0%] text-[#131313]  text-center mb-6 md:mb-8 lg:mb-10">
        Accounts
      </h1>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-7 gap-[30px]">
        <div className="md:col-span-2">
          <ProfileSidebar
            userProfile={userProfile}
            profileImage={profileImage}
            setProfileImage={setProfileImage}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            token={token}
          />
        </div>
        <div className="md:col-span-5">
          {activeTab === "personal" && <PersonalInformation />}
          {activeTab === "password" && <ChangePassword />}
        </div>
      </div>
    </div>
  );
}
