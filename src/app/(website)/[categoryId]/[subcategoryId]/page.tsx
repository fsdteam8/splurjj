
import React from "react";
import AllContentContainer from "../../_components/AllContentContainer";
import { Metadata } from "next";

const fetchData = async (categoryId: string, subcategoryId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contents/${categoryId}/${subcategoryId}`,
    { cache: "no-store" }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

export async function generateMetadata({
  params,
}: {
  params: { categoryId: string; subcategoryId: string };
}): Promise<Metadata> {
  const data = await fetchData(params.categoryId, params.subcategoryId);

  // Adjust depending on API shape
  const metaTitle = data?.data[0]?.sub_category_name || decodeURIComponent(params.subcategoryId);
  console.log(metaTitle , "metaTitle");
  const metaDescription = data?.data[0]?.meta_description || metaTitle;

  return {
    title: `${metaTitle} | Splurjj`,
    description: metaDescription,
  };
}

const AllContent = ({
  params,
}: {
  params: { categoryId: string; subcategoryId: string };
}) => {
  return (
    <div>
      <AllContentContainer
        categoryId={params.categoryId}
        subcategoryId={params.subcategoryId}
      />
    </div>
  );
};

export default AllContent;

