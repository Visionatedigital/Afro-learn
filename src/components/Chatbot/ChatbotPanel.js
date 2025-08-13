import React, { useState, useRef, useEffect } from 'react';
import './ChatbotPanel.css';
import OwlAvatar from '../../assets/images/Friendly Purple Owl Character.svg';

const ChatbotPanel = ({ isOpen, onClose, userProfile }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showMathPad, setShowMathPad] = useState(false);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [panelSize, setPanelSize] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('chatbotPanelSize') || 'null');
      if (saved && saved.width && saved.height) return saved;
    } catch (_) {}
    return { width: 400, height: 600 };
  });
  const [isResizing, setIsResizing] = useState(false);
  const resizeStateRef = useRef({ startX: 0, startY: 0, startW: 0, startH: 0, mode: 'br' });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // keep keypad in view
    if (showMathPad) scrollToBottom();
  }, [showMathPad]);

  useEffect(() => {
    try { localStorage.setItem('chatbotPanelSize', JSON.stringify(panelSize)); } catch (_) {}
  }, [panelSize]);

  // No voice output (TTS) per requirements; only voice input is supported.

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await simulateAICall(inputValue, userProfile);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Voice input (Web Speech API)
  const startListening = () => {
    try {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) {
        alert('Voice input not supported on this device/browser.');
        return;
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      const rec = new SR();
      rec.lang = (userProfile?.language || 'en').startsWith('en') ? 'en-US' : userProfile?.language || 'en-US';
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      rec.onresult = (e) => {
        let transcript = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          transcript += e.results[i][0].transcript;
        }
        setInputValue((prev) => `${prev ? prev + ' ' : ''}${transcript}`.trim());
      };
      rec.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };
      rec.onerror = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };
      recognitionRef.current = rec;
      setIsListening(true);
      rec.start();
    } catch (_) {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    try { recognitionRef.current?.stop(); } catch (_) {}
    setIsListening(false);
  };

  // Math keypad helpers
  const insertAtCursor = (text) => {
    const ta = inputRef.current;
    if (!ta) { setInputValue(v => (v + text)); return; }
    const start = ta.selectionStart ?? ta.value.length;
    const end = ta.selectionEnd ?? ta.value.length;
    const before = inputValue.slice(0, start);
    const after = inputValue.slice(end);
    const next = before + text + after;
    setInputValue(next);
    // restore caret after update
    requestAnimationFrame(() => {
      try {
        const pos = start + text.length;
        ta.focus();
        ta.setSelectionRange(pos, pos);
      } catch (_) {}
    });
  };

  const MATH_KEYS = [
    '±','÷','×','−','+','=', '≠','≤','≥','≈',
    '√','^','π','θ','∞','%','°','∠','∥','⊥',
    '(',')','[',']','{','}','| |','→','←','↔',
    'a/b','x^2','x^3','x_y','|x|'
  ];

  const onMathKey = (k) => {
    switch (k) {
      case '−': insertAtCursor('−'); break; // true minus
      case '×': insertAtCursor('×'); break;
      case '÷': insertAtCursor('÷'); break;
      case 'a/b': insertAtCursor('( )/( )'); break;
      case 'x^2': insertAtCursor('x^2'); break;
      case 'x^3': insertAtCursor('x^3'); break;
      case 'x_y': insertAtCursor('x_y'); break;
      case '| |': insertAtCursor('| |'); break;
      default: insertAtCursor(k);
    }
  };

  // Resize handlers
  const onResizeStart = (e, mode = 'br') => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    document.body.style.userSelect = 'none';
    const startX = e.clientX;
    const startY = e.clientY;
    resizeStateRef.current = { startX, startY, startW: panelSize.width, startH: panelSize.height, mode };
    window.addEventListener('mousemove', onResizing, { passive: false });
    window.addEventListener('mouseup', onResizeEnd, { passive: false });
  };

  const onResizing = (e) => {
    e.preventDefault();
    const { startX, startY, startW, startH, mode } = resizeStateRef.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    let nextW = panelSize.width;
    let nextH = panelSize.height;
    if (mode === 'br') {
      nextW = Math.min(Math.max(320, startW + dx), 680);
      nextH = Math.min(Math.max(420, startH + dy), window.innerHeight - 40);
    } else if (mode === 'left') {
      nextW = Math.min(Math.max(320, startW - dx), 680);
    } else if (mode === 'top') {
      nextH = Math.min(Math.max(420, startH - dy), window.innerHeight - 40);
    }
    setPanelSize({ width: nextW, height: nextH });
  };

  const onResizeEnd = () => {
    setIsResizing(false);
    document.body.style.userSelect = '';
    window.removeEventListener('mousemove', onResizing);
    window.removeEventListener('mouseup', onResizeEnd);
  };

  const simulateAICall = async (message, profile) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
      return "Hello! I'm here to help you with your learning. What subject are you working on today?";
    } else if (message.toLowerCase().includes('math') || message.toLowerCase().includes('mathematics')) {
      return 'Great! I can help you with math. What specific topic are you studying? (e.g., fractions, algebra, geometry)';
    } else if (message.toLowerCase().includes('help')) {
      return 'I can help you with:\n• Explaining concepts\n• Practice questions\n• Study tips\n• Homework help\n\nWhat would you like to work on?';
    } else {
      return "That's interesting! I'd be happy to help you with that. Could you tell me more about what you're learning?";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-overlay" onClick={onClose}>
      <div
        className={`chatbot-panel${isResizing ? ' resizing' : ''}`}
        onClick={(e) => e.stopPropagation()}
        style={{ width: panelSize.width + 'px', height: panelSize.height + 'px' }}
      >
        <div className="chatbot-header">
          <div className="chatbot-title">
            <div className="chatbot-avatar">
              <img src={OwlAvatar} alt="Ubongo Buddy" />
            </div>
            <div>
              <h3>Ubongo Buddy</h3>
              <p>Ask me anything. Let’s learn!</p>
            </div>
          </div>
          <button className="chatbot-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-content">
                {message.content}
              </div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message bot">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {showMathPad && (
          <div className="math-keypad" aria-label="Math keypad">
            {MATH_KEYS.map((k) => (
              <button key={k} className="key" onClick={() => onMathKey(k)} aria-label={`insert ${k}`}>{k}</button>
            ))}
          </div>
        )}

        <div className="chatbot-input">
          <button
            className={`mic-button ${isListening ? 'active' : ''}`}
            title={isListening ? 'Stop voice' : 'Speak'}
            onClick={isListening ? stopListening : startListening}
            disabled={isLoading}
          >
            {isListening ? '⏺' : '🎤'}
          </button>

          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Speak or type your message..."
            rows="1"
            disabled={isLoading}
          />

          <button
            className="math-button"
            title="Math keypad"
            onClick={() => setShowMathPad(v => !v)}
            disabled={isLoading}
          >
            𝑓(x)
          </button>

          <button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="send-button"
            title="Send"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
            </svg>
            <span className="send-button-label">Ask AI</span>
          </button>
        </div>

        <div className="resize-handle-br" onMouseDown={(e) => onResizeStart(e, 'br')} title="Resize" />
        <div className="resize-handle-left" onMouseDown={(e) => onResizeStart(e, 'left')} title="Resize width" />
        <div className="resize-handle-top" onMouseDown={(e) => onResizeStart(e, 'top')} title="Resize height" />
      </div>
    </div>
  );
};

export default ChatbotPanel;
