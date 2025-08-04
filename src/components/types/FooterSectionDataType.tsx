export type FooterSectionDataType = {
  success: boolean;
  message: string;
  data: {
    footer_links: { title: string; url: string }[];
    facebook_link: string;
    instagram_link: string;
    linkedin_link: string;
    twitter_link: string;
    app_store_link: string;
    google_play_link: string;
    bg_color: string;
    copyright: string;
    text_color: string;
    active_text_color: string;
  };
};
