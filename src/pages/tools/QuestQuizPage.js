import React, { useEffect, useMemo, useState } from 'react';
import ToolHeader from '../../components/tools/ToolHeader';

export default function QuestQuizPage({ userProfile = { age: 10, level: 'Intermediate' } }) {
  const [stage, setStage] = useState('setup'); // setup | quiz | summary
  const [subject, setSubject] = useState('Math');
  const [topic, setTopic] = useState('Fractions');
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState(2);
  const [includeHints, setIncludeHints] = useState(true);
  const [timed, setTimed] = useState(false);

  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // id -> { choice, correct, usedHint }
  const [timeLeft, setTimeLeft] = useState(null); // seconds
  const totalTime = useMemo(() => (timed ? Math.max(30, count * 30) : null), [timed, count]);
  const current = useMemo(() => items[index], [items, index]);

  useEffect(() => {
    if (stage !== 'quiz' || !timed) return;
    if (timeLeft === 0) { setStage('summary'); return; }
    const id = setInterval(() => setTimeLeft(t => (t !== null ? Math.max(0, t - 1) : null)), 1000);
    return () => clearInterval(id);
  }, [stage, timed, timeLeft]);

  const startQuiz = async () => {
    try {
      const res = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, topic, count, difficulty, profile: userProfile })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'AI error');
      setItems(json.data.items || []);
      setIndex(0);
      setAnswers({});
      setTimeLeft(totalTime);
      setStage('quiz');
    } catch (e) {
      console.error(e);
    }
  };

  const selectChoice = async (qid, choiceId) => {
    const q = items.find(i => i.id === qid);
    try {
      const res = await fetch('/api/ai/check-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, choice: choiceId, profile: userProfile })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'AI error');
      setAnswers(prev => ({ ...prev, [qid]: { ...(prev[qid] || {}), choice: choiceId, correct: !!json.data.correct } }));
    } catch (e) {
      console.error(e);
    }
  };

  const markHint = (qid) => setAnswers(prev => ({ ...prev, [qid]: { ...(prev[qid] || {}), usedHint: true } }));

  const next = () => setIndex(i => Math.min(i + 1, items.length - 1));
  const prev = () => setIndex(i => Math.max(i - 1, 0));
  const finish = () => setStage('summary');
  const reset = () => { setStage('setup'); setItems([]); setIndex(0); setAnswers({}); setTimeLeft(null); };

  const score = useMemo(() => {
    let total = 0; let max = items.length;
    items.forEach(q => {
      const a = answers[q.id];
      if (a?.correct) total += a?.usedHint ? 0.5 : 1;
    });
    return { total, max, percent: max ? Math.round((total / max) * 100) : 0 };
  }, [answers, items]);

  const formatTime = (s) => {
    if (s == null) return null;
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div style={{ padding: '2rem 0.5rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: '1.5rem' }}>
        <ToolHeader icon="question" title="Quest Quiz" subtitle="Practice with instant feedback" />

        {stage === 'setup' && (
          <div style={{ display: 'grid', gap: 14 }}>
            <div>
              <label style={label}>Subject</label>
              <select value={subject} onChange={e => setSubject(e.target.value)} style={sel}>
                <option>Math</option>
                <option>English</option>
              </select>
            </div>
            <div>
              <label style={label}>Topic</label>
              <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., Fractions, Parts of Speech" style={inp} />
            </div>
            <div>
              <label style={label}>Number of Questions</label>
              <input type="number" min={3} max={15} value={count} onChange={e => setCount(Number(e.target.value))} style={inp} />
            </div>
            <div>
              <label style={label}>Difficulty: {difficulty}</label>
              <input type="range" min={1} max={5} value={difficulty} onChange={e => setDifficulty(Number(e.target.value))} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={includeHints} onChange={e => setIncludeHints(e.target.checked)} /> Include Hints
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={timed} onChange={e => setTimed(e.target.checked)} /> Timed Mode {timed && totalTime ? `( ${Math.ceil(totalTime/60)} min )` : ''}
            </label>
            <button onClick={startQuiz} style={primary}>Start Quiz</button>
          </div>
        )}

        {stage === 'quiz' && current && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 13, color: '#4e5d52' }}>Question {index + 1} of {items.length}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {timed && (
                  <div style={{ fontSize: 13, color: timeLeft < 15 ? '#c62828' : '#4e5d52', fontWeight: 700 }}>
                    ⏱ {formatTime(timeLeft)}
                  </div>
                )}
                <div style={{ fontSize: 13, color: '#4e5d52' }}>Difficulty: {current.difficulty}</div>
              </div>
            </div>

            <div style={{ fontSize: 16, color: '#2d3a2e' }}>{current.stem}</div>

            <div style={{ display: 'grid', gap: 8 }}>
              {(current.choices || (current.type === 'true_false' ? [{ id: 'true', text: 'True' }, { id: 'false', text: 'False' }] : [])).map(ch => {
                const chosen = answers[current.id]?.choice === ch.id;
                const verdict = answers[current.id]?.correct;
                const showVerdict = chosen && verdict !== undefined;
                const bd = showVerdict ? (verdict ? '#2e7d32' : '#c62828') : '#e0e0e0';
                return (
                  <label key={ch.id} style={{ ...choiceRow, borderColor: bd, background: chosen ? '#f6faff' : '#fff' }}>
                    <input type="radio" name={current.id} checked={chosen} onChange={() => selectChoice(current.id, ch.id)} />
                    <span>{ch.text}</span>
                  </label>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {includeHints && current.hint && (
                <button onClick={() => markHint(current.id)} style={ghost}>Hint</button>
              )}
              <button onClick={prev} disabled={index === 0} style={ghost}>Previous</button>
              {index < items.length - 1 ? (
                <button onClick={next} style={ghost}>Next</button>
              ) : (
                <button onClick={finish} style={primary}>Finish</button>
              )}
            </div>

            {answers[current.id]?.choice && (
              <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 12, background: '#fafbff' }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{answers[current.id]?.correct ? 'Correct!' : 'Not quite'}</div>
                <div style={{ color: '#4e5d52' }}>{current.explanation}</div>
              </div>
            )}
          </div>
        )}

        {stage === 'summary' && (
          <div style={{ display: 'grid', gap: 12 }}>
            <h3 style={{ margin: 0, color: '#2d3a2e' }}>Your Results</h3>
            <div>Score: {score.total} / {score.max} ({score.percent}%)</div>
            {timed && totalTime != null && (
              <div>Time Used: {formatTime((totalTime || 0) - (timeLeft || 0))}</div>
            )}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button style={ghost} onClick={reset}>New Quiz</button>
              <button style={ghost} onClick={() => { setStage('setup'); }}>Change Settings</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const primary = { alignSelf: 'start', padding: '10px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #2bb6bb 0%, #22a3a8 100%)', color: '#fff', fontWeight: 600 };
const ghost = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer' };
const choiceRow = { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: '1px solid #e0e0e0' };
const label = { fontSize: 12, color: '#4e5d52', display: 'block', marginBottom: 6 };
const sel = { width: '100%', borderRadius: 8, border: '1px solid #e0e0e0', padding: 10 };
const inp = { width: '100%', borderRadius: 8, border: '1px solid #e0e0e0', padding: 10 };
