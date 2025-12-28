import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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