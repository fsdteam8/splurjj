"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Palette, History } from "lucide-react"

interface ColorPickerProps {
  selectedColor: string
  onColorChange: (color: string) => void
  // previousColor: string | null
}

interface HSVColor {
  h: number
  s: number
  v: number
}

export function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  const [previousColors, setPreviousColors] = useState<string[]>([])
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [hsvColor, setHsvColor] = useState<HSVColor>({ h: 0, s: 100, v: 100 })
  const [satValPosition, setSatValPosition] = useState({ x: 100, y: 0 })
  const [huePosition, setHuePosition] = useState(0)

  const colorPickerRef = useRef<HTMLDivElement>(null)
  const satValRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)

  // Load previous colors from localStorage on component mount
  useEffect(() => {
    const savedColors = localStorage.getItem("previousColors")
    if (savedColors) {
      setPreviousColors(JSON.parse(savedColors))
    }
  }, [])

  // Close color picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Initialize positions based on HSV
  useEffect(() => {
    setSatValPosition({
      x: hsvColor.s,
      y: 100 - hsvColor.v,
    })
    setHuePosition((hsvColor.h / 360) * 100)
  }, [hsvColor])

  // Convert HSV to RGB
  const hsvToRgb = (h: number, s: number, v: number): [number, number, number] => {
    s = s / 100
    v = v / 100

    const c = v * s
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = v - c

    let r = 0,
      g = 0,
      b = 0

    if (h >= 0 && h < 60) {
      ;[r, g, b] = [c, x, 0]
    } else if (h >= 60 && h < 120) {
      ;[r, g, b] = [x, c, 0]
    } else if (h >= 120 && h < 180) {
      ;[r, g, b] = [0, c, x]
    } else if (h >= 180 && h < 240) {
      ;[r, g, b] = [0, x, c]
    } else if (h >= 240 && h < 300) {
      ;[r, g, b] = [x, 0, c]
    } else {
      ;[r, g, b] = [c, 0, x]
    }

    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)]
  }

  // Convert RGB to Hex
  const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`
  }

  // Update color from HSV
  const updateColorFromHsv = (h: number, s: number, v: number) => {
    const [r, g, b] = hsvToRgb(h, s, v)
    const hex = rgbToHex(r, g, b)
    onColorChange(hex)
    setHsvColor({ h, s, v })
  }

  const handleColorChange = (color: string) => {
    // Add current color to previous colors before changing
    if (selectedColor && selectedColor !== color) {
      addToPreviousColors(selectedColor)
    }

    onColorChange(color)
  }

  const addToPreviousColors = (color: string) => {
    // Only add if it's a valid color and not already in the list
    if (color && color.startsWith("#")) {
      const newPreviousColors = [color, ...previousColors.filter((c) => c !== color).slice(0, 5)]
      setPreviousColors(newPreviousColors)

      // Save to localStorage
      localStorage.setItem("previousColors", JSON.stringify(newPreviousColors))
    }
  }

  const handleClearColor = () => {
    if (selectedColor) {
      addToPreviousColors(selectedColor)
    }
    onColorChange("")
  }

  const handleColorPickerClick = (e: React.MouseEvent) => {
    // Prevent the click from closing the picker immediately
    e.stopPropagation()
  }

  const handleSatValChange = (e: React.MouseEvent) => {
    if (!satValRef.current) return

    const rect = satValRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left))
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top))

    const s = Math.round((x / rect.width) * 100)
    const v = Math.round(100 - (y / rect.height) * 100)

    setSatValPosition({ x: s, y: 100 - v })
    updateColorFromHsv(hsvColor.h, s, v)
  }

  const handleHueChange = (e: React.MouseEvent) => {
    if (!hueRef.current) return

    const rect = hueRef.current.getBoundingClientRect()
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top))
    const huePercent = (y / rect.height) * 100
    const hue = Math.round(3.6 * huePercent)

    setHuePosition(huePercent)
    updateColorFromHsv(hue, hsvColor.s, hsvColor.v)
  }

  const handleSatValMouseDown = (e: React.MouseEvent) => {
    handleSatValChange(e)

    const onMouseMove = (e: MouseEvent) => {
      handleSatValChange(e as unknown as React.MouseEvent)
    }

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
    }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
  }

  const handleHueMouseDown = (e: React.MouseEvent) => {
    handleHueChange(e)

    const onMouseMove = (e: MouseEvent) => {
      handleHueChange(e as unknown as React.MouseEvent)
    }

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
    }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
  }

  // Predefined color swatches
  const colorSwatches = ["#000000", "#FFFFFF", "#FF0000", "#FFFF00", "#00FF00", "#0000FF", "#800080"]

  return (
    <div className="relative">
      <div className="flex items-center gap-4">
        {/* Color preview circle with icon */}
        <div
          className="w-16 h-16 rounded-md overflow-hidden border border-gray-300 cursor-pointer flex items-center justify-center"
          onClick={() => setShowColorPicker(!showColorPicker)}
          style={{ backgroundColor: selectedColor || "#ccc" }}
        >
          <Palette
            className={`w-8 h-8 ${selectedColor ? "text-white" : "text-gray-500"}`}
            style={{
              filter: selectedColor ? "drop-shadow(0px 0px 1px rgba(0,0,0,0.5))" : "none",
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Input
              id="colorHex"
              value={selectedColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-24 text-black"
            />
            <Button variant="outline" className="h-10 px-4 dark:text-black" onClick={handleClearColor}>
              Clear
            </Button>
          </div>

          {/* Previous color section */}
          {/* {previousColor && (
            <div className="flex items-center gap-2 mt-2">
              <div className="w-6 h-6 rounded-sm border border-gray-300" style={{ backgroundColor: previousColor }} />
              <span className="text-xs text-gray-500 dark:text-black">Previous: {previousColor}</span>
            </div>
          )} */}
        </div>
      </div>

      {/* Color picker panel */}
      {showColorPicker && (
        <div
          ref={colorPickerRef}
          className="absolute z-10 mt-2 p-2 bg-white border border-gray-300 rounded-md shadow-lg"
          onClick={handleColorPickerClick}
        >
          {/* Color gradient area */}
          <div className="flex gap-2">
            <div
              ref={satValRef}
              className="w-48 h-48 relative border border-gray-300 cursor-crosshair"
              onMouseDown={handleSatValMouseDown}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 100%), 
                              linear-gradient(to right, #fff 0%, hsl(${hsvColor.h}, 100%, 50%) 100%)`,
                }}
              />
              {/* Color picker indicator */}
              <div
                className="absolute w-4 h-4 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  left: `${satValPosition.x}%`,
                  top: `${satValPosition.y}%`,
                  boxShadow: "0 0 0 1px rgba(0,0,0,0.3)",
                }}
              />
            </div>

            {/* Hue slider */}
            <div
              ref={hueRef}
              className="w-6 h-48 relative border border-gray-300 cursor-pointer"
              onMouseDown={handleHueMouseDown}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
                }}
              />
              {/* Hue slider indicator */}
              <div
                className="absolute w-8 h-2 bg-white border border-gray-300 left-0 transform -translate-y-1/2 -translate-x-1px pointer-events-none"
                style={{
                  top: `${huePosition}%`,
                  boxShadow: "0 0 0 1px rgba(0,0,0,0.3)",
                }}
              />
            </div>
          </div>

          {/* Previous colors section */}
          {previousColors.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center gap-1 mb-1">
                <History className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-500">Recent Colors</span>
              </div>
              <div className="flex gap-1">
                {previousColors.map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-sm cursor-pointer border border-gray-300"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Color swatches */}
          <div className="flex mt-2 gap-1">
            {colorSwatches.map((color, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-sm cursor-pointer border border-gray-300"
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

