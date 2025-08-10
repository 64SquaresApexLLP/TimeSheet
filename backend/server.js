// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './authRoutes.js'; // Or wherever the file lives

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
  })

  // ✅ Start server
  app.listen(3000, () => {
    console.log('🚀 Server running on http://localhost:3000');
  });

// Routes
app.use('/api/auth', authRoutes);
