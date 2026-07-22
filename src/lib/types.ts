import { ReactNode } from "react";

export type DirectusFile = string | { id?: string; url?: string; filename_download?: string; [key: string]: unknown } | null;

export interface Author {
  id: string;
  name?: string | null;
  blog_id?: string | null;
  user_created?: string | null;
  date_created?: string | null;
  user_updated?: string | null;
  date_updated?: string | null;
}

export interface Notice {
  id: string;
  text: string;
  button_text?: string | null;
  button_url?: string | null;
  button_border?: string | null;
  button_fill?: string | null;
  button_text_color?: string | null;
  buttons?: Array<{ buttons_id: BlockButton | number }>;
}

export interface GlobalSettings {
  brand_name: string;
  handle_name?: string | null;
  logo: DirectusFile;
  favicon: DirectusFile;
  left_quote_logo?: DirectusFile;
  right_quote_logo?: DirectusFile;
  not_found_image?: DirectusFile;
  email?: string | null;
  link_details: Array<{ link_text: string; link_url: string }>;
  label: string;
  /** WYSIWYG - rich HTML content for newsletter/footer */
  content: string;
  button_color?: string | null;
  button_text_color?: string | null;
  button_hover_text_color?: string | null;
  button_hover_fill_color?: string | null;
  bg_color?: string | null;
  text_color?: string | null;
  subtitle_color?: string | null;
  global_title_size?: number | null;
  global_subtitle_size?: number | null;
  global_label_size?: number | null;
  global_content_size?: number | null;
  social_links: Array<SocialLink | string>; // UUIDs or populated SocialLink objects
  footer_images: Array<FooterImage | string>; // UUIDs or populated FooterImage objects
  buttons?: Array<{ buttons_id: BlockButton | number }>;
  made_by?: string | null;
  made_by_logo?: DirectusFile;
  footer_form?: Form | { id: string; name?: string; success_message?: string } | string | null;
}

export interface NavigationItem {
  id: string;
  name: string;
  slug: string;
  logo?: DirectusFile;
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
  logo?: DirectusFile;
  hover_logo?: DirectusFile;
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
  buttons?: Array<{ buttons_id: BlockButton | number }>;
  background_image?: DirectusFile;
  background_video?: DirectusFile;
  subtitle_size?: "sm" | "md" | "lg" | string | null;
  inner_name?: string;
  title_size?: number;
  content?: string | null;
}

export interface BlockJourneyAppButton {
  button_text: string;
  button_url: string;
  button_border_color: string;
  button_text_color: string;
  button_fill_color?: string;
  button_hover_text_color?: string | null;
  button_hover_fill_color?: string | null;
  logo?: DirectusFile;
}

export interface BlockJourneyApp {
  id: string;
  image?: DirectusFile;
  /** WYSIWYG - rich HTML title */
  title: string | null;
  /** WYSIWYG - rich HTML content */
  content: string | null;
  buttons: BlockJourneyAppButton[];
  title_size?: number;
  content_size?: number | null;
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
  image?: DirectusFile;
  image_position: "left" | "right" | string | null;
  button_text: string | null;
  button_url: string | null;
  content_size?: number | null;
  contact_information?: boolean | string | null;
  buttons?: Array<{ buttons_id: BlockButton | number }>;
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
  theme?: "dark" | "white" | string | null;
}

export interface CardItem {
  id: string;
  title: string | null;
  photo?: DirectusFile;
  /** WYSIWYG - rich HTML card content */
  content: string | null;
  button_text?: string | null;
  button_url?: string | null;
  sort?: number | null;
}

export interface BlockPricingCard {
  id: string;
  type_of_plan: "monthly" | "yearly" | string | null;
  background_image?: DirectusFile;
  title: string | null;
  /** WYSIWYG - rich HTML content */
  content: string | null;
  show_benefits: "true" | "false" | string | null;
  button_text: string | null;
  button_url: string | null;
  button_text_color: string | null;
  button_fill: string | null;
  button_hover_text_color?: string | null;
  button_hover_fill_color?: string | null;
  pricing_cards: Array<{
    pricing_cards_id: PricingCardItem | string;
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
  sort?: number | null;
}

export interface PricingBenefit {
  id: string;
  sort: number | null;
  title: string | null;
  plans?: Array<{ pricing_cards_id?: PricingCardItem | string }>;
}

export interface BlockTestimonial {
  id: string;
  title: string | null;
  title_size: number | null;
  background_image?: DirectusFile;
  /** JSON list of testimonial items */
  testimonial: Array<{
    testimonial_id?: TestimonialItem | string;
    content?: string;
    name?: string;
  }>;
}

export interface TestimonialItem {
  id: string;
  content: string | null;
  name: string | null;
  image?: DirectusFile;
  video?: DirectusFile;
  sort?: number | null;
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
  background_image?: DirectusFile;
}

export interface SocialLink {
  id: string;
  url?: string;
  media_name?: string;
  media_logo?: DirectusFile;
  sort?: number | null;
}

export interface FooterImage {
  id: string;
  image?: DirectusFile;
  sort?: number | null;
}

export interface PageBlockRelation {
  id: number;
  pages_id: string;
  item: string | Record<string, unknown>;
  collection: string;
  sort?: number;
}

export interface Page {
  id: string;
  inner_name: string;
  slug: string | null;
  pages_blocks: PageBlockRelation[];
  sort?: number | null;
}

export interface TextImageItem {
  id: string;
  photo?: DirectusFile;
  title: string | null;
  sort?: number | null;
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
  background_image?: DirectusFile;
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
  background_image?: DirectusFile;
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
  photo?: DirectusFile;
  main_title: string | null;
  slug_button_text: string | null;
  slug_button_url: string | null;
  categories: string | null;
  authors: Array<Author | { authors_id?: Author | string } | string> | null;
  author?: Author | string | null;
  blog_details: Array<{ title: string | null; content: string | null }> | null;
  date_created?: string | null;
}

export interface BlockBlogs {
  id: string;
  title: string | null;
  background_color: string | null;
  blog_detail_button?: Array<{ buttons_id?: BlockButton | number }> | BlockButton | null;
  buttons: Array<{
    buttons_id: BlockButton | number;
  }>;
  blogs: Array<{
    blogs_id: BlogItem | string;
  }>;
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: "text" | "email" | "textarea" | "tel" | "number" | string;
  placeholder?: string;
  required?: boolean | string;
  sort?: number;
}

export interface Form {
  id: string;
  name: string;
  success_message?: string;
  form_fields?: FormField[];
}

export interface BlockForm {
  id: string;
  title?: string | null;
  background_image?: DirectusFile;
  captcha?: boolean;
  buttons?: Array<{ buttons_id: BlockButton | number }>;
  form?: Form | { form_fields?: FormField[]; success_message?: string } | string | null;
}

export interface BlockContent {
  id: string;
  title?: string | null;
  subtitle?: string | null;
  content?: string | null;
  background_color?: string | null;
  content_size?: number | null;
}

export interface BlockLegalDetail {
  title?: string | null;
  subtitle?: string | null;
  content?: string | null;
}

export interface BlockLegal {
  id: string;
  inner_name?: string | null;
  details?: BlockLegalDetail[] | null;
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
  authors: Author[];
  form: Form[];
  form_fields: FormField[];
  slides: SlideItem[];
  testimonial: TestimonialItem[];
  text_image: TextImageItem[];
  block_legal: BlockLegal[];
}

export interface BlockLegalProps {
  data: BlockLegal;
  globalSettings?: GlobalSettings;
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
  data: BlockJourneyApp;
  globalSettings?: GlobalSettings;
}

export interface BlockFaqsProps {
  data: BlockFaqs;
}

export interface BlockSliderProps {
  data: BlockSlider;
  globalSettings?: GlobalSettings;
}

export interface BlockContentProps {
  data: BlockContent;
  globalSettings?: GlobalSettings;
}

export interface NavigationClientProps {
  globalSettings: GlobalSettings;
  navigationData: NavigationItem[];
}

export interface NavigationProps {
  globalSettings: GlobalSettings;
}

export interface BlockMobileProps {
  data: BlockMobile;
  globalSettings?: GlobalSettings;
}

export interface BlockPricingCardsProps {
  data: BlockPricingCard[];
  globalSettings?: GlobalSettings;
  benefits?: PricingBenefitItem[];
  pricingCards?: Array<{ pricing_cards_id?: PricingCardItem | string } | PricingCardItem>;
}

export interface BlockTestimonialsProps {
  data: BlockTestimonial;
  globalSettings?: GlobalSettings;
}

export interface AnimatedImageGridProps {
  images: Array<DirectusFile>;
}

export interface BlockNoticeProps {
  globalSettings: GlobalSettings;
}

export interface BlockFormProps {
  data: BlockForm;
  globalSettings?: GlobalSettings;
}

export interface PricingBenefitsProps {
  benefits: PricingBenefitItem[];
  pricingCards?: Array<{ pricing_cards_id?: PricingCardItem | string } | PricingCardItem>;
}

export interface BlockTitleProps {
  data: BlockTitle;
  globalSettings?: GlobalSettings;
}

export interface BlockCardProps {
  data: BlockCard;
  globalSettings?: GlobalSettings;
}

export interface BlockTextImageProps {
  data: BlockTextImage;
  globalSettings?: GlobalSettings;
}

export interface PricingBenefitItem {
  id: string;
  sort: number | null;
  title: string | null;
  plans?: Array<{
    pricing_cards_id?: {
      id: string;
      title?: string | null;
    } | string;
  }>;
}

export interface BlockBlogsProps {
  data: BlockBlogs;
  globalSettings?: GlobalSettings;
  allCategories?: string[];
  allAuthors?: string[];
  authorsMapData?: { id: string; name: string }[];
}

export interface BlockBlogDetailProps {
  data: BlockBlogs;
  globalSettings?: GlobalSettings;
  authorsMapData?: { id: string; name: string }[];
}

export interface DynamicButtonProps {
  btn: BlockButton | { buttons_id?: BlockButton | number } | Record<string, unknown>;
  globalSettings?: GlobalSettings;
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
  onClick?: (e?: import("react").MouseEvent) => void;
  onMouseEnter?: (e?: import("react").MouseEvent) => void;
  onMouseLeave?: (e?: import("react").MouseEvent) => void;
  target?: string;
  disabled?: boolean;
}
