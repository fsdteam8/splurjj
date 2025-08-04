"use client";

import { useEffect, useState } from "react";
import CategoryContents from "./_components/categoryContents";
import Vertical from "@/components/adds/vertical";

interface BlogPost {
  id: number;
  category_id: number;
  subcategory_id: number;
  category_name: string;
  sub_category_name: string;
  heading: string;
  author: string;
  date: string;
  sub_heading: string;
  body1: string;
  image1: string;
  advertising_image: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  imageLink: string;
  advertisingLink: string;
  user_id: number;
  status: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: BlogPost[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

interface PageProps {
  params: { category_name: string };
}

function Page({ params }: PageProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);


  const limit = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/home/${params.category_name}?page=${currentPage}&limit=${limit}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data: ApiResponse = await response.json();
        setPosts(data.data || []);
        setTotalPages(data.meta.last_page);
        setTotalItems(data.meta.total);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.category_name, currentPage]);


  console.log(posts, "posts");

  // Capitalize category name for display
const capitalize = (str: string) =>
  decodeURIComponent(str) // decode URL-encoded characters
    .replace(/-/g, " ")    // replace hyphens with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize first letters


  return (
    <div className="container mx-auto px-4">
      <div className="text-center pt-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
          {capitalize(params.category_name)} Content
        </h1>
      </div>
      <div className="grid grid-cols-8 gap-4 py-16">
        {/* Main content */}
        <div className="col-span-8 md:col-span-5 lg:col-span-6">
          <CategoryContents
            posts={posts}
            loading={loading}
            error={error}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            setCurrentPage={setCurrentPage}
          />
        </div>

        {/* Sticky sidebar */}
        <div className="col-span-8 md:col-span-3 lg:col-span-2">
          <div className="sticky top-[120px]">
            <Vertical />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;