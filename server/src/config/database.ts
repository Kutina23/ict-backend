import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const dbUrl = `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:17200/${process.env.DB_NAME}?ssl-mode=REQUIRED`;

export const sequelize = new Sequelize(dbUrl, {
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
})