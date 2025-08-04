export interface DashboardOverviewResponse {
  success: boolean;
  data: {
    total_content: number;
    total_pending_content: number;
    total_author: number;
    total_user: number;
    total_subscriber: number;
    recent_content: RecentContent;
  };
}

export interface RecentContent {
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
}

export interface ContentItem {
  id: number;
  category_id: number;
  subcategory_id: number;
  heading: string;
  author: string;
  date: string; // e.g. "1972-03-27"
  sub_heading: string;
  body1: string;
  image1: string | null;
  advertising_image: string | null;
  tags: string[]; // Parsed array
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
  imageLink: string | null;
  advertisingLink: string | null;
  user_id: number;
  status:
    | "Draft"
    | "Review"
    | "Approved"
    | "Published"
    | "Archived"
    | "Needs Revision"
    | "Rejected"
    | string;
  image2: string[];
  image2_url: string[];
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}
