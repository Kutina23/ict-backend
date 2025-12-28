import express from 'express'
import bcrypt from 'bcryptjs'
import { StudentDue } from '../models/StudentDue'
import { Due } from '../models/Due'
import { Payment } from '../models/Payment'
import { User } from '../models/User'
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth'

const router = express.Router()

// All routes require student authentication
router.use(authenticateToken, authorizeRoles('student'))

// Get student dues
router.get('/dues', async (req: AuthRequest, res) => {
  try {
    const studentDues = await StudentDue.findAll({
      where: { student_id: req.user.id },
      include: [{ model: Due, as: 'due' }],
    })

    const formattedDues = studentDues.map((sd: any) => ({
      id: sd.id,
      due_title: sd.due?.title || 'Unknown',
      total_amount: sd.due?.amount || 0,
      amount_paid: sd.amount_paid,
      balance: sd.balance,
      status: sd.status,
    }))

    res.json(formattedDues)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Initiate payment
router.post('/payment/initiate', async (req: AuthRequest, res) => {
  try {
    const { due_id, amount } = req.body
    const reference = `PAY-${Date.now()}-${Math.random().toString(36).substring(7)}`

    res.json({ reference })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Verify payment
router.post('/payment/verify', async (req: AuthRequest, res) => {
  try {
    const { reference } = req.body

    // In production, verify with Paystack API
    // For now, we'll simulate a successful payment

    // Extract due_id and amount from reference or request
    const studentDue = await StudentDue.findOne({
      where: { student_id: req.user.id },
    })

    if (!studentDue) {
      return res.status(404).json({ message: 'Due not found' })
    }

    const amount = 100 // This should come from Paystack verification

    // Create payment record
    await Payment.create({
      student_id: req.user.id,
      due_id: studentDue.due_id,
      amount,
      payment_reference: reference,
      payment_method: 'Paystack',
    })

    // Update student due
    const newAmountPaid = parseFloat(studentDue.amount_paid.toString()) + amount
    const newBalance = parseFloat(studentDue.balance.toString()) - amount

    await studentDue.update({
      amount_paid: newAmountPaid,
      balance: newBalance,
      status: newBalance <= 0 ? 'Paid' : 'Partial',
    })

    res.json({ message: 'Payment verified successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Get payment history
router.get('/payments', async (req: AuthRequest, res) => {
  try {
    const user = await User.findByPk(req.user.id)
    const payments = await Payment.findAll({
      where: { student_id: req.user.id },
      include: [{ model: Due, as: 'due' }],
    })

    const formattedPayments = payments.map((p: any) => ({
      id: p.id,
      due_title: p.due?.title || 'Unknown',
      amount: p.amount,
      payment_reference: p.payment_reference,
      date: p.date,
      student_name: user?.name,
      index_number: user?.index_number,
      level: user?.level,
    }))

    res.json(formattedPayments)
  } catch (error) {
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

export default router