"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { CarouselApi } from "@/components/ui/carousel";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify"; // For sanitizing HTML
import { motion } from "framer-motion";

interface BlogPost {
  id: number;
  category_id: number;
  subcategory_id: number;
  category_name?: string;
  sub_category_name?: string;
  heading: string;
  author: string;
  date: string;
  sub_heading: string;
  body1: string;
  image1: string | null;
  image2?: string[] | null;
  advertising_image: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  imageLink: string | null;
  advertisingLink: string | null;
  user_id: number;
  status: string;
}

interface GearCarouselProps {
  posts: BlogPost[];
  getImageUrl: (image: string | null) => string;
}

export default function GearCarousel({
  posts,
  getImageUrl,
}: GearCarouselProps) {
  const [api, setApi] = useState<CarouselApi | null>(null);

  // Debug: Log posts and API
  useEffect(() => {
    console.log("GearCarousel Posts:", posts);
    console.log("Carousel API:", api);
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api, posts]);

  return (
    <div className="w-full mt-8">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {posts && posts.length > 0 ? (
            posts.flatMap((post, postIndex) =>
              post.image2 && post.image2.length > 0
                ? post.image2.map((image, imageIndex) => (
                    <CarouselItem key={`${post.id}-${imageIndex}`}>
                      <Link
                        href={`/${post.category_id}/${post.subcategory_id}/${post.id}`}
                        aria-label={`View post: ${
                          post.heading || "Untitled Post"
                        }`}
                      >
                        <div
                          style={{
                            backgroundImage: `url(${getImageUrl(image)})`,
                            height: "433px",
                          }}
                          className="flex items-center justify-center object-contain aspect-[2/1] w-full bg-contain bg-no-repeat bg-center"
                        >
                          <div className="text-center max-w-[1000px] mx-auto py-4 px-10 bg-black/20 rounded-[12px]">
                            <motion.p
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(post.heading),
                              }}
                              className="!text-white text-4xl lg:text-5xl md:text-left hover:underline"
                              whileHover={{
                                scale: 1.05,
                                fontWeight: 900,
                                transition: { duration: 0.3 },
                              }}
                            />
                            <div
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(post.sub_heading),
                              }}
                              className="text-lg font-normal line-clamp-3 !text-white md:text-left"
                            />
                          </div>
                        </div>
                      </Link>
                    </CarouselItem>
                  ))
                : post.image1
                ? [
                    <CarouselItem key={`${post.id}-${postIndex}`}>
                      <Link
                        href={`/${post.category_id}/${post.subcategory_id}/${post.id}`}
                        aria-label={`View post: ${
                          post.heading || "Untitled Post"
                        }`}
                      >
                        <div
                          style={{
                            backgroundImage: `url(${getImageUrl(post.image1)})`,
                            height: "433px",
                          }}
                          className="flex items-center justify-center aspect-[2/1] w-full bg-contain bg-no-repeat bg-center"
                        >
                          <div className="text-center">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(post.heading),
                              }}
                              className="!text-white text-4xl lg:text-5xl md:text-left"
                            />
                            <div
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(post.sub_heading),
                              }}
                              className="text-lg font-normal  line-clamp-3 !text-white md:text-left"
                            />
                          </div>
                        </div>
                      </Link>
                    </CarouselItem>,
                  ]
                : [
                    <CarouselItem key={`${post.id}-${postIndex}`}>
                      <div className="mt-8 text-center">
                        <p>No images available for post {post.id}</p>
                      </div>
                    </CarouselItem>,
                  ]
            )
          ) : (
            <CarouselItem>
              <div className="mt-8 text-center">
                <p>No posts available</p>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        {/* <CarouselPrevious />
        <CarouselNext /> */}
      </Carousel>
    </div>
  );
}
