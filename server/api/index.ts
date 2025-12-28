// server/api/index.ts
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

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/', express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/hod', hodRoutes);
app.use('/api/events', eventRoutes);
app.use('/api', publicRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Database connection - test connection on startup
(async () => {
  try {
    console.log('Attempting to connect to database...');
    console.log('Database URL:', `mysql://${process.env.DB_USER}:****@${process.env.DB_HOST}:17200/${process.env.DB_NAME}`);
    await sequelize.authenticate();
    console.log('Database connected successfully');
    await sequelize.sync();
    console.log('Database models synced');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    // Don't crash the server if database connection fails
    // In Vercel serverless, connections are established on-demand for each request
  }
})();

// Export the Express app for Vercel
module.exports = app;

export default (req: VercelRequest, res: VercelResponse) => {
  app(req, res);
};
