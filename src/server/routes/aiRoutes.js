const express = require('express');
const router = express.Router();
const ai = require('../ai/aiProvider');

function buildContext(req) {
  const p = req.body?.profile || req.body?.userProfile || {};
  const ctx = {
    age: Number(p.age) || 10,
    level: p.level || 'Intermediate',
    language: p.language || 'en',
    streakDays: Number(p.streakDays) || 0,
    skillsMastered: Number(p.skillsMastered) || 0,
    weakTopics: p.weakTopics || [],
    strongTopics: p.strongTopics || [],
    focusSubject: p.focusSubject || req.body?.subject || null,
    recentAchievements: p.recentAchievements || [],
    nextBadge: p.nextBadge || null,
  };
  return ctx;
}

router.post('/explain', async (req, res) => {
  try { const data = await ai.explain({ ...(req.body||{}), context: buildContext(req) }); res.json({ success: true, data }); } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});
router.post('/summarize', async (req, res) => {
  try { const data = await ai.summarize({ ...(req.body||{}), context: buildContext(req) }); res.json({ success: true, data }); } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});
router.post('/simplify-text', async (req, res) => {
  try { const data = await ai.simplifyText({ ...(req.body||{}), context: buildContext(req) }); res.json({ success: true, data }); } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});
router.post('/word-wizard', async (req, res) => {
  try { const data = await ai.wordWizard({ ...(req.body||{}), context: buildContext(req) }); res.json({ success: true, data }); } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});
router.post('/etymology', async (req, res) => {
  try { const data = await ai.etymology({ ...(req.body||{}), context: buildContext(req) }); res.json({ success: true, data }); } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});
router.post('/mnemonics', async (req, res) => {
  try { const data = await ai.mnemonics({ ...(req.body||{}), context: buildContext(req) }); res.json({ success: true, data }); } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});
router.post('/describe-image', async (req, res) => {
  try { const data = await ai.describeImage({ ...(req.body||{}), context: buildContext(req) }); res.json({ success: true, data }); } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});
router.post('/generate-questions', async (req, res) => {
  try { const data = await ai.generateQuestions({ ...(req.body||{}), context: buildContext(req) }); res.json({ success: true, data }); } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});
router.post('/check-answer', async (req, res) => {
  try { const data = await ai.checkAnswer({ ...(req.body||{}), context: buildContext(req) }); res.json({ success: true, data }); } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

module.exports = router;
