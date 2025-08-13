import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { register } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import GoogleSignIn from '../components/GoogleSignIn';
import './Signup.css';
import signupIllustration from '../assets/images/signup-illustration.png';

const roles = ['Learner', 'Teacher', 'Parent'];
const months = [
  'Month', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const years = Array.from({ length: 20 }, (_, i) => `${2005 + i}`);
const countries = [
  'Select Country', 'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Ethiopia', 
  'Uganda', 'Tanzania', 'Morocco', 'Algeria', 'Egypt', 'Sudan', 'Cameroon',
  'Côte d\'Ivoire', 'Senegal', 'Mali', 'Burkina Faso', 'Niger', 'Chad',
  'Somalia', 'Central African Republic', 'Democratic Republic of Congo',
  'Republic of Congo', 'Gabon', 'Equatorial Guinea', 'São Tomé and Príncipe',
  'Angola', 'Zambia', 'Malawi', 'Mozambique', 'Zimbabwe', 'Botswana',
  'Namibia', 'Lesotho', 'Eswatini', 'Madagascar', 'Mauritius', 'Seychelles',
  'Comoros', 'Djibouti', 'Eritrea', 'Libya', 'Tunisia', 'South Sudan',
  'Rwanda', 'Burundi', 'Gambia', 'Guinea-Bissau', 'Guinea', 'Sierra Leone',
  'Liberia', 'Togo', 'Benin', 'Western Sahara', 'Mauritania'
];
const grades = [
  'Select Grade', 'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6', 'Primary 7'
];

export default function Signup() {
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'learner' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const roleParam = searchParams.get('role');
    if (roleParam && ['learner', 'teacher', 'parent'].includes(roleParam.toLowerCase())) {
      setForm(prev => ({ ...prev, role: roleParam.toLowerCase() }));
    }
  }, [location.search]);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(form);
      setLoading(false);
      navigate('/login');
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const renderStepIndicator = () => (
    <div className="signup-step-indicator">
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className={`signup-step-dot ${loading ? 'completed' : ''} ${loading ? 'active' : ''}`}
        />
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="signup-step">
      <h3 className="signup-step-title">Choose Your Role</h3>
      <p className="signup-step-subtitle">Tell us who you are on AfroLearn</p>
      <div className="signup-role-tabs">
        {roles.map((r) => (
          <button
            key={r}
            className={`signup-role-tab${form.role === r.toLowerCase() ? ' active' : ''}`}
            onClick={() => setForm(f => ({ ...f, role: r.toLowerCase() }))}
            type="button"
            disabled={loading}
          >
            {r}
          </button>
        ))}
      </div>
      <input type="text" className="signup-input" placeholder="Full Name" name="name" value={form.name} onChange={handleChange} disabled={loading} required />
      <input type="email" className="signup-input" placeholder="Email" name="email" value={form.email} onChange={handleChange} disabled={loading} required />
      <input type="password" className="signup-input" placeholder="Password" name="password" value={form.password} onChange={handleChange} disabled={loading} required />
      <div className="signup-form-row">
        <select className="signup-input" name="birthMonth" value={form.birthMonth} onChange={handleChange} disabled={loading}>
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select className="signup-input" name="birthYear" value={form.birthYear} onChange={handleChange} disabled={loading}>
          <option value="Year">Year</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="signup-step">
      <h3 className="signup-step-title">Where are you from?</h3>
      <p className="signup-step-subtitle">Select your country and grade</p>
      <select className="signup-input" name="country" value={form.country} onChange={handleChange} disabled={loading}>
        {countries.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select className="signup-input" name="grade" value={form.grade} onChange={handleChange} disabled={loading}>
        {grades.map(g => <option key={g} value={g}>{g}</option>)}
      </select>
    </div>
  );

  const renderStep3 = () => (
    <div className="signup-step">
      <h3 className="signup-step-title">Almost Done!</h3>
      <p className="signup-step-subtitle">Review your information and create your account</p>
      <div className="signup-review">
        <div className="signup-review-item"><span className="signup-review-label">Name:</span><span className="signup-review-value">{form.name}</span></div>
        <div className="signup-review-item"><span className="signup-review-label">Email:</span><span className="signup-review-value">{form.email}</span></div>
        <div className="signup-review-item"><span className="signup-review-label">Role:</span><span className="signup-review-value">{form.role}</span></div>
        <div className="signup-review-item"><span className="signup-review-label">Country:</span><span className="signup-review-value">{form.country}</span></div>
        <div className="signup-review-item"><span className="signup-review-label">Grade:</span><span className="signup-review-value">{form.grade}</span></div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (1) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="signup-root">
      <div className="signup-illustration">
        <img src={signupIllustration} alt="AfroLearn sign up illustration" />
      </div>
      <div className="signup-form-container">
        <div className="signup-form-inner">
          <h2 className="signup-title">Sign up</h2>
          <p className="signup-subtitle">Join AfroLearn for free as a Learner, Teacher, or Parent</p>
          {renderStepIndicator()}
          {error && <div className="signup-error">{error}</div>}
          {loading && <div className="signup-loading">Signing up...</div>}
          <form className="signup-form" onSubmit={handleSubmit}>
            {renderCurrentStep()}
            <div className="signup-step-buttons">
              <button type="submit" className="signup-btn" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>
          <div className="signup-login-link">Already have an account? <a href="/login">Log in</a></div>
        </div>
      </div>
    </div>
  );
}
 
 
 