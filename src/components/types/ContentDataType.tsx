// export type ContentDataTypeResponse = {
//   id: number | string;
//   heading: string;
//   sub_heading: string;
//   author: string;
//   date: string;
//   body1: string;
//   tags: string[];
//   category_name: string;
//   sub_category_name: string;
//   image1?: string | null;
//   advertising_image?: string | null;
//   advertisingLink?: string | null;
//   imageLink?: string | null;
// };

// export type ContentAllDataTypeResponse = {
//   status: boolean;
//   data: ContentDataTypeResponse[];
//   meta: {
//     current_page: number;
//     per_page: number;
//     total_items: number;
//     total_pages: number;
//   };
// };






export type ContentDataTypeResponse = {
  id: number;
  heading: string;
  sub_heading: string;
  author: string;
  date: string;
  body1: string;
  tags: string[];
  category_name: string;
  sub_category_name: string;
  image1: string;
  advertising_image: string;
  advertisingLink: string | null;
  imageLink: string | null;
};

export type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

export type ContentAllDataTypeResponse = {
  success: boolean;
  data: {
    current_page: number;
    data: ContentDataTypeResponse[];
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
