import React, { useState } from 'react';
import ToolHeader from '../../components/tools/ToolHeader';

export default function ReadingSimplifierPage({ userProfile = { age: 10, level: 'Intermediate' } }) {
  const [inputText, setInputText] = useState('');
  const [simplified, setSimplified] = useState('');
  const [glossary, setGlossary] = useState([]);
  const [loading, setLoading] = useState(false);

  const simplifyText = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/simplify-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, profile: userProfile })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'AI error');
      setSimplified(json.data.simplified || '');
      setGlossary(json.data.glossary || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem 0.5rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: '1.5rem' }}>
        <ToolHeader icon="book" title="Reading Simplifier" subtitle="Make any text easier with glossed terms" />

        <div style={{ display: 'grid', gap: 12 }}>
          <textarea
            style={{ width: '100%', borderRadius: 8, border: '1px solid #e0e0e0', padding: 12, fontSize: 14, fontFamily: 'inherit' }}
            rows={8}
            placeholder="Paste your text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <button onClick={simplifyText} disabled={loading || !inputText.trim()} style={{ alignSelf: 'start', padding: '10px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', fontWeight: 600 }}>
            {loading ? 'Simplifying...' : 'Simplify'}
          </button>

          {simplified && (
            <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 12, background: '#fafbff' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#2d3a2e' }}>Simplified Version</h4>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{simplified}</p>
            </div>
          )}

          {glossary.length > 0 && (
            <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 12, background: '#fafbff' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#2d3a2e' }}>Glossed Terms</h4>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {glossary.map((g, i) => (
                  <li key={i}>
                    <strong>{g.term}</strong>: {g.meaning}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
