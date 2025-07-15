import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

// Get all categories for user
router.get('/', async (req, res) => {
  const categories = await Category.find({ user: req.user.id });
  res.json(categories);
});

// Create category
router.post('/', async (req, res) => {
  const { name, limit } = req.body;
  if (!name || typeof limit !== 'number') return res.status(400).json({ message: 'Name and limit required' });
  const category = await Category.create({ name, limit, user: req.user.id });
  res.status(201).json(category);
});

// Update category
router.put('/:id', async (req, res) => {
  const { name, limit } = req.body;
  const category = await Category.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { name, limit },
    { new: true }
  );
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json(category);
});

// Delete category
router.delete('/:id', async (req, res) => {
  const category = await Category.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json({ message: 'Category deleted' });
});

export default router; 