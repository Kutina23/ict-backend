import express from 'express'
import { Program } from '../models/Program'
import { Faculty } from '../models/Faculty'
import { User } from '../models/User'
import { StudentDue } from '../models/StudentDue'
import { Payment } from '../models/Payment'
import { Partner } from '../models/Partner'

const router = express.Router()

// Public route to get active programs (for homepage)
router.get('/programs', async (req, res) => {
  try {
    const programs = await Program.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
    })
    res.json(programs)
  } catch (error) {
    console.error('Get programs error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Public route to get active faculty members (for faculty page)
router.get('/faculty', async (req, res) => {
  try {
    const faculty = await Faculty.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']]
    })
    res.json(faculty)
  } catch (error) {
    console.error('Get faculty error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Public route to get active partners (for homepage)
router.get('/partners', async (req, res) => {
  try {
    const partners = await Partner.findAll({
      where: { isActive: true },
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    })
    res.json(partners)
  } catch (error) {
    console.error('Get partners error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Public route to get statistics for homepage
router.get('/stats', async (req, res) => {
  try {
    // Get active students count
    const activeStudents = await User.count({
      where: { 
        role: 'student',
        status: 'active'
      }
    })

    // Get active faculty count
    const activeFaculty = await Faculty.count({
      where: { isActive: true }
    })

    // Get active partners count
    const activePartners = await Partner.count({
      where: { isActive: true }
    })

    // Calculate success rate (percentage of paid dues)
    const totalStudentDues = await StudentDue.count()
    const paidStudentDues = await StudentDue.count({
      where: { status: 'Paid' }
    })
    
    const successRate = totalStudentDues > 0 
      ? Math.round((paidStudentDues / totalStudentDues) * 100)
      : 0

    const stats = [
      { 
        label: "Active Students", 
        value: activeStudents > 0 ? `${activeStudents}+` : "0" 
      },
      { 
        label: "Experienced Staff", 
        value: activeFaculty > 0 ? `${activeFaculty}+` : "0" 
      },
      { 
        label: "Industry Partners", 
        value: activePartners > 0 ? `${activePartners}+` : "0" 
      },
      { 
        label: "Success Rate", 
        value: `${successRate}%` 
      },
    ]

    res.json(stats)
  } catch (error) {
    console.error('Get stats error:', error)
    // Return default stats if there's an error
    const defaultStats = [
      { label: "Active Students", value: "0" },
      { label: "6+ Experienced Staff", value: "0" },
      { label: "Industry Partners", value: "0" },
      { label: "Success Rate", value: "0%" },
    ]
    res.json(defaultStats)
  }
})

export default router