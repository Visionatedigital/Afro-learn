import React, { useState } from 'react';
import ToolHeader from '../../components/tools/ToolHeader';

// removed unused makeMnemonics helper

export default function MemoryHooksPage({ userProfile = { age: 10, level: 'Intermediate' } }) {
  const [topic, setTopic] = useState('');
  const [mnemonics, setMnemonics] = useState([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/mnemonics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, profile: userProfile })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'AI error');
      setMnemonics(json.data?.tips || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem 0.5rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: '1.5rem' }}>
        <ToolHeader icon="star" title="Memory Hooks (Mnemonics)" subtitle="Quick tricks to help remember new ideas" />

        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              style={{ flex: 1, borderRadius: 8, border: '1px solid #e0e0e0', padding: 12, fontSize: 14 }}
              placeholder="Enter topic (e.g., Order of Operations)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <button onClick={generate} disabled={loading || !topic.trim()} style={{ padding: '10px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #16a085 0%, #1abc9c 100%)', color: '#fff', fontWeight: 600 }}>
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>

          {mnemonics.length > 0 && (
            <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 12, background: '#f6fffb' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#2d3a2e' }}>Try These</h4>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {mnemonics.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
