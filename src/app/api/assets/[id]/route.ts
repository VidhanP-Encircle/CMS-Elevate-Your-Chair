import { NextRequest, NextResponse } from 'next/server';
import { getDirectus } from '@/lib/directus';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Await the params object in Next.js 15+ App Router
  const { id } = await params;
  
  if (!id) {
    return new NextResponse('Missing asset ID', { status: 400 });
  }

  try {
    // Authenticate and get the Directus client
    const directus = await getDirectus();
    
    // Instead of using the SDK to download which may not stream perfectly,
    // we fetch the asset from the directus instance URL using the access token.
    
    // Wait, the new SDK stores the token internally in memory or storage. 
    // We can extract it using directus.getToken()
    const token = await directus.getToken();
    
    const assetUrl = `http://127.0.0.1:8055/assets/${id}`;
    
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(assetUrl, { headers });

    if (!response.ok) {
      return new NextResponse('Asset not found or forbidden', { status: response.status });
    }

    // Pipe the response body and headers (like content-type) back to the client
    const newHeaders = new Headers(response.headers);
    
    // Remove headers that might interfere with Next.js responses
    newHeaders.delete('content-encoding');
    newHeaders.delete('transfer-encoding');

    return new NextResponse(response.body, {
      status: 200,
      headers: newHeaders,
    });
  } catch (error) {
    console.error('Error proxying asset:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
