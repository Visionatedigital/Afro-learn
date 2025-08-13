import React, { useState } from 'react';
import ToolHeader from '../../components/tools/ToolHeader';

const FUN = [
  'Honey never spoils — edible even after thousands of years!',
  'Octopuses have three hearts and blue blood!',
  'Bananas are berries, but strawberries are not.',
  'A day on Venus is longer than a year on Venus.'
];

export default function FunSparksPage() {
  const [fact, setFact] = useState('');

  const run = async () => {
    const pick = FUN[Math.floor(Math.random() * FUN.length)];
    setFact(pick);
  };

  return (
    <div style={{ padding: '2rem 0.5rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: '1.5rem' }}>
        <ToolHeader icon="star" title="Fun Sparks" subtitle="Playful facts that spark curiosity" />

        <div style={{ display: 'grid', gap: 12 }}>
          <button onClick={run} style={{ alignSelf: 'start', padding: '10px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #3f51b5 0%, #33449e 100%)', color: '#fff', fontWeight: 600 }}>
            Show a Fun Fact
          </button>

          {fact && (
            <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 12, background: '#eef0ff' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#2d3a2e' }}>Did you know?</h4>
              <p style={{ margin: 0 }}>{fact}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
