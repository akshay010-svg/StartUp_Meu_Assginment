import mongoose from 'mongoose'
import { config } from './config/index.js'

let isConnected = false

export async function connectDB(): Promise<void> {
  if (isConnected) {
    return
  }

  try {
    mongoose.connection.on('connected', () => {
      console.log(`[MongoDB] Connected to database: "${mongoose.connection.name}"`)
      console.log(`[MongoDB] Compass connection URI: ${config.MONGODB_URI}`)
    })

    mongoose.connection.on('error', (err) => {
      console.error('[MongoDB] Connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Disconnected from database')
      isConnected = false
    })

    await mongoose.connect(config.MONGODB_URI)
    isConnected = true
  } catch (error) {
    console.error(`[MongoDB] Failed to connect to MongoDB at ${config.MONGODB_URI}:`, error)
    console.error('[MongoDB] Make sure MongoDB is running locally or specify MONGODB_URI in .env')
    throw error
  }
}

export async function disconnectDB(): Promise<void> {
  if (!isConnected) {
    return
  }

  await mongoose.disconnect()
  isConnected = false
}
