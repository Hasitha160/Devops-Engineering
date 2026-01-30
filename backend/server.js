const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');

// Load environment variables
dotenv.config();

console.log('🔧 Environment variables loaded');
console.log('📊 MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Not set');
console.log('🔑 JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5174',
  credentials: true
}));

console.log('✅ CORS enabled for:', process.env.CLIENT_URL || 'http://localhost:5174');

// Import passport config
require('./config/passport')(passport);

// Session configuration for passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Import routes
const authRoutes = require('./routes/auth');
const credentialRoutes = require('./routes/credentials');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/credentials', credentialRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'SecurePass API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/securepass';

console.log('🔌 Connecting to MongoDB...');
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('🔄 Make sure MongoDB is running on your system');
  });

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`📱 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5174'}`);
  console.log('🔍 Test health: http://localhost:' + PORT + '/api/health');
});
