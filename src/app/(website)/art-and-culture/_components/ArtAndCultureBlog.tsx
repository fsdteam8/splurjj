import { blogData } from "@/components/data/BlogData";
import MainBlogCart from "@/components/shared/MainBlogCart";
import React from "react";

const ArtAndCultureBlog = () => {
  return (
    <div>
      <div>
        {blogData?.map((blog) => {
          return <MainBlogCart key={blog.id} blog={blog} />;
        })}
      </div>
    </div>
  );
};

export default ArtAndCultureBlog;
