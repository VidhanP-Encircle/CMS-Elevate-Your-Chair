import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Universal form submission handler.
 * Collects all field values from a <form> element and POSTs them
 * to /api/form-submission with the given formId.
 *
 * Usage: await submitFormData(formElement, formId)
 */
export async function submitFormData(
  formElement: HTMLFormElement,
  formId: string | null | undefined
): Promise<{ success: boolean; error?: string; id?: string }> {
  const formData = new FormData(formElement);
  const dataObj: Record<string, string> = {};
  formData.forEach((value, key) => {
    dataObj[key] = value as string;
  });

  try {
    const res = await fetch("/api/form-submission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formId: formId ?? null, data: dataObj }),
    });

    if (res.ok) {
      const result = await res.json();
      return { success: true, id: result.id };
    } else {
      const errData = await res.json().catch(() => ({}));
      return { success: false, error: errData.error || "Something went wrong. Please try again." };
    }
  } catch (err) {
    console.error("Form submission error:", err);
    return { success: false, error: "Failed to submit form. Please try again." };
  }
}
