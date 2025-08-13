import React, { useState } from 'react';
import ToolHeader from '../../components/tools/ToolHeader';

function summarize(text) {
  if (!text.trim()) return '';
  const sentences = text.replace(/\s+/g, ' ').split(/(?<=[.!?])\s+/).filter(Boolean);
  const head = sentences[0] || '';
  const bullets = sentences.slice(1, 3).map((s) => `• ${s.replace(/[.!?]$/, '')}`);
  return `${head}\n${bullets.join('\n')}`.trim();
}

export default function LightningSummaryPage({ userProfile = { age: 10, level: 'Intermediate' } }) {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, profile: userProfile })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'AI error');
      const out = [json.data?.headline, ...(json.data?.bullets || [])].filter(Boolean).join('\n');
      setOutput(out);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem 0.5rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: '1.5rem' }}>
        <ToolHeader icon="bolt" title="Lightning Summary" subtitle="Fast key points from any passage" />

        <div style={{ display: 'grid', gap: 12 }}>
          <textarea
            style={{ width: '100%', borderRadius: 8, border: '1px solid #e0e0e0', padding: 12, fontSize: 14, fontFamily: 'inherit' }}
            rows={8}
            placeholder="Paste your text..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={run} disabled={loading || !text.trim()} style={{ alignSelf: 'start', padding: '10px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #00796b 0%, #019786 100%)', color: '#fff', fontWeight: 600 }}>
            {loading ? 'Summarizing...' : 'Summarize'}
          </button>

          {output && (
            <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 12, background: '#f7fbff' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#2d3a2e' }}>Summary</h4>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{output}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
