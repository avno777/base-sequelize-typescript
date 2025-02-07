import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import fs from 'fs'
import UsersModel from '../models/users.model'
import { IUser } from '../interfaces/users.interface'
import { IRegister } from '~/interfaces/auth.interface'
import { config } from '~/configs/config'

let privateKey: crypto.KeyObject
let publicKey0: crypto.KeyObject
let publicKey1: crypto.KeyObject
const AuthService = {
  updatePrivateKey: async () => {
    const privateKeyString = await fs.readFileSync('privateKey.pem', 'utf8')
    privateKey = crypto.createPrivateKey(privateKeyString)
  },
  updatePublicKey: async () => {
    // const publicKeyString = [
    //   'dfqojiwihj4rfu8394tryuq98wcrehtg98qwrh9tgbnwq39q8tqy43797htrc9834yt9823yi24h39ur23249rtyu9384ytr928342ch9t2345nt982324598cty238945tcynm83w45ctyh832224mx29354ytc893245yn893472hn57tg84352cn5g7yc783245ynmx278tgy',
    //   'ncaweuisofhqpwejqf890q343cumrx89234ytxc77822y534xt978y2938745yxtg872x2x345tyg78972345yutg9822xy3u45t8g9324y78t9yu3245789tygh783t452yhtgtg78532452yhtg9734yt942m325gh93452g7n'
    // ]
    const publicKeyString = await fs.readFileSync('publicKey.pem', 'utf8')
    publicKey0 = crypto.createPublicKey(publicKeyString[0])
    publicKey1 = crypto.createPublicKey(publicKeyString[1])
  },
  hashedPassword: async (password: string): Promise<string> => {
    const salt: string = await bcrypt.genSalt(10)
    const hashedPassword: string = await bcrypt.hash(password, salt)
    return hashedPassword
  },

  isPasswordMatch: async (user: IUser, password: string): Promise<boolean> => {
    const isMatch: boolean = await bcrypt.compare(password, user.password)
    return isMatch
  },

  createUser: async (userBody: IRegister): Promise<IUser> => {
    const newUser: IRegister = {
      fullname: userBody.fullname,
      email: userBody.email,
      password: userBody.password
    }

    const user: IUser = await UsersModel.create(newUser)
    return user
  },

  generateTokens: async (_id: string, role: string) => {
    const [accessToken, refreshToken] = await Promise.all([
      jwt.sign({ _id, role }, privateKey, { expiresIn: config.jwt.accessExpirationMinutes, algorithm: 'RS256' }),
      jwt.sign({ _id, role }, privateKey, { expiresIn: config.jwt.refreshExpirationDays, algorithm: 'RS256' })
    ])

    return {
      accessToken,
      refreshToken
    }
  }
}

export default AuthService
