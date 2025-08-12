
export type ContentItem = {
  id: number;
  heading: string;
  sub_heading: string;
  author: string;
  meta_title: string;
  meta_description: string;
  date: string;
  body1: string;
  tags: string[];
  category_id: number;
  subcategory_id: number;
  category_name: string;
  sub_category_name: string;
  image1: string | null;
  advertising_image: string | null;
  advertisingLink: string | null;
  image2: string[];
  image2_url: string[];
  imageLink: string | null;
  status:
    | "Draft"
    | "Review"
    | "Approved"
    | "Published"
    | "Archived"
    | "Needs Revision"
    | "Rejected"
    | string;
};

export type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

export type ContentDashboardResponse = {
  success: boolean;
  data: {
    current_page: number;
    data: ContentItem[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  current_page: number;
  total_pages: number;
  per_page: number;
  total: number;
};
