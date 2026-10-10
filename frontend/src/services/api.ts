import type { Todo, TodoDraft } from '../types/todo.ts'

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  'http://localhost:5000/api'
const TOKEN_KEY = 'todo_app_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  statusCode: number
  errors?: { field: string; message: string }[]

  constructor(
    message: string,
    statusCode: number,
    errors?: { field: string; message: string }[],
  ) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.errors = errors
  }
}

interface ApiResponsePayload {
  message?: string
  errors?: { field: string; message: string }[]
  [key: string]: unknown
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken()
  const headers = new Headers(options.headers || {})

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  let responseData: ApiResponsePayload | null = null
  try {
    responseData = (await response.json()) as ApiResponsePayload
  } catch {
    // non-json response
  }

  if (!response.ok) {
    const firstErrorMessage = responseData?.errors?.[0]?.message
    const message =
      responseData?.message ||
      firstErrorMessage ||
      `Request failed with status ${response.status}`
    throw new ApiError(message, response.status, responseData?.errors)
  }

  return responseData as T
}

export type AuthResponse = {
  success: boolean
  message: string
  token: string
  user: {
    id: string
    name: string
    email: string
  }
}

export const api = {
  async signUp(credentials: {
    name: string
    email: string
    password: string
  }): Promise<AuthResponse> {
    const res = await request<AuthResponse>('/user/signup', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    setToken(res.token)
    return res
  },

  async signIn(credentials: {
    email: string
    password: string
  }): Promise<AuthResponse> {
    const res = await request<AuthResponse>('/user/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    setToken(res.token)
    return res
  },

  async getMe(): Promise<{ user: { id: string; name: string; email: string } }> {
    return request<{ user: { id: string; name: string; email: string } }>(
      '/user/me',
    )
  },

  async getTodos(): Promise<Todo[]> {
    const res = await request<{ todos: Todo[] }>('/todos')
    return res.todos
  },

  async createTodo(draft: TodoDraft): Promise<Todo> {
    const res = await request<{ todo: Todo }>('/todos', {
      method: 'POST',
      body: JSON.stringify(draft),
    })
    return res.todo
  },

  async toggleTodo(todoId: string): Promise<Todo> {
    const res = await request<{ todo: Todo }>(`/todos/${todoId}/toggle`, {
      method: 'PATCH',
    })
    return res.todo
  },

  async deleteTodo(todoId: string): Promise<void> {
    await request<void>(`/todos/${todoId}`, {
      method: 'DELETE',
    })
  },
}
