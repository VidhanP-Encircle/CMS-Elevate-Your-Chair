export interface Notice {
  id: string;
  text: string;
  button_text: string | null;
  button_url: string | null;
  button_border: string | null;
  button_fill: string | null;
  button_text_color: string | null;
}

export interface GlobalSettings {
  brand_name: string;
  logo: string;
  favicon: string;
  link_details: Array<{ link_text: string; link_url: string }>;
  label: string;
  content: string;
  button_color: string | null;
  button_text_color: string | null;
  bg_color?: string | null;
  text_color?: string | null;
  subtitle_color?: string | null;
  global_title_size?: number | null;
  global_subtitle_size?: number | null;
  global_label_size?: number | null;
  global_content_size?: number | null;
  social_links: string[]; // UUIDs of social links
  footer_images: string[]; // UUIDs of footer images
}

export interface NavigationItem {
  id: string;
  name: string;
  slug: string;
}

export interface Navigation {
  id: string;
  items: number[];
}

export interface BlockTitle {
  id: string;
  title: string;
  subtitle: string;
  buttons: Array<{
    button_name: string;
    button_url: string;
    button_text: string;
    text_color: string;
    border_color?: string;
    fill_color?: string;
  }>;
  background_image: string | null;
  background_video: string | null;
  subtitle_size: string;
}

export interface SocialLink {
  id: string;
  url?: string;
  media_name?: string;
  media_logo?: string;
}

export interface FooterImage {
  id: string;
  image?: string;
}

export interface Page {
  id: string;
  inner_name: string;
  pages_blocks: any[];
}

export interface Schema {
  block_notice: Notice[];
  global_settings: GlobalSettings;
  navigation: Navigation[];
  navigation_items: NavigationItem[];
  block_title: BlockTitle[];
  social_links: SocialLink[];
  footer_images: FooterImage[];
  pages: Page[];
}
