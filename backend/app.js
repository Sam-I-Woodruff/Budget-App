import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/categories.js';
import transactionRoutes from './routes/transactions.js';
import { authenticateJWT } from './middleware/auth.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', authenticateJWT, categoryRoutes);
app.use('/api/transactions', authenticateJWT, transactionRoutes);

app.get('/', (req, res) => {
  res.send('Budget App Backend Running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 