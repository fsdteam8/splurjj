"use client"

import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useState, useEffect } from "react"

interface Page {
  id: number
  name: string
}

interface FooterSection {
  id: number
  title: string
  pages: string[]
  created_at: string
  updated_at: string
}

function AboutUSPages() {
  const session = useSession()
  const token = session.data?.user?.token
  const queryClient = useQueryClient()

  // Define the query to fetch page names
  const {
    data: pagesData,
    isLoading: isPagesLoading,
    isError: isPagesError,
    error: pagesError,
  } = useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pages`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      return response.data
    },
    enabled: !!token, // Only run query when token is available
  })

  // Define the query to fetch footer sections
  const {
    data: footerData,
    isLoading: isFooterLoading,
    isError: isFooterError,
    error: footerError,
  } = useQuery({
    queryKey: ["footer-sections"],
    queryFn: async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/footer-sections`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      return response.data
    },
    enabled: !!token, // Only run query when token is available
  })

  // Find the "About us" section
  const aboutUsSection = footerData?.find((section: FooterSection) => section.title === "About us")

  console.log(aboutUsSection)

  // State for controlled checkboxes
  const [checkedPages, setCheckedPages] = useState<string[]>([])

  // Update checkedPages when aboutUsSection data is loaded
  useEffect(() => {
    if (aboutUsSection?.pages) {
      setCheckedPages(aboutUsSection.pages)
    }
  }, [aboutUsSection])

  // Normalize page names for comparison
  const isPageChecked = (pageName: string) => {
    return checkedPages.some((p: string) => p.trim().toLowerCase() === pageName.trim().toLowerCase())
  }

  // Mutation for updating footer section
  const mutation = useMutation({
    mutationFn: async (pages: string[]) => {
      if (!token) {
        throw new Error("Authentication token is missing")
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/footer-sections/1`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "About us",
          pages,
        }),
      })
      if (!response.ok) {
        throw new Error(`Failed to update footer section: ${response.statusText}`)
      }
      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["footer-sections"] })
    },
    onError: (error: Error) => {
      console.error("Error updating footer section:", error.message)
    },
  })

  // Handle Add Pages button click
  const handleAddPages = () => {
    mutation.mutate(checkedPages)
  }

  // Handle checkbox change
  const handleCheckboxChange = (pageName: string, checked: boolean) => {
    if (checked) {
      setCheckedPages((prev) => [...prev, pageName])
    } else {
      setCheckedPages((prev) => prev.filter((p) => p !== pageName))
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between border border-gray-200 p-2 rounded-lg">
        <div>
          <h1 className="text-[20px] font-bold dark:text-black">About Us</h1>
        </div>
        <div>
          <Button className="text-white" onClick={handleAddPages} disabled={mutation.isPending || !token}>
            {mutation.isPending ? "Saving..." : "Add Pages"}
          </Button>
        </div>
      </div>

      <div className="mt-4">
        {isPagesLoading || isFooterLoading ? (
          <p>Loading...</p>
        ) : isPagesError || isFooterError ? (
          <p>Error: {pagesError?.message || footerError?.message}</p>
        ) : !pagesData || !footerData ? (
          <p>No data available</p>
        ) : (
          <ul className="space-y-2">
            {pagesData?.map((page: Page) => (
              <li key={page.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`page-${page.id}`}
                  className="h-4 w-4 rounded border-gray-300"
                  checked={isPageChecked(page.name)}
                  onChange={(e) => handleCheckboxChange(page.name, e.target.checked)}
                />
                <label htmlFor={`page-${page.id}`} className="cursor-pointer dark:text-black">
                  {page.name}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default AboutUSPages
