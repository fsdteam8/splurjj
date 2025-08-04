

"use client"

import React, { useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"


interface ProfileAvatarProps {
  profileImage: string
  setProfileImage: (image: string) => void
  userName: string
  token: string
}

export default function ProfileAvatar({
  profileImage,
  setProfileImage,
  userName,
  token,
}: ProfileAvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { mutate: uploadProfilePic } = useMutation({
    mutationKey: ["update-profile-pic"],
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("profile_pic", file)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-pic`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to upload image")
      }

      return data
    },
   onSuccess: (data)=>{
    if(!data?.success){
      toast.error(data?.message || "Something went wrong");
      return;
    }
    toast.success(data?.message || "Profile pic updated successfully");
    setProfileImage(data.profile_pic || data.profile_pic_url)
   }
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadProfilePic(file)
    }
  }

  const triggerImageUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="relative inline-block">
      <Avatar
        className="w-[150px] h-[150px] rounded-full mx-auto mb-4 cursor-pointer border"
        onClick={triggerImageUpload}
      >
        <AvatarImage src={profileImage || "/placeholder.svg"} alt={userName} />
        <AvatarFallback>
          {userName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div
        className="absolute bottom-4 right-0 bg-gray-600 rounded-full p-1 cursor-pointer hover:bg-gray-700 transition-colors"
        onClick={triggerImageUpload}
      >
        <Camera className="w-4 h-4 text-white" />
      </div>
      <input
        ref={fileInputRef}
        id="imageUpload"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  )
}
