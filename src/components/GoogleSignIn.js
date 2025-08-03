import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import './GoogleSignIn.css';

// Separate component for Google OAuth functionality
const GoogleOAuthButton = ({ onSuccess, onError, buttonText, loading }) => {
  const { googleLogin } = useAuth();
  const [googleError, setGoogleError] = useState(null);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        setGoogleError(null);
        // Get user info from Google
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${response.access_token}` },
        }).then(res => res.json());
        // Call our backend with Google user info
        const result = await googleLogin({
          credential: response.access_token,
          email: userInfo.email,
          given_name: userInfo.given_name,
          family_name: userInfo.family_name,
          picture: userInfo.picture
        });
        if (result.success) {
          onSuccess && onSuccess(result.user);
        } else {
          const errorMsg = result.error || 'Google login failed';
          setGoogleError(errorMsg);
          onError && onError(errorMsg);
        }
      } catch (error) {
        console.error('Google login error:', error);
        const errorMsg = 'Google login failed. Please try again.';
        setGoogleError(errorMsg);
        onError && onError(errorMsg);
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      const errorMsg = 'Google login failed. Please try again.';
      setGoogleError(errorMsg);
      onError && onError(errorMsg);
    }
  });

  return (
    <>
      <button
        className="google-signin-btn"
        onClick={() => login()}
        disabled={loading}
        type="button"
      >
        <svg className="google-icon" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span>{loading ? 'Signing in...' : buttonText}</span>
      </button>
      {googleError && (
        <div className="google-error">
          {googleError}
        </div>
      )}
    </>
  );
};

// Fallback component when Google is not configured
const GoogleSignInDisabled = ({ googleClientId }) => (
  <div className="google-signin-disabled">
    <button
      className="google-signin-btn disabled"
      disabled={true}
      type="button"
    >
      <svg className="google-icon" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      <span>Google Sign-In (Not Configured)</span>
    </button>
    <div className="google-config-note">
      <small>
        To enable Google Sign-In, add your Google Client ID to the .env file:<br/>
        REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here<br/>
        <br/>
        Current value: {googleClientId || 'undefined'}
      </small>
    </div>
  </div>
);

const GoogleSignIn = ({ onSuccess, onError, buttonText = "Continue with Google" }) => {
  const { loading } = useAuth();
  // Check if Google Client ID is configured
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '640944440753-qm31crjml06efqv29d8qs17ls9lvch8f.apps.googleusercontent.com';
  const isGoogleConfigured = googleClientId && googleClientId !== 'YOUR_GOOGLE_CLIENT_ID';
  if (!isGoogleConfigured) {
    return <GoogleSignInDisabled googleClientId={googleClientId} />;
  }
  return (
    <GoogleOAuthButton
      onSuccess={onSuccess}
      onError={onError}
      buttonText={buttonText}
      loading={loading}
    />
  );
};

export default GoogleSignIn; 
 
 
 