import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';
import { cookies } from 'next/headers';
import '../globals.css';

export default async function PortalLayout({ children }) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect('/signin');

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center p-6">
      <header className="w-full max-w-4xl flex justify-between mb-8">
        <h1 className="text-xl font-semibold">DialogicLabs Client Portal</h1>
        <form action="/auth/signout" method="post">
          <button className="text-sm underline">Sign out</button>
        </form>
      </header>
      <section className="w-full max-w-4xl">{children}</section>
    </main>
  );
}
