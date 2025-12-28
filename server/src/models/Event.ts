import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/database'

export class Event extends Model {
  public id!: number
  public type!: 'image' | 'xml'
  public content_url?: string
  public content_text?: string
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM('image', 'xml'),
      allowNull: false,
    },
    content_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'events',
    timestamps: true,
  }
)