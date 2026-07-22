import { NextRequest, NextResponse } from 'next/server';
import { getDirectus } from '@/lib/directus';
import { createItem } from '@directus/sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formId, data } = body;

    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: 'Invalid form submission data' },
        { status: 400 }
      );
    }

    const directus = await getDirectus();

    // Store the form submission in Directus 'form_submission' collection
    const payload: { form?: string; data: Record<string, unknown> } = {
      data,
    };

    if (formId) {
      payload.form = formId;
    }

    const result = (await directus.request(
      createItem("form_submission" as never, payload as never)
    )) as { id?: string } | null;

    return NextResponse.json({
      success: true,
      message: 'Form submission received successfully',
      id: result?.id,
    });
  } catch (error: unknown) {
    console.error('Error handling form submission:', error);
    const errMessage = error instanceof Error ? error.message : 'Failed to submit form';
    return NextResponse.json(
      { error: errMessage },
      { status: 500 }
    );
  }
}
