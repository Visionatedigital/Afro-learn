const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.REACT_APP_API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory user storage (replace with database in production)
const users = [];

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { 
      email, 
      password, 
      name, 
      role = 'learner',
      country,
      grade,
      birthMonth,
      birthYear
    } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with onboarding data
    const user = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      name,
      role,
      country,
      grade,
      birthMonth,
      birthYear,
      createdAt: new Date()
    };

    users.push(user);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        country: user.country,
        grade: user.grade,
        birthMonth: user.birthMonth,
        birthYear: user.birthYear
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        country: user.country,
        grade: user.grade,
        birthMonth: user.birthMonth,
        birthYear: user.birthYear
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Protected route example
app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        country: user.country,
        grade: user.grade,
        birthMonth: user.birthMonth,
        birthYear: user.birthYear
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Serve static files from React build (for production)
app.use(express.static('build'));

// Proxy all non-API requests to React dev server
app.use('/', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api' // Keep API routes
  },
  onProxyReq: (proxyReq, req, res) => {
    // Don't proxy API routes
    if (req.path.startsWith('/api/')) {
      proxyReq.path = req.path;
      return;
    }
  }
}));

app.listen(PORT, () => {
  console.log(`🚀 AfroLearn Development Server running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🌐 React app will be proxied from http://localhost:3000`);
  console.log(`💡 Make sure to run 'npm start' in another terminal!`);
});

module.exports = app; 
 
 
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.REACT_APP_API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory user storage (replace with database in production)
const users = [];

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { 
      email, 
      password, 
      name, 
      role = 'learner',
      country,
      grade,
      birthMonth,
      birthYear
    } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with onboarding data
    const user = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      name,
      role,
      country,
      grade,
      birthMonth,
      birthYear,
      createdAt: new Date()
    };

    users.push(user);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        country: user.country,
        grade: user.grade,
        birthMonth: user.birthMonth,
        birthYear: user.birthYear
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        country: user.country,
        grade: user.grade,
        birthMonth: user.birthMonth,
        birthYear: user.birthYear
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Protected route example
app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        country: user.country,
        grade: user.grade,
        birthMonth: user.birthMonth,
        birthYear: user.birthYear
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Serve static files from React build (for production)
app.use(express.static('build'));

// Proxy all non-API requests to React dev server
app.use('/', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api' // Keep API routes
  },
  onProxyReq: (proxyReq, req, res) => {
    // Don't proxy API routes
    if (req.path.startsWith('/api/')) {
      proxyReq.path = req.path;
      return;
    }
  }
}));

app.listen(PORT, () => {
  console.log(`🚀 AfroLearn Development Server running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🌐 React app will be proxied from http://localhost:3000`);
  console.log(`💡 Make sure to run 'npm start' in another terminal!`);
});

module.exports = app; 
 
 
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.REACT_APP_API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory user storage (replace with database in production)
const users = [];

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { 
      email, 
      password, 
      name, 
      role = 'learner',
      country,
      grade,
      birthMonth,
      birthYear
    } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with onboarding data
    const user = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      name,
      role,
      country,
      grade,
      birthMonth,
      birthYear,
      createdAt: new Date()
    };

    users.push(user);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        country: user.country,
        grade: user.grade,
        birthMonth: user.birthMonth,
        birthYear: user.birthYear
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        country: user.country,
        grade: user.grade,
        birthMonth: user.birthMonth,
        birthYear: user.birthYear
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Protected route example
app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        country: user.country,
        grade: user.grade,
        birthMonth: user.birthMonth,
        birthYear: user.birthYear
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Serve static files from React build (for production)
app.use(express.static('build'));

// Proxy all non-API requests to React dev server
app.use('/', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api' // Keep API routes
  },
  onProxyReq: (proxyReq, req, res) => {
    // Don't proxy API routes
    if (req.path.startsWith('/api/')) {
      proxyReq.path = req.path;
      return;
    }
  }
}));

app.listen(PORT, () => {
  console.log(`🚀 AfroLearn Development Server running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🌐 React app will be proxied from http://localhost:3000`);
  console.log(`💡 Make sure to run 'npm start' in another terminal!`);
});

module.exports = app; 
 
 
 