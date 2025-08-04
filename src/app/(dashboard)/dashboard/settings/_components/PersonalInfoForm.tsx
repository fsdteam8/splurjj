"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState, useRef, useEffect } from "react";
import { Upload, X, Camera } from "lucide-react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9\s\-()]{7,20}$/, "Invalid phone number"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City/State is required"),
  description: z.string().optional(),
  facebook_link: z.string().url("Invalid URL").optional(),
  instagram_link: z.string().url("Invalid URL").optional(),
  youtube_link: z.string().url("Invalid URL").optional(),
  twitter_link: z.string().url("Invalid URL").optional(),
});

type FormData = z.infer<typeof formSchema>;

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
    profile_pic: string;
    description?: string;
    facebook_link?: string;
    instagram_link?: string;
    youtube_link?: string;
    twitter_link?: string;
  };
};

export default function PersonalInfoForm() {
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // GET API
  const { data } = useQuery<UserSettingsResponse>({
    queryKey: ["personal-information"],
    enabled: !!token,
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings/info`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
  });

  // Sync form and previewUrl with fetched data
  useEffect(() => {
    if (data?.data) {
      form.reset({
        first_name: data.data.first_name,
        last_name: data.data.last_name,
        email: data.data.email,
        phone: data.data.phone,
        country: data.data.country,
        city: data.data.city,
        description: data.data.description || "",
        facebook_link: data.data.facebook_link || "",
        instagram_link: data.data.instagram_link || "",
        youtube_link: data.data.youtube_link || "",
        twitter_link: data.data.twitter_link || "",
      });
      setPreviewUrl(data.data.profile_pic || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Image handlers
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setSelectedFile(file);
    }
  };

  const handleImageRemove = () => {
    setPreviewUrl("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // POST API
  const { mutate, isPending } = useMutation({
    mutationKey: ["personal-info"],
    mutationFn: async (formData: FormData) => {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (selectedFile) {
        data.append("profile_pic", selectedFile);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings/info`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }
      toast.success(data?.message || "Profile info updated successfully");
      queryClient.invalidateQueries({ queryKey: ["personal-information", "user-info"] });
    },
    onError: () => {
      toast.error("Failed to update profile info");
    },
  });

  const onSubmit = (formData: FormData) => {
    mutate(formData);
  };

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-[106px] dark:bg-white p-6 rounded-lg">
        <div className="md:col-span-3">
          <div className="flex items-center justify-between pb-8">
            <h1 className="text-2xl text-[#212121]  font-semibold leading-[120%] tracking-[0%]">
              Personal Information
            </h1>
            <Button
              type="submit"
              size="lg"
              disabled={isPending}
              onClick={form.handleSubmit(onSubmit)}
              className="h-[37px] text-white font-sm font-medium leading-[120%] tracking-[0%]  py-[10px] px-[26px] bg-[#34A1E8] rounded-[8px]"
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px]">
                {[
                  { name: "first_name", label: "First Name" },
                  { name: "last_name", label: "Last Name" },
                  { name: "email", label: "Email Address", type: "email" },
                  { name: "phone", label: "Phone" },
                  { name: "country", label: "Country" },
                  { name: "city", label: "City/State" },
                ].map(({ name, label, type }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as keyof FormData}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-normal  leading-[120%] tracking-[0%] text-[#212121]">
                          {label}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type={type || "text"}
                            className="h-[51px] border border-[#595959] placeholder:text-[#595959] text-[#212121]  font-normal text-base tracking-[0%] rounded-[8px]"
                            placeholder={`Enter your ${label.toLowerCase()}`}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm font-medium" />

                      </FormItem>
                    )}
                  />
                ))}
              </div>
              {/* description  */}
              <div className=" w-full">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-normal  leading-[120%] tracking-[0%] text-[#212121]">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="w-full h-[100px] border border-[#595959] placeholder:text-[#595959] text-[#212121] dark:text-[#212121] font-normal text-base tracking-[0%] rounded-[8px]"
                          placeholder="Tell us about yourself"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm font-medium" />

                    </FormItem>
                  )}
                />
              </div>
              {/* social url input field  */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px]">
                <div className="md:col-span-1">
                  <div className="mb-6">
                    <FormField
                      control={form.control}
                      name="facebook_link"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-normal  leading-[120%] tracking-[0%] text-[#212121]">
                            Facebook Url Link
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="h-[51px] border border-[#595959] placeholder:text-[#595959] text-[#212121]  font-normal text-base tracking-[0%] rounded-[8px]"
                              placeholder="https://www.facebook.com/your-profile"
                              type="url"
                            />
                          </FormControl>
                       <FormMessage className="text-red-500 text-sm font-medium" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="">
                    <FormField
                      control={form.control}
                      name="instagram_link"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-normal  leading-[120%] tracking-[0%] text-[#212121]">
                            Instagram Url Link
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="h-[51px] border border-[#595959] placeholder:text-[#595959] text-[#212121]  font-normal text-base tracking-[0%] rounded-[8px]"
                              placeholder="https://www.instagram.com/your-profile"
                              type="url"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm font-medium" />

                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="md:col-span-1">
                  <div className="mb-6">
                    <FormField
                      control={form.control}
                      name="youtube_link"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-normal  leading-[120%] tracking-[0%] text-[#212121]">
                            YouTube Url Link
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="h-[51px] border border-[#595959] placeholder:text-[#595959] text-[#212121]  font-normal text-base tracking-[0%] rounded-[8px]"
                              placeholder="https://www.youtube.com/your-channel"
                              type="url"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm font-medium" />

                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="twitter_link"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-normal  leading-[120%] tracking-[0%] text-[#212121]">
                            Twitter Url Link
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="h-[51px] border border-[#595959] placeholder:text-[#595959] text-[#212121]  font-normal text-base tracking-[0%] rounded-[8px]"
                              placeholder="https://www.twitter.com/your-profile"
                              type="url"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm font-medium" />

                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>

        {/* Profile Image Upload */}
        <div className="md:col-span-1 flex items-center justify-center">
          <div className="relative group">
            <div
              className="w-[222px] h-[222px] rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={handleImageClick}
            >
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  width={222}
                  height={222}
                />
              ) : (
                <Camera className="w-8 h-8 text-gray-400" />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload className="w-6 h-6 text-white" />
              </div>
            </div>

            {previewUrl && (
              <button
                type="button"
                onClick={handleImageRemove}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
