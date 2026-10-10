import { useState } from 'react'
import type { FormEvent } from 'react'
import AppShell from '../components/AppShell.tsx'
import Button from '../components/Button.tsx'
import {
  SelectField,
  TextAreaField,
  TextField,
} from '../components/FormField.tsx'
import type { TodoDraft, TodoPriority } from '../types/todo.ts'

type CreateTodoPageProps = {
  onCancel: () => void
  onCreateTodo: (todo: TodoDraft) => void
  onSignOut: () => void
  userName: string
}

const priorities: TodoPriority[] = ['Low', 'Medium', 'High']

function CreateTodoPage({
  onCancel,
  onCreateTodo,
  onSignOut,
  userName,
}: CreateTodoPageProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<TodoPriority>('Medium')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cleanTitle = title.trim()
    const cleanDescription = description.trim()

    if (!cleanTitle || !dueDate) {
      return
    }

    onCreateTodo({
      description: cleanDescription || 'No description added.',
      dueDate,
      priority,
      title: cleanTitle,
    })
  }

  return (
    <AppShell
      activeView="create"
      onDashboard={onCancel}
      onSignOut={onSignOut}
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
            <Button type="submit">Create todo</Button>
            <Button onClick={onCancel} variant="secondary">
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </AppShell>
  )
}

export default CreateTodoPage
