'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';

export default function OrgsPage() {
  const [name, setName] = useState('');
  const router = useRouter();

  async function createOrg(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase
      .from('organizations')
      .insert({ name });
    if (!error) router.push('/');          // back to dashboard
  }

  return (
    <form
      onSubmit={createOrg}
      style={{
        maxWidth: 300,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        color: 'white',
      }}
    >
      <h2 style={{ fontSize: 18, fontWeight: 600 }}>
        New organisation
      </h2>
      <input
        style={{ padding: 8, borderRadius: 4 }}
        placeholder="Organisation name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button
        style={{
          padding: 8,
          borderRadius: 6,
          background: '#500069',
          color: '#fff',
        }}
      >
        Save
      </button>
    </form>
  );
}
