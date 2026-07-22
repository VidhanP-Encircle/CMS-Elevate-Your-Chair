import { ReactNode, CSSProperties } from "react";

export interface Notice {
  id: string;
  text: string;
  button_text: string | null;
  button_url: string | null;
  button_border: string | null;
  button_fill: string | null;
  button_text_color: string | null;
  buttons?: Array<{ buttons_id: BlockButton | number }>;
}

export interface GlobalSettings {
  brand_name: string;
  handle_name?: string | null;
  logo: string;
  favicon: string;
  link_details: Array<{ link_text: string; link_url: string }>;
  label: string;
  /** WYSIWYG - rich HTML content for newsletter/footer */
  content: string;
  button_color: string | null;
  button_text_color: string | null;
  button_hover_text_color: string | null;
  button_hover_fill_color: string | null;
  bg_color?: string | null;
  text_color?: string | null;
  subtitle_color?: string | null;
  global_title_size?: number | null;
  global_subtitle_size?: number | null;
  global_label_size?: number | null;
  global_content_size?: number | null;
  social_links: string[]; // UUIDs of social links
  footer_images: string[]; // UUIDs of footer images
  buttons?: Array<{ buttons_id: BlockButton | number }>;
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
  id?: number | string;
  button_text: string;
  button_url?: string | null;
  button_text_color?: string | null;
  button_fill_color?: string | null;
  button_border_color?: string | null;
  button_hover_text_color?: string | null;
  button_hover_fill_color?: string | null;
  logo?: string | { id: string } | null;
  hover_logo?: string | { id: string } | null;
  inner_name?: string | null;
  type?: "redirect" | "more_less" | "submit" | "navigation" | string | null;
  user_created?: string | null;
  date_created?: string | null;
  user_updated?: string | null;
  date_updated?: string | null;
}

export interface BlockTitle {
  id: string;
  /** WYSIWYG - rich HTML title */
  title: string;
  subtitle: string;
  buttons: Array<{
    buttons_id: BlockButton | number;
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
  button_hover_text_color?: string | null;
  button_hover_fill_color?: string | null;
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
  button_hover_text_color?: string | null;
  button_hover_fill_color?: string | null;
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
  buttons: Array<{
    buttons_id: BlockButton | number;
  }>;
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
  theme?: string | null;
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
  title: string | null;
  /** WYSIWYG - rich HTML content */
  content: string | null;
  show_benefits: string | null;
  button_text: string | null;
  button_url: string | null;
  button_text_color: string | null;
  button_fill: string | null;
  button_hover_text_color?: string | null;
  button_hover_fill_color?: string | null;
  pricing_cards: Array<{
    pricing_cards_id: PricingCardItem;
  }>;
  buttons: Array<{
    buttons_id: BlockButton | number;
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

export interface PricingBenefit {
  id: string;
  sort: number | null;
  title: string | null;
}

export interface BlockTestimonial {
  id: string;
  title: string | null;
  title_size: number | null;
  background_image: string | { id: string } | null;
  /** JSON list of testimonial items */
  testimonial: Array<{
    content: string;
    name: string;
  }>;
}

export interface BlockFaqItem {
  questions: string;
  answers: string;
}

export interface BlockFaqs {
  id: string;
  title: string | null;
  /** JSON list of FAQ items with questions and answers */
  que_ans: BlockFaqItem[];
  background_image?: string | { id: string } | null;
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
  slug: string | null;
  pages_blocks: any[];
}

export interface TextImageItem {
  id: string;
  photo: string | null;
  title: string | null;
}

export interface BlockTextImage {
  id: string;
  /** WYSIWYG - rich HTML title */
  title: string | null;
  initial_text: string | null;
  label: string | null;
  /** WYSIWYG - rich HTML content */
  content: string | null;
  bottom_text: string | null;
  button_text: string | null;
  button_url: string | null;
  background_image: string | { id: string } | null;
  text_image: Array<{
    text_image_id: TextImageItem | string;
  }>;
  buttons: Array<{
    buttons_id: BlockButton | number;
  }>;
}

export interface SlideItem {
  id: string;
  sort: number | null;
  title: string | null;
  subtitle: string | null;
  background_image: string | { id: string } | null;
}

export interface BlockSlider {
  id: string;
  slides: Array<{
    slides_id: SlideItem | string;
  }>;
  button: Array<{
    buttons_id: BlockButton | number;
  }>;
}

export interface BlogItem {
  id: string;
  photo: string | { id: string } | null;
  main_title: string | null;
  slug_button_text: string | null;
  slug_button_url: string | null;
  categories: string | null;
  authors: string[] | null;
  blog_details: Array<{ title: string | null; content: string | null }> | null;
  date_created?: string | null;
}

export interface BlockBlogs {
  id: string;
  title: string | null;
  background_color: string | null;
  buttons: Array<{
    buttons_id: BlockButton | number;
  }>;
  blogs: Array<{
    blogs_id: BlogItem | string;
  }>;
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
  block_text_image: BlockTextImage[];
  block_slider: BlockSlider[];
  block_faqs: BlockFaqs[];
  pricing_benefits: PricingBenefit[];
  social_links: SocialLink[];
  footer_images: FooterImage[];
  pages: Page[];
  card: CardItem[];
  pricing_cards: PricingCardItem[];
  buttons: BlockButton[];
  block_blogs: BlockBlogs[];
  blogs: BlogItem[];
}

export interface ScrollRevealProps {
 
  children: ReactNode;
  className?: string;
  delay?: number;

}

export interface FooterProps {

  globalSettings: GlobalSettings;

}

export interface BlockJourneyAppProps {

  data: any;
  globalSettings?: any;

}

export interface BlockFaqsProps {

  data: any;

}

export interface BlockSliderProps {

  data: any;
  globalSettings?: any;

}

export interface BlockContentProps {

  data: any;
  globalSettings?: any;

}

export interface NavigationClientProps {

  globalSettings: GlobalSettings;
  navigationData: any[];

}

export interface NavigationProps {

  globalSettings: GlobalSettings;

}

export interface BlockMobileProps {

  data: any;
  globalSettings?: any;

}

export interface BlockPricingCardsProps {

  data: any[];
  globalSettings?: any;
  benefits?: any[];

}

export interface BlockTestimonialsProps {

  data: any;
  globalSettings?: any;

}

export interface AnimatedImageGridProps {
 images: any[] 
}

export interface BlockNoticeProps {

  globalSettings: GlobalSettings;

}

export interface BlockFormProps {

  data: any;
  globalSettings?: any;

}

export interface PricingBenefitsProps {

  benefits: PricingBenefitItem[];
  pricingCards?: any[];

}

export interface BlockTitleProps {

  data: any;
  globalSettings?: any;

}

export interface BlockCardProps {

  data: any;
  globalSettings?: any;

}

export interface BlockTextImageProps {

  data: any;
  globalSettings?: any;

}

export interface PricingBenefitItem {
  id: string;
  sort: number | null;
  title: string | null;
  plans?: Array<{
    pricing_cards_id?: {
      id: string;
      title?: string | null;
    };
  }>;
}

export interface DynamicButtonProps {
  btn: any;
  globalSettings?: any;
  className?: string;
  defaultPadding?: string;
  fallbackFill?: string;
  fallbackText?: string;
  type?: "submit" | "button" | "reset";
  onClick?: () => void;
  disabled?: boolean;
}

export interface HoverButtonProps {
  href?: string;
  type?: "submit" | "button" | "reset";
  className?: string;
  style?: import("react").CSSProperties;
  hoverFill?: string | null;
  hoverText?: string | null;
  children: import("react").ReactNode;
  onClick?: () => void;
  target?: string;
  disabled?: boolean;
  [key: string]: any;
}
