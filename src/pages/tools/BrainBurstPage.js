import React, { useMemo, useState } from 'react';
import ToolHeader from '../../components/tools/ToolHeader';

function getAgeBand(age) {
  if (age <= 8) return '6-8';
  if (age <= 10) return '9-10';
  return '11-12';
}

// removed unused explain helper

export default function BrainBurstPage({ userProfile = { age: 10 } }) {
  const [topic, setTopic] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  // const band = useMemo(() => getAgeBand(Number(userProfile?.age ?? 10)), [userProfile?.age]);

  const run = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, subject: null, profile: userProfile })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'AI error');
      const summary = (json.data?.bullets || []).join(' ');
      setOutput(summary || '');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem 0.5rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: '1.5rem' }}>
        <ToolHeader icon="bolt" title="Brain Burst" subtitle="Quick explainer matched to the learner's age" />

        <div style={{ display: 'grid', gap: 12 }}>
          <input
            style={{ width: '100%', borderRadius: 8, border: '1px solid #e0e0e0', padding: 12, fontSize: 14 }}
            placeholder="Enter a topic (e.g., photosynthesis)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button onClick={run} disabled={loading || !topic.trim()} style={{ alignSelf: 'start', padding: '10px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #2bb6bb 0%, #22a3a8 100%)', color: '#fff', fontWeight: 600 }}>
            {loading ? 'Explaining...' : 'Explain'}
          </button>

          {output && (
            <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 12, background: '#f6fffb' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#2d3a2e' }}>Simple Explanation</h4>
              <p style={{ margin: 0 }}>{output}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
