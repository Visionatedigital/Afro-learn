import axios from 'axios';

const API_BASE_URL = '/api';

export async function register({ email, password, name, role, ...rest }) {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name, role, ...rest }),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Registration failed');
  return await res.json();
  }

export async function login({ email, password }) {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Login failed');
  return await res.json();
  }

export async function getMe(token) {
  const res = await fetch(`${API_BASE_URL}/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Not authenticated');
  return await res.json();
}

export default { register, login, getMe }; 
 
 
 