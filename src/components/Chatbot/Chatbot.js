import React, { useState, useEffect } from 'react';
import ChatbotIcon from './ChatbotIcon';
import ChatbotPanel from './ChatbotPanel';

const Chatbot = ({ userProfile, showInUbongoTools = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInUbongoTools, setIsInUbongoTools] = useState(false);

  useEffect(() => {
    const checkUbongoTools = () => {
      const path = window.location.pathname;
      const ubongoRoutes = ['/ubongo-tools', '/student-tools', '/learning-tools'];
      const isInUbongo = ubongoRoutes.some(route => path.includes(route));
      setIsInUbongoTools(isInUbongo);
    };

    checkUbongoTools();

    const handleRouteChange = () => {
      checkUbongoTools();
    };

    window.addEventListener('popstate', handleRouteChange);
    const interval = setInterval(checkUbongoTools, 1000);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      clearInterval(interval);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const shouldShow = !showInUbongoTools || isInUbongoTools;

  if (!shouldShow) {
    return null;
  }

  return (
    <>
      <ChatbotIcon onClick={handleToggle} isOpen={isOpen} />
      <ChatbotPanel
        isOpen={isOpen}
        onClose={handleClose}
        userProfile={userProfile}
      />
    </>
  );
};

export default Chatbot;





