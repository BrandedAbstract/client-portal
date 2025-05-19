'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useSearchParams } from 'next/navigation';

export default function BotsPage() {
  // ?org=<organisation id> will be passed in the URL
  const search = useSearchParams();
  const orgId = search.get('org')!;

  const [bots, setBots] = useState<any[]>([]);
  const [chatbaseId, setChatbaseId] = useState('');
  const [embed, setEmbed] = useState('');

  // fetch bots for this organisation
  useEffect(() => {
    supabase
      .from('bots')
      .select('*')
      .eq('org_id', orgId)
      .then(({ data }) => setBots(data || []));
  }, [orgId]);

  async function addBot(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('bots').insert({
      org_id: orgId,
      chatbase_bot_id: chatbaseId,
      embed_code: embed,
    });
    if (!error) {
      setChatbaseId('');
      setEmbed('');
      const { data } = await supabase
        .from('bots')
        .select('*')
        .eq('org_id', orgId);
      setBots(data || []);
    }
  }

  return (
    <div style={{ maxWidth: 500, color: 'white' }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
        Bots
      </h2>

      {/* add-bot form */}
      <form onSubmit={addBot} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input
          placeholder="Chatbase Bot ID"
          value={chatbaseId}
          onChange={(e) => setChatbaseId(e.target.value)}
          required
          style={{ padding: 8, borderRadius: 4 }}
        />
        <textarea
          placeholder="Embed code"
          value={embed}
          onChange={(e) => setEmbed(e.target.value)}
          required
          rows={4}
          style={{ padding: 8, borderRadius: 4 }}
        />
        <button style={{ padding: 8, background: '#500069', color: '#fff', borderRadius: 6 }}>
          + Add bot
        </button>
      </form>

      {/* existing bots list */}
      {bots.length > 0 && (
        <ul style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {bots.map((b) => (
            <li
              key={b.id}
              style={{ border: '1px solid #444', padding: 12, borderRadius: 6, wordBreak: 'break-all' }}
            >
              <strong>{b.chatbase_bot_id}</strong>
              <br />
              <span style={{ opacity: 0.7 }}>{b.embed_code.slice(0, 60)}…</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
