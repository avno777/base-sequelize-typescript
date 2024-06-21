export interface IUser {
  id?: number
  fullname: string
  email: string
  password: string
  role: string
  refreshToken?: string
  phone?: number
  nationCode?: string
  address?: string
  city?: string
  country?: string
  state?: string
}
