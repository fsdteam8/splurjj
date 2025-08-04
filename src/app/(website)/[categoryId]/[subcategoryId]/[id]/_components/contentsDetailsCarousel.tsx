"use client"

import { useEffect, useState } from "react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Image from "next/image"
import type { CarouselApi } from "@/components/ui/carousel"
import ImageViewer from "./image-viewer"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ContentItem {
  id: number
  category_id: number
  subcategory_id: number
  heading: string
  image1: string | null
  image2?: string | null
}

interface ImageCarouselProps {
  posts: ContentItem
  getImageUrl: (image: string | null) => string
}

export default function ContentsDetailsCarousel({ posts, getImageUrl }: ImageCarouselProps) {
  const [api, setApi] = useState<CarouselApi | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    if (!api) return
    const interval = setInterval(() => api.scrollNext(), 5000)
    return () => clearInterval(interval)
  }, [api])

  const imageUrls = (() => {
    const urls: string[] = []
    if (posts.image1) urls.push(getImageUrl(posts.image1))
    if (posts.image2) {
      // First check if it's already an array
      if (Array.isArray(posts.image2)) {
        urls.push(...posts.image2.map(getImageUrl))
      } else if (typeof posts.image2 === "string") {
        try {
          const parsed = JSON.parse(posts.image2)
          if (Array.isArray(parsed)) {
            urls.push(...parsed.map(getImageUrl))
          } else if (typeof parsed === "string") {
            urls.push(getImageUrl(parsed))
          }
        } catch {
          // If JSON parsing fails, treat it as a regular string
          urls.push(getImageUrl(posts.image2))
        }
      }
    }
    return urls.length ? urls : ["/fallback-image.jpg"]
  })()

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
    setIsViewerOpen(true)
  }

  const handleCloseViewer = () => {
    setIsViewerOpen(false)
  }

  return (
    <>
      <div className="w-full">
        <Carousel setApi={setApi} opts={{ align: "start", loop: true }} className="w-full relative">
          <CarouselContent>
            {imageUrls.map((imageUrl, index) => (
              <CarouselItem key={`${posts.id}-${index}`}>
                <div className="relative cursor-pointer group" onClick={() => handleImageClick(index)}>
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt={`Slide ${index + 1}`}
                    width={1200}
                    height={600}
                    className="aspect-[2/1] w-full object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                    onError={(e) => {
                      ;(e.currentTarget as HTMLImageElement).src = "/fallback-image.jpg"
                    }}
                  />
                  {/* Overlay hint */}
                  {/* <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Click to view full size
                    </div>
                  </div> */}
                  {/* Image counter badge */}
                  {imageUrls.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-sm font-medium">
                      {index + 1} / {imageUrls.length}
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Buttons - Only show if there are multiple images */}
          {imageUrls.length > 1 && (
            <>
              <button
                onClick={() => api?.scrollPrev()}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 dark:bg-gray-400 dark:text-black border border-white/20 text-white hover:bg-black/70 h-12 w-12 rounded-full hover:text-white transition-all duration-200 flex items-center justify-center z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => api?.scrollNext()}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 dark:bg-gray-400 dark:text-black border border-white/20 text-white hover:bg-black/70 h-12 w-12 rounded-full hover:text-white transition-all duration-200 flex items-center justify-center z-10"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </Carousel>
      </div>

      <ImageViewer
        images={imageUrls}
        initialIndex={selectedImageIndex}
        isOpen={isViewerOpen}
        onClose={handleCloseViewer}
        title={posts.heading}
      />
    </>
  )
}
