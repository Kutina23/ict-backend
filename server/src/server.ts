import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { sequelize } from './config/database'
import './models/index'
import authRoutes from './routes/auth'
import adminRoutes from './routes/admin'
import studentRoutes from './routes/student'
import hodRoutes from './routes/hod'
import eventRoutes from './routes/events'
import publicRoutes from './routes/public'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Serve static files from public directory
app.use('/public', express.static(path.join(__dirname, '../public')))
// Also serve public files at root level for backward compatibility
app.use('/', express.static(path.join(__dirname, '../public')))

// Routes - Mount public routes first to avoid conflicts with admin routes
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/student', studentRoutes)
app.use('/api/hod', hodRoutes)
app.use('/api/events', eventRoutes)
// Mount public routes before admin routes to avoid conflicts
app.use('/api', publicRoutes)

// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connected successfully')
    
    // Sync database models (without force to avoid conflicts with init-db)
    await sequelize.sync()
    console.log('Database models synced')
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Unable to start server:', error)
    process.exit(1)
  }
}

startServer()