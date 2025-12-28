import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/database'

export class StudentDue extends Model {
  public id!: number
  public student_id!: number
  public due_id!: number
  public amount_paid!: number
  public balance!: number
  public status!: string
}

StudentDue.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    due_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount_paid: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Not Paid', 'Partial', 'Paid'),
      defaultValue: 'Not Paid',
    },
  },
  {
    sequelize,
    tableName: 'student_dues',
    timestamps: true,
  }
)