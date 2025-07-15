import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema); 