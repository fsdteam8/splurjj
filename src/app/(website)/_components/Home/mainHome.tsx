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
import { CategoryApiResponse } from "@/components/types/CategoryDataType";
import BodyForm from "./body-form";
import EtcByeond from "./etc-beyond";


function MainHome() {

  const {
    data: categoriesData,
    isLoading,
    isError,
    error,
  } = useQuery<CategoryApiResponse>({
    queryKey: ["categories"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`).then(
        (res) => res.json()
      ),
  });
  if (isLoading) {
    console.log("loading categories...");
    return null;
  }
  if (isError) {
    return <div className="text-black text-lg font-medium">Error: {error?.message}</div>;
  }

  // console.log(categories[0]?.category_name);
    const categories = categoriesData && categoriesData?.data || [];

    // console.log(categories , "categories");

  const firstCategory = categories[0]?.cat_slug;
  const secoundCategory = categories[1]?.cat_slug;
  const thirdPost = categories[2]?.cat_slug;
  const forthPost = categories[3]?.cat_slug;
  const fifthPost = categories[4]?.cat_slug;
  const sixthPost = categories[5]?.cat_slug;
  const sevenPost = categories[6]?.cat_slug;
  const eightPost = categories[7]?.cat_slug;

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
            <div className="!sticky top-[120px] mb-2">
              <Vertical />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="hidden md:block">
          <Horizontal />
        </div>
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
        <div className="hidden md:block">
          <Horizontal />
        </div>
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
        <div className="hidden md:block">
          <Horizontal />
        </div>
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
        <div className="hidden md:block">
          <Horizontal />
        </div>
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
      </div>

      {/* new posts section */}

      <div>
        <div className="hidden md:block">
          <Horizontal />
        </div>
        <div className="container">
          <div className="grid grid-cols-8 gap-4 pt-4">
            {/* Main content */}
            <div className="col-span-8 md:col-span-6 pb-2">
              <BodyForm categoryName={{ categoryName: sevenPost }} />
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

      <div className="">
        <div className="hidden md:block">
          <Horizontal />
        </div>
        <div className="container">
          <div className="grid grid-cols-8 gap-4 pt-4">
            {/* Main content */}
            <div className="col-span-8 md:col-span-6 pb-2">
              <EtcByeond categoryName={{ categoryName: eightPost }} />
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

      <div className="hidden md:block">
        <Horizontal />
      </div>
    </div>
  );
}

export default MainHome;
