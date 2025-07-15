import express from 'express';
import Transaction from '../models/Transaction.js';
import Category from '../models/Category.js';

const router = express.Router();

// Get all transactions for user
router.get('/', async (req, res) => {
  const transactions = await Transaction.find({ user: req.user.id }).populate('category');
  res.json(transactions);
});

// Create transaction
router.post('/', async (req, res) => {
  const { amount, date, category: categoryId } = req.body;
  if (!amount || !date || !categoryId) return res.status(400).json({ message: 'Amount, date, and category required' });
  const category = await Category.findOne({ _id: categoryId, user: req.user.id });
  if (!category) return res.status(404).json({ message: 'Category not found' });
  const transaction = await Transaction.create({ amount, date, category: categoryId, user: req.user.id });
  category.spent += amount;
  await category.save();
  res.status(201).json(transaction);
});

// Update transaction
router.put('/:id', async (req, res) => {
  const { amount, date, category: categoryId } = req.body;
  const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user.id });
  if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
  // Adjust spent for old category
  const oldCategory = await Category.findById(transaction.category);
  if (oldCategory) oldCategory.spent -= transaction.amount;
  // Adjust spent for new category
  const newCategory = await Category.findOne({ _id: categoryId, user: req.user.id });
  if (!newCategory) return res.status(404).json({ message: 'New category not found' });
  newCategory.spent += amount;
  await oldCategory.save();
  await newCategory.save();
  transaction.amount = amount;
  transaction.date = date;
  transaction.category = categoryId;
  await transaction.save();
  res.json(transaction);
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
  // Adjust spent for category
  const category = await Category.findById(transaction.category);
  if (category) {
    category.spent -= transaction.amount;
    await category.save();
  }
  res.json({ message: 'Transaction deleted' });
});

export default router; 