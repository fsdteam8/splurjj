// types/blogPost.ts
export interface BlogPost {
  id: number;
  category_id: number;
  subcategory_id: number;
  category_name: string;
  sub_category_name: string;
  heading: string;
  author: string;
  date: string;
  sub_heading: string;
  body1: string;
  image1: string;
  image2?: string | string[] | null | undefined;
  advertising_image: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  imageLink: string;
  advertisingLink: string;
  user_id: number;
  status: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: BlogPost[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}