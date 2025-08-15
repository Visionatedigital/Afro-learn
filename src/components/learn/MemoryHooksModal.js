import React, { useState } from 'react';

function makeMnemonics(topic) {
  const t = topic.trim();
  if (!t) return [];
  const simple = t.split(/\s+/).slice(0, 3).join(' ');
  return [
    `Story: Imagine a character dealing with ${simple} in a funny way so you never forget.`,
    `Acronym: Take the first letters of key words about ${simple} and make a catchy word.`,
    `Chunking: Break ${simple} into 3 small parts and practice each part quickly.`
  ];
}

export default function MemoryHooksModal({ isOpen, onClose }) {
  const [topic, setTopic] = useState('');
  const [mnemonics, setMnemonics] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setMnemonics(makeMnemonics(topic));
    setLoading(false);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={{ margin: 0 }}>Memory Hooks (Mnemonics)</h3>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          <input
            style={styles.input}
            placeholder="Enter topic (e.g., Order of Operations)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button onClick={generate} disabled={loading || !topic.trim()} style={styles.primaryBtn}>
            {loading ? 'Generating...' : 'Generate Mnemonics'}
          </button>

          {mnemonics.length > 0 && (
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>Try These</h4>
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

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000
  },
  modal: {
    background: '#fff', width: 'min(560px, 92%)', borderRadius: 12,
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)', padding: 20
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12
  },
  closeBtn: {
    border: 'none', background: 'transparent', fontSize: 24, cursor: 'pointer'
  },
  input: {
    width: '100%', borderRadius: 8, border: '1px solid #e0e0e0', padding: 12, fontSize: 14
  },
  primaryBtn: {
    alignSelf: 'start', padding: '10px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
    background: 'linear-gradient(135deg, #16a085 0%, #1abc9c 100%)', color: '#fff', fontWeight: 600
  },
  section: {
    border: '1px solid #f0f0f0', borderRadius: 8, padding: 12, background: '#f6fffb'
  },
  sectionTitle: {
    margin: '0 0 8px 0', fontSize: 14, color: '#2d3a2e'
  }
};










