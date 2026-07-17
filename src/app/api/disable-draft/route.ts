import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  // Disable Draft Mode by clearing the cookie
  const draft = await draftMode();
  draft.disable();
  
  redirect('/');
}
