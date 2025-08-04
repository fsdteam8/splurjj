"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "@/components/ui/color-picker";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useEffect } from "react";
import AboutUSPages from "./aboutUSPages";
import OtherPages from "./otherPages";
import FooterBottomPage from "./footerbottompage";

const formSchema = z.object({
  facebook_link: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: "Please enter a valid Facebook URL.",
    }),
  instagram_link: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: "Please enter a valid Instagram URL.",
    }),
  linkedin_link: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: "Please enter a valid YouTube URL.",
    }),
  twitter_link: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: "Please enter a valid Twitter URL.",
    }),
  google_play_link: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: "Please enter a valid Google Play URL.",
    }),
  app_store_link: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: "Please enter a valid App Store URL.",
    }),
  copyright: z.string().min(10, "Copyright is required"),
  bg_color: z.string().min(6, {
    message: "Please pick a background color.",
  }),
  text_color: z.string().min(6, {
    message: "Please pick a text color.",
  }),
  active_text_color: z.string().min(6, {
    message: "Please pick a active text color.",
  }),
});

export type FooterLink = {
  name: string;
  named_url: string;
};

export type FooterApiResponse = {
  success: boolean;
  message: string;
  data: {
    footer_links: FooterLink[];
    facebook_link: string;
    instagram_link: string;
    linkedin_link: string;
    twitter_link: string;
    app_store_link: string;
    google_play_link: string;
    bg_color: string;
    text_color: string;
    active_text_color: string;
    copyright: string;
  };
};

export function FooterForm() {
  const session = useSession();
  const token = (session?.data?.user as { token?: string })?.token;

  const { data } = useQuery<FooterApiResponse>({
    queryKey: ["footer-content-data"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/footer`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()),
  });

  // console.log(data?.data?.app_store_link);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facebook_link: "",
      instagram_link: "",
      linkedin_link: "",
      twitter_link: "",
      google_play_link: "",
      app_store_link: "",
      copyright: "",
      bg_color: "#000000",
      text_color: "#000000",
      active_text_color: "#000000",
    },
  });

  useEffect(() => {
    if (data?.data) {
      form.reset({
        facebook_link: data?.data?.facebook_link || "",
        instagram_link: data?.data?.instagram_link || "",
        linkedin_link: data?.data?.linkedin_link || "",
        twitter_link: data?.data?.twitter_link || "",
        google_play_link: data?.data?.google_play_link || "",
        app_store_link: data?.data?.app_store_link || "",
        copyright: data?.data?.copyright || "",
        bg_color: data?.data?.bg_color || "#000000",
        text_color: data?.data?.text_color || "#000000",
        active_text_color: data?.data?.active_text_color || "#000000",
      });
    }
  }, [data, form]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["footer-content"],
    mutationFn: (values: z.infer<typeof formSchema>) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/footer/update`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }
      toast.success(data?.message || "Footer updated successfully");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // console.log("Submitted Values:", values);
    mutate(values);
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="w-full flex items-center justify-between gap-10 md:gap-14">
            <div className="flex gap-4">
              {/*add background Color */}
              <div>
                <FormField
                  control={form.control}
                  name="bg_color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold text-black">
                        Add Background Color
                      </FormLabel>
                      <FormControl>
                        <ColorPicker
                          selectedColor={field.value ?? "#FFFFFF"}
                          onColorChange={field.onChange}
                          // previousColor={"#000000"}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm font-medium" />
                    </FormItem>
                  )}
                />
              </div>
              {/*add text Color */}
              <div>
                <FormField
                  control={form.control}
                  name="text_color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold text-black">
                        Add Text Color
                      </FormLabel>
                      <FormControl>
                        <ColorPicker
                          selectedColor={field.value ?? "#FFFFFF"}
                          onColorChange={field.onChange}
                          // previousColor={"#000000"}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm font-medium" />
                    </FormItem>
                  )}
                />
              </div>
              {/*add active text Color */}
              <div>
                <FormField
                  control={form.control}
                  name="active_text_color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold text-black">
                        Add Active Text Color
                      </FormLabel>
                      <FormControl>
                        <ColorPicker
                          selectedColor={field.value ?? "#FFFFFF"}
                          onColorChange={field.onChange}
                          // previousColor={"#000000"}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm font-medium" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-center items-center">
              <Button
                size={"lg"}
                disabled={isPending}
                type="submit"
                className="py-3 px-10 rounded-lg bg-primary text-white font-semibold leading-normal text-lg"
              >
                {isPending ? "Sending..." : "Submit"}
              </Button>
            </div>
          </div>
          {/* social url input field  */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <AboutUSPages />
            </div>
            <div className="space-y-4 bg-white rounded-lg shadow-lg p-4">
              <div>
                <h1 className="text-[20px] font-bold">Social Links</h1>
              </div>
              <div className="">
                <FormField
                  control={form.control}
                  name="facebook_link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold  leading-[120%] tracking-[0%] text-[#212121]">
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
                      <FormLabel className="ttext-sm font-semibold  leading-[120%] tracking-[0%] text-[#212121]">
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
              <div className="">
                <FormField
                  control={form.control}
                  name="linkedin_link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold leading-[120%] tracking-[0%] text-[#212121]">
                        Linkedin Url Link
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
                      <FormLabel className="text-sm font-semibold  leading-[120%] tracking-[0%] text-[#212121]">
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
              <div className="">
                <FormField
                  control={form.control}
                  name="app_store_link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold  leading-[120%] tracking-[0%] text-[#212121]">
                        App Store Url Link
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-[51px] border border-[#595959] placeholder:text-[#595959] text-[#212121]  font-normal text-base tracking-[0%] rounded-[8px]"
                          placeholder="https://www.apple.com/app-store/your-app"
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
                  name="google_play_link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold leading-[120%] tracking-[0%] text-[#212121]">
                        Google Play Url Link
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-[51px] border border-[#595959] placeholder:text-[#595959] text-[#212121]  font-normal text-base tracking-[0%] rounded-[8px]"
                          placeholder="https://play.google.com/store/your-apps"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded-lg shadow-lg p-4">
            <div>
              <OtherPages />
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
              <div className="">
                <FormField
                  control={form.control}
                  name="copyright"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-normal  leading-[120%] tracking-[0%] text-[#212121]">
                        Copyright
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-[51px] border border-[#595959] placeholder:text-[#595959] text-[#212121]  font-normal text-base tracking-[0%] rounded-[8px]"
                          placeholder="Copyright © 2025 Your Company. All rights reserved."
                          type="text"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm font-medium" />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FooterBottomPage />
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
