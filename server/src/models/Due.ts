import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/database'

export class Due extends Model {
  public id!: number
  public title!: string
  public amount!: number
  public level!: string
  public academic_year!: string
  public description?: string
}

Due.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    level: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    academic_year: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'dues',
    timestamps: true,
  }
)