import React, { useState } from 'react';

export default function ReadingSimplifierModal({ isOpen, onClose }) {
  const [inputText, setInputText] = useState('');
  const [simplified, setSimplified] = useState('');
  const [glossary, setGlossary] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const simplifyText = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 700));

    // Naive simplification: split on long sentences and trim extras
    const sentences = inputText
      .replace(/\s+/g, ' ')
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const simplifiedSentences = sentences.map((s) => {
      // Break at commas for shorter ideas
      const parts = s.split(',');
      const first = parts[0] || s;
      // Reduce overly complex words by removing adverbs ending with -ly (display intent)
      return first.replace(/\b\w+ly\b/g, (m) => m.replace(/ly$/, ''));
    });

    const simplifiedText = simplifiedSentences.join(' ');

    // Build a tiny glossary for long words
    const words = inputText
      .toLowerCase()
      .replace(/[^a-z\s-]/g, '')
      .split(/\s+/)
      .filter((w) => w.length >= 9);
    const unique = Array.from(new Set(words)).slice(0, 8);

    const gloss = unique.map((w) => ({
      term: w,
      meaning: `A simpler way to say "${w}".`,
      tip: 'Use a short sentence to explain it.'
    }));

    setSimplified(simplifiedText);
    setGlossary(gloss);
    setLoading(false);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={{ margin: 0 }}>Reading Simplifier</h3>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          <textarea
            style={styles.textarea}
            rows={6}
            placeholder="Paste your text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <button onClick={simplifyText} disabled={loading || !inputText.trim()} style={styles.primaryBtn}>
            {loading ? 'Simplifying...' : 'Simplify'}
          </button>

          {simplified && (
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>Simplified Version</h4>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{simplified}</p>
            </div>
          )}

          {glossary.length > 0 && (
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>Glossed Terms</h4>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {glossary.map((g, i) => (
                  <li key={i}>
                    <strong>{g.term}</strong>: {g.meaning} <span style={{ color: '#667eea' }}>({g.tip})</span>
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

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000
  },
  modal: {
    background: '#fff', width: 'min(720px, 92%)', borderRadius: 12,
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)', padding: 20
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12
  },
  closeBtn: {
    border: 'none', background: 'transparent', fontSize: 24, cursor: 'pointer'
  },
  textarea: {
    width: '100%', borderRadius: 8, border: '1px solid #e0e0e0', padding: 12, fontSize: 14, fontFamily: 'inherit'
  },
  primaryBtn: {
    alignSelf: 'start', padding: '10px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', fontWeight: 600
  },
  section: {
    border: '1px solid #f0f0f0', borderRadius: 8, padding: 12, background: '#fafbff'
  },
  sectionTitle: {
    margin: '0 0 8px 0', fontSize: 14, color: '#2d3a2e'
  }
};










