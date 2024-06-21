import schedule from 'node-schedule'
import { generateKeyPair } from 'crypto'
import fs from 'fs'

async function generateAndStoreKeyPair() {
  generateKeyPair(
    'rsa',
    {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    },
    async (err, publicKey, privateKey) => {
      if (err) {
        console.error(err)
        return
      }
      // Lưu privateKey vào file hoặc secure storage
      await fs.writeFileSync('privateKey.pem', privateKey)
      await fs.writeFileSync('pubicKey.pem', publicKey)
      // Lưu publicKey vào Redis với key là userId
      //redisClient.set(`user:${userId}:publicKey`, publicKey, redis.print)
    }
  )
}

schedule.scheduleJob('0 0 * * *', () => {
  generateAndStoreKeyPair()
})
