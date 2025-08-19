import React, { useState } from 'react';
import ToolHeader from '../../components/tools/ToolHeader';

function speak(text) {
  try {
    if (window && 'speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    }
  } catch (_) {}
}

export default function WordWizardPage({ userProfile = { age: 10, level: 'Intermediate' } }) {
  const [word, setWord] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!word.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/word-wizard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, profile: userProfile })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'AI error');
      setResult(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = (idx) => {
    if (!result) return;
    const correct = idx === result.activity?.correctIndex;
    const msg = correct ? 'Great job!' : 'Not quite—try again!';
    alert(`${msg}\n${result.activity?.explanation || ''}`);
  };

  return (
    <div style={{ padding: '2rem 0.5rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: '1.5rem' }}>
        <ToolHeader icon="wand" title="Word Wizard" subtitle="Kid-friendly word meanings matched to age and level" />

        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              style={{ flex: 1, borderRadius: 8, border: '1px solid #e0e0e0', padding: 12, fontSize: 14 }}
              placeholder="Type a word (e.g., curious)"
              value={word}
              onChange={(e) => setWord(e.target.value)}
            />
            <button onClick={generate} disabled={loading || !word.trim()} style={{ padding: '10px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', fontWeight: 600 }}>
              {loading ? 'Working...' : 'Explain'}
            </button>
          </div>

          {result && (
            <div style={{ display: 'grid', gap: 16 }}>
              <div style={sectionStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h4 style={titleStyle}>
                    Say it
                    <span style={{ marginLeft: 8, color: '#667eea', fontWeight: 600 }}>{result.syllables}</span>
                  </h4>
                  <button style={iconBtn} onClick={() => speak(word)} title="Hear word">🔊</button>
                </div>
              </div>

              <div style={sectionStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h4 style={titleStyle}>What it means</h4>
                  <button style={iconBtn} onClick={() => speak(result.definition)} title="Hear definition">🔊</button>
                </div>
                <p style={{ margin: 0 }}>{result.definition}</p>
              </div>

              {result.examples?.length > 0 && (
                <div style={sectionStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h4 style={titleStyle}>Use it</h4>
                    <button style={iconBtn} onClick={() => speak(result.examples.join(' '))} title="Hear examples">🔊</button>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {result.examples.map((e, i) => (<li key={i}>{e}</li>))}
                  </ul>
                </div>
              )}

              {result.roots?.length > 0 && (
                <div style={sectionStyle}>
                  <h4 style={titleStyle}>Word parts</h4>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {result.roots.map((r, i) => (
                      <li key={i}><strong>{r.part}</strong>: {r.meaning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.activity && (
                <div style={sectionStyle}>
                  <h4 style={titleStyle}>Try it</h4>
                  <p style={{ margin: '0 0 8px 0' }}>{result.activity.prompt}</p>
                  <div style={{ display: 'grid', gap: 8 }}>
                    {result.activity.options.map((o, i) => (
                      <button key={i} style={optionBtn} onClick={() => checkAnswer(i)}>{o}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const sectionStyle = { border: '1px solid #f0f0f0', borderRadius: 8, padding: 12, background: '#fafbff' };
const titleStyle = { margin: 0, fontSize: 14, color: '#2d3a2e' };
const iconBtn = { border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18 };
const optionBtn = { textAlign: 'left', padding: '10px 12px', borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer' };
