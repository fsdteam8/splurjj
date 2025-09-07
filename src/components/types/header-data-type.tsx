export interface Header {
  logo: string;
  border_color: string;
  bg_color: string;
  menu_item_color: string;
  menu_item_active_color: string;
  dark_logo: string;
}

export interface HeaderApiResponse {
  success: boolean;
  message: string;
  data: Header;
}
