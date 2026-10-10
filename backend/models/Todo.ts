import mongoose, { Document, Model, Schema, Types } from 'mongoose'

export type TodoPriority = 'Low' | 'Medium' | 'High'
export type TodoStatus = 'upcoming' | 'completed' | 'missed'

export interface ITodo extends Document {
  userId: Types.ObjectId
  title: string
  description: string
  dueDate: string
  priority: TodoPriority
  status: TodoStatus
  createdAt: Date
  updatedAt: Date
}

const todoSchema = new Schema<ITodo>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    dueDate: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['upcoming', 'completed', 'missed'],
      default: 'upcoming',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, any>) {
        ret.id = ret._id?.toString()
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  },
)

export const Todo: Model<ITodo> =
  mongoose.models.Todo || mongoose.model<ITodo>('Todo', todoSchema)
