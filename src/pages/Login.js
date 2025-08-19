import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import GoogleSignIn from '../components/GoogleSignIn';
import './Login.css';
import fallbackIllustration from '../assets/images/child_looking_up.png';
import img1 from '../assets/images/IMG_4416.PNG';
import img2 from '../assets/images/IMG_4417.PNG';
import img3 from '../assets/images/IMG_4418.PNG';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const heroImages = [img1, img2, img3, fallbackIllustration];
  const [heroIndex, setHeroIndex] = useState(Math.floor(Math.random() * heroImages.length));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  React.useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, [heroImages.length]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginApi(form);
      setLoading(false);
      login(res.token, res.user);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const handleGoogleSuccess = (user) => {
    navigate('/');
  };

  const handleGoogleError = (error) => {
    console.error('Google login error:', error);
  };

  return (
    <div className="login-root">
      <div className="login-illustration">
        <img src={heroImages[heroIndex]} alt="AfroLearn login" />
      </div>
      <div className="login-form-container">
        <div className="login-form-inner">
          <h2 className="login-title">Log in</h2>
          <p className="login-subtitle">Welcome back to AfroLearn</p>
          {error && <div className="login-error">{error}</div>}
          <GoogleSignIn onSuccess={handleGoogleSuccess} onError={handleGoogleError} buttonText="Continue with Google" />
          <div className="auth-divider"><span>or</span></div>
          <form className="login-form" onSubmit={handleSubmit}>
            <input name="email" value={form.email} onChange={handleChange} className="login-input" placeholder="Email" required disabled={loading} />
            <input name="password" type="password" value={form.password} onChange={handleChange} className="login-input" placeholder="Password" required disabled={loading} />
            <button className={`login-btn${loading ? ' loading' : ''}`} type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
          <div className="login-signup-link">
            Don't have an account? <a href="/signup">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 
 
 
 