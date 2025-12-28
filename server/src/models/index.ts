import { User } from './User'
import { Due } from './Due'
import { StudentDue } from './StudentDue'
import { Payment } from './Payment'
import { Event } from './Event'
import { Program } from './Program'
import { Faculty } from './Faculty'
import { Partner } from './Partner'

// Define associations
User.hasMany(StudentDue, { foreignKey: 'student_id', as: 'studentDues' })
StudentDue.belongsTo(User, { foreignKey: 'student_id', as: 'student' })

Due.hasMany(StudentDue, { foreignKey: 'due_id', as: 'studentDues' })
StudentDue.belongsTo(Due, { foreignKey: 'due_id', as: 'due' })

User.hasMany(Payment, { foreignKey: 'student_id', as: 'payments' })
Payment.belongsTo(User, { foreignKey: 'student_id', as: 'student' })

Due.hasMany(Payment, { foreignKey: 'due_id', as: 'payments' })
Payment.belongsTo(Due, { foreignKey: 'due_id', as: 'due' })

export { User, Due, StudentDue, Payment, Event, Program, Faculty, Partner }