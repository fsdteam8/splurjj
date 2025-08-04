import React from "react";
import ViewAuthorPost from "./_components/viewAuthorPost";
import Horizontal from "@/components/adds/horizontal";

function page(params: { params: { id: string } }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-8 gap-4 py-16">
      {/* Main content */}
      <div className="col-span-1 md:col-span-6">
        <ViewAuthorPost
          userId={Number(params.params.id)}
        />
      </div>

      {/* Sticky sidebar */}
      <div className="col-span-1 md:col-span-2">
        <div className="sticky top-[120px]">
          <Horizontal />
        </div>
      </div>
    </div>
  );
}

export default page;
