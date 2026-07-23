"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import DynamicButton from "@/components/DynamicButton/DynamicButton";
import RichText from "@/components/RichText/RichText";
import { BlockFormProps, BlockButton, FormField } from "@/lib/types";
import { submitFormData } from "@/lib/utils";

export default function BlockForm({ data, globalSettings }: BlockFormProps) {
  const { title, background_image, captcha, buttons, form } = data;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const bgImageId =
    typeof background_image === "object" && background_image !== null
      ? background_image.id
      : background_image;

  // Resolve M2M buttons
  let buttonList: BlockButton[] = [];
  if (Array.isArray(buttons)) {
    buttonList = buttons
      .map((junction: { buttons_id?: BlockButton | number } | BlockButton) =>
        typeof junction === "object" && junction !== null && "buttons_id" in junction
          ? (junction.buttons_id as BlockButton)
          : (junction as BlockButton)
      )
      .filter((item: BlockButton) => typeof item === "object" && item !== null);
  }

  const titleSize = globalSettings?.global_title_size || 48;

  const formFields: FormField[] =
    typeof form === "object" && form !== null && Array.isArray(form.form_fields)
      ? form.form_fields
      : [];
  // Sort fields by the 'sort' property if available
  const sortedFields = [...formFields].sort(
    (a, b) => (a.sort || 0) - (b.sort || 0)
  );

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget; // capture before async — React nullifies currentTarget after sync return
    setIsSubmitting(true);
    setErrorMsg(null);

    const formId =
      typeof form === "object" && form !== null && "id" in form
        ? (form as { id: string }).id
        : (form as string | null | undefined);

    const result = await submitFormData(formEl, formId);

    if (result.success) {
      setIsSubmitted(true);
      formEl.reset();
    } else {
      setErrorMsg(result.error ?? "Something went wrong.");
    }
    setIsSubmitting(false);
  };

  return (
    <div
      className="relative w-full py-16 md:py-24 overflow-hidden flex justify-center"
      style={{
        background:
          "linear-gradient(180deg, #D6CFC9 0%, #F5F2EF 50%, #D6CFC9 100%)",
      }}
    >
      {/* Background Image */}
      {bgImageId && (
        <div className="absolute inset-0 w-full h-full z-0">
          <Image
            src={`/api/assets/${bgImageId}`}
            alt="Background"
            fill
            className="object-cover object-center opacity-60"
            sizes="100vw"
            priority
          />
          {/* Top & Bottom #D6CFC9 with Whitish Middle Overlay */}
          <div
            className="absolute inset-0 z-1"
            style={{
              background:
                "linear-gradient(180deg, #D6CFC9 0%, #D6CFC9DF 15%, rgba(255, 255, 255, 0.75) 50%, #D6CFC9DF 85%, #D6CFC9 100%)",
            }}
          />
        </div>
      )}

      <div className="relative z-10 w-full px-4 md:px-12 lg:px-20 2xl:px-32 flex flex-col items-center">
        {/* Title */}
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <RichText
              variant="title"
              theme="custom"
              align="center"
              content={title}
              className="prose-p:m-0 prose-p:leading-[1.1] prose-headings:font-title prose-headings:uppercase prose-headings:tracking-wide prose-headings:font-light prose-headings:text-[#1a1a1a] prose-headings:m-0 prose-strong:font-black prose-strong:font-title prose-strong:text-[#1a1a1a] font-title font-light uppercase tracking-wide mb-12 m-0"
              style={{
                fontSize: titleSize
                  ? `clamp(${Math.round(titleSize * 0.4)}px, ${(titleSize / 12).toFixed(3)}vw, ${titleSize}px)`
                  : undefined,
                color: "#1a1a1a",
              }}
            />
          </motion.div>
        )}

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full"
        >
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
            {/* Dynamic Fields Grid */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedFields.map((field: FormField) => {
                const isFullWidth =
                  field.type === "textarea" ||
                  field.type === "text-area" ||
                  field.name === "message";

                const isRequired =
                  field.required === true || field.required === "true";

                const placeholderText = field.placeholder || `${field.label}${isRequired ? " *" : ""}`;

                return (
                  <div
                    key={field.id || field.name}
                    className={`flex flex-col gap-2 ${isFullWidth ? "md:col-span-2" : ""}`}
                  >
                    <label
                      htmlFor={field.name}
                      className="text-[#1a1a1a] font-sans text-sm tracking-wide font-medium"
                    >
                      {field.label}{" "}
                      {isRequired && <span className="text-red-500">*</span>}
                    </label>
                    {isFullWidth ? (
                      <textarea
                        id={field.name}
                        name={field.name}
                        placeholder={placeholderText}
                        required={isRequired}
                        rows={5}
                        className="w-full bg-white border-2 border-black p-4 text-[#1a1a1a] placeholder:text-gray-400 font-sans text-base focus:outline-none focus:ring-2 focus:ring-black transition-shadow resize-y"
                      />
                    ) : (
                      <input
                        id={field.name}
                        name={field.name}
                        type={field.type || "text"}
                        placeholder={placeholderText}
                        required={isRequired}
                        className="w-full bg-white border-2 border-black p-4 text-[#1a1a1a] placeholder:text-gray-400 font-sans text-base focus:outline-none focus:ring-2 focus:ring-black transition-shadow"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {errorMsg && (
              <div className="text-red-600 font-sans text-sm text-center">
                {errorMsg}
              </div>
            )}

            {/* Footer: Captcha + Submit Button Aligned */}
            <div className="w-full mt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              {captcha && (
                <div className="flex justify-center">
                  <div className="bg-white border border-[#d3d3d3] rounded-[3px] p-2 flex items-center justify-between w-76 h-19.5 shadow-sm">
                    <div className="flex items-center gap-3 pl-2">
                      <div className="w-7 h-7 border-2 border-[#c1c1c1] rounded-sm bg-white cursor-pointer hover:border-gray-400 transition-colors"></div>
                      <span className="font-sans text-sm text-[#222]">
                        I'm not a robot
                      </span>
                    </div>
                    <div className="flex flex-col items-center pr-2">
                      <div className="w-8 h-8 flex flex-wrap items-center justify-center -mb-1">
                        <div className="text-[#4285f4] font-bold text-2xl leading-none">
                          ↻
                        </div>
                      </div>
                      <span className="text-[10px] text-[#555] mt-1">
                        reCAPTCHA
                      </span>
                      <span className="text-[8px] text-[#555]">
                        Privacy - Terms
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="shrink-0 w-full sm:w-auto flex justify-center">
                {buttonList.length > 0 ? (
                  buttonList.map((btn: BlockButton, idx: number) => (
                    <DynamicButton
                      key={idx}
                      btn={btn}
                      globalSettings={globalSettings}
                      fallbackFill="#1a1a1a"
                      fallbackText="#ffffff"
                      className="w-full sm:w-auto"
                      type="submit"
                      disabled={isSubmitting}
                    />
                  ))
                ) : (
                  /* Fallback submit button when no buttons configured */
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative overflow-hidden inline-flex justify-center items-center font-sans font-extrabold text-[14px] md:text-[16px] uppercase no-underline transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lg px-6 md:px-8 py-2 md:py-3 bg-[#1a1a1a] text-white border-none cursor-pointer w-full sm:w-auto"
                  >
                    <span className="relative z-10">Submit</span>
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Success Message Banner (auto-width according to message, centered below form) */}
          <AnimatePresence>
            {isSubmitted && (
              <div className="w-full flex justify-center mt-8">
                <motion.div
                  key="success-banner"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-fit max-w-full bg-[#f4f7f4] border border-[#a3d9a5] py-4 px-6 sm:px-8 rounded-sm flex items-center justify-between gap-4 shadow-sm overflow-hidden"
                >
                  {/* Top border timer progress line */}
                  <motion.div
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{ duration: 5, ease: "linear" }}
                    style={{ transformOrigin: "left" }}
                    className="absolute top-0 left-0 right-0 h-0.75 bg-[#1e5622]"
                  />

                  <RichText
                    variant="content"
                    theme="custom"
                    align="center"
                    content={
                      (typeof form === "object" && form !== null && "success_message" in form && form.success_message)
                        ? (form as { success_message: string }).success_message
                        : "<p>Thank you! Your response has been successfully submitted.</p>"
                    }
                    className="prose-p:m-0 prose-p:text-[#1e5622] prose-p:font-sans prose-p:text-base sm:prose-p:text-lg prose-p:font-medium pt-1 m-0"
                  />
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="text-[#1e5622] hover:text-[#143b17] p-1.5 rounded-full hover:bg-[#e2efe3] transition-colors shrink-0 cursor-pointer z-10 ml-2"
                    aria-label="Close message"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
