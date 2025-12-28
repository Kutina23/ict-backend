import express from 'express'
import { Event } from '../models/Event'

const router = express.Router()

// Get all events (public)
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll({ order: [['createdAt', 'DESC']] })
    res.json(events)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router