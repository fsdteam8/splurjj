import React from "react";
import TagContainer from "./_components/TagContainer";
import Vertical from "@/components/adds/vertical";

interface PageParams {
  params: {
    categoryId: string;
    subcategoryId: string;
    id: string;
    tag: string;
  };
}

function Page({ params }: PageParams) {
  if (
    !params.categoryId ||
    !params.subcategoryId ||
    !params.id ||
    !params.tag
  ) {
    return <div>Error: Missing required parameters</div>;
  }

  const capitalize = (str: string) =>
    str
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="container mx-auto px-4">
      <div className="text-center pt-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
          {capitalize(params.tag)}
        </h1>
      </div>
      <div className="grid grid-cols-8 gap-4 pt-16">
        {/* Main content */}
        <div className="col-span-8 md:col-span-5 lg:col-span-6 pb-16">
          <TagContainer
            categoryId={params.categoryId}
            subcategoryId={params.subcategoryId}
            tag={params.tag}
          />
        </div>

        {/* Sticky sidebar */}
        <div className="col-span-8 md:col-span-3 lg:col-span-2">
          <div className="sticky top-[120px] mb-2">
           <Vertical />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
