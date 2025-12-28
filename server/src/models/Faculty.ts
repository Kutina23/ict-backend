import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/database'

interface FacultyAttributes {
  id: number
  name: string
  position: string
  specialization: string
  email: string
  phone: string
  office: string
  image: string
  bio: string
  qualifications: string
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}

interface FacultyCreationAttributes extends Omit<FacultyAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Faculty extends Model<FacultyAttributes, FacultyCreationAttributes> implements FacultyAttributes {
  public id!: number
  public name!: string
  public position!: string
  public specialization!: string
  public email!: string
  public phone!: string
  public office!: string
  public image!: string
  public bio!: string
  public qualifications!: string
  public isActive!: boolean

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  // Helper method to parse qualifications from JSON string
  public getQualificationsArray(): string[] {
    try {
      return JSON.parse(this.qualifications || '[]')
    } catch {
      return []
    }
  }

  // Helper method to set qualifications from array
  public setQualificationsArray(qualifications: string[]): void {
    this.qualifications = JSON.stringify(qualifications)
  }
}

Faculty.init(
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
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    office: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '/default-avatar.svg',
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    qualifications: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '[]',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Faculty',
    tableName: 'faculties',
  }
)

export { Faculty }
export default Faculty