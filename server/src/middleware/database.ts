// server/src/middleware/database.ts
import { Request, Response, NextFunction } from 'express';
import { sequelize } from '../config/database';

export const databaseMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Skip database connection for health check and other non-database routes
  if (req.path === '/health' || req.path === '/api/health') {
    return next();
  }

  try {
    // Test the database connection
    await sequelize.authenticate();
    
    // Ensure models are synced (this is safe to call multiple times)
    await sequelize.sync();
    
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    
    // Type guard to check if error is an Error object
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // For serverless, we want to fail fast if database is required
    if (req.path.startsWith('/api/') && !req.path.includes('/public')) {
      res.status(503).json({
        error: 'Service unavailable',
        message: 'Database connection failed',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      });
    } else {
      // For non-critical routes, continue without database
      next();
    }
  }
};