"use client";

import ThemeToggle from "@/app/theme-toggle";
import { useQuery } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type React from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutModal from "@/components/shared/modals/LogoutModal";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface UserProfileData {
  first_name: string;
  last_name: string;
  profile_pic: string;
}

interface UserSettingsResponse {
  success: boolean;
  message: string;
  data: UserProfileData;
}

export type HeaderResponse = {
  success: boolean;
  message: string;
  data: {
    logo: string | null;
    border_color: string | null;
    bg_color: string | null;
    menu_item_color: string | null;
    menu_item_active_color: string | null;
  };
};

export default function DashboardHeader() {
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const session = useSession();
  const role = session?.data?.user?.role || "Admin";

  const token = (session?.data?.user as { token?: string })?.token;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handLogout = async () => {
    try {
      toast.success("Logout successful!");
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  // user info data
  const { data } = useQuery<UserSettingsResponse>({
    queryKey: ["user-info"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings/info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
  });

  return (
    // <header className=" px-6 py-4 sticky top-0 z-50">
    <header
      className={`px-4 py-4 sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white dark:bg-[#1f1f1f] shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-end w-full">
        <div className="flex items-center justify-center gap-4">
          {/* theme toggle  */}
          <ThemeToggle />

          {/* Right Section - Notifications and User Profile */}
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex items-center gap-3">
                  <div>
                    <Avatar>
                      <AvatarImage
                        src={
                          data?.data?.profile_pic ||
                          "https://github.com/shadcn.png"
                        }
                      />
                      <AvatarFallback className="text-base font-bold leading-normal text-black">
                        {data?.data?.first_name?.charAt(0) || ""}
                        {data?.data?.last_name?.charAt(0) || ""}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-[#131313] dark:text-white leading-[120%] tracking-[0%] ">
                      {data?.data?.first_name}
                    </h4>
                    <p className="text-xs font-normal text-[#424242] text-left dark:text-white leading-[120%] tracking-[0%]  pt-[2px]">
                      {role}
                    </p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white w-[150px]">
                <Link href="/dashboard/settings">
                  <DropdownMenuLabel className="text-[#131313] text-sm font-semibold leading-normal hover:bg-blue-100/50">
                    Settings
                  </DropdownMenuLabel>
                </Link>
                <DropdownMenuLabel
                  onClick={() => setLogoutModalOpen(true)}
                  className="text-red-500 text-sm font-semibold leading-normal cursor-pointer"
                >
                  Log Out
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {logoutModalOpen && (
        <LogoutModal
          isOpen={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          onConfirm={handLogout}
        />
      )}
    </header>
  );
}

// "use client";
// import ThemeToggle from "@/app/theme-toggle";
// import { useQuery } from "@tanstack/react-query";
// import { signOut, useSession } from "next-auth/react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// // import Image from "next/image"
// import Link from "next/link";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import LogoutModal from "@/components/shared/modals/LogoutModal";
// import { useState } from "react";
// import { toast } from "react-toastify";
// import { Settings, LogOut, User } from "lucide-react";

// interface UserProfileData {
//   first_name: string;
//   last_name: string;
//   profile_pic: string;
// }

// interface UserSettingsResponse {
//   success: boolean;
//   message: string;
//   data: UserProfileData;
// }

// export type HeaderResponse = {
//   success: boolean;
//   message: string;
//   data: {
//     logo: string | null;
//     border_color: string | null;
//     bg_color: string | null;
//     menu_item_color: string | null;
//     menu_item_active_color: string | null;
//   };
// };

// export default function DashboardHeader() {
//   const [logoutModalOpen, setLogoutModalOpen] = useState(false);
//   const session = useSession();
//   const role = session?.data?.user?.role || "Admin";
//   const token = (session?.data?.user as { token?: string })?.token;

//   const handLogout = async () => {
//     try {
//       toast.success("Logout successful!");
//       await signOut({ callbackUrl: "/login" });
//     } catch (error) {
//       console.error("Logout failed:", error);
//       toast.error("Logout failed. Please try again.");
//     }
//   };

//   // user info data
//   const { data } = useQuery<UserSettingsResponse>({
//     queryKey: ["user-info"],
//     queryFn: () =>
//       fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings/info`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }).then((res) => res.json()),
//   });

//   return (
//     <div className="flex items-center justify-end w-full">
//       {/* Right Section */}
//       <div className="flex items-center gap-4">
//         {/* Theme Toggle */}
//         <ThemeToggle />

//         {/* User Profile Dropdown */}
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button
//               variant="ghost"
//               className="relative h-10 w-auto px-3 hover:bg-gray-100 dark:hover:bg-gray-800"
//             >
//               <div className="flex items-center gap-3">
//                 <Avatar className="h-8 w-8">
//                   <AvatarImage
//                     src={data?.data?.profile_pic || "/placeholder.svg"}
//                     alt={`${data?.data?.first_name || "User"} Avatar`}
//                   />
//                   <AvatarFallback className="text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-black">
//                     {data?.data?.first_name?.charAt(0) || "U"}
//                     {data?.data?.last_name?.charAt(0) || ""}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div className="hidden md:block text-left">
//                   <p className="text-sm font-medium text-gray-900 dark:text-black">
//                     {data?.data?.first_name || "User"}
//                   </p>
//                   <p className="text-xs text-gray-500 dark:text-black">
//                     {role}
//                   </p>
//                 </div>
//               </div>
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent className="w-56 bg-white" align="end" forceMount>
//             <DropdownMenuLabel className="font-normal">
//               <div className="flex flex-col space-y-1">
//                 <p className="text-sm font-medium leading-none">
//                   {data?.data?.first_name} {data?.data?.last_name}
//                 </p>
//                 <p className="text-xs leading-none text-muted-foreground">
//                   {role}
//                 </p>
//               </div>
//             </DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem asChild>
//               <Link href="/dashboard/settings" className="flex items-center">
//                 <Settings className="mr-2 h-4 w-4" />
//                 <span className="text-base font-medium leading-normal text-[#131313]">Settings</span>
//               </Link>
//             </DropdownMenuItem>
//             <DropdownMenuItem asChild>
//               <Link href="/profile" className="flex items-center">
//                 <User className="mr-2 h-4 w-4" />
//                 <span>Profile</span>
//               </Link>
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem
//               className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
//               onClick={() => setLogoutModalOpen(true)}
//             >
//               <LogOut className="mr-2 h-4 w-4" />
//               <span>Log out</span>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//       {logoutModalOpen && (
//         <LogoutModal
//           isOpen={logoutModalOpen}
//           onClose={() => setLogoutModalOpen(false)}
//           onConfirm={handLogout}
//         />
//       )}
//     </div>
//   );
// }
