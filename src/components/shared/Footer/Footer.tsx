"use client";
import React from "react";
import { Instagram, Facebook, Linkedin, Twitter, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import NewsLetterForm from "./NewsLetterForm";
import { FooterSectionDataType } from "@/components/types/FooterSectionDataType";

interface Category {
  id: number;
  category_id: number;
  category_name: string;
}

interface PageData {
  id: number;
  name: string;
  body: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface FooterSection {
  id: number;
  title: string;
  pages: string[];
  created_at: string;
  updated_at: string;
  page_data: PageData[];
}

// interface FooterData {
//   app_store_link: string
//   bg_color: string
//   text_color: string
//   copyright: string
//   facebook_link: string
//   google_play_link: string
//   instagram_link: string
//   linkedin_link: string
//   twitter_link: string
//   footer_links: string
// }

export type FooterData = {
  success: boolean;
  message: string;
  data: {
    footer_links: string;
    facebook_link: string;
    instagram_link: string;
    linkedin_link: string;
    twitter_link: string;
    app_store_link: string;
    google_play_link: string;
    text_color: string;
    bg_color: string;
    copyright: string;
  };
};

// API fetch functions
const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  const result: { data: Category[] } = await response.json();
  return result.data;
};

const fetchFooterSections = async (): Promise<FooterSection[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/footer-sections`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch footer sections");
  }
  return response.json();
};

// const fetchFooter = async (): Promise<FooterData> => {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/footer`
//   );
//   if (!response.ok) {
//     throw new Error("Failed to fetch footer data");
//   }
//   const result: { data: FooterData } = await response.json();
//   return result.data;
// };

// Loading skeleton components
const FooterSectionSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-6 w-32" />
    <div className="space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-4 w-24" />
      ))}
    </div>
  </div>
);

const Footer = () => {
  // footer section
  const {
    data: footerbg,
    isLoading,
    isError,
    error,
  } = useQuery<FooterSectionDataType>({
    queryKey: ["footer-section"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/footer`).then(
        (res) => res.json()
      ),
  });


  // console.log("footer bg color", footerbg?.data?.bg_color);
  // TanStack Query hooks
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const {
    data: footerSections = [],
    isLoading: sectionsLoading,
    error: sectionsError,
  } = useQuery<FooterSection[]>({
    queryKey: ["footer-content-data"],
    queryFn: fetchFooterSections,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // const { data: footer, error: footerError } = useQuery<FooterData>({
  //   queryKey: ["footerData"],
  //   queryFn: fetchFooter,
  //   staleTime: 5 * 60 * 1000, // 5 minutes
  //   retry: 2,
  // });

  // Static shop data
  const shopData = [
    { id: 1, shop: "Latest" },
    { id: 2, shop: "Men" },
    { id: 3, shop: "Women" },
    { id: 4, shop: "Lifestyle" },
    { id: 5, shop: "Tech" },
    { id: 6, shop: "Sale" },
  ];

  // Extract data from footer sections
  const otherData = React.useMemo(() => {
    return (
      footerSections
        ?.find((section) => section.title.toLowerCase() === "other")
        ?.pages.map((page, index) => ({ id: index + 1, other: page })) || []
    );
  }, [footerSections]);

  const aboutData = React.useMemo(() => {
    return (
      footerSections
        ?.find((section) => section.title.toLowerCase() === "about us")
        ?.pages.map((page, index) => ({ id: index + 1, about: page })) || []
    );
  }, [footerSections]);

  const footerBottomPages = React.useMemo(() => {
    return (
      footerSections?.find(
        (section) => section.title.toLowerCase() === "footer bottom"
      )?.pages || []
    );
  }, [footerSections]);

  // Error handling
  if (categoriesError || sectionsError) {
    return (
      <div className="w-full p-8">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load footer data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  
  if (isError) {
    console.log(error);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // console.log("footer bg color", footer?.data?.bg_color);

  return (
    <div
      className="h-full lg:h-[533px] w-full pt-24"
      style={{ backgroundColor: footerbg?.data?.bg_color || "#C9C3C3"}}
      // style={
      //   footerbg?.data?.bg_color
      //     ? { backgroundColor: footerbg?.data?.bg_color }
      //     : undefined
      // }
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 pb-3 md:pb-4">
          {/* Categories Section */}
          <div className="lg:col-span-2">
            <div
              className="text-xl font-bold text-black tracking-[0%] leading-[120%] pb-4 md:pb-5 lg:pb-6"
              style={{ color: footerbg?.data?.text_color || "#1a1a1a" }}
            >
              CATEGORIES
            </div>
            {categoriesLoading ? (
              <FooterSectionSkeleton />
            ) : (
              <ul>
                {categories?.map((item) => (
                  <li key={`category-${item.id}`}>
                    <Link
                      href={`/blogs/${item.category_name}`}
                      style={{ color: footerbg?.data?.text_color || "#1a1a1a" }}
                      className="text-sm font-semibold cursor-pointer hover:underline tracking-[0%] leading-[120%] py-2 block"
                    >
                      {item.category_name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Shop Section */}
          <div className="lg:col-span-1">
            <div
              className="text-xl font-bold text-black tracking-[0%] leading-[120%] pb-4 md:pb-5 lg:pb-6"
              style={{ color: footerbg?.data?.text_color || "#1a1a1a" }}
            >
              SHOP
            </div>
            <ul>
              {shopData.map((item) => (
                <li
                  key={`shop-${item.id}`}
                  className="text-sm font-semibold cursor-pointer hover:underline tracking-[0%] leading-[120%] py-2"
                  style={{ color: footerbg?.data?.text_color || "#1a1a1a" }}
                >
                  <Link
                    style={{ color: footerbg?.data?.text_color || "#1a1a1a" }}
                    href={`/shop/${item.shop.toLowerCase()}`}
                  >
                    {item.shop}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Others Section */}
          <div className="lg:col-span-2">
            <div
              className="text-xl font-bold text-black tracking-[0%] leading-[120%] pb-4 md:pb-5 lg:pb-6"
              style={{ color: footerbg?.data?.text_color || "#1a1a1a" }}
            >
              OTHER
            </div>
            {sectionsLoading ? (
              <FooterSectionSkeleton />
            ) : (
              <ul>
                {otherData.map((item) => (
                  <li
                    key={`other-${item.id}`}
                    className="text-sm font-semibold cursor-pointer hover:underline tracking-[0%] leading-[120%] py-2"
                    style={{ color: footerbg?.data?.text_color || "#1a1a1a" }}
                  >
                    <Link
                      style={{ color: footerbg?.data?.text_color || "#1a1a1a" }}
                      href={`/pages/${item.other}`}
                    >
                      {item.other}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* About Us Section */}
          <div className="lg:col-span-2">
            <div
              className="text-xl font-bold text-black tracking-[0%] leading-[120%] pb-4 md:pb-5 lg:pb-6"
              style={{ color: footerbg?.data?.text_color || "#1a1a1a" }}
            >
              ABOUT US
            </div>
            {sectionsLoading ? (
              <FooterSectionSkeleton />
            ) : (
              <ul>
                {aboutData.map((item) => (
                  <li
                    key={`about-${item.id}`}
                    className="text-sm font-semibold cursor-pointer hover:underline tracking-[0%] leading-[120%] py-2"
                    style={{ color: footerbg?.data?.text_color || "#1a1a1a" }}
                  >
                    <Link
                      style={{ color: footerbg?.data?.text_color || "#1a1a1a" }}
                      href={`/pages/${item.about}`}
                    >
                      {item.about}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Follow Us Section */}
          <div className="lg:col-span-3">
            <div
              className="text-xl font-bold tracking-[0%] leading-[120%] pb-4 md:pb-5 lg:pb-6"
              style={{ color: footerbg?.data?.text_color || "#1a1a1a" }}
            >
              FOLLOW US
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={
                  footerbg?.data?.twitter_link ||
                  "https://x.com/splurjj?lang=ar-x-fm"
                }
                className="bg-[#E6EEFE] p-3 rounded-full hover:bg-[#d1e7fd] transition-colors"
              >
                <Twitter className="text-primary w-8 h-8 cursor-pointer" />
              </Link>
              <Link
                href={
                  footerbg?.data?.instagram_link ||
                  "https://www.instagram.com/accounts/login/?next=%2Fsplurjj%2F&source=omni_redirect"
                }
                className="bg-[#E6EEFE] p-3 rounded-full hover:bg-[#d1e7fd] transition-colors"
              >
                <Instagram className="text-primary w-8 h-8 cursor-pointer" />
              </Link>
              <Link
                href={
                  footerbg?.data?.linkedin_link ||
                  "https://www.linkedin.com/in/sharif-dyson-795b62132"
                }
                className="bg-[#E6EEFE] p-3 rounded-full hover:bg-[#d1e7fd] transition-colors"
              >
                <Linkedin className="text-primary w-8 h-8 cursor-pointer" />
              </Link>
              <Link
                href={
                  footerbg?.data?.facebook_link ||
                  "https://www.facebook.com/splurjj/"
                }
                className="bg-[#E6EEFE] p-3 rounded-full hover:bg-[#d1e7fd] transition-colors"
              >
                <Facebook className="text-primary w-8 h-8 cursor-pointer" />
              </Link>
            </div>
            <div
              className="py-3 md:py-4 text-sm font-semibold tracking-[0%] leading-[150%]"
              style={{ color: footerbg?.data?.text_color || "#1a1a1a" }}
            >
              {"Don't miss out on the latest news by signing up"} <br />{" "}
              {"for our newsletters."}
            </div>
            <div>
              <NewsLetterForm />
            </div>
            <div
              className="text-lg md:text-xl font-semibold leading-[120%] tracking-[0%] pt-3 md:pt-4"
              style={{ color: footerbg?.data?.text_color || "#1a1a1a" }}
            >
              Download our App
            </div>
            <div className="flex items-center gap-4 mt-3 md:mt-4">
              <Link
                href={
                  footerbg?.data?.app_store_link ||
                  "https://apps.apple.com/us/app/doppl-google/id6741596720"
                }
              >
                <Image
                  src="/assets/images/google_play.png"
                  alt="Download on App Store"
                  width={165}
                  height={56}
                  className="hover:opacity-80 transition-opacity"
                />
              </Link>
              <Link
                href={
                  footerbg?.data?.google_play_link ||
                  "https://play.google.com/store/games?hl=en&pli=1"
                }
              >
                <Image
                  src="/assets/images/app_store.png"
                  alt="Get it on Google Play"
                  width={165}
                  height={56}
                  className="hover:opacity-80 transition-opacity"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-b border-[#D9D9D9] mt-4" />
        <div className="w-full h-[1px]" />

        <div
          className="w-full flex flex-col md:flex-row items-center justify-center pt-4 pb-3 md:pb-1 text-base font-medium leading-[120%] tracking-[0%] text-black gap-2"
          style={{ color: footerbg?.data?.text_color || "#1a1a1a" }}
        >
          <span>
            {footerbg?.data?.copyright ||
              "Copyright © 2025 SPLURJJ. All Rights Reserved."}
          </span>
          <Minus className="text-black w-[5px] h-auto hidden md:block" />
          <div className="md:flex items-center gap-4 space-x-4">
            {footerBottomPages.map((page, index) => (
              <Link
                key={`footer-bottom-${index}`}
                href={`/pages/${page}`}
                style={{ color: footerbg?.data?.text_color || "#1a1a1a" }}
                className="hover:underline"
              >
                {page}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
