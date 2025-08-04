"use client";

import React from "react";
import AllContents from "./AllContents";
import ArtCulture from "./ArtCulture";
import Gear from "./gear";
import Music from "./music";
import Ride from "./ride";
import Video from "./video";
import Horizontal from "@/components/adds/horizontal";
import Vertical from "@/components/adds/vertical";
import { useQuery } from "@tanstack/react-query";
import QuitCalm from "./quitCalm";

interface Category {
  category_id: number;
  category_name: string;
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

const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`
  );
  if (!response.ok) throw new Error("Failed to fetch categories");
  const result: ApiResponse = await response.json();
  return result.data;
};

function MainHome() {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const firstCategory = categories[0]?.category_name;
  const secoundCategory = categories[1]?.category_name;
  const thirdPost = categories[2]?.category_name;
  const forthPost = categories[3]?.category_name;
  const fifthPost = categories[4]?.category_name;
  const sixthPost = categories[5]?.category_name;

  return (
    <div>
      <div className="container">
        <div className="grid grid-cols-8 gap-4 pt-16">
          {/* Main content */}
          <div className="col-span-8 md:col-span-6 pb-8 md:pb-14 lg:pb-16">
            <AllContents />
          </div>

          {/* Sticky sidebar */}
          <div className=" col-span-8 md:col-span-2">
            <div className="sticky top-[120px] mb-2">
              <Vertical />
            </div>
          </div>
        </div>
      </div>
      <div>
        <Horizontal />
        <div className="container">
          <div className="grid grid-cols-8 gap-4 pt-8 md:pt-12 lg:pt-16">
            {/* Main content */}
            <div className="col-span-8 md:col-span-6 pb-8 md:pb-12 lg:pb-5">
              <ArtCulture categoryName={{ categoryName: firstCategory }} />
              <Gear categoryName={{ categoryName: secoundCategory }} />
            </div>

            {/* Sticky sidebar */}
            <div className="col-span-8 md:col-span-2">
              <div className="sticky top-[120px] mb-2">
                <Vertical />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Horizontal />
        <div className="container">
          <div className="grid grid-cols-8 gap-4 pt-8 md:pt-12 lg:pt-16">
            {/* Main content */}
            <div className="col-span-8 md:col-span-6 pb-8 md:pb-12 lg:pb-10">
              <Music categoryName={{ categoryName: thirdPost }} />
              <Ride categoryName={{ categoryName: forthPost }} />
            </div>

            {/* Sticky sidebar */}
            <div className="col-span-8 md:col-span-2">
              <div className="sticky top-[120px] mb-2">
                <Vertical />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Horizontal />
        <div className="container">
          <div className="grid grid-cols-8 gap-4 pt-8 md:pt-12 lg:pt-16">
            {/* Main content */}
            <div className="col-span-8 md:col-span-6 pb-8 md:pb-12 lg:pb-10">
              <Video categoryName={{ categoryName: fifthPost }} />
            </div>

            {/* Sticky sidebar */}
            <div className="col-span-8 md:col-span-2">
              <div className="sticky top-[120px] mb-2">
                <Vertical />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Horizontal />
        <div className="container">
          <div className="grid grid-cols-8 gap-4 pt-4">
            {/* Main content */}
            <div className="col-span-8 md:col-span-6 pb-2">
              <QuitCalm categoryName={{ categoryName: sixthPost }} />
            </div>

            {/* Sticky sidebar */}
            <div className="col-span-8 md:col-span-2">
              <div className="sticky top-[120px] mb-2">
                <Vertical />
              </div>
            </div>
          </div>
        </div>
        <Horizontal />
      </div>
    </div>
  );
}

export default MainHome;
