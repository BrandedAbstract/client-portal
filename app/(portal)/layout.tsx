// @ts-nocheck
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function PortalLayout({ children }) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();


  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6">
      {children}
    </main>
  );
}
