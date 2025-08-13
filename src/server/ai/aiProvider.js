// Simple AI provider shim with deterministic demo responses.
// Replace these implementations with calls to your real AI service.

function tonePrefix(context) {
  const band = (context?.age || 10) <= 8 ? '6-8' : (context?.age || 10) <= 10 ? '9-10' : '11-12';
  const congrats = context?.recentAchievements?.length ? `Congrats on ${context.recentAchievements[0]}! ` : '';
  const nudge = context?.nextBadge ? `You are close to ${context.nextBadge}. ` : '';
  const weak = context?.weakTopics?.length ? `We can practice ${context.weakTopics[0]} soon. ` : '';
  const base = `${congrats}${nudge}${weak}`;
  if (band === '6-8') return base + 'We will use simple words.';
  if (band === '9-10') return base + 'We will keep it clear and short.';
  return base + 'We will be concise and precise.';
}

function explain({ topic, age, level, subject, context }) {
  const pre = tonePrefix(context);
  const band = (age || context?.age || 10) <= 8 ? '6-8' : (age || context?.age || 10) <= 10 ? '9-10' : '11-12';
  const bullets = band === '6-8'
    ? [ `${pre}`, `This is about ${topic} you can see or do.`, 'What it is, how it works, and why it helps.' ]
    : band === '9-10'
    ? [ `${pre}`, `${topic} has 3 parts: what, how, why.`, 'We use simple examples.' ]
    : [ `${pre}`, `${topic}: definition, key ideas, one example.`, 'Short and precise.' ];
  return Promise.resolve({ title: `${subject || ''} ${topic}`.trim(), bullets, example: `Example in ${subject || 'class'}: ${topic}.` });
}

function summarize({ text, context }) {
  const head = text.split(/[.!?]/).map(s => s.trim()).filter(Boolean)[0] || 'Summary';
  const parts = text.split(/[.!?]/).map(s => s.trim()).filter(Boolean).slice(1, 3);
  return Promise.resolve({ headline: head, bullets: parts.map(p => `• ${p}`), length: 'short' });
}

function simplifyText({ text, context }) {
  const sentences = text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const simplified = sentences.map(s => (s.split(',')[0] || s).replace(/\b\w+ly\b/g, (m) => m.replace(/ly$/, ''))).join(' ');
  const words = text.toLowerCase().replace(/[^a-z\s-]/g, '').split(/\s+/).filter(w => w.length >= 9);
  const unique = Array.from(new Set(words)).slice(0, 8);
  const glossary = unique.map(w => ({ term: w, meaning: `A simpler way to say "${w}".` }));
  return Promise.resolve({ simplified: `${tonePrefix(context)} ${simplified}`.trim(), glossary });
}

function wordWizard({ word, age, level, context }) {
  const syllables = word.replace(/([aeiouy])([^aeiouy])/gi, '$1-$2');
  const band = (age || context?.age || 10) <= 8 ? '6-8' : (age || context?.age || 10) <= 10 ? '9-10' : '11-12';
  const examples = band === '6-8'
    ? [ `I use "${word}" at school.`, `We talked about "${word}" today.` ]
    : band === '9-10'
    ? [ `I used "${word}" to explain my idea.`, `My sentence with "${word}" was clear.` ]
    : [ `"${word}" fit the tone of my paragraph.`, `It made my answer more precise.` ];
  const roots = []; const lower = word.toLowerCase();
  if (lower.startsWith('un')) roots.push({ part: 'un-', meaning: 'not' });
  if (lower.endsWith('ful')) roots.push({ part: '-ful', meaning: 'full of' });
  return Promise.resolve({
    syllables,
    definition: `${tonePrefix(context)} A simple meaning of "${word}" for your level.`,
    examples,
    synonyms: [], antonyms: [], roots,
    activity: {
      prompt: `Pick the best way to use "${word}" in a sentence`,
      options: [ `I am ${word} about science.`, `I ${word} the chair.` ],
      correctIndex: 0,
      explanation: 'Use the word in a context that matches its meaning.'
    }
  });
}

function etymology({ term, context }) {
  const lower = (term || '').toLowerCase();
  const parts = [];
  if (lower.includes('bio')) parts.push({ part: 'bio', meaning: 'life' });
  if (lower.includes('geo')) parts.push({ part: 'geo', meaning: 'earth' });
  return Promise.resolve({ parts, familyWords: ['biology', 'geology'].slice(0, parts.length) });
}

function mnemonics({ topic, context }) {
  const simple = (topic || '').split(/\s+/).slice(0, 3).join(' ');
  return Promise.resolve({ tips: [
    `${tonePrefix(context)} Story: a character uses ${simple} in a funny way.`,
    `Acronym: first letters of key words in ${simple}.`,
    `Chunking: break ${simple} into 3 small parts.`,
  ]});
}

function describeImage({ imageUrl, context }) {
  return Promise.resolve({
    caption: `${tonePrefix(context)} A simple description of the image.`,
    details: ['Object 1', 'Object 2'], concepts: ['color', 'action']
  });
}

function generateQuestions({ subject, topic, count = 5, difficulty = 2, context }) {
  const qs = fetchQuestionsLike(subject, topic, count, difficulty);
  return Promise.resolve({ items: qs });
}

function checkAnswer({ question, choice, context }) {
  const correct = Array.isArray(question.correct) ? question.correct.includes(choice) : question.correct === choice;
  return Promise.resolve({ correct, explanation: question.explanation || 'Reviewed your answer.' });
}

// Simple sampler from the top of the mock pool
function fetchQuestionsLike(subject, topic, count, difficulty) {
  const topicLc = (topic || '').toLowerCase();
  const pool = MOCK_REF.filter(q => (!subject || q.subject === subject) && (!topicLc || q.topic.toLowerCase().includes(topicLc)) && (!difficulty || q.difficulty <= difficulty));
  const list = (pool.length ? pool : MOCK_REF.filter(q => (!subject || q.subject === subject))).slice(0, count || 5);
  return list.map(q => ({ ...q, choices: q.choices || (q.type === 'true_false' ? [{ id: 'true', text: 'True' }, { id: 'false', text: 'False' }] : []) }));
}

const MOCK_REF = [
  { id: 'ref1', subject: 'Math', topic: 'Fractions', type: 'mcq', stem: 'Which is 1/2?', choices: [ { id: 'a', text: '2/4' }, { id: 'b', text: '3/5' } ], correct: 'a', explanation: '2/4 simplifies to 1/2.', difficulty: 1 },
  { id: 'ref2', subject: 'English', topic: 'Vocabulary', type: 'true_false', stem: 'Opposite of hot is cold.', correct: 'true', explanation: 'Yes, cold is the antonym.', difficulty: 1 },
];

module.exports = { explain, summarize, simplifyText, wordWizard, etymology, mnemonics, describeImage, generateQuestions, checkAnswer };
