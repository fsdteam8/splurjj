export interface LatestBlog {
  id: number;
  category_id: number;
  subcategory_id: number;
  heading: string;
  author: string;
  date: string; // ISO date string format
  sub_heading: string;
  body1: string;
  image1: string | null;
  advertising_image: string | null;
  tags: string[];
  created_at: string; // ISO date string format
  updated_at: string; // ISO date string format
  imageLink: string;
  advertisingLink: string;
  user_id: number;
}

export interface LatestBlogResponse {
  status: boolean;
  data: {
    latest: LatestBlog;
  };
}
