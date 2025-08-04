"use client"; // Required for client-side fetching in Next.js App Router

import React, { useEffect, useState } from "react";

interface PageData {
  id: number;
  name: string;
  body: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface AllpageProps {
  pagesName: string;
}

function Allpage({ pagesName }: AllpageProps) {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPageData() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pages/slug/${pagesName}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch page data");
        }
        const data: PageData = await response.json();
        setPageData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchPageData();
  }, [pagesName]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!pageData) return <div>No page data found</div>;

  return (
    <div className="">
      <div className="text-center text-[40px] py-10">
        <h1>{pageData.name}</h1>
      </div>
      <div className="pb-24 max-w-7xl mx-auto">
        <div dangerouslySetInnerHTML={{ __html: pageData.body }} />
      </div>
    </div>
  );
}

export default Allpage;
