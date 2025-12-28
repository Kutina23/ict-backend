import express from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../models/User'
import { Due } from '../models/Due'
import { StudentDue } from '../models/StudentDue'
import { Payment } from '../models/Payment'
import { Event } from '../models/Event'
import { Partner } from '../models/Partner'
import { authenticateToken, authorizeRoles } from '../middleware/auth'

const router = express.Router()

// All routes require admin authentication
router.use(authenticateToken, authorizeRoles('admin'))

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

// Student management
router.get('/students', async (req, res) => {
  try {
    const students = await User.findAll({ where: { role: 'student' } })
    res.json(students)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Helper function to get matching dues for a student level
const getMatchingDuesForLevel = async (studentLevel: string) => {
  // Return empty array if student level is null or undefined
  if (!studentLevel) {
    return []
  }
  
  const dues = await Due.findAll()
  
  return dues.filter(due => {
    const dueLevel = due.level.toLowerCase()
    const studentLevelLower = studentLevel.toLowerCase()
    
    // Exact match
    if (dueLevel === studentLevelLower) {
      return true
    }
    
    // For ICT levels, match base level (e.g., ICT 300 matches ICT 300)
    if (studentLevelLower.startsWith('ict ')) {
      return dueLevel === studentLevelLower
    }
    
    // For B-Tech levels, match exact level (e.g., B-Tech 300 matches B-Tech 300)
    if (studentLevelLower.startsWith('b-tech ')) {
      return dueLevel === studentLevelLower
    }
    
    // For Top Up levels, match exact level (e.g., Top Up 300 matches Top Up 300)
    if (studentLevelLower.startsWith('top up ')) {
      return dueLevel === studentLevelLower
    }
    
    return false
  })
}

// Helper function to assign dues to a student
const assignDuesToStudent = async (studentId: number, studentLevel: string) => {
  // Skip if student level is null or undefined
  if (!studentLevel) {
    return
  }
  
  const matchingDues = await getMatchingDuesForLevel(studentLevel)
  
  for (const due of matchingDues) {
    // Check if this student already has this due assigned
    const existingStudentDue = await StudentDue.findOne({
      where: {
        student_id: studentId,
        due_id: due.id
      }
    })
    
    // Only create if it doesn't exist
    if (!existingStudentDue) {
      await StudentDue.create({
        student_id: studentId,
        due_id: due.id,
        amount_paid: 0,
        balance: due.amount,
        status: 'Not Paid',
      })
    }
  }
}

router.post('/students', async (req, res) => {
  try {
    const { name, index_number, level, email, phone, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const student = await User.create({
      name,
      index_number,
      level,
      email,
      phone,
      password: hashedPassword,
      role: 'student',
      status: 'active',
    })

    // Assign existing dues for this level using improved logic
    await assignDuesToStudent(student.id, level)

    res.status(201).json(student)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.put('/students/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, index_number, level, email, phone, password } = req.body

    const student = await User.findByPk(id)
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    const updateData: any = {
      name,
      index_number,
      level,
      email,
      phone,
    }

    // Only update password if provided
    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 10)
    }

    const oldLevel = student.level
    await student.update(updateData)

    // If level changed, reassign dues based on new level
    // Handle cases where oldLevel or new level might be null/undefined
    if ((oldLevel || '') !== (level || '')) {
      // Remove old dues assignments
      await StudentDue.destroy({ where: { student_id: id } })
      
      // Assign new dues based on new level
      await assignDuesToStudent(parseInt(id), level)
    }

    res.json(student)
  } catch (error) {
    console.error('Update student error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.delete('/students/:id', async (req, res) => {
  try {
    const { id } = req.params

    // Delete associated student dues first
    await StudentDue.destroy({ where: { student_id: id } })
    
    // Delete associated payments first
    await Payment.destroy({ where: { student_id: id } })
    
    // Delete the student
    await User.destroy({ where: { id } })

    res.json({ message: 'Student deleted successfully' })
  } catch (error) {
    console.error('Delete student error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Dues management
router.get('/dues', async (req, res) => {
  try {
    const dues = await Due.findAll()
    res.json(dues)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Helper function to get students matching a due level
const getStudentsForDueLevel = async (dueLevel: string) => {
  const students = await User.findAll({ where: { role: 'student' } })
  
  return students.filter(student => {
    // Skip students without level
    if (!student.level) {
      return false
    }
    
    const studentLevel = student.level.toLowerCase()
    const dueLevelLower = dueLevel.toLowerCase()
    
    // Exact match
    if (dueLevelLower === studentLevel) {
      return true
    }
    
    // For ICT levels, match base level (e.g., ICT 300 matches ICT 300)
    if (studentLevel.startsWith('ict ')) {
      return dueLevelLower === studentLevel
    }
    
    // For B-Tech levels, match exact level (e.g., B-Tech 300 matches B-Tech 300)
    if (studentLevel.startsWith('b-tech ')) {
      return dueLevelLower === studentLevel
    }
    
    // For Top Up levels, match exact level (e.g., Top Up 300 matches Top Up 300)
    if (studentLevel.startsWith('top up ')) {
      return dueLevelLower === studentLevel
    }
    
    return false
  })
}

router.post('/dues', async (req, res) => {
  try {
    const { title, amount, level, academic_year, description } = req.body

    const due = await Due.create({ title, amount, level, academic_year, description })

    // Assign to all students in this level using improved logic
    const matchingStudents = await getStudentsForDueLevel(level)
    for (const student of matchingStudents) {
      // Check if this student already has this due assigned
      const existingStudentDue = await StudentDue.findOne({
        where: {
          student_id: student.id,
          due_id: due.id
        }
      })
      
      // Only create if it doesn't exist
      if (!existingStudentDue) {
        await StudentDue.create({
          student_id: student.id,
          due_id: due.id,
          amount_paid: 0,
          balance: amount,
          status: 'Not Paid',
        })
      }
    }

    res.status(201).json(due)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.put('/dues/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, amount, level, academic_year, description } = req.body

    const due = await Due.findByPk(id)
    if (!due) {
      return res.status(404).json({ message: 'Due not found' })
    }

    await due.update({
      title,
      amount,
      level,
      academic_year,
      description,
    })

    // Update associated student dues if amount changed
    if (amount !== due.amount) {
      const studentDues = await StudentDue.findAll({ where: { due_id: id } })
      for (const studentDue of studentDues) {
        const newBalance = parseFloat(studentDue.balance.toString()) + (amount - due.amount)
        await studentDue.update({
          balance: newBalance,
          status: newBalance <= 0 ? 'Paid' : (studentDue.amount_paid > 0 ? 'Partial' : 'Not Paid')
        })
      }
    }

    res.json(due)
  } catch (error) {
    console.error('Update due error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.delete('/dues/:id', async (req, res) => {
  try {
    const dueId = req.params.id
    
    // Delete associated student dues first
    await StudentDue.destroy({ where: { due_id: dueId } })
    
    // Delete the due
    await Due.destroy({ where: { id: dueId } })
    
    res.json({ message: 'Due deleted successfully' })
  } catch (error) {
    console.error('Delete due error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Payment records
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

// Student payment status with balances
router.get('/students-payment-status', async (req, res) => {
  try {
    const students = await User.findAll({ 
      where: { role: 'student' },
      attributes: ['id', 'name', 'index_number', 'level', 'email']
    })

    const studentsWithPaymentStatus = []

    for (const student of students) {
      // Get student's dues with payment information
      const studentDues = await StudentDue.findAll({
        where: { student_id: student.id },
        include: [
          { model: Due, as: 'due', attributes: ['title', 'amount', 'academic_year'] }
        ]
      })

      // Get student's payment history
      const payments = await Payment.findAll({
        where: { student_id: student.id },
        include: [
          { model: Due, as: 'due', attributes: ['title'] }
        ],
        order: [['date', 'DESC']]
      })

      // Calculate summary totals
      let totalDues = 0
      let totalPaid = 0
      let totalBalance = 0
      let paidDues = 0
      let partialDues = 0
      let unpaidDues = 0

      const duesWithStatus = studentDues.map((studentDue: any) => {
        const dueAmount = parseFloat(studentDue.due.amount.toString())
        const amountPaid = parseFloat(studentDue.amount_paid.toString())
        const balance = parseFloat(studentDue.balance.toString())

        totalDues += dueAmount
        totalPaid += amountPaid
        totalBalance += balance

        if (studentDue.status === 'Paid') {
          paidDues++
        } else if (studentDue.status === 'Partial') {
          partialDues++
        } else {
          unpaidDues++
        }

        return {
          id: studentDue.id,
          due_id: studentDue.due_id,
          due_title: studentDue.due.title,
          due_amount: dueAmount,
          amount_paid: amountPaid,
          balance: balance,
          status: studentDue.status,
          academic_year: studentDue.due.academic_year
        }
      })

      const paymentHistory = payments.map((payment: any) => ({
        id: payment.id,
        due_title: payment.due?.title || 'Unknown',
        amount: parseFloat(payment.amount.toString()),
        payment_reference: payment.payment_reference,
        date: payment.date,
        payment_method: payment.payment_method
      }))

      studentsWithPaymentStatus.push({
        student: {
          id: student.id,
          name: student.name,
          index_number: student.index_number,
          level: student.level,
          email: student.email
        },
        summary: {
          totalDues,
          totalPaid,
          totalBalance,
          paidDues,
          partialDues,
          unpaidDues,
          totalDuesCount: studentDues.length
        },
        dues: duesWithStatus,
        paymentHistory: paymentHistory.slice(0, 10) // Last 10 payments
      })
    }

    // Sort by total balance descending (highest balances first)
    studentsWithPaymentStatus.sort((a, b) => b.summary.totalBalance - a.summary.totalBalance)

    res.json(studentsWithPaymentStatus)
  } catch (error) {
    console.error('Error fetching student payment status:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Event management
router.post('/events', async (req, res) => {
  try {
    const { type, content_text } = req.body
    
    if (!type || (type === 'xml' && !content_text)) {
      return res.status(400).json({ message: 'Missing required fields' })
    }
    
    const event = await Event.create({ 
      type, 
      content_text: type === 'xml' ? content_text : null,
      content_url: null
    })
    res.status(201).json(event)
  } catch (error) {
    console.error('Error creating event:', error)
    res.status(500).json({ message: 'Server error', error: (error as any).message })
  }
})

router.delete('/events/:id', async (req, res) => {
  try {
    await Event.destroy({ where: { id: req.params.id } })
    res.json({ message: 'Event deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Admin Settings
router.get('/settings', async (req, res) => {
  try {
    const adminId = (req as any).user.id
    const admin = await User.findByPk(adminId, {
      attributes: ['id', 'name', 'email', 'phone', 'role']
    })
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    res.json(admin)
  } catch (error) {
    console.error('Failed to fetch admin settings:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.put('/settings', async (req, res) => {
  try {
    const adminId = (req as any).user.id
    const { name, email, phone } = req.body

    const admin = await User.findByPk(adminId)
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    // Check if email is already taken by another user
    if (email !== admin.email) {
      const existingUser = await User.findOne({ where: { email } })
      if (existingUser && existingUser.id !== adminId) {
        return res.status(400).json({ message: 'Email is already taken' })
      }
    }

    await admin.update({
      name,
      email,
      phone
    })

    res.json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      role: admin.role
    })
  } catch (error) {
    console.error('Failed to update admin settings:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.put('/change-password', async (req, res) => {
  try {
    const adminId = (req as any).user.id
    const { currentPassword, newPassword } = req.body

    const admin = await User.findByPk(adminId)
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)
    
    await admin.update({
      password: hashedNewPassword
    })

    res.json({ message: 'Password changed successfully' })
  } catch (error) {
    console.error('Failed to change password:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Maintenance route to sync dues for all students
router.post('/sync-dues', async (req, res) => {
  try {
    const students = await User.findAll({ where: { role: 'student' } })
    const dues = await Due.findAll()
    
    let assignedCount = 0
    let skippedCount = 0

    for (const student of students) {
      // Skip students without level
      if (!student.level) {
        continue
      }
      
      const matchingDues = await getMatchingDuesForLevel(student.level)
      
      for (const due of matchingDues) {
        // Check if this student already has this due assigned
        const existingStudentDue = await StudentDue.findOne({
          where: {
            student_id: student.id,
            due_id: due.id
          }
        })
        
        // Only create if it doesn't exist
        if (!existingStudentDue) {
          await StudentDue.create({
            student_id: student.id,
            due_id: due.id,
            amount_paid: 0,
            balance: due.amount,
            status: 'Not Paid',
          })
          assignedCount++
        } else {
          skippedCount++
        }
      }
    }

    res.json({ 
      message: 'Dues sync completed successfully',
      totalStudents: students.length,
      totalDues: dues.length,
      assignedCount,
      skippedCount
    })
  } catch (error) {
    console.error('Failed to sync dues:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Partners management
router.get('/partners', async (req, res) => {
  try {
    const partners = await Partner.findAll({
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    })
    res.json(partners)
  } catch (error) {
    console.error('Error fetching partners:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/partners', async (req, res) => {
  try {
    const { name, logo_url, website_url, description, isActive = true, sort_order = 0 } = req.body

    if (!name || !logo_url) {
      return res.status(400).json({ message: 'Name and logo URL are required' })
    }

    const partner = await Partner.create({
      name,
      logo_url,
      website_url,
      description,
      isActive,
      sort_order
    })

    res.status(201).json(partner)
  } catch (error) {
    console.error('Error creating partner:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.put('/partners/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, logo_url, website_url, description, isActive, sort_order } = req.body

    const partner = await Partner.findByPk(id)
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' })
    }

    await partner.update({
      ...(name !== undefined && { name }),
      ...(logo_url !== undefined && { logo_url }),
      ...(website_url !== undefined && { website_url }),
      ...(description !== undefined && { description }),
      ...(isActive !== undefined && { isActive }),
      ...(sort_order !== undefined && { sort_order })
    })

    res.json(partner)
  } catch (error) {
    console.error('Error updating partner:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.delete('/partners/:id', async (req, res) => {
  try {
    const { id } = req.params
    const partner = await Partner.findByPk(id)

    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' })
    }

    await partner.destroy()

    res.json({ message: 'Partner deleted successfully' })
  } catch (error) {
    console.error('Error deleting partner:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router