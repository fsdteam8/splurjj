"use client";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Search, ShoppingCart, User, ChevronDown, Menu, X } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/app/theme-toggle";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FooterSectionDataType } from "@/components/types/FooterSectionDataType";

// Define search result type (assumed based on typical API response)
// interface SearchResult {
//   id: number
//   heading: string
//   sub_heading: string
//   // Add other relevant fields as needed
// }
// interface SearchApiResponse {
//   success: boolean
//   data: SearchResult[]
//   pagination: {
//     current_page: number
//     last_page: number
//     per_page: number
//     total: number
//   }
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
    bg_color: string;
    copyright: string;
  };
};
interface Subcategory {
  id: number;
  name: string;
}
interface Category {
  category_id: number;
  category_name: string;
  subcategories: Subcategory[];
}
interface ApiResponse {
  success: boolean;
  data: Category[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
interface ThemeHeader {
  bg_color: string;
  border_color: string;
  logo: string;
  menu_item_active_color: string;
  menu_item_color: string;
}

// Fetch Functions
const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`
  );
  if (!response.ok) throw new Error("Failed to fetch categories");
  const result: ApiResponse = await response.json();
  return result.data;
};
const fetchHeader = async (): Promise<ThemeHeader> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/header`
  );
  if (!response.ok) throw new Error("Failed to fetch header");
  const result = await response.json();
  return result.data;
};
// const fetchSearchResults = async (query: string): Promise<SearchApiResponse> => {
//   const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search?q=${encodeURIComponent(query)}`)
//   if (!response.ok) throw new Error("Failed to fetch search results")
//   const result: SearchApiResponse = await response.json()
//   return result
// }

// Component
export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;
  const role = session?.data?.user?.role;
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const dropdownCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const {
    data: header,
    isLoading: headerLoading,
    error: headerError,
  } = useQuery({
    queryKey: ["header"],
    queryFn: fetchHeader,
  });
  const staticMenuItems = [{ name: "LATEST", href: "/" }];

  // Initialize searchQuery from URL on component mount
  useEffect(() => {
    const qParam = searchParams.get("q");
    if (qParam) {
      setSearchQuery(qParam);
      setIsSearchOpen(true); // Open search bar if there's a query in URL
    }
  }, [searchParams]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }
    // Navigate to search results page with query
    router.push(`/homeAllContent?q=${encodeURIComponent(searchQuery)}`);
    setIsSearchOpen(false); // Close search bar after submitting
    // setSearchQuery(""); // Keep search query in input after navigation
  };

  // Handle clearing search
  const handleClearSearch = () => {
    setSearchQuery("");
    // Navigate to current path without search param
    router.push(pathName);
    setIsSearchOpen(false);
  };

  // Handle search on Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(e); // Trigger the search function
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const getImageUrl = (path: string | null): string => {
    if (!path) return "/assets/videos/blog1.jpg";
    if (path.startsWith("http")) return path;
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path.replace(/^\/+/, "")}`;
  };

  const handLogout = () => {
    try {
      toast.success("Logout successful!");
      setTimeout(async () => {
        await signOut({ callbackUrl: "/" });
      }, 1000);
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const isCategoryActive = (categoryId: number) => {
    return (
      pathName === `/${categoryId}` ||
      categories
        .find((cat) => cat.category_id === categoryId)
        ?.subcategories.some((sub) => pathName === `/${categoryId}/${sub.id}`)
    );
  };

  const handleDropdownOpen = (categoryId: number) => {
    if (dropdownCloseTimeoutRef.current) {
      clearTimeout(dropdownCloseTimeoutRef.current);
      dropdownCloseTimeoutRef.current = null;
    }
    setActiveDropdownId(categoryId);
  };

  const handleDropdownClose = () => {
    if (dropdownCloseTimeoutRef.current) {
      clearTimeout(dropdownCloseTimeoutRef.current);
    }
    dropdownCloseTimeoutRef.current = setTimeout(() => {
      setActiveDropdownId(null);
    }, 150);
  };

  // const { data } = useQuery<FooterData>({
  //   queryKey: ["footerData"],
  //   queryFn: () =>
  //     fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/footer`).then((res) =>
  //       res.json()
  //     ),
  // });
  // footer section
  const {
    data: footerbg,
    isLoading,
    isError,
    error,
  } = useQuery<FooterSectionDataType>({
    queryKey: ["footer-section"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/footer`).then((res) =>
        res.json()
      ),
  });

  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="h-[16px] bg-gray-300" />
      <header className="w-full border-b bg-white">
        <div className="container">
          <div className="flex h-[80px] items-center justify-between">
            <div className="bg-gray-300 h-[55px] w-[90px] rounded"></div>
            <nav className="hidden lg:flex items-center space-x-8">
              <div className="bg-gray-300 h-4 w-16 rounded"></div>
              {[1, 2, 3, 4].map((_, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <div className="bg-gray-300 h-4 w-20 rounded"></div>
                  <div className="bg-gray-300 h-4 w-4 rounded"></div>
                </div>
              ))}
            </nav>
            <div className="flex items-center space-x-2">
              <div className="bg-gray-300 h-8 w-8 rounded-full"></div>
              <div className="bg-gray-300 h-8 w-8 rounded-full hidden sm:block"></div>
              <div className="bg-gray-300 h-8 w-8 rounded-full hidden sm:block"></div>
              <div className="bg-gray-300 h-8 w-8 rounded-full"></div>
              <div className="bg-gray-300 h-8 w-8 rounded-full lg:hidden"></div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );

  if (categoriesLoading || headerLoading) return <SkeletonLoader />;
  if (categoriesError || headerError)
    return (
      <div className="text-center py-8 text-red-500">
        Error:{" "}
        {(categoriesError || headerError)?.message || "Failed to load header"}
      </div>
    );

  if (isLoading) {
    return <div>loading...</div>;
  }
  if (isError) {
    return <div>{error?.message}</div>;
  }

  return (
    <>
      <div
        className="h-[16px] sticky top-0 z-50"
        style={{ backgroundColor: footerbg?.data?.bg_color || "#C9C3C3" }}
      />
      <header
        className="sticky top-0 z-50 w-full  bg-white backdrop-blur supports-[backdrop-filter]:bg-background/60"
        style={{ backgroundColor: header?.bg_color || "#ffffff" }}
      >
        <div className="container">
          <div className="flex h-[65px] md:h-[80px] items-center justify-between">
            <div className="flex items-center justify-start gap-6">
              <div className="h-[35px] md:h-[40px] w-[70px] md:w-[90px] flex items-center justify-start">
                <Link href="/" className="">
                  <Image
                    src={getImageUrl(header?.logo || "/logo.png")}
                    alt="Logo"
                    width={50}
                    height={30}
                    className="w-[90px] h-[55px] object-contain"
                  />
                </Link>
              </div>
              <nav className="hidden lg:flex items-start space-x-8">
                {staticMenuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm font-medium transition-colors hover:text-primary"
                    style={{
                      color:
                        pathName === item.href
                          ? header?.menu_item_active_color || "#0253F7"
                          : header?.menu_item_color || "text-muted-foreground",
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
                {categories?.map((category) => {
                  const isActive = isCategoryActive(category.category_id);
                  if (category.subcategories.length === 0) {
                    return (
                      <Link
                        key={category.category_id}
                        href={`/blogs/${category.category_name}`}
                        className="text-xs lg:text-sm font-medium transition-colors hover:text-primary "
                        style={{
                          color: isActive
                            ? header?.menu_item_active_color || "#0253F7"
                            : header?.menu_item_color ||
                              "text-muted-foreground",
                        }}
                      >
                        {category.category_name.toUpperCase()}
                      </Link>
                    );
                  }
                  return (
                    <DropdownMenu
                      key={category.category_id}
                      open={activeDropdownId === category.category_id}
                      onOpenChange={(openState) => {
                        if (
                          !openState &&
                          activeDropdownId === category.category_id
                        ) {
                          setActiveDropdownId(null);
                          if (dropdownCloseTimeoutRef.current) {
                            clearTimeout(dropdownCloseTimeoutRef.current);
                            dropdownCloseTimeoutRef.current = null;
                          }
                        }
                      }}
                    >
                      <DropdownMenuTrigger asChild>
                        <div
                          className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary border-0 outline-none ring-0 cursor-pointer"
                          onPointerEnter={() =>
                            handleDropdownOpen(category.category_id)
                          }
                          onPointerLeave={handleDropdownClose}
                          style={{
                            color:
                              isActive ||
                              activeDropdownId === category.category_id
                                ? header?.menu_item_active_color || "#0253F7"
                                : header?.menu_item_color ||
                                  "text-muted-foreground",
                          }}
                        >
                          <Link
                            href={`/blogs/${category.category_name}`}
                            className="text-sm lg:text-sm font-medium transition-colors hover:text-primary"
                            style={{
                              color:
                                isActive ||
                                activeDropdownId === category.category_id
                                  ? header?.menu_item_active_color || "#0253F7"
                                  : header?.menu_item_color ||
                                    "text-muted-foreground",
                            }}
                            onClick={() => {
                              setActiveDropdownId(null);
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            {category.category_name.toUpperCase()}
                          </Link>
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-48 bg-white text-[18px] font-semibold border-0 mt-[5px]"
                        onPointerEnter={() =>
                          handleDropdownOpen(category.category_id)
                        }
                        onPointerLeave={handleDropdownClose}
                      >
                        {category.subcategories.map((subcategory) => (
                          <DropdownMenuItem key={subcategory.id} asChild>
                            <Link
                              href={`/${category.category_id}/${subcategory.id}`}
                              className="cursor-pointer"
                              style={{
                                color:
                                  pathName ===
                                  `/${category.category_id}/${subcategory.id}`
                                    ? header?.menu_item_active_color ||
                                      "#0253F7"
                                    : header?.menu_item_color ||
                                      "text-muted-foreground",
                              }}
                            >
                              {subcategory.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                })}
              </nav>
            </div>

            {/* Right Actions */}
            <div className="flex items-center justify-end space-x-2">
              {/* Search */}
              <div className="relative">
                {isSearchOpen ? (
                  <form
                    onSubmit={handleSearch}
                    className="flex items-center w-full max-w-sm transition-all duration-300 border border-gray-300 rounded-full px-3 py-1 bg-white shadow-sm"
                    role="search"
                  >
                    <Input
                      type="text"
                      placeholder="Search products, categories..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onKeyDown={handleKeyDown}
                      className="w-full ml-2 bg-transparent text-sm focus:ring-0 focus:outline-none focus:border-0 border-0 outline-none ring-0 placeholder:text-gray-400 dark:text-black"
                      autoFocus
                      aria-label="Search content"
                    />
                    <button
                      type="submit"
                      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors ml-2"
                      aria-label="Submit search"
                    >
                      <Search className="h-5 w-5 text-black" />
                    </button>
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors ml-1"
                      aria-label="Close search"
                    >
                      <X className="h-4 w-4 text-black" />
                    </button>
                  </form>
                ) : (
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    onClick={() => setIsSearchOpen(true)}
                    aria-label="Open search"
                  >
                    <Search className="text-black w-[24px] h-[24px]" />
                  </button>
                )}
              </div>
              <ShoppingCart
                className="text-black hidden sm:block mr-4"
                size={30}
              />
              <div className="hidden sm:block">
                {token ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-1 rounded-full hover:bg-gray-100">
                      <User className="text-black w-[33px] h-[33px]" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white w-[130px]">
                      {["admin", "editor", "author"].includes(role ?? "") ? (
                        <Link href="/dashboard">
                          <DropdownMenuLabel
                            style={{
                              color:
                                pathName === "/dashboard"
                                  ? header?.menu_item_active_color
                                  : header?.menu_item_color,
                            }}
                          >
                            Dashboard
                          </DropdownMenuLabel>
                        </Link>
                      ) : (role ?? "") === "user" ? (
                        <Link href="/accounts">
                          <DropdownMenuLabel
                            style={{
                              color:
                                pathName === "/accounts"
                                  ? header?.menu_item_active_color
                                  : header?.menu_item_color,
                            }}
                          >
                            My Account
                          </DropdownMenuLabel>
                        </Link>
                      ) : null}
                      <DropdownMenuItem
                        onClick={() => setLogoutModalOpen(true)}
                        className="text-[#DB0000] cursor-pointer"
                      >
                        Log Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    href="/login"
                    className="p-1 rounded text-white px-4 py-2 bg-black hover:bg-white hover:text-black my-2"
                  >
                    Sign In
                  </Link>
                )}
              </div>
              <div>
                <ThemeToggle />
              </div>
              <div className="block md:hidden">
                <div className="w-full flex items-center !justify-end">
                  <button
                    className="lg:hidden !inline-flex !items-center !justify-end"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                  >
                    {isMobileMenuOpen ? (
                      <X className="!h-9 !w-9 dark:text-black" size={48} />
                    ) : (
                      <Menu className="dark:text-black !w-9 !h-9" size={48} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t py-4">
              <nav className="flex flex-col space-y-4">
                {staticMenuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm font-medium py-2"
                    style={{
                      color:
                        pathName === item.href
                          ? header?.menu_item_active_color
                          : header?.menu_item_color,
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <Accordion type="single" collapsible className="w-full">
                  {categories.map((category) => {
                    const isActive = isCategoryActive(category.category_id);
                    if (category.subcategories.length === 0) {
                      return (
                        <Link
                          key={category.category_id}
                          href={`/blogs/${category.category_name}`}
                          className="text-sm font-medium py-2"
                          style={{
                            color: isActive
                              ? header?.menu_item_active_color
                              : header?.menu_item_color,
                          }}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {category.category_name.toUpperCase()}
                        </Link>
                      );
                    }
                    return (
                      <AccordionItem
                        value={`item-${category.category_id}`}
                        key={category.category_id}
                        className="border-b-0"
                      >
                        <AccordionTrigger
                          className="flex items-center justify-between w-full py-2 text-sm font-medium hover:no-underline"
                          style={{
                            color: isActive
                              ? header?.menu_item_active_color
                              : header?.menu_item_color,
                          }}
                        >
                          <Link
                            href={`/blogs/${category.category_name}`}
                            className="flex-grow text-left"
                            style={{
                              color: isActive
                                ? header?.menu_item_active_color
                                : header?.menu_item_color,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            {category.category_name.toUpperCase()}
                          </Link>
                        </AccordionTrigger>
                        <AccordionContent>
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col space-y-2 pl-4 py-2"
                          >
                            {category.subcategories.map((sub) => (
                              <Link
                                key={sub.id}
                                href={`/${category.category_id}/${sub.id}`}
                                className="block text-sm"
                                style={{
                                  color:
                                    pathName ===
                                    `/${category.category_id}/${sub.id}`
                                      ? header?.menu_item_active_color
                                      : header?.menu_item_color,
                                }}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </motion.div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
                <div className="flex items-center space-x-4 mt-4 sm:hidden">
                  <ShoppingCart className="text-black" size={30} />
                </div>
                <div className="mt-2 sm:hidden">
                  {token ? (
                    <div className="flex flex-col space-y-2">
                      {["admin", "editor", "author"].includes(role ?? "") ? (
                        <Link
                          href="/dashboard"
                          className="text-base font-semibold"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                      ) : (role ?? "") === "user" ? (
                        <Link
                          href="/accounts"
                          className="text-base font-semibold"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          My Account
                        </Link>
                      ) : null}
                      <button
                        onClick={() => {
                          setLogoutModalOpen(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-[#DB0000] font-semibold text-base text-left"
                      >
                        Log Out
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/sign-up"
                      className="block p-2 rounded text-white bg-black text-center mt-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
      {logoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 dark:text-black">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6 dark:text-black">
              Are you sure you want to log out?
            </p>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => setLogoutModalOpen(false)}
                className="flex-1 dark:text-black"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setLogoutModalOpen(false);
                  handLogout();
                }}
                className="flex-1 border border-red-500 text-red-500 dark:text-red-500 hover:bg-red-500 hover:text-white dark:hover:text-white font-semibold"
              >
                Log Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
