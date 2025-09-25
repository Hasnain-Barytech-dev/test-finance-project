const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

console.log('🚀 Starting Express app...');

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Finance Tracker API is running!' });
});

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API test successful!', 
    timestamp: new Date().toISOString(),
    status: 'healthy'
  });
});

// Load test routes (modularized)
try {
  console.log('📦 Loading test routes...');
  const testRoutes = require('./routes/test');
  app.use('/api/test', testRoutes);
  console.log('✅ Test routes loaded');
} catch (error) {
  console.error('❌ Error loading test routes:', error.message);
}

// Load auth routes (login, register, verify)
try {
  console.log('📦 Loading auth routes...');
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading auth routes:', error.message);
  console.error('Full error:', error);
}

// Load transactions routes
try {
  console.log('📦 Loading transactions routes...');
  const transactionsRoutes = require('./routes/transactions');
  app.use('/api/transactions', transactionsRoutes);
  console.log('✅ Transactions routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading transactions routes:', error.message);
  console.error('Full error:', error);
}

// Load users routes
try {
  console.log('📦 Loading users routes...');
  const usersRoutes = require('./routes/users');
  app.use('/api/users', usersRoutes);
  console.log('✅ Users routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading users routes:', error.message);
  console.error('Full error:', error);
}

// Load analytics routes
try {
  console.log('📦 Loading analytics routes...');
  const analyticsRoutes = require('./routes/analytics');
  app.use('/api/analytics', analyticsRoutes);
  console.log('✅ Analytics routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading analytics routes:', error.message);
  console.error('Full error:', error);
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

console.log('✅ Express app setup complete');

module.exports = app;
