
import Vertical from "@/components/adds/vertical"
import { Suspense } from "react"
import Contents from "./_components/contents"

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const searchQuery = searchParams.q || ""

  return (
    <div className="container">
      <div className="text-center pt-16">
        <h1 className="text-[60px] font-bold ">All Content</h1>
        {/* <p className="max-w-[800px] mx-auto">
          {searchQuery ? `Showing results for "${searchQuery}"` : "Enter a query to search for content."}
        </p> */}
      </div>
      <div className="grid grid-cols-8 gap-4 pt-16">
        {/* Main content */}
        <div className="col-span-8 md:col-span-6 pb-16">
          <Suspense fallback={<div>Loading search results...</div>}>
            <Contents initialSearchQuery={searchQuery} />
          </Suspense>
        </div>
        {/* Sticky sidebar */}
        <div className="col-span-8 md:col-span-2">
          <div className="sticky top-[120px] mb-2">
            <Vertical />
          </div>
        </div>
      </div>
    </div>
  )
}
