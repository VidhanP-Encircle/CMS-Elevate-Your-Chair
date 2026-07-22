import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Construct an optimized image URL through the Directus proxy.
 * Directus supports on-the-fly image transformations, which we can
 * pass through the `/api/assets/` proxy.
 *
 * @param id - The Directus asset UUID (or full object with `.id`)
 * @param params - Optional transformation parameters
 * @param params.width - Desired width (e.g. 800)
 * @param params.height - Desired height (e.g. 600)
 * @param params.format - Output format (e.g. 'webp', 'avif', 'auto')
 * @param params.quality - JPEG/WebP quality 1-100
 * @param params.fit - Fit strategy: 'cover', 'contain', 'inside', 'outside'
 * @returns The full URL path to the asset
 *
 * @example
 * ```tsx
 * <Image
 *   src={getDirectusImageUrl(photoId, { width: 800, format: 'webp' })}
 *   alt=""
 *   width={800}
 *   height={600}
 * />
 * ```
 */
export function getDirectusImageUrl(
  id: string | { id?: string } | null | undefined,
  params?: {
    width?: number;
    height?: number;
    format?: 'webp' | 'avif' | 'auto';
    quality?: number;
    fit?: 'cover' | 'contain' | 'inside' | 'outside';
  }
): string {
  // Resolve the ID from object or string
  const resolvedId = typeof id === 'object' && id !== null ? id.id : id;
  if (!resolvedId) return '';

  let url = `/api/assets/${resolvedId}`;

  if (params) {
    const queryParts: string[] = [];
    if (params.width) queryParts.push(`width=${params.width}`);
    if (params.height) queryParts.push(`height=${params.height}`);
    if (params.format && params.format !== 'auto') queryParts.push(`format=${params.format}`);
    if (params.quality) queryParts.push(`quality=${params.quality}`);
    if (params.fit) queryParts.push(`fit=${params.fit}`);

    if (queryParts.length > 0) {
      url += `?${queryParts.join('&')}`;
    }
  }

  return url;
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
