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
  /** WYSIWYG - rich HTML content for newsletter/footer */
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

export interface BlockButton {
  button_text: string;
  button_url: string;
  button_text_color: string;
  button_fill_color?: string;
  button_border_color?: string;
  logo?: string | { id: string } | null;
}

export interface BlockTitle {
  id: string;
  /** WYSIWYG - rich HTML title */
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
  inner_name?: string;
  title_size?: number;
}

export interface BlockJourneyAppButton {
  button_text: string;
  button_url: string;
  button_border_color: string;
  button_text_color: string;
  button_fill_color?: string;
  logo?: string | { id: string } | null;
}

export interface BlockJourneyApp {
  id: string;
  image: string | { id: string } | null;
  /** WYSIWYG - rich HTML title */
  title: string | null;
  /** WYSIWYG - rich HTML content */
  content: string | null;
  buttons: BlockJourneyAppButton[];
  title_size?: number;
}

export interface BlockMobile {
  id: string;
  /** WYSIWYG - rich HTML title */
  title: string | null;
  /** WYSIWYG - rich HTML subtitle */
  subtitle: string | null;
  /** WYSIWYG - rich HTML content */
  content: string | null;
  image: string | null;
  image_position: string | null;
  button_text: string | null;
  button_url: string | null;
  content_size: number | null;
}

export interface BlockCard {
  id: string;
  /** WYSIWYG - rich HTML title */
  title: string | null;
  /** WYSIWYG - rich HTML subtitle */
  subtitle: string | null;
  subtitle_size: number | null;
  cards: CardItem[];
  title_size?: number;
  content_size?: number;
}

export interface CardItem {
  id: string;
  title: string | null;
  photo: string | null;
  /** WYSIWYG - rich HTML card content */
  content: string | null;
}

export interface BlockPricingCard {
  id: string;
  type_of_plan: string | null;
  background_image: string | { id: string } | null;
  button_text: string | null;
  button_url: string | null;
  /** WYSIWYG - rich HTML title */
  title: string | null;
  button_text_color: string | null;
  button_fill: string | null;
  pricing_cards: Array<{
    pricing_cards_id: PricingCardItem;
  }>;
}

export interface PricingCardItem {
  id: string;
  label: string | null;
  title: string | null;
  /** WYSIWYG - rich HTML content */
  content: string | null;
  monthly_price: string | null;
  yearly_price: string | null;
}

export interface BlockTestimonial {
  id: string;
  title: string | null;
  title_size: number | null;
  /** JSON list of testimonial items */
  testimonial: Array<{
    content: string;
    name: string;
  }>;
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
  block_journey_app: BlockJourneyApp[];
  block_mobile: BlockMobile[];
  block_card: BlockCard[];
  block_pricing_cards: BlockPricingCard[];
  block_testimonials: BlockTestimonial[];
  block_text_image: any[]; // Not yet implemented in frontend
  social_links: SocialLink[];
  footer_images: FooterImage[];
  pages: Page[];
  card: CardItem[];
  pricing_cards: PricingCardItem[];
  buttons: BlockButton[];
}
