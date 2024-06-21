import { Sequelize, DataTypes, Model, Optional } from 'sequelize'
import { IUser } from '../interfaces/users.interface'

export type UserCreationAttributes = Optional<IUser, 'id' | 'email' | 'password' | 'role'>

export class UserModel extends Model<IUser, UserCreationAttributes> implements IUser {
  public id!: number
  public fullname!: string
  public email!: string
  public password!: string
  public role!: 'customer' | 'admin' | 'supervisor'
  public refreshToken?: string
  public phone?: number
  public nationCode?: string
  public address?: string
  public city?: string
  public country?: string
  public state?: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      fullname: {
        allowNull: false,
        type: DataTypes.STRING(45)
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING(45),
        unique: true
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING(255)
      },
      role: {
        allowNull: false,
        type: DataTypes.ENUM('customer', 'admin', 'supervisor'),
        defaultValue: 'admin'
      },
      refreshToken: {
        allowNull: false,
        type: DataTypes.STRING(255)
      },
      phone: {
        type: DataTypes.INTEGER
      },
      nationCode: {
        type: DataTypes.STRING(45)
      },
      address: {
        type: DataTypes.STRING(255)
      },
      city: {
        type: DataTypes.STRING(45)
      },
      country: {
        type: DataTypes.STRING(45)
      },
      state: {
        type: DataTypes.STRING(45)
      }
    },
    {
      tableName: 'users',
      sequelize
    }
  )

  return UserModel
}
