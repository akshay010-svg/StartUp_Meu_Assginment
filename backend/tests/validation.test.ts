import assert from 'node:assert/strict'
import {
  createTodoSchema,
  todoIdParamSchema,
  updateTodoSchema,
} from '../schemas/todo.schema.js'
import { signInSchema, signUpSchema } from '../schemas/user.schema.js'

console.log('[Test Suite] Running Zod validation unit tests...')

// 1. User Sign Up Validation
{
  // Valid user
  const validUser = signUpSchema.safeParse({
    name: 'Aksha',
    email: 'aksha@example.com',
    password: 'password123',
  })
  assert.equal(validUser.success, true, 'Valid user should pass validation')

  // Empty name
  const emptyName = signUpSchema.safeParse({
    name: '   ',
    email: 'aksha@example.com',
    password: 'password123',
  })
  assert.equal(emptyName.success, false, 'Empty name should fail validation')

  // Invalid email
  const badEmail = signUpSchema.safeParse({
    name: 'Aksha',
    email: 'not-an-email',
    password: 'password123',
  })
  assert.equal(badEmail.success, false, 'Invalid email should fail validation')

  // Short password
  const shortPass = signUpSchema.safeParse({
    name: 'Aksha',
    email: 'aksha@example.com',
    password: '123',
  })
  assert.equal(shortPass.success, false, 'Short password should fail validation')
  console.log('✓ User SignUp schema validations passed')
}

// 2. User Sign In Validation
{
  const validLogin = signInSchema.safeParse({
    email: 'aksha@example.com',
    password: 'mypassword',
  })
  assert.equal(validLogin.success, true, 'Valid login should pass validation')

  const emptyPass = signInSchema.safeParse({
    email: 'aksha@example.com',
    password: '',
  })
  assert.equal(emptyPass.success, false, 'Empty password should fail validation')
  console.log('✓ User SignIn schema validations passed')
}

// 3. Todo Creation Validation
{
  const validTodo = createTodoSchema.safeParse({
    title: 'Design MongoDB collections',
    description: 'Inspect schemas in MongoDB Compass',
    dueDate: '2026-10-15',
    priority: 'High',
  })
  assert.equal(validTodo.success, true, 'Valid todo should pass validation')
  if (validTodo.success) {
    assert.equal(validTodo.data.title, 'Design MongoDB collections')
    assert.equal(validTodo.data.priority, 'High')
  }

  // Missing title
  const missingTitle = createTodoSchema.safeParse({
    description: 'No title provided',
    dueDate: '2026-10-15',
    priority: 'Low',
  })
  assert.equal(missingTitle.success, false, 'Missing title must fail')

  // Invalid due date format
  const badDate = createTodoSchema.safeParse({
    title: 'Test date',
    dueDate: '15-10-2026', // wrong format, should be YYYY-MM-DD
    priority: 'Medium',
  })
  assert.equal(badDate.success, false, 'Invalid date format must fail')

  // Invalid priority
  const badPriority = createTodoSchema.safeParse({
    title: 'Test priority',
    dueDate: '2026-10-15',
    priority: 'Urgent', // invalid enum
  })
  assert.equal(badPriority.success, false, 'Invalid priority enum must fail')
  console.log('✓ Create Todo schema validations passed')
}

// 4. Todo Update Validation
{
  const validUpdate = updateTodoSchema.safeParse({
    status: 'completed',
  })
  assert.equal(validUpdate.success, true, 'Partial update should pass')

  const emptyUpdate = updateTodoSchema.safeParse({})
  assert.equal(emptyUpdate.success, false, 'Empty update payload must fail')
  console.log('✓ Update Todo schema validations passed')
}

// 5. Todo ObjectId Param Validation
{
  const validId = todoIdParamSchema.safeParse({
    id: '507f1f77bcf86cd799439011',
  })
  assert.equal(validId.success, true, 'Valid 24-hex ObjectId must pass')

  const invalidId = todoIdParamSchema.safeParse({
    id: 'not-a-valid-mongo-id',
  })
  assert.equal(invalidId.success, false, 'Invalid ObjectId must fail')
  console.log('✓ Todo ID param validations passed')
}

console.log('[Test Suite] All Zod validation tests succeeded!')
