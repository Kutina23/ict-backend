import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/database'

export class Program extends Model {
  public id!: number
  public name!: string
  public duration!: string
  public focus!: string
  public highlights!: string // JSON string of array
  public isActive!: boolean
}

Program.init(
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
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    focus: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    highlights: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('highlights')
        return rawValue ? JSON.parse(rawValue) : []
      },
      set(value: string[]) {
        this.setDataValue('highlights', JSON.stringify(value))
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'programs',
    timestamps: true,
  }
)