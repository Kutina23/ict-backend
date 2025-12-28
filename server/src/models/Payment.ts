import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/database'

export class Payment extends Model {
  public id!: number
  public student_id!: number
  public due_id!: number
  public amount!: number
  public payment_reference!: string
  public payment_method!: string
  public date!: Date
}

Payment.init(
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
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    payment_reference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    payment_method: {
      type: DataTypes.STRING,
      defaultValue: 'Paystack',
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'payments',
    timestamps: true,
  }
)