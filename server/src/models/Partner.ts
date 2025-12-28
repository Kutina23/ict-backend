import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export interface PartnerAttributes {
  id?: number;
  name: string;
  logo_url: string;
  website_url?: string;
  description?: string;
  isActive: boolean;
  sort_order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PartnerCreationAttributes extends PartnerAttributes {}

export class Partner extends Model<PartnerAttributes, PartnerCreationAttributes> implements PartnerAttributes {
  public id!: number;
  public name!: string;
  public logo_url!: string;
  public website_url?: string;
  public description?: string;
  public isActive!: boolean;
  public sort_order!: number;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Partner.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Company/Organization name',
  },
  logo_url: {
    type: DataTypes.STRING(500),
    allowNull: false,
    comment: 'URL to partner logo image',
  },
  website_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Partner website URL',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Brief description of the partnership',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Whether partner should be displayed',
  },
  sort_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Display order for partners',
  },
}, {
  sequelize,
  tableName: 'partners',
  timestamps: true,
  indexes: [
    {
      fields: ['isActive', 'sort_order'],
    },
  ],
});