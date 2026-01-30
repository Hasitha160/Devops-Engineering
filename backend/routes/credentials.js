const express = require('express');
const Credential = require('../models/Credential');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/credentials
// @desc    Get all user credentials
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    console.log('📋 Fetching credentials for user:', req.user._id);
    const credentials = await Credential.find({ user: req.user._id })
      .select('-encryptedPassword')
      .sort({ createdAt: -1 });

    console.log('✅ Found', credentials.length, 'credentials');
    res.json(credentials);
  } catch (error) {
    console.error('❌ Get credentials error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/credentials/:id
// @desc    Get single credential with decrypted password
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    console.log('🔍 Getting credential:', req.params.id);
    const credential = await Credential.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!credential) {
      return res.status(404).json({ message: 'Credential not found' });
    }

    // Decrypt password
    const decryptedPassword = Credential.decryptPassword(credential.encryptedPassword);
    
    if (!decryptedPassword) {
      return res.status(500).json({ message: 'Error decrypting password' });
    }

    res.json({
      _id: credential._id,
      site: credential.site,
      username: credential.username,
      password: decryptedPassword,
      category: credential.category,
      notes: credential.notes,
      createdAt: credential.createdAt,
      updatedAt: credential.updatedAt
    });
  } catch (error) {
    console.error('❌ Get credential error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/credentials
// @desc    Create new credential
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    console.log('➕ Creating new credential:', req.body);
    const { site, username, password, category, notes } = req.body;

    // Validation
    if (!site || !username || !password) {
      return res.status(400).json({ message: 'Site, username, and password are required' });
    }

    // Encrypt password
    const encryptedPassword = Credential.encryptPassword(password);

    const credential = new Credential({
      user: req.user._id,
      site,
      username,
      encryptedPassword,
      category: category || 'general',
      notes
    });

    await credential.save();

    console.log('✅ Credential created successfully');

    // Return credential without encrypted password
    const responseCredential = {
      _id: credential._id,
      site: credential.site,
      username: credential.username,
      category: credential.category,
      notes: credential.notes,
      createdAt: credential.createdAt,
      updatedAt: credential.updatedAt
    };

    res.status(201).json(responseCredential);
  } catch (error) {
    console.error('❌ Create credential error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/credentials/:id
// @desc    Update credential
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { site, username, password, category, notes } = req.body;

    const credential = await Credential.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!credential) {
      return res.status(404).json({ message: 'Credential not found' });
    }

    // Update fields
    if (site) credential.site = site;
    if (username) credential.username = username;
    if (password) credential.encryptedPassword = Credential.encryptPassword(password);
    if (category) credential.category = category;
    if (notes !== undefined) credential.notes = notes;

    await credential.save();

    // Return updated credential without encrypted password
    const responseCredential = {
      _id: credential._id,
      site: credential.site,
      username: credential.username,
      category: credential.category,
      notes: credential.notes,
      createdAt: credential.createdAt,
      updatedAt: credential.updatedAt
    };

    res.json(responseCredential);
  } catch (error) {
    console.error('Update credential error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/credentials/:id
// @desc    Delete credential
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('🗑️ Deleting credential:', req.params.id);
    const credential = await Credential.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!credential) {
      return res.status(404).json({ message: 'Credential not found' });
    }

    await credential.deleteOne();
    console.log('✅ Credential deleted successfully');

    res.json({ message: 'Credential deleted successfully' });
  } catch (error) {
    console.error('❌ Delete credential error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
