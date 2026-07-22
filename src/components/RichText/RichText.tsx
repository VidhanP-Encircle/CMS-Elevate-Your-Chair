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
  align?: "left" | "center" | "right";
  theme?: "light" | "dark" | "custom";
}

export default function RichText({ 
  content, 
  className, 
  style, 
  variant = "content",
  align = "left",
  theme = "light"
}: RichTextProps) {
  if (!content) return null;

  // Base typography that applies universally
  const baseClasses = `
    prose max-w-none w-full
    prose-a:text-[#c2b7a3] prose-a:no-underline hover:prose-a:underline
    prose-ul:list-disc prose-ul:pl-5 md:prose-ul:pl-6 prose-ul:my-2 md:prose-ul:my-3 prose-ul:space-y-1 md:prose-ul:space-y-1.5 prose-li:my-1 md:prose-li:my-1.5 prose-li:leading-normal
    prose-ol:list-decimal prose-ol:pl-5 md:prose-ol:pl-6 prose-ol:my-2 md:prose-ol:my-3 prose-ol:space-y-1 md:prose-ol:space-y-1.5
    prose-blockquote:border-l-[#c2b7a3] prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:italic
    prose-img:rounded-lg prose-img:my-4
    prose-table:w-full prose-table:border-collapse prose-th:border prose-th:border-gray-600 prose-th:px-3 prose-th:py-2
    prose-td:border prose-td:border-gray-600 prose-td:px-3 prose-td:py-2
    prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-[#c2b7a3]
    prose-pre:bg-gray-800 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto prose-pre:border prose-pre:border-gray-700
  `;

  const variantClasses = {
    content: "font-sans text-[16px] leading-relaxed prose-p:my-2 md:prose-p:my-2.5 prose-p:leading-normal md:prose-p:leading-[1.7] prose-strong:font-bold",
    title: "font-title uppercase prose-p:my-0 prose-p:leading-[1.2] prose-p:uppercase prose-p:font-title prose-h1:my-0 prose-h1:leading-[1.2] prose-h1:uppercase prose-h1:font-bold prose-h2:my-0 prose-h2:leading-[1.2] prose-h2:uppercase prose-h2:font-bold prose-h3:my-0 prose-h3:leading-[1.2] prose-headings:font-title prose-strong:font-bold prose-strong:font-title text-[24px] md:text-[30px] lg:text-[36px] prose-p:text-inherit prose-h1:text-inherit prose-h2:text-inherit prose-h3:text-inherit",
    subtitle: "font-sans font-medium text-[20px] leading-normal prose-p:my-0 prose-p:text-[20px]",
  };

  const alignClasses = {
    left: "text-left prose-ul:text-left prose-ol:text-left",
    center: "text-center flex flex-col items-center prose-ul:text-left prose-ol:text-left",
    right: "text-right flex flex-col items-end prose-ul:text-right prose-ol:text-right",
  };

  const themeClasses = {
    light: "prose-headings:text-gray-900 prose-p:text-gray-600 prose-strong:text-gray-900",
    dark: "prose-invert prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-em:text-gray-300",
    custom: "",
  };

  return (
    <div
      style={style}
      className={cn(
        baseClasses, 
        variantClasses[variant], 
        alignClasses[align], 
        themeClasses[theme],
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
