import React from 'react';
import './ChatbotIcon.css';
import OwlIcon from '../../assets/images/Friendly Purple Owl Character.svg';

const ChatbotIcon = ({ onClick, isOpen }) => {
  return (
    <div 
      className={`chatbot-icon ${isOpen ? 'open' : ''}`}
      onClick={onClick}
      title="Chat with AI Assistant"
    >
      <img
        src={OwlIcon}
        alt="Ubongo Owl"
        style={{ width: 28, height: 28, objectFit: 'contain' }}
      />
    </div>
  );
};

export default ChatbotIcon;





