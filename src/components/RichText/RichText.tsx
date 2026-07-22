import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RichTextProps {
  content: string | null | undefined;
  className?: string;
  style?: React.CSSProperties;
  variant?: "content" | "title" | "subtitle";
}

export default function RichText({ content, className, style, variant = "content" }: RichTextProps) {
  if (!content) return null;

  const baseClasses = "prose max-w-none";

  const variantClasses = {
    content: "font-sans text-[16px] leading-relaxed prose-p:my-2 md:prose-p:my-2.5 prose-p:leading-normal md:prose-p:leading-[1.7] prose-ul:list-disc prose-ul:pl-5 md:prose-ul:pl-6 prose-ul:my-2 md:prose-ul:my-3 prose-ul:space-y-1 md:prose-ul:space-y-1.5 prose-ol:list-decimal prose-ol:pl-5 md:prose-ol:pl-6 prose-ol:my-2 md:prose-ol:my-3 prose-ol:space-y-1 md:prose-ol:space-y-1.5 prose-li:my-1 md:prose-li:my-1.5 prose-li:leading-normal prose-strong:font-bold prose-a:underline hover:prose-a:opacity-80 transition-opacity",
    title: "font-title uppercase prose-p:my-0 prose-p:leading-[1.2] prose-p:uppercase prose-p:font-title prose-h1:my-0 prose-h1:leading-[1.2] prose-h1:uppercase prose-h1:font-bold prose-h2:my-0 prose-h2:leading-[1.2] prose-h2:uppercase prose-h2:font-bold prose-h3:my-0 prose-h3:leading-[1.2] prose-headings:font-title prose-strong:font-bold prose-strong:font-title text-[24px] md:text-[30px] lg:text-[36px] prose-p:text-inherit prose-h1:text-inherit prose-h2:text-inherit prose-h3:text-inherit",
    subtitle: "font-sans font-medium text-[20px] leading-normal prose-p:my-0 prose-p:text-[20px]",
  };

  return (
    <div
      style={style}
      className={cn(baseClasses, variantClasses[variant], className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
