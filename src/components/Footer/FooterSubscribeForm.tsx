"use client";

import { useState, useEffect } from "react";
import DynamicButton from "@/components/DynamicButton/DynamicButton";
import { FormField, BlockButton, GlobalSettings } from "@/lib/types";
import { submitFormData } from "@/lib/utils";

interface FooterSubscribeFormProps {
  formId: string;
  fields: FormField[];
  successMessage?: string;
  buttons: BlockButton[];
  globalSettings: GlobalSettings;
}

export default function FooterSubscribeForm({
  formId,
  fields,
  successMessage,
  buttons,
  globalSettings,
}: FooterSubscribeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-hide success after 5s
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => setIsSubmitted(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget; // capture before async — React nullifies currentTarget after sync return
    setIsSubmitting(true);
    setErrorMsg(null);

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
    <form className="flex flex-col gap-5 w-full mt-2" onSubmit={handleSubmit}>
      {/* Dynamic fields from Directus */}
      {fields.map((field, idx) => (
        <div key={field.id || idx} className="flex flex-col gap-2.5">
          <label className="text-[14px] text-white font-sans">
            {field.label}
          </label>
          {field.type === "textarea" ? (
            <textarea
              id={field.name}
              name={field.name}
              placeholder={field.placeholder || field.label}
              required={field.required === true || field.required === "true"}
              rows={3}
              className="w-full px-5 py-3.5 bg-white text-[#1a1a1a] font-sans text-[16px] border-none outline-none placeholder:text-[#1a1a1a]/40 resize-none"
            />
          ) : (
            <input
              id={field.name}
              type={field.type || "text"}
              name={field.name}
              placeholder={field.placeholder || field.label}
              required={field.required === true || field.required === "true"}
              className="w-full px-5 py-3.5 bg-white text-[#1a1a1a] font-sans text-[16px] border-none outline-none placeholder:text-[#1a1a1a]/40"
            />
          )}
        </div>
      ))}

      {/* Success message */}
      {isSubmitted && successMessage && (
        <div
          className="text-[13px] font-sans text-[#c2b7a3]"
          dangerouslySetInnerHTML={{ __html: successMessage }}
        />
      )}

      {/* Error message */}
      {errorMsg && (
        <p className="text-[13px] font-sans text-red-400">{errorMsg}</p>
      )}

      {/* Buttons — type="submit" triggers this form's onSubmit */}
      <div className="flex flex-wrap gap-4 mt-2">
        {buttons.map((btn: BlockButton, idx: number) => (
          <DynamicButton
            key={idx}
            btn={btn}
            fallbackFill="#c2b7a3"
            fallbackText="#1a1a1a"
            globalSettings={globalSettings}
            type={btn.type === "submit" ? "submit" : undefined}
            disabled={isSubmitting}
            className="w-full md:w-auto md:max-w-60 px-6 py-3.5 font-sans font-extrabold text-[15px] uppercase border-none cursor-pointer tracking-wide"
          />
        ))}
      </div>
    </form>
  );
}
