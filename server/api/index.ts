import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { sequelize } from '../src/config/database';
import '../src/models/index';
import authRoutes from '../src/routes/auth';
import adminRoutes from '../src/routes/admin';
import studentRoutes from '../src/routes/student';
import hodRoutes from '../src/routes/hod';
import eventRoutes from '../src/routes/events';
import publicRoutes from '../src/routes/public';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://ict-backend-8jup.vercel.app', 'http://localhost:17200'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve static files from public directory
app.use('/public', express.static(path.join(__dirname, '../public')));
// Also serve public files at root level for backward compatibility
app.use('/', express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/hod', hodRoutes);
app.use('/api/events', eventRoutes);
app.use('/api', publicRoutes);

// Database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Database models synced');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

// Export the Express app for Vercel
module.exports = app;

export default (req: VercelRequest, res: VercelResponse) => {
  app(req, res);
};