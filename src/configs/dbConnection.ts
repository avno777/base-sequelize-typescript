// File: dbConnection.ts
import { Dialect, Sequelize } from 'sequelize'
//import { Sequelize } from 'sequelize-typescript'
import dotenv from 'dotenv'
dotenv.config()

const dbName = process.env.DB_NAME as string
const dbUser = process.env.DB_USER as string
const dbHost = process.env.DB_HOST
const dbDriver = process.env.DB_DRIVER as Dialect
const dbPassword = process.env.DB_PASSWORD

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDriver
})

// Kiểm tra kết nối
sequelizeConnection
  .authenticate()
  .then(() => {
    console.log('Kết nối thành công đến cơ sở dữ liệu MySQL.')
  })
  .catch((error) => {
    console.error('Lỗi kết nối đến cơ sở dữ liệu MySQL:', error)
  })

export default sequelizeConnection
