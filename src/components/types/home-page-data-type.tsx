export interface Content {
  id: number;
  category_id: number;
  subcategory_id: number;
  category_name: string;
  sub_category_name: string;
  heading: string;
  author: string;
  date: string;
  sub_heading: string;
  image1: string | null;
  image2: string[]; // multiple images
  image2_url: string[]; // same as image2 but looks like a second field
  advertising_image: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  body1: string;
  imageLink: string | null;
  advertisingLink: string | null;
  user_id: number;
  status: string;
  meta_title: string;
  meta_description: string;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface HomeContentApiResponse {
  success: boolean;
  message: string;
  data: Content[];
  pagination: Pagination;
}
