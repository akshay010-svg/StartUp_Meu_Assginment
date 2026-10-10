import cors from 'cors'
import express from 'express'
import { config } from './config/index.js'
import { connectDB, disconnectDB } from './db.js'
import { errorHandler } from './middleware/error.middleware.js'
import todoRoutes from './routes/todos/todo.routes.js'
import userRoutes from './routes/user/user.routes.js'

const app = express()

// Middleware
app.use(
  cors({
    origin: config.CORS_ORIGIN === '*' ? true : config.CORS_ORIGIN,
    credentials: true,
  }),
)
app.use(express.json())

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: 'connected',
  })
})

// Application routes
app.use('/api/user', userRoutes)
app.use('/api/todos', todoRoutes)

// 404 Not Found handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
  })
})

// Centralized error handler
app.use(errorHandler)

export async function startServer() {
  try {
    await connectDB()

    const server = app.listen(config.PORT, () => {
      console.log(`[Server] Todo API listening on http://localhost:${config.PORT}`)
      console.log(`[Server] Health check: http://localhost:${config.PORT}/api/health`)
      console.log(`[MongoDB Compass] Connect your Compass client to: ${config.MONGODB_URI}`)
    })

    const shutdown = async () => {
      console.log('\n[Server] Shutting down gracefully...')
      server.close(async () => {
        await disconnectDB()
        console.log('[Server] Process terminated.')
        process.exit(0)
      })
    }

    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)

    return server
  } catch (error) {
    console.error('[Server] Failed to initialize server:', error)
    process.exit(1)
  }
}

// Start if executed directly
if (process.env.NODE_ENV !== 'test') {
  startServer()
}

export default app
