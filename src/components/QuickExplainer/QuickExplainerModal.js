import React, { useState } from 'react';
import './QuickExplainerModal.css';

const QuickExplainerModal = ({ isOpen, onClose, userProfile }) => {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('Math');
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userResponse, setUserResponse] = useState(null);
  const [followUp, setFollowUp] = useState(null);

  const subjects = ['Math', 'Science', 'English', 'History', 'Geography'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setExplanation(null);
    setUserResponse(null);
    setFollowUp(null);

    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, age: userProfile?.age, level: userProfile?.level, subject })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'AI error');
      setExplanation({
        text: `${json.data.title}\n\n${json.data.bullets.join('\n')}`,
        examples: json.data.example ? [json.data.example] : [],
        analogies: undefined,
        visualSuggestion: 'Try drawing a simple picture to remember it.'
      });
    } catch (error) {
      console.error('Error generating explanation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserResponse = async (response) => {
    setUserResponse(response);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: `${topic} (more detail: ${response})`, age: userProfile?.age, level: userProfile?.level, subject })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'AI error');
      setFollowUp({
        text: json.data.title,
        additionalInfo: json.data.bullets.join(' ')
      });
    } catch (error) {
      console.error('Error generating follow-up:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="quick-explainer-fullpage">
      {/* Header */}
      <div className="fullpage-header">
        <div className="header-content">
          <div className="header-left">
            <button className="back-button" onClick={onClose}>
              ← Back to Tools
            </button>
            <div>
              <h1>Quick Explainer</h1>
              <p>Get simple explanations in words you understand</p>
            </div>
          </div>
          <div className="header-right">
            <div className="user-info">
              <div className="user-name">{userProfile.name}</div>
              <div className="user-level">{userProfile.level}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="fullpage-content">
        <div className="content-container">
          {/* Input Section */}
          {!explanation && (
            <div className="input-section-fullpage">
              <div className="input-card">
                <h2>What would you like explained?</h2>
                <p>Type any topic you're studying and I'll explain it in simple terms that make sense to you.</p>
                
                <form onSubmit={handleSubmit} className="input-form">
                  <div className="input-group">
                    <label htmlFor="topic">Topic to explain</label>
                    <textarea
                      id="topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., photosynthesis, fractions, World War II, gravity..."
                      className="topic-input-fullpage"
                      rows="4"
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="subject">Subject</label>
                    <select
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="subject-selector-fullpage"
                    >
                      {subjects.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    className="explain-button-fullpage"
                    disabled={!topic.trim() || loading}
                  >
                    {loading ? 'Creating explanation...' : 'Explain This Topic'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="loading-section-fullpage">
              <div className="loading-card">
                <div className="loading-spinner-fullpage"></div>
                <h3>Creating your explanation...</h3>
                <p>I'm thinking about the best way to explain this topic in simple terms that you'll understand.</p>
              </div>
            </div>
          )}

          {/* Explanation Display */}
          {explanation && !loading && (
            <div className="explanation-container-fullpage">
              <div className="explanation-card">
                <div className="explanation-header-fullpage">
                  <div className="header-info">
                    <h2>Explaining: {topic}</h2>
                    <span className="subject-badge">{subject}</span>
                  </div>
                  <div className="difficulty-badge-fullpage">Level: {userProfile.level}</div>
                </div>

                <div className="explanation-content-fullpage">
                  <div className="main-explanation-fullpage">
                    {explanation.text}
                  </div>

                  {explanation.examples && (
                    <div className="examples-section-fullpage">
                      <h4>Examples:</h4>
                      <ul>
                        {explanation.examples.map((example, index) => (
                          <li key={index}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Follow-up Actions */}
                {!userResponse && (
                  <div className="interaction-buttons-fullpage">
                    <button 
                      className="btn-secondary-fullpage"
                      onClick={() => handleUserResponse("Explain More")}
                    >
                      Explain More
                    </button>
                    <button 
                      className="btn-secondary-fullpage"
                      onClick={() => handleUserResponse("Give Me Examples")}
                    >
                      Give Me Examples
                    </button>
                    <button 
                      className="btn-primary-fullpage"
                      onClick={() => handleUserResponse("I Understand")}
                    >
                      I Understand
                    </button>
                    <button 
                      className="btn-secondary-fullpage"
                      onClick={() => handleUserResponse("I'm Still Confused")}
                    >
                      I'm Still Confused
                    </button>
                  </div>
                )}

                {/* Follow-up Response */}
                {followUp && (
                  <div className="follow-up-section-fullpage">
                    <div className="follow-up-content-fullpage">
                      <p>{followUp.text}</p>
                      {followUp.additionalInfo && <p>{followUp.additionalInfo}</p>}
                    </div>
                    <div className="final-actions-fullpage">
                      <button 
                        className="btn-primary-fullpage"
                        onClick={() => {
                          setExplanation(null);
                          setUserResponse(null);
                          setFollowUp(null);
                          setTopic('');
                        }}
                      >
                        Try Another Topic
                      </button>
                      <button className="btn-secondary-fullpage" onClick={onClose}>Back to Tools</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickExplainerModal;
