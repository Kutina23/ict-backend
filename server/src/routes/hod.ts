import express from 'express'
import bcrypt from 'bcryptjs'
import path from 'path'
import { Op } from 'sequelize'
import { User } from '../models/User'
import { Due } from '../models/Due'
import { StudentDue } from '../models/StudentDue'
import { Payment } from '../models/Payment'
import { Program } from '../models/Program'
import { Faculty } from '../models/Faculty'
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth'
import { upload } from '../utils/upload'

const router = express.Router()

// All routes require HOD authentication
router.use(authenticateToken, authorizeRoles('hod'))

// Get stats
router.get('/stats', async (req, res) => {
  try {
    const totalStudents = await User.count({ where: { role: 'student' } })
    const totalDues = await Due.sum('amount') || 0
    const paidPayments = await Payment.count()
    const pendingPayments = await StudentDue.count({ where: { status: ['Not Paid', 'Partial'] } })

    res.json({ totalStudents, totalDues, paidPayments, pendingPayments })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// View students
router.get('/students', async (req, res) => {
  try {
    const students = await User.findAll({ where: { role: 'student' } })
    res.json(students)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// View payments
router.get('/payments', async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        { model: User, as: 'student', attributes: ['name'] },
        { model: Due, as: 'due', attributes: ['title'] },
      ],
    })

    const formattedPayments = payments.map((p: any) => ({
      id: p.id,
      student_name: p.student?.name || 'Unknown',
      due_title: p.due?.title || 'Unknown',
      amount: p.amount,
      payment_reference: p.payment_reference,
      date: p.date,
    }))

    res.json(formattedPayments)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Update profile
router.put('/profile', async (req: AuthRequest, res) => {
  try {
    const { name, email, phone } = req.body

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' })
    }

    const user = await User.findByPk(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ 
      where: { 
        email, 
        id: { [Op.ne]: req.user.id } 
      } 
    })
    
    if (existingUser) {
      return res.status(400).json({ message: 'Email address is already in use' })
    }

    await user.update({
      name: name || user.name,
      email: email || user.email,
      phone: phone || user.phone
    })

    res.json({ 
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Profile update error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get current user profile
router.get('/profile', async (req: AuthRequest, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'phone', 'role', 'status']
    })
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Change password
router.put('/change-password', async (req: AuthRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' })
    }

    const user = await User.findByPk(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Check if current password is correct
    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    await user.update({ password: hashedPassword })

    res.json({ message: 'Password changed successfully' })
  } catch (error) {
    console.error('Password change error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Program Management Routes

// Get all programs
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

// Create new program
router.post('/programs', async (req: AuthRequest, res) => {
  try {
    const { name, duration, focus, highlights } = req.body

    if (!name || !duration || !focus || !highlights) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const program = await Program.create({
      name,
      duration,
      focus,
      highlights: JSON.stringify(highlights),
      isActive: true
    })

    res.status(201).json({ 
      message: 'Program created successfully',
      program 
    })
  } catch (error) {
    console.error('Create program error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update program
router.put('/programs/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const { name, duration, focus, highlights, isActive } = req.body

    const program = await Program.findByPk(id)
    if (!program) {
      return res.status(404).json({ message: 'Program not found' })
    }

    await program.update({
      name: name || program.name,
      duration: duration || program.duration,
      focus: focus || program.focus,
      highlights: highlights ? JSON.stringify(highlights) : program.highlights,
      isActive: isActive !== undefined ? isActive : program.isActive
    })

    res.json({ 
      message: 'Program updated successfully',
      program 
    })
  } catch (error) {
    console.error('Update program error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete program (soft delete by setting isActive to false)
router.delete('/programs/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const program = await Program.findByPk(id)
    if (!program) {
      return res.status(404).json({ message: 'Program not found' })
    }

    await program.update({ isActive: false })

    res.json({ message: 'Program deleted successfully' })
  } catch (error) {
    console.error('Delete program error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get all programs including inactive ones (for HOD management)
router.get('/programs/all', async (req, res) => {
  try {
    const programs = await Program.findAll({
      order: [['createdAt', 'DESC']]
    })
    res.json(programs)
  } catch (error) {
    console.error('Get all programs error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Faculty Management Routes

// Get all faculty members
router.get('/faculty', async (req, res) => {
  try {
    const faculty = await Faculty.findAll({
      order: [['name', 'ASC']]
    })
    res.json(faculty)
  } catch (error) {
    console.error('Get faculty error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Create new faculty member
router.post('/faculty', upload.single('image'), async (req: AuthRequest, res) => {
  try {
    const { name, position, specialization, email, phone, office, bio, qualifications, isActive } = req.body

    if (!name || !position || !specialization || !email || !phone || !office || !bio) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Validate image field to prevent emoji or invalid values
    if (req.body.image && (req.body.image.includes('👩‍💼') || req.body.image.includes('👨‍💼'))) {
      return res.status(400).json({ message: 'Invalid image value provided' })
    }

    // Handle image upload
    let imagePath = '/default-avatar.svg'; // Default image
    if (req.file) {
      imagePath = `/uploads/faculty/${req.file.filename}`;
    }

    const faculty = await Faculty.create({
      name,
      position,
      specialization,
      email,
      phone,
      office,
      image: imagePath,
      bio,
      qualifications: JSON.stringify(qualifications || []),
      isActive: isActive !== undefined ? isActive : true
    })

    res.status(201).json({ 
      message: 'Faculty member created successfully',
      faculty 
    })
  } catch (error) {
    console.error('Create faculty error:', error)
    if ((error as any).name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ message: 'Email already exists' })
    } else {
      res.status(500).json({ message: 'Server error' })
    }
  }
})

// Update faculty member
router.put('/faculty/:id', upload.single('image'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const { name, position, specialization, email, phone, office, bio, qualifications, isActive } = req.body

    const faculty = await Faculty.findByPk(id)
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty member not found' })
    }

    // Validate image field to prevent emoji or invalid values
    if (req.body.image && (req.body.image.includes('👩‍💼') || req.body.image.includes('👨‍💼'))) {
      return res.status(400).json({ message: 'Invalid image value provided' })
    }

    // Handle image upload
    let imagePath = faculty.image; // Keep existing image if no new image uploaded
    if (req.file) {
      imagePath = `/uploads/faculty/${req.file.filename}`;
    }

    await faculty.update({
      name: name || faculty.name,
      position: position || faculty.position,
      specialization: specialization || faculty.specialization,
      email: email || faculty.email,
      phone: phone || faculty.phone,
      office: office || faculty.office,
      image: imagePath,
      bio: bio || faculty.bio,
      qualifications: qualifications ? JSON.stringify(qualifications) : faculty.qualifications,
      isActive: isActive !== undefined ? isActive : faculty.isActive
    })

    res.json({ 
      message: 'Faculty member updated successfully',
      faculty 
    })
  } catch (error) {
    console.error('Update faculty error:', error)
    if ((error as any).name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ message: 'Email already exists' })
    } else {
      res.status(500).json({ message: 'Server error' })
    }
  }
})

// Delete faculty member (soft delete by setting isActive to false)
router.delete('/faculty/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const faculty = await Faculty.findByPk(id)
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty member not found' })
    }

    await faculty.update({ isActive: false })

    res.json({ message: 'Faculty member deleted successfully' })
  } catch (error) {
    console.error('Delete faculty error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router