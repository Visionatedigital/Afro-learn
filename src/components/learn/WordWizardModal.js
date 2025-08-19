import React, { useState, useMemo } from 'react';

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

function getAgeBand(age) {
  if (age <= 8) return '6-8';
  if (age <= 10) return '9-10';
  return '11-12';
}

function simplifyDefinition(def, band) {
  // Crude simplifier by band
  if (band === '6-8') return def.replace(/\b(approximately|complex|investigate|determine)\b/gi, 'find out').replace(/\butilize\b/gi, 'use');
  if (band === '9-10') return def.replace(/\bapproximately\b/gi, 'about').replace(/\butilize\b/gi, 'use');
  return def;
}

function hyphenate(word) {
  // Very naive syllable split (demo only)
  return word.replace(/([aeiouy])([^aeiouy])/gi, '$1-$2');
}

function buildExamples(word, band) {
  const lower = word.toLowerCase();
  const base = [
    `I saw the word "${lower}" in my book today.`,
    `We used "${lower}" in class to talk about our topic.`,
    `Can you use "${lower}" in a sentence with your friend?`
  ];
  if (band === '6-8') return base.map(s => s.replace(/today\./, 'at school.')).slice(0, 2);
  if (band === '9-10') return [
    `Our teacher asked us to use "${lower}" when we explained our idea.`,
    `I wrote a sentence with "${lower}" to make my meaning clear.`
  ];
  return [
    `I chose "${lower}" because it fits the tone of my paragraph.`,
    `Using "${lower}" helped me be more precise in my answer.`
  ];
}

function buildActivity(word, band) {
  const w = word.toLowerCase();
  if (band === '6-8') {
    return {
      type: 'pick',
      prompt: `Which sentence uses "${w}" correctly?`,
      options: [
        `I am ${w} about how plants grow.`,
        `I ${w} the pencil on my desk.`,
      ],
      correctIndex: 0,
      explain: 'Use the word to describe a feeling or idea that fits the meaning.'
    };
  }
  if (band === '9-10') {
    return {
      type: 'blank',
      prompt: `Fill the blank with the best word: "I was _____ to learn more about space."`,
      options: [w, 'tired'],
      correctIndex: 0,
      explain: 'Choose the word that matches being eager to learn.'
    };
  }
  return {
    type: 'context',
    prompt: `Pick the sentence where "${w}" fits the context best:`,
    options: [
      `She felt ${w} about the mystery and kept asking questions.`,
      `She ${w} the chair under the table.`
    ],
    correctIndex: 0,
    explain: 'The word should fit an intellectual/emotional context, not an action on objects.'
  };
}

function buildDefinition(word, band, level) {
  const base = `A simple meaning of "${word}".`;
  const byBand = band === '6-8'
    ? `Means something easy to understand for kids.`
    : band === '9-10'
    ? `Means an idea explained clearly for learners.`
    : `A concise meaning used in academic or precise contexts.`;
  const def = `${byBand}`;
  return simplifyDefinition(def, band);
}

function buildRoots(word, band, level) {
  if (band === '6-8') return [];
  const roots = [];
  const lower = word.toLowerCase();
  if (lower.startsWith('un')) roots.push({ part: 'un-', meaning: 'not' });
  if (lower.endsWith('ful')) roots.push({ part: '-ful', meaning: 'full of' });
  if (lower.endsWith('ous')) roots.push({ part: '-ous', meaning: 'full of' });
  if (lower.endsWith('ment')) roots.push({ part: '-ment', meaning: 'state or result' });
  if (level && level.toLowerCase() === 'advanced') roots.push({ part: 'root', meaning: 'Break the word into meaningful parts if possible.' });
  return roots.slice(0, 2);
}

export default function WordWizardModal({ isOpen, onClose, userProfile }) {
  const [word, setWord] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const age = userProfile?.age ?? 10;
  const level = userProfile?.level ?? 'Intermediate';
  const band = useMemo(() => getAgeBand(Number(age)), [age]);

  if (!isOpen) return null;

  const generate = async () => {
    if (!word.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const def = buildDefinition(word, band, level);
    const syll = hyphenate(word);
    const ex = buildExamples(word, band);
    const act = buildActivity(word, band);
    const rt = buildRoots(word, band, level);

    setResult({ word, syllables: syll, definition: def, examples: ex, activity: act, roots: rt, synonyms: [], antonyms: [] });
    setLoading(false);
  };

  const checkAnswer = (idx) => {
    if (!result) return;
    const correct = idx === result.activity.correctIndex;
    const msg = correct ? 'Great job!' : 'Not quite—try again!';
    alert(`${msg}\n${result.activity.explain}`);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={{ margin: 0 }}>Word Wizard</h3>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              style={styles.input}
              placeholder="Type a word (e.g., curious)"
              value={word}
              onChange={(e) => setWord(e.target.value)}
            />
            <button onClick={generate} disabled={loading || !word.trim()} style={styles.primaryBtn}>
              {loading ? 'Working...' : 'Explain'}
            </button>
          </div>

          {result && (
            <div style={{ display: 'grid', gap: 16 }}>
              <div style={styles.section}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h4 style={styles.sectionTitle}>
                    Say it
                    <span style={{ marginLeft: 8, color: '#667eea', fontWeight: 600 }}>{result.syllables}</span>
                  </h4>
                  <button style={styles.iconBtn} onClick={() => speak(result.word)} title="Hear word">🔊</button>
                </div>
              </div>

              <div style={styles.section}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h4 style={styles.sectionTitle}>What it means</h4>
                  <button style={styles.iconBtn} onClick={() => speak(result.definition)} title="Hear definition">🔊</button>
                </div>
                <p style={{ margin: 0 }}>{result.definition}</p>
              </div>

              <div style={styles.section}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h4 style={styles.sectionTitle}>Use it</h4>
                  <button style={styles.iconBtn} onClick={() => speak(result.examples.join(' '))} title="Hear examples">🔊</button>
                </div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {result.examples.map((e, i) => (<li key={i}>{e}</li>))}
                </ul>
              </div>

              {result.roots && result.roots.length > 0 && (
                <div style={styles.section}>
                  <h4 style={styles.sectionTitle}>Word parts</h4>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {result.roots.map((r, i) => (
                      <li key={i}><strong>{r.part}</strong>: {r.meaning}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={styles.section}>
                <h4 style={styles.sectionTitle}>Try it</h4>
                <p style={{ margin: '0 0 8px 0' }}>{result.activity.prompt}</p>
                <div style={{ display: 'grid', gap: 8 }}>
                  {result.activity.options.map((o, i) => (
                    <button key={i} style={styles.optionBtn} onClick={() => checkAnswer(i)}>{o}</button>
                  ))}
                </div>
              </div>

              <div style={styles.section}>
                <h4 style={styles.sectionTitle}>Remember it</h4>
                <p style={{ margin: 0 }}>Make a tiny story or rhyme using "{result.word}". Add it to Flashcards later!</p>
              </div>
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
    background: '#fff', width: 'min(760px, 94%)', borderRadius: 12,
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)', padding: 20
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12
  },
  closeBtn: {
    border: 'none', background: 'transparent', fontSize: 24, cursor: 'pointer'
  },
  input: {
    flex: 1, borderRadius: 8, border: '1px solid #e0e0e0', padding: 12, fontSize: 14
  },
  primaryBtn: {
    padding: '10px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', fontWeight: 600
  },
  iconBtn: {
    border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18
  },
  section: {
    border: '1px solid #f0f0f0', borderRadius: 8, padding: 12, background: '#fafbff'
  },
  sectionTitle: {
    margin: 0, fontSize: 14, color: '#2d3a2e'
  },
  optionBtn: {
    textAlign: 'left', padding: '10px 12px', borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer'
  }
};













