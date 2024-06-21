import dotenv from 'dotenv'
import path from 'path'
import Joi from 'joi'

dotenv.config({ path: path.join(__dirname, '../../.env') })

interface EnvVars {
  NODE_ENV: 'production' | 'development'
  PORT: number
  MYSQL_USER: string
  MYSQL_PASSWORD: string
  MYSQL_HOST: string
  MYSQL_PORT: number
  MYSQL_DATABASE: string
  JWT_ACCESS_EXPIRATION_MINUTES: string
  JWT_REFRESH_EXPIRATION_DAYS: string
  SMTP_HOST: string
  SMTP_PORT: number
  SMTP_USERNAME: string
  SMTP_PASSWORD: string
  EMAIL_FROM: string
  REDIS_HOST: string
  REDIS_PORT: number
  REDIS_PASSWORD: string
  LOG_FORMAT: string
  LOG_DIR: string
  OTP_EXPIRE_MINUTE: number
  SOCKET_PORT: number
}

const envVarsSchema = Joi.object<EnvVars>()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development').required(),
    PORT: Joi.number().default(5000),
    MYSQL_USER: Joi.string().required().description('MySQL DB user'),
    MYSQL_PASSWORD: Joi.string().required().description('MySQL DB password'),
    MYSQL_HOST: Joi.string().required().description('MySQL DB host'),
    MYSQL_PORT: Joi.number().default(3306).description('MySQL DB port'),
    MYSQL_DATABASE: Joi.string().required().description('MySQL DB name'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.string().description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.string().description('days after which refresh tokens expire'),
    REDIS_HOST: Joi.string().description('Redis host'),
    REDIS_PORT: Joi.number().description('Redis port'),
    REDIS_PASSWORD: Joi.string().description('Redis password'),
    LOG_FORMAT: Joi.string().description('logger format'),
    LOG_DIR: Joi.string().description('logger directory')
  })
  .unknown()

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

export const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  sequelize: {
    user: envVars.MYSQL_USER,
    password: envVars.MYSQL_PASSWORD,
    host: envVars.MYSQL_HOST,
    port: envVars.MYSQL_PORT,
    database: envVars.MYSQL_DATABASE
  },
  jwt: {
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS
  },
  redis: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
    password: envVars.REDIS_PASSWORD
  },
  log: {
    format: envVars.LOG_FORMAT,
    dir: envVars.LOG_DIR
  }
}
