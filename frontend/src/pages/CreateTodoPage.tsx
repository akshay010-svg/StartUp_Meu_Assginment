import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell.tsx'
import Button from '../components/Button.tsx'
import {
  SelectField,
  TextAreaField,
  TextField,
} from '../components/FormField.tsx'
import { useAuth } from '../context/AuthContext.tsx'
import { api } from '../services/api.ts'
import type { TodoDraft, TodoPriority } from '../types/todo.ts'

type CreateTodoPageProps = {
  onCancel?: () => void
  onCreateTodo?: (todo: TodoDraft) => void | Promise<void>
  onSignOut?: () => void
  userName?: string
}

const priorities: TodoPriority[] = ['Low', 'Medium', 'High']

function CreateTodoPage({
  onCancel,
  onCreateTodo,
  onSignOut,
  userName: propUserName,
}: CreateTodoPageProps = {}) {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const userName = propUserName ?? user?.name ?? 'User'

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<TodoPriority>('Medium')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleCancel() {
    if (onCancel) {
      onCancel()
    } else {
      navigate('/dashboard')
    }
  }

  function handleSignOut() {
    if (onSignOut) {
      onSignOut()
    } else {
      signOut()
      navigate('/signin')
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cleanTitle = title.trim()
    const cleanDescription = description.trim()

    if (!cleanTitle || !dueDate || isSubmitting) {
      return
    }

    const todoDraft: TodoDraft = {
      description: cleanDescription || 'No description added.',
      dueDate,
      priority,
      title: cleanTitle,
    }

    if (onCreateTodo) {
      await onCreateTodo(todoDraft)
      return
    }

    setIsSubmitting(true)
    try {
      await api.createTodo(todoDraft)
      navigate('/dashboard')
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : 'Failed to create todo. Please check your inputs.'
      alert(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppShell
      activeView="create"
      onDashboard={handleCancel}
      onSignOut={handleSignOut}
      userName={userName}
    >
      <main className="page page--narrow">
        <section className="page-heading">
          <div>
            <p className="eyebrow">Create todo</p>
            <h1>Add a focused task</h1>
          </div>
          <p>
            Give it a clear name, a due date, and the priority it deserves.
          </p>
        </section>

        <form className="todo-form" onSubmit={handleSubmit}>
          <TextField
            id="todo-title"
            label="Title"
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Finish Express routes"
            required
            type="text"
            value={title}
          />

          <TextAreaField
            id="todo-description"
            label="Description"
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Add short notes or acceptance criteria"
            rows={5}
            value={description}
          />

          <div className="form-grid">
            <TextField
              id="todo-due-date"
              label="Due date"
              onChange={(event) => setDueDate(event.target.value)}
              required
              type="date"
              value={dueDate}
            />

            <SelectField
              id="todo-priority"
              label="Priority"
              onChange={(event) =>
                setPriority(event.target.value as TodoPriority)
              }
              value={priority}
            >
              {priorities.map((priorityValue) => (
                <option key={priorityValue} value={priorityValue}>
                  {priorityValue}
                </option>
              ))}
            </SelectField>
          </div>

          <div className="form-actions">
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Creating...' : 'Create todo'}
            </Button>
            <Button onClick={handleCancel} variant="secondary">
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </AppShell>
  )
}

export default CreateTodoPage
