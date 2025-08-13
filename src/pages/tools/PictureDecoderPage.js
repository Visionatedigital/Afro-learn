import React, { useState } from 'react';
import ToolHeader from '../../components/tools/ToolHeader';

export default function PictureDecoderPage({ userProfile = { age: 10, level: 'Intermediate' } }) {
  const [url, setUrl] = useState('');
  const [explanation, setExplanation] = useState('');

  const run = async () => {
    if (!url.trim()) return;
    try {
      const res = await fetch('/api/ai/describe-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: url, profile: userProfile })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'AI error');
      setExplanation(json.data?.caption || '');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ padding: '2rem 0.5rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: '1.5rem' }}>
        <ToolHeader icon="image" title="Picture Decoder" subtitle="Explain any image in simple words" />

        <div style={{ display: 'grid', gap: 12 }}>
          <input
            style={{ width: '100%', borderRadius: 8, border: '1px solid #e0e0e0', padding: 12, fontSize: 14 }}
            placeholder="Paste image URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button onClick={run} disabled={!url.trim()} style={{ alignSelf: 'start', padding: '10px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #6ecb63 0%, #5fb956 100%)', color: '#fff', fontWeight: 600 }}>
            Explain Picture
          </button>

          {url && (
            <img src={url} alt="preview" style={{ width: '100%', borderRadius: 8, objectFit: 'cover', maxHeight: 320 }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          )}

          {explanation && (
            <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 12, background: '#f7fff7' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#2d3a2e' }}>Explanation</h4>
              <p style={{ margin: 0 }}>{explanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
