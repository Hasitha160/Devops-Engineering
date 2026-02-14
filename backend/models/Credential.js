const mongoose = require('mongoose');
const crypto = require('crypto');

const credentialSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  site: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  encryptedPassword: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'general',
    enum: ['general', 'social', 'banking', 'email', 'work', 'other']
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
credentialSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Encryption methods using modern crypto API
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'fallback-32-character-encryption-key';
const ALGORITHM = 'aes-256-cbc';

// Ensure key is exactly 32 bytes for AES-256
const getKey = () => {
  const key = Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32), 'utf8');
  return key;
};

credentialSchema.statics.encryptPassword = function(password) {
  try {
    const iv = crypto.randomBytes(16);
    const key = getKey();
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Return IV + encrypted data
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt password');
  }
};

credentialSchema.statics.decryptPassword = function(encryptedPassword) {
  try {
    const [ivHex, encrypted] = encryptedPassword.split(':');
    if (!ivHex || !encrypted) {
      throw new Error('Invalid encrypted password format');
    }
    
    const iv = Buffer.from(ivHex, 'hex');
    const key = getKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

module.exports = mongoose.model('Credential', credentialSchema);
