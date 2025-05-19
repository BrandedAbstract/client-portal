import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function PortalLayout({ children }) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect('/signin');      // send logged-out users to sign-in

  return (
    <main style={{minHeight:'100vh',background:'#000',color:'#fff',padding:'24px'}}>
      {children}
    </main>
  );
}
