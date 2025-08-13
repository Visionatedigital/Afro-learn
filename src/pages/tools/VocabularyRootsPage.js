import React, { useState } from 'react';
import ToolHeader from '../../components/tools/ToolHeader';

const KNOWN_ROOTS = [
  { root: 'bio', meaning: 'life', examples: ['biology', 'biography', 'biome'] },
  { root: 'geo', meaning: 'earth', examples: ['geography', 'geology', 'geometry'] },
  { root: 'tele', meaning: 'far', examples: ['telephone', 'television', 'teleport'] },
  { root: 'micro', meaning: 'small', examples: ['microscope', 'microorganism', 'microchip'] },
  { root: 'auto', meaning: 'self', examples: ['autograph', 'automatic', 'autonomy'] },
  { root: 'graph', meaning: 'write', examples: ['graphic', 'paragraph', 'autograph'] },
  { root: 'photo', meaning: 'light', examples: ['photograph', 'photosynthesis', 'photocopy'] },
];

export default function VocabularyRootsPage() {
  const [term, setTerm] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!term.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const lower = term.toLowerCase();
    const hits = KNOWN_ROOTS.filter((r) => lower.includes(r.root));

    const prefixes = hits.map((h) => h.root);
    const guessedSuffix = lower.match(/(tion|sion|ment|ness|able|ible|ology|ist|ism)$/)?.[0] || null;

    const familyWords = hits.flatMap((h) => h.examples).slice(0, 8);

    setAnalysis({
      term,
      prefixes,
      suffix: guessedSuffix,
      meaningParts: hits.map((h) => `${h.root} = ${h.meaning}`),
      familyWords,
    });

    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem 0.5rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: '1.5rem' }}>
        <ToolHeader icon="palette" title="Vocabulary Roots (Etymology)" subtitle="Decode words with roots, prefixes and suffixes" />

        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              style={{ flex: 1, borderRadius: 8, border: '1px solid #e0e0e0', padding: 12, fontSize: 14 }}
              placeholder="Type a word (e.g., photosynthesis)"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
            <button onClick={analyze} disabled={loading || !term.trim()} style={{ padding: '10px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)', color: '#fff', fontWeight: 600 }}>
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>

          {analysis && (
            <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 12, background: '#fff9f5' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#2d3a2e' }}>Breakdown</h4>
              <p style={{ margin: '0 0 6px 0' }}>
                <strong>Prefixes/Roots:</strong> {analysis.prefixes.length ? analysis.prefixes.join(', ') : '—'}
              </p>
              <p style={{ margin: '0 0 6px 0' }}>
                <strong>Suffix:</strong> {analysis.suffix || '—'}
              </p>
              <p style={{ margin: '0 0 6px 0' }}>
                <strong>Meaning parts:</strong> {analysis.meaningParts.length ? analysis.meaningParts.join('; ') : '—'}
              </p>
              <div>
                <h5 style={{ margin: '10px 0 6px 0' }}>Word Family</h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {analysis.familyWords.map((w, i) => (
                    <span key={i} style={{ padding: '6px 10px', background: '#ffe6d9', borderRadius: 16, fontSize: 12, color: '#7a3e2e' }}>{w}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
