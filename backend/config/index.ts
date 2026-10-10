import dotenv from 'dotenv'

dotenv.config()

export const config = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  MONGODB_URI:
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todo_app',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-todo-app-secret-key-change-in-prod',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
}
