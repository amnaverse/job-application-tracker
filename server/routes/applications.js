const express = require('express');
const mongoose = require('mongoose');
const Application = require('../models/Application');
const auth = require('../middleware/auth');

const router = express.Router();

// Har route se pehle token check hoga
router.use(auth);

// Sirf in fields ko update/create karne denge
const pickFields = (body) => {
  const allowed = ['company', 'role', 'link', 'status', 'appliedDate', 'followUpDate', 'notes'];
  const data = {};
  allowed.forEach((f) => {
    if (body[f] !== undefined) data[f] = body[f];
  });
  return data;
};

// Get all (sirf apni), filter: ?status=Applied&search=google
router.get('/', async (req, res) => {
  try {
    const filter = { user: req.user.id };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.company = { $regex: req.query.search, $options: 'i' };
    }
    const apps = await Application.find(filter).sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create
router.post('/', async (req, res) => {
  try {
    const data = pickFields(req.body);
    if (!data.company || !data.role) {
      return res.status(400).json({ message: 'Company and role are required' });
    }
    const app = await Application.create({ ...data, user: req.user.id });
    res.status(201).json(app);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    const app = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      pickFields(req.body),
      { new: true, runValidators: true }
    );
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json(app);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    const app = await Application.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;