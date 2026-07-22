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
    const payload: { form?: string; data: Record<string, any> } = {
      data,
    };

    if (formId) {
      payload.form = formId;
    }

    const result = await directus.request(
      createItem('form_submission' as any, payload as any)
    );

    return NextResponse.json({
      success: true,
      message: 'Form submission received successfully',
      id: (result as any)?.id,
    });
  } catch (error: any) {
    console.error('Error handling form submission:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to submit form' },
      { status: 500 }
    );
  }
}
