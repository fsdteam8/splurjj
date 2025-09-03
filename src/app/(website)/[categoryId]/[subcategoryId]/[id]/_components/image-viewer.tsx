"use client"

import type React from "react"

import { useEffect, useState, useRef, useCallback } from "react"
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ImageViewerProps {
  images: string[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
  title?: string
}

export default function ImageViewer({ images, initialIndex, isOpen, onClose, title }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const imageRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Reset state when opening or changing images
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
      setScale(1)
      setPosition({ x: 0, y: 0 })
      setIsLoading(true)
    }
  }, [isOpen, initialIndex])

  // Reset zoom and position when changing images
  useEffect(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
    setIsLoading(true)
  }, [currentIndex])

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose()
          break
        case "ArrowLeft":
          handlePrevious()
          break
        case "ArrowRight":
          handleNext()
          break
        case "=":
        case "+":
          handleZoomIn()
          break
        case "-":
          handleZoomOut()
          break
        case "0":
          handleReset()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, currentIndex])

  const handlePrevious = useCallback(() => {
    if (images.length > 1) {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
    }
  }, [images.length])

  const handleNext = useCallback(() => {
    if (images.length > 1) {
      setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
    }
  }, [images.length])

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev * 1.2, 5))
  }, [])

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev / 1.2, 0.5))
  }, [])

  const handleReset = useCallback(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [])

  // Handle mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setScale((prev) => Math.min(Math.max(prev * delta, 0.5), 5))
  }, [])

  // Handle mouse drag
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      if (scale > 1) {
        setIsDragging(true)
        setDragStart({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        })
      }
    },
    [scale, position],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging && scale > 1) {
        e.preventDefault()
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        })
      }
    },
    [isDragging, dragStart, scale],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Handle double-click to zoom
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (scale === 1) {
        setScale(2)
        // Center zoom on click position
        const rect = containerRef.current?.getBoundingClientRect()
        if (rect) {
          const centerX = rect.width / 2
          const centerY = rect.height / 2
          const clickX = e.clientX - rect.left
          const clickY = e.clientY - rect.top
          setPosition({
            x: centerX - clickX,
            y: centerY - clickY,
          })
        }
      } else {
        handleReset()
      }
    },
    [scale, handleReset],
  )

  if (!isOpen) return null

  const currentImage = images[currentIndex]

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {title && <h2 className="text-white text-lg font-medium truncate max-w-md">{title}</h2>}
            <div className="text-white/70 text-sm">
              {currentIndex + 1} of {images.length}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/50 to-transparent p-4">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
            className="text-white hover:bg-white/20"
            title="Zoom Out (-)"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="text-white hover:bg-white/20"
            title="Reset (0)"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            disabled={scale >= 5}
            className="text-white hover:bg-white/20"
            title="Zoom In (+)"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <div className="text-white/70 text-sm ml-2">{Math.round(scale * 100)}%</div>
        </div>
      </div>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
            title="Previous (←)"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
            title="Next (→)"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Image container */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center p-16"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
          userSelect: "none",
        }}
      >
        <div
          ref={imageRef}
          className="relative transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: "center center",
          }}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
          <Image
            src={currentImage || "/placeholder.svg"}
            alt={`Image ${currentIndex + 1}`}
            width={1200}
            height={800}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
            priority
            unoptimized
          />
        </div>
      </div>

      {/* Help text */}
      <div className="absolute top-16 right-4 text-white/50 text-xs space-y-1 hidden md:block">
        <div>Double-click to zoom</div>
        <div>Mouse wheel to zoom</div>
        <div>Drag to pan when zoomed</div>
        <div>ESC to close</div>
      </div>
    </div>
  )
}




// "use client"

// import type React from "react"

// import { useEffect, useState } from "react"
// import Image from "next/image"
// import { X, ChevronLeft, ChevronRight } from "lucide-react"
// import { Button } from "@/components/ui/button"

// interface ImageViewerProps {
//   images: string[]
//   initialIndex: number
//   isOpen: boolean
//   onClose: () => void
//   title?: string
// }

// export default function ImageViewer({ images, initialIndex, isOpen, onClose, title }: ImageViewerProps) {
//   const [currentIndex, setCurrentIndex] = useState(initialIndex)

//   useEffect(() => {
//     setCurrentIndex(initialIndex)
//   }, [initialIndex])

//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = "hidden"
//     } else {
//       document.body.style.overflow = "unset"
//     }

//     return () => {
//       document.body.style.overflow = "unset"
//     }
//   }, [isOpen])

//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (!isOpen) return

//       switch (event.key) {
//         case "Escape":
//           onClose()
//           break
//         case "ArrowLeft":
//           goToPrevious()
//           break
//         case "ArrowRight":
//           goToNext()
//           break
//       }
//     }

//     window.addEventListener("keydown", handleKeyDown)
//     return () => window.removeEventListener("keydown", handleKeyDown)
//   }, [isOpen, currentIndex])

//   const goToNext = () => {
//     setCurrentIndex((prev) => (prev + 1) % images.length)
//   }

//   const goToPrevious = () => {
//     setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
//   }

//   const handleBackdropClick = (e: React.MouseEvent) => {
//     if (e.target === e.currentTarget) {
//       onClose()
//     }
//   }

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm" onClick={handleBackdropClick}>
//       {/* Header */}
//       <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
//         {title && <h2 className="text-white text-lg font-medium max-w-2xl truncate">{title}</h2>}
//         <div className="flex items-center gap-4 ml-auto">
//           <span className="text-white text-sm font-medium">
//             {currentIndex + 1} of {images.length}
//           </span>
//           <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 h-10 w-10">
//             <X className="h-6 w-6" />
//             <span className="sr-only">Close</span>
//           </Button>
//         </div>
//       </div>

//       {/* Navigation Buttons */}
//       {images.length > 1 && (
//         <>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={goToPrevious}
//             className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 h-24 w-12"
//           >
//             <ChevronLeft className="h-8 w-8" />
//             <span className="sr-only">Previous image</span>
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={goToNext}
//             className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 h-24 w-12"
//           >
//             <ChevronRight className="h-8 w-8" />
//             <span className="sr-only">Next image</span>
//           </Button>
//         </>
//       )}

//       {/* Main Image */}
//       <div className="flex items-center justify-center h-full p-4 pt-20 pb-20">
//         <div className="relative max-w-7xl max-h-full w-full h-full">
//           <Image
//             src={images[currentIndex] || "/placeholder.svg"}
//             alt={`Image ${currentIndex + 1} of ${images.length}`}
//             fill
//             className="object-contain"
//             priority
//             sizes="100vw"
//             onError={(e) => {
//               ;(e.currentTarget as HTMLImageElement).src = "/fallback-image.jpg"
//             }}
//           />
//         </div>
//       </div>

//       {/* Thumbnail Strip */}
//       {/* {images.length > 1 && (
//         <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/50 to-transparent">
//           <div className="flex items-center justify-center gap-2 p-4 overflow-x-auto">
//             <div className="flex gap-2 max-w-full">
//               {images.map((image, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrentIndex(index)}
//                   className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
//                     index === currentIndex ? "border-white scale-110" : "border-white/30 hover:border-white/60"
//                   }`}
//                 >
//                   <Image
//                     src={image || "/placeholder.svg"}
//                     alt={`Thumbnail ${index + 1}`}
//                     fill
//                     className="object-cover"
//                     sizes="64px"
//                   />
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       )} */}
//     </div>
//   )
// }
