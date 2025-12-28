import bcrypt from 'bcryptjs'
import { sequelize } from './config/database'
import { User } from './models/User'
import { Due } from './models/Due'
import { StudentDue } from './models/StudentDue'
import { Event } from './models/Event'

const seedDatabase = async () => {
  try {
    // Disable FK checks before syncing
    await sequelize.query('SET FOREIGN_KEY_CHECKS=0')
    await sequelize.sync({ force: true })
    // Re-enable FK checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS=1')
    console.log('Database synced')

    // Create admin
    const adminPassword = await bcrypt.hash('admin123', 10)
    await User.create({
      name: 'Admin User',
      email: 'admin@ict.edu',
      password: adminPassword,
      role: 'admin',
      status: 'active',
    })

    // Create HOD
    const hodPassword = await bcrypt.hash('hod123', 10)
    await User.create({
      name: 'Head of Department',
      email: 'hod@ict.edu',
      password: hodPassword,
      role: 'hod',
      status: 'active',
    })

    // Create sample students
    const studentPassword = await bcrypt.hash('student123', 10)
    const student1 = await User.create({
      name: 'John Doe',
      email: 'student@ict.edu',
      password: studentPassword,
      role: 'student',
      index_number: 'ICT/2024/001',
      level: 'ICT 200',
      phone: '0244123456',
      status: 'active',
    })

    const student2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@ict.edu',
      password: studentPassword,
      role: 'student',
      index_number: 'ICT/2024/002',
      level: 'ICT 200',
      phone: '0244123457',
      status: 'active',
    })

    const student3 = await User.create({
      name: 'Bob Johnson',
      email: 'bob@ict.edu',
      password: studentPassword,
      role: 'student',
      index_number: 'ICT/2024/003',
      level: 'ICT 300',
      phone: '0244123458',
      status: 'active',
    })

    // Create sample dues
    const due1 = await Due.create({
      title: 'Semester Fees',
      amount: 500,
      level: 'ICT 200',
      academic_year: '2024/2025',
      description: 'Semester fees for ICT 200 students',
    })

    const due2 = await Due.create({
      title: 'Lab Fees',
      amount: 150,
      level: 'ICT 200',
      academic_year: '2024/2025',
      description: 'Laboratory usage fees',
    })

    const due3 = await Due.create({
      title: 'Semester Fees',
      amount: 600,
      level: 'ICT 300',
      academic_year: '2024/2025',
      description: 'Semester fees for ICT 300 students',
    })

    const due4 = await Due.create({
      title: 'Project Fees',
      amount: 200,
      level: 'ICT 300',
      academic_year: '2024/2025',
      description: 'Final year project fees',
    })

    // Assign dues to students
    await StudentDue.create({
      student_id: student1.id,
      due_id: due1.id,
      amount_paid: 0,
      balance: 500,
      status: 'Not Paid',
    })

    await StudentDue.create({
      student_id: student1.id,
      due_id: due2.id,
      amount_paid: 0,
      balance: 150,
      status: 'Not Paid',
    })

    await StudentDue.create({
      student_id: student2.id,
      due_id: due1.id,
      amount_paid: 0,
      balance: 500,
      status: 'Not Paid',
    })

    await StudentDue.create({
      student_id: student2.id,
      due_id: due2.id,
      amount_paid: 0,
      balance: 150,
      status: 'Not Paid',
    })

    await StudentDue.create({
      student_id: student3.id,
      due_id: due3.id,
      amount_paid: 0,
      balance: 600,
      status: 'Not Paid',
    })

    await StudentDue.create({
      student_id: student3.id,
      due_id: due4.id,
      amount_paid: 0,
      balance: 200,
      status: 'Not Paid',
    })

    // Create sample events
    await Event.create({
      type: 'xml',
      content_text: 'Welcome to the new academic year 2024/2025! Registration is now open.',
    })

    await Event.create({
      type: 'xml',
      content_text: 'ICT Department Open Day - January 15, 2025. All are welcome!',
    })

    console.log('Database seeded successfully!')
    console.log('\nDemo Credentials:')
    console.log('Admin: admin@ict.edu / admin123')
    console.log('HOD: hod@ict.edu / hod123')
    console.log('Student: student@ict.edu / student123')
    
    process.exit(0)
  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  }
}

seedDatabase()