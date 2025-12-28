import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/database'

export class User extends Model {
  public id!: number
  public name!: string
  public email!: string
  public password!: string
  public role!: 'admin' | 'student' | 'hod'
  public index_number?: string
  public level?: string
  public phone?: string
  public status!: string
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'student', 'hod'),
      allowNull: false,
    },
    index_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    level: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  }
)