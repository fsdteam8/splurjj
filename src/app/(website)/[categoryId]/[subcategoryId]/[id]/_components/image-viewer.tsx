"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageViewerProps {
  images: string[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
  title?: string
}

export default function ImageViewer({ images, initialIndex, isOpen, onClose, title }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case "Escape":
          onClose()
          break
        case "ArrowLeft":
          goToPrevious()
          break
        case "ArrowRight":
          goToNext()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, currentIndex])

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm" onClick={handleBackdropClick}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        {title && <h2 className="text-white text-lg font-medium max-w-2xl truncate">{title}</h2>}
        <div className="flex items-center gap-4 ml-auto">
          <span className="text-white text-sm font-medium">
            {currentIndex + 1} of {images.length}
          </span>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 h-10 w-10">
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </div>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 h-24 w-12"
          >
            <ChevronLeft className="h-8 w-8" />
            <span className="sr-only">Previous image</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 h-24 w-12"
          >
            <ChevronRight className="h-8 w-8" />
            <span className="sr-only">Next image</span>
          </Button>
        </>
      )}

      {/* Main Image */}
      <div className="flex items-center justify-center h-full p-4 pt-20 pb-20">
        <div className="relative max-w-7xl max-h-full w-full h-full">
          <Image
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`Image ${currentIndex + 1} of ${images.length}`}
            fill
            className="object-contain"
            priority
            sizes="100vw"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).src = "/fallback-image.jpg"
            }}
          />
        </div>
      </div>

      {/* Thumbnail Strip */}
      {/* {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex items-center justify-center gap-2 p-4 overflow-x-auto">
            <div className="flex gap-2 max-w-full">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex ? "border-white scale-110" : "border-white/30 hover:border-white/60"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )} */}
    </div>
  )
}
